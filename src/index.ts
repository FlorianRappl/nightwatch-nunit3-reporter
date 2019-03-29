import { NUnit3Reporter, NUnit3ReporterOptions } from './reporter';

export function reporter(results: any, callback: (error?: Error) => void) {
  return write(results, {}, callback);
}

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
