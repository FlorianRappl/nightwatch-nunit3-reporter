import { resolve, join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { NUnit3Reporter, NUnit3ReporterOptions } from './reporter';

export interface NUnit3ReporterFunction {
  (results: any, callback: (error?: Error) => void): void;
}

/**
 * Creates a new reporter to be used in the globals.js file.
 */
export function createReporter(options: NUnit3ReporterOptions): NUnit3ReporterFunction {
  return (results, callback) => write(results, options, callback);
}

/**
 * A convenience reporter function.
 */
export function reporter(results: any, callback: (error?: Error) => void) {
  const nwJsonPath = resolve(process.cwd(), 'nightwatch.json');
  const options: NUnit3ReporterOptions = {};

  if (existsSync(nwJsonPath)) {
    const nwJson = JSON.parse(readFileSync(nwJsonPath, 'utf8'));
    options.output_folder = join(nwJson.output_folder || '', 'nunit3');
  }

  write(results, options, callback);
}

/**
 * Standard CLI interface as defined by Nightwatch.js.
 */
export function write(results: any, options: NUnit3ReporterOptions, callback: (error?: Error) => void) {
  const reporter = new NUnit3Reporter(results, options);

  reporter.write().then(
    () => callback(),
    err => {
      console.error(err);
      callback(err);
    },
  );
}
