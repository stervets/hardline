PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE ps_auths (
  id TEXT PRIMARY KEY,
  auth_type TEXT CHECK(auth_type IN ('md5','userpass')),
  nonce_lifetime INTEGER,
  md5_cred TEXT,
  password TEXT,
  realm TEXT,
  username TEXT
);
INSERT INTO ps_auths VALUES('99010','userpass',NULL,NULL,'99010',NULL,'99010');
CREATE TABLE ps_aors (
  id TEXT PRIMARY KEY,
  contact TEXT,
  default_expiration INTEGER,
  mailboxes TEXT,
  max_contacts INTEGER,
  minimum_expiration INTEGER,
  remove_existing TEXT CHECK(remove_existing IN ('yes','no')),
  qualify_frequency INTEGER,
  authenticate_qualify TEXT CHECK(authenticate_qualify IN ('yes','no')),
  maximum_expiration INTEGER,
  outbound_proxy TEXT,
  support_path TEXT CHECK(support_path IN ('yes','no')),
  qualify_timeout REAL,
  voicemail_extension TEXT
);
INSERT INTO ps_aors VALUES('99999',NULL,NULL,NULL,0,NULL,'yes',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO ps_aors VALUES('99010',NULL,NULL,NULL,1,NULL,'yes',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
CREATE TABLE ps_contacts (
  id TEXT,                       -- aor id
  uri TEXT,
  expiration_time INTEGER,
  qualify_frequency INTEGER,
  outbound_proxy TEXT,
  path TEXT,
  user_agent TEXT,
  qualify_timeout REAL,
  reg_server TEXT,
  authenticate_qualify TEXT CHECK(authenticate_qualify IN ('yes','no')),
  via_addr TEXT,
  via_port INTEGER,
  call_id TEXT,
  endpoint TEXT,
  prune_on_boot TEXT CHECK(prune_on_boot IN ('yes','no'))
, qualify_2xx_only INTEGER);
INSERT INTO ps_contacts VALUES('99010^3B@1c36cc8d39e863f96356c89efbb7bee8','sip:99010@172.19.0.1:45148',1765819330,0,'','','LinphoneAndroid/6.0.20 (Infinix ZERO 40 5G) LinphoneSDK/5.4.60 (tags/5.4.60^5E0)',3.0,'','no','192.168.2.81',52278,'-U122eUe9N','99010','no','false');
CREATE TABLE ps_endpoints (
  id TEXT PRIMARY KEY,
  transport TEXT,
  aors TEXT,
  auth TEXT,
  context TEXT,
  disallow TEXT,
  allow TEXT,
  direct_media TEXT CHECK(direct_media IN ('yes','no')),
  dtmf_mode TEXT,
  force_rport TEXT CHECK(force_rport IN ('yes','no')),
  ice_support TEXT CHECK(ice_support IN ('yes','no')),
  identify_by TEXT CHECK(identify_by IN ('username','auth_username')),
  mailboxes TEXT,
  outbound_proxy TEXT,
  rewrite_contact TEXT CHECK(rewrite_contact IN ('yes','no')),
  rtp_symmetric TEXT CHECK(rtp_symmetric IN ('yes','no')),
  media_encryption TEXT CHECK(media_encryption IN ('no','sdes','dtls')),
  use_avpf TEXT CHECK(use_avpf IN ('yes','no')),
  inband_progress TEXT CHECK(inband_progress IN ('yes','no'))
, force_avp TEXT, timers TEXT, '100rel' TEXT, rtcp_mux TEXT);
INSERT INTO ps_endpoints VALUES('99999','transport-udp','99999',NULL,'hardline','all','ulaw,alaw','no',NULL,'yes',NULL,NULL,NULL,NULL,'yes','yes',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO ps_endpoints VALUES('99010','transport-udp','99010','99010','hardline','all','ulaw,alaw','no',NULL,'yes','no',NULL,NULL,NULL,'yes','yes',NULL,'no',NULL,'no','no','no','yes');
CREATE TABLE ps_endpoint_id_ips (
  id TEXT PRIMARY KEY,
  endpoint TEXT,
  match TEXT
);
CREATE UNIQUE INDEX ps_contacts_uq ON ps_contacts(id, reg_server);
COMMIT;
