import { Store } from 'src/types';
import fs from 'node:fs';

const storePath = process.env.STORE_PATH || '/data/store.json';

export const config = {
  userContext: 'hardline',

  store: JSON.parse(fs.readFileSync(storePath, 'utf-8')) as Store,

  host: process.env.HARDLINE_HOST || '10.0.2.2',
  realm: process.env.HARDLINE_REALM || 'hardline.local',

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
