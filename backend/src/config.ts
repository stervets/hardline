export const config = {
  registryPath: process.env.REGISTRY_PATH || '/data/registry.json',

  extMin: 99000,
  extMax: 99989,

  svcEcho: 99990,
  svcPlayback: 99999,

  host: process.env.HARDLINE_HOST || '10.0.2.2',
  realm: process.env.HARDLINE_REALM || 'hardline.local',

  userContext: 'hardline',
};