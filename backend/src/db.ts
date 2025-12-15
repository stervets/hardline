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
  `);
}
