import { Store } from 'src/types';
import fs from 'node:fs';

const storePath = process.env.STORE_PATH || '/data/store.json';

export const config = {
  store: JSON.parse(fs.readFileSync(storePath, 'utf-8')) as Store,

  context: process.env.SIP_CONTEXT || 'hardline',
  host: process.env.PUBLIC_HOST || '192.168.2.70',
  realm: process.env.SIP_REALM || 'hardline.local',
  port: process.env.SIP_UDP_PORT || 5060,

  secret: process.env.JWT_SECRET || '2aae6e4e356e18179e73093947ff3',

  adminPhone: 99000,
  svcEcho: 99990,
  svcPlayback: 99999,
};

export function saveStore() {
  //const tmp = config.registryPath + '.tmp';
  //fs.writeFileSync(tmp, JSON.stringify(r, null, 2), 'utf-8');
  //fs.renameSync(tmp, config.registryPath);
  fs.writeFileSync(storePath, JSON.stringify(config.store, null, 2), 'utf-8');
}
