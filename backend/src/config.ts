export const config = {
  serverPassword: process.env.SERVER_PASSWORD || 'change_me',
  registryPath: process.env.REGISTRY_PATH || '/data/registry.json',

  extMin: 99000,
  extMax: 99989,

  svcEcho: 99990,
  svcPlayback: 99999,
};
