import { config } from '../config';
import { readRegistry, writeRegistry, allocateExt } from '../registry';

export function registerUser(input: {
  serverPassword: string;
  displayName: string;
  sipPassword: string;
}) {
  if (input.serverPassword !== config.serverPassword) {
    const e: any = new Error('Forbidden');
    e.statusCode = 403;
    throw e;
  }

  const r = readRegistry();
  const ext = allocateExt(r);

  const user = { ext, name: input.displayName, sipPassword: input.sipPassword };
  r.users.unshift(user);
  writeRegistry(r);

  return user;
}
