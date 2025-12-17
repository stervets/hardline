import { Body, Controller, Header, Post } from '@nestjs/common';
import { config } from '../config';
import { readRegistry } from '../registry';

const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>\n`;

const escapeXml = (s: string) =>
  (s ?? '').replace(/[<>&"']/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return c;
    }
  });

const asNumber = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

@Controller()
export class FreeSwitchController {
  @Post('/freeswitch/xml')
  @Header('Content-Type', 'text/xml; charset=utf-8')
  handle(@Body() body: any) {
    const section = body?.section;

    if (section === 'directory') return this.directory(body);
    if (section === 'dialplan') return this.dialplan();

    // На всякий: FS может дернуть и другие секции — отвечаем пусто, чтобы не падал.
    return xmlHeader + `<document type="freeswitch/xml"><section name="${escapeXml(section || 'unknown')}"/></document>`;
  }

  private directory(body: any) {
    // FS обычно передает key_value=ext (или user/id — зависит от запроса)
    const ext =
      asNumber(body?.key_value) ??
      asNumber(body?.user) ??
      asNumber(body?.id) ??
      null;

    if (!ext) {
      return xmlHeader + `<document type="freeswitch/xml"><section name="directory"/></document>`;
    }

    const reg = readRegistry();
    const user = reg.users.find((u) => u.ext === ext);
    if (!user) {
      return xmlHeader + `<document type="freeswitch/xml"><section name="directory"/></document>`;
    }

    const name = escapeXml(user.name || `${user.ext}`);
    const pass = escapeXml(user.sipPassword);

    return (
      xmlHeader +
      `<document type="freeswitch/xml">
  <section name="directory">
    <domain name="default">
      <user id="${user.ext}">
        <params>
          <param name="password" value="${pass}"/>
        </params>
        <variables>
          <variable name="user_context" value="default"/>
          <variable name="effective_caller_id_name" value="${name}"/>
          <variable name="effective_caller_id_number" value="${user.ext}"/>
        </variables>
      </user>
    </domain>
  </section>
</document>`
    );
  }

  private dialplan() {
    const svcEcho = config.svcEcho; // 99990
    const svcPlayback = config.svcPlayback; // 99999

    // Файл, который реально монтируется в контейнер
    const playbackFile = '/var/lib/freeswitch/sounds/custom/hello.opus';

    return (
      xmlHeader +
      `<document type="freeswitch/xml">
  <section name="dialplan">
    <context name="default">

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
