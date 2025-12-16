import WebSocket from 'ws';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { config } from '../config';

@Injectable()
export class AriService implements OnModuleInit {
  onModuleInit() {
    const httpUrl = new URL(config.ari.url);
    httpUrl.protocol = httpUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    httpUrl.pathname = `${httpUrl.pathname.replace(/\/$/, '')}/events`;

    httpUrl.searchParams.set('api_key', `${config.ari.user}:${config.ari.pass}`);
    httpUrl.searchParams.set('app', config.ari.app);

    const ws = new WebSocket(httpUrl.toString());

    ws.on('open', () => {
      console.log('[ARI] connected');
    });

    ws.on('message', (msg) => {
      const e = JSON.parse(msg.toString());

      if (e.type === 'StasisStart') {
        console.log('[ARI] call start', {
          channel: e.channel?.id,
          caller: e.channel?.caller?.number,
          exten: e.channel?.dialplan?.exten,
        });
      }

      if (e.type === 'ChannelDestroyed') {
        console.log('[ARI] call end', {
          channel: e.channel?.id,
          cause: e.cause_txt,
        });
      }
    });

    ws.on('close', () => {
      console.error('[ARI] disconnected');
    });
  }
}
