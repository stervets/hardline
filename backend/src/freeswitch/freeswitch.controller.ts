import { Body, Controller, Header, Post } from '@nestjs/common';
import { config } from '../config';
import { readRegistry } from '../registry';

const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>\n`;

const escapeXml = (s: string) =>
  (s ?? '').replace(/[<>&"']/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '"':
        return '&quot;';
      case "'":
        return '&apos;';
      default:
        return c;
    }
  });

const asString = (v: any) => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length ? s : null;
};

const asNumber = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const pick = (body: any, ...keys: string[]) => {
  for (const k of keys) {
    const v = body?.[k];
    const s = asString(v);
    if (s) return s;
  }
  return null;
};

const pickKV = (body: any, wantedKey: string) => {
  const key = asString(body?.key);
  if (!key) return null;
  if (key !== wantedKey) return null;
  return asString(body?.key_value) ?? asString(body?.value) ?? null;
};

@Controller()
export class FreeSwitchController {
  @Post('/freeswitch/xml')
  @Header('Content-Type', 'text/xml; charset=utf-8')
  handle(@Body() body: any) {
    const section =
      pick(body, 'section') ??
      pickKV(body, 'section') ??
      // иногда section прилетает через Event-Subclass/Caller-Context — но нам хватит дефолта
      'unknown';

    if (section === 'directory') return this.directory(body);
    if (section === 'dialplan') return this.dialplan();

    return (
      xmlHeader +
      `<document type="freeswitch/xml"><section name="${escapeXml(section)}"/></document>`
    );
  }

  private directory(body: any) {
    // 1) userId: прямые поля
    const directUser =
      pick(body, 'user', 'username', 'id', 'sip_auth_username', 'auth_user');

    // 2) userId: key/key_value пара
    const kvUser =
      pickKV(body, 'user') ?? pickKV(body, 'username') ?? pickKV(body, 'id');

    // 3) иногда подсовывают "Caller-Caller-ID-Number"/"from_user" — берём только если совсем нет другого
    const fallbackUser =
      pick(body, 'from_user', 'Caller-Caller-ID-Number', 'caller_id_number');

    const userIdRaw = directUser ?? kvUser ?? fallbackUser ?? null;
    const ext = asNumber(userIdRaw);

    // domain/realm:
    const directDomain = pick(
      body,
      'domain',
      'realm',
      'sip_auth_realm',
      'sip_realm',
      'auth_realm',
      'sip_to_host',
      'to_host',
    );

    const kvDomain =
      pickKV(body, 'domain') ??
      pickKV(body, 'realm') ??
      pickKV(body, 'sip_auth_realm') ??
      pickKV(body, 'sip_realm');

    // если FS сам решил доменом быть контейнерным IP — он как раз здесь всплывёт
    const domain = (directDomain ?? kvDomain ?? config.realm)!;

    // лог — оставь пока, это твой “осциллограф”
    // eslint-disable-next-line no-console
    console.log('[xml_curl]', { section: 'directory', userId: userIdRaw, ext, domain });

    if (!ext) return this.notFound();

    const reg = readRegistry();
    const user = reg.users.find((u) => u.ext === ext);
    if (!user) return this.notFound();

    const name = escapeXml(user.name || `${user.ext}`);
    const pass = escapeXml(user.sipPassword);

    return (
      xmlHeader +
      `<document type="freeswitch/xml">
  <section name="directory">
    <domain name="${escapeXml(domain)}">
      <user id="${user.ext}">
        <params>
          <param name="password" value="${pass}"/>
        </params>
        <variables>
          <variable name="user_context" value="${escapeXml(config.userContext)}"/>
          <variable name="effective_caller_id_name" value="${name}"/>
          <variable name="effective_caller_id_number" value="${user.ext}"/>
        </variables>
      </user>
    </domain>
  </section>
</document>`
    );
  }

  private notFound() {
    return (
      xmlHeader +
      `<document type="freeswitch/xml">
  <section name="result">
    <result status="not found"/>
  </section>
</document>`
    );
  }

  private dialplan() {
    const svcEcho = config.svcEcho;
    const svcPlayback = config.svcPlayback;
    const playbackFile = '/var/lib/freeswitch/sounds/custom/hello.opus';

    return (
      xmlHeader +
      `<document type="freeswitch/xml">
  <section name="dialplan">
    <context name="${escapeXml(config.userContext)}">

      <extension name="reserved_star">
        <condition field="destination_number" expression="^\\*(00[0-9]|999)$">
          <action application="hangup" data="CALL_REJECTED"/>
        </condition>
      </extension>

      <extension name="users">
        <condition field="destination_number" expression="^(99\\d{3})$">
          <action application="bridge" data="user/$1"/>
        </condition>
      </extension>

      <extension name="svc_echo">
        <condition field="destination_number" expression="^${svcEcho}$">
          <action application="answer"/>
          <action application="echo"/>
        </condition>
      </extension>

      <extension name="svc_playback">
        <condition field="destination_number" expression="^${svcPlayback}$">
          <action application="answer"/>
          <action application="playback" data="${playbackFile}"/>
          <action application="hangup"/>
        </condition>
      </extension>

    </context>
  </section>
</document>`
    );
  }
}
