import fs from 'node:fs';
import { config } from './config';

export type User = { ext: number; name: string; sipPassword: string };
export type Registry = { nextExt: number; users: User[] };

export function readRegistry(): Registry {
  return JSON.parse(fs.readFileSync(config.registryPath, 'utf-8'));
}

export function writeRegistry(r: Registry) {
  const tmp = config.registryPath + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(r, null, 2), 'utf-8');
  fs.renameSync(tmp, config.registryPath);
}

export function allocateExt(r: Registry) {
  // просто инкремент, без “поиска дыр” — MVP
  if (r.nextExt > config.extMax) throw new Error('No free extensions');
  const ext = r.nextExt;
  r.nextExt += 1;
  return ext;
}
