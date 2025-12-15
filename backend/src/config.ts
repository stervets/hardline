export const config = {
  serverPassword: process.env.SERVER_PASSWORD || 'change_me',
  jwtSecret: process.env.JWT_SECRET || 'change_me_too',

  sipDomain: process.env.PUBLIC_HOST || 'phone.core5.ru',
  sipTransport: 'udp' as const,

  sqlitePath: process.env.SQLITE_PATH || '/data/sqlite/app.db',

  extMin: 99010,
  extMax: 99998,

  defaults: {
    context: 'phones',
    disallow: 'all',
    allow: 'opus,ulaw,alaw',
    direct_media: 'no',
    rtp_symmetric: 'yes',
    force_rport: 'yes',
    rewrite_contact: 'yes',
    timers: 'no',
    transport: 'transport-udp',
    max_contacts: 4,
    qualify_frequency: 30,
    default_expiration: 3600,
    minimum_expiration: 60,
    maximum_expiration: 7200,
  },
};
