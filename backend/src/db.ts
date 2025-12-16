import Database from 'better-sqlite3';
import { config } from './config';

export let database: Database.Database;

export function initDb() {
  database = new Database(config.sqlitePath);
  database.pragma('journal_mode = WAL');

  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
                                       id TEXT PRIMARY KEY,
                                       display_name TEXT NOT NULL,
                                       password_hash TEXT NOT NULL,
                                       extension TEXT NOT NULL UNIQUE,
                                       sip_password TEXT NOT NULL,
                                       created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ps_aors (
                                         id TEXT PRIMARY KEY,
                                         max_contacts INTEGER,
                                         qualify_frequency INTEGER,
                                         default_expiration INTEGER,
                                         minimum_expiration INTEGER,
                                         maximum_expiration INTEGER
    );

    CREATE TABLE IF NOT EXISTS ps_auths (
                                          id TEXT PRIMARY KEY,
                                          auth_type TEXT,
                                          username TEXT,
                                          password TEXT
    );

    CREATE TABLE IF NOT EXISTS ps_endpoints (
                                              id TEXT PRIMARY KEY,
                                              transport TEXT,
                                              aors TEXT,
                                              auth TEXT,
                                              context TEXT,
                                              disallow TEXT,
                                              allow TEXT,
                                              direct_media TEXT,
                                              rtp_symmetric TEXT,
                                              force_rport TEXT,
                                              rewrite_contact TEXT,
                                              timers TEXT
    );

    -- Contacts are created/updated by Asterisk registrar during REGISTER/UNREGISTER.
    -- Keep the schema permissive: SQLite types are flexible, and Asterisk versions
    -- sometimes add new columns (e.g. prune_on_boot / qualify_2xx_only).
    CREATE TABLE IF NOT EXISTS ps_contacts (
                                            id TEXT PRIMARY KEY,
                                            uri TEXT,
                                            expiration_time INTEGER,
                                            qualify_frequency INTEGER,
                                            qualify_timeout REAL,
                                            qualify_2xx_only TEXT,
                                            outbound_proxy TEXT,
                                            path TEXT,
                                            user_agent TEXT,
                                            endpoint TEXT,
                                            reg_server TEXT,
                                            authenticate_qualify TEXT,
                                            prune_on_boot TEXT,
                                            via_addr TEXT,
                                            via_port INTEGER,
                                            call_id TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_ps_contacts_endpoint ON ps_contacts(endpoint);
    CREATE INDEX IF NOT EXISTS idx_ps_contacts_exp_time ON ps_contacts(expiration_time);

    -- Optional: identify endpoints by source IP / header.
    CREATE TABLE IF NOT EXISTS ps_endpoint_id_ips (
                                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                    endpoint TEXT NOT NULL,
                                                    match TEXT,
                                                    match_header TEXT,
                                                    srv_lookups TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_ps_endpoint_id_ips_endpoint ON ps_endpoint_id_ips(endpoint);
  `);
}
