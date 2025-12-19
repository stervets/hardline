import { config } from '../config';
import { readRegistry, writeRegistry, allocateExt } from '../registry';

export function registerUser(input: {
  displayName: string;
  sipPassword: string;
}) {
  return;

  const r = readRegistry();
  const ext = allocateExt(r);

  const user = { ext, name: input.displayName, sipPassword: input.sipPassword };
  r.users.unshift(user);
  writeRegistry(r);

  const sip = {
    username: String(ext),
    password: input.sipPassword,

    host: '10.0.2.2', //config.host, // 10.0.2.2 (эмулятор -> хост)
    realm: config.realm, // hardline.local (логический домен)

    port: Number(process.env.SIP_UDP_PORT || 5060),
    transport: 'udp',
  } as const;

  return { ext, name: user.name, sip };
}