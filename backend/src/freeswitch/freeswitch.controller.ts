import {
  Body,
  Controller,
  Header,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { config } from '../config';

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

const splitUserAtDomain = (raw: string | null) => {
  if (!raw)
    return { user: null as string | null, domain: null as string | null };
  const s = String(raw).trim();
  if (!s) return { user: null, domain: null };
  const at = s.indexOf('@');
  if (at < 0) return { user: s, domain: null };
  const user = s.slice(0, at).trim() || null;
  const domain = s.slice(at + 1).trim() || null;
  return { user, domain };
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
  @HttpCode(200)
  handle(@Req() req: any, @Body() raw: any) {
    console.log(111, raw);
    const text = typeof raw === 'string' ? raw : '';
    const vars = text.includes('=')
      ? Object.fromEntries(new URLSearchParams(text))
      : {};

    // на всякий — FS иногда может прислать query
    Object.assign(vars, req.query ?? {});

    // дальше работаешь с vars как с обычным body
  }

  private directory(body: any) {
    console.log(111, body);
    const userId = asString(body?.sip_auth_username) ?? asString(body?.user);
    const ext = asNumber(userId);
    if (!ext) return this.notFound();

    const user = config.store.users.find((u) => u.phone === ext);
    if (!user) return this.notFound();

    const name = escapeXml(user.name || `${user.phone}`);
    const pass = escapeXml(user.password);
    const domain = escapeXml(config.realm);

    return (
      xmlHeader +
      `<document type="freeswitch/xml">
  <section name="directory">
    <domain name="${domain}">
      <user id="${user.phone}">
        <params>
          <param name="password" value="${pass}"/>
        </params>
        <variables>
          <variable name="user_context" value="${escapeXml(config.context)}"/>
          <variable name="effective_caller_id_name" value="${name}"/>
          <variable name="effective_caller_id_number" value="${user.phone}"/>
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
    const playbackFile = '/data/sounds/hello.opus';

    return (
      xmlHeader +
      `<document type="freeswitch/xml">
  <section name="dialplan">
    <context name="${escapeXml(config.context)}">

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
