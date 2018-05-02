#!/usr/bin/env node
import * as commander from 'commander';
import chalk from 'chalk';
import { migrate } from './migrate';

commander.version('0.0.1');

commander
  .command('migrate')
  .alias('m')
  .description('Run firestore migration')
  .action((c, m) => {
    return migrate();
  });

commander.parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp(chalk.red);
}
