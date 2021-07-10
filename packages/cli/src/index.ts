import { program } from 'commander';
import { serveCommand } from './commands/serve';

// associate different commands together
program.addCommand(serveCommand)

program.parse(process.argv)