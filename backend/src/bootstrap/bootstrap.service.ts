import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { database } from '../db';
import { config } from '../config';
import { signToken } from '../jwt';

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const genSipPass = () => randomBytes(18).toString('base64url');

function allocateExtTx() {
  for (let ext = config.extMin; ext <= config.extMax; ext++) {
    const hit = database
      .prepare('SELECT 1 FROM users WHERE extension=? LIMIT 1')
      .get(String(ext));
    if (!hit) return String(ext);
  }
  throw new Error('No free extensions');
}

function upsertRealtimeTx(ext: string, sipPassword: string) {
  const d = config.defaults;

  database.prepare(
    `
    INSERT INTO ps_aors (id, max_contacts, qualify_frequency, default_expiration, minimum_expiration, maximum_expiration)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      max_contacts=excluded.max_contacts,
      qualify_frequency=excluded.qualify_frequency,
      default_expiration=excluded.default_expiration,
      minimum_expiration=excluded.minimum_expiration,
      maximum_expiration=excluded.maximum_expiration
  `,
  ).run(
    ext,
    d.max_contacts,
    d.qualify_frequency,
    d.default_expiration,
    d.minimum_expiration,
    d.maximum_expiration,
  );

  database.prepare(
    `
    INSERT INTO ps_auths (id, auth_type, username, password)
    VALUES (?, 'userpass', ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      auth_type=excluded.auth_type,
      username=excluded.username,
      password=excluded.password
  `,
  ).run(ext, ext, sipPassword);

  database.prepare(
    `
    INSERT INTO ps_endpoints (
      id, transport, aors, auth, context,
      disallow, allow,
      direct_media, rtp_symmetric, force_rport, rewrite_contact,
      timers
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      transport=excluded.transport,
      aors=excluded.aors,
      auth=excluded.auth,
      context=excluded.context,
      disallow=excluded.disallow,
      allow=excluded.allow,
      direct_media=excluded.direct_media,
      rtp_symmetric=excluded.rtp_symmetric,
      force_rport=excluded.force_rport,
      rewrite_contact=excluded.rewrite_contact,
      timers=excluded.timers
  `,
  ).run(
    ext,
    d.transport,
    ext,
    ext,
    d.context,
    d.disallow,
    d.allow,
    d.direct_media,
    d.rtp_symmetric,
    d.force_rport,
    d.rewrite_contact,
    d.timers,
  );
}

export function bootstrapUser(input: {
  serverPassword: string;
  displayName: string;
  password: string;
}) {
  if (input.serverPassword !== config.serverPassword) {
    const e: any = new Error('Forbidden');
    e.statusCode = 403;
    throw e;
  }

  return database.transaction(() => {
    const ext = allocateExtTx();
    const id = randomUUID();
    const sipPassword = genSipPass();

    database.prepare(
      `
      INSERT INTO users (id, display_name, password_hash, extension, sip_password, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    ).run(
      id,
      input.displayName,
      sha256(input.password),
      ext,
      sipPassword,
      new Date().toISOString(),
    );

    upsertRealtimeTx(ext, sipPassword);

    return {
      token: signToken({ userId: id, ext }),
      user: { name: input.displayName, extension: ext },
      sip: {
        username: ext,
        password: sipPassword,
        domain: config.sipDomain,
        transport: config.sipTransport,
      },
    };
  })();
}
