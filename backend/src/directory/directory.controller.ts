import { Controller, Get } from '@nestjs/common';
import { database } from '../db';

@Controller()
export class DirectoryController {
  @Get('/directory')
  getDirectory() {
    const users = database
      .prepare(
        `
      SELECT u.id, u.extension, u.display_name
      FROM users u
      ORDER BY u.extension
    `,
      )
      .all();

    const contacts = database
      .prepare(
        `
      SELECT
        endpoint,
        uri,
        status,
        rtt,
        expiration_time,
        user_agent
      FROM ps_contacts
      WHERE expiration_time > strftime('%s','now')
    `,
      )
      .all() as any;

    const byEndpoint = new Map<string, any[]>();
    for (const c of contacts) {
      if (!byEndpoint.has(c.endpoint)) byEndpoint.set(c.endpoint, []);
      byEndpoint.get(c.endpoint)!.push(c);
    }

    return {
      items: users.map((u: any) => ({
        extension: u.extension,
        displayName: u.display_name,
        online: byEndpoint.has(u.extension),
        contacts: byEndpoint.get(u.extension) ?? [],
      })),
    };
  }
}
