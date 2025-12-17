import { Controller, Get } from '@nestjs/common';
import { readRegistry } from '../registry';

@Controller()
export class DirectoryController {
  @Get('/directory')
  getDirectory() {
    const r = readRegistry();
    return {
      items: r.users
        .slice()
        .sort((a, b) => a.ext - b.ext)
        .map((u) => ({ extension: u.ext, displayName: u.name })),
    };
  }
}
