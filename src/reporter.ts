import * as ejs from 'ejs';
import { loadTemplate } from './template';
import { writeFile } from 'fs';
import { join, sep } from 'path';
import { stackTraceFilter, stripControlChars, createReportFolder } from './utils';

export interface NUnit3ReporterOptions {
  output_folder?: string;
}

export class NUnit3Reporter {
  private readonly results: any;
  private readonly options: NUnit3ReporterOptions;

  constructor(results: any, opts: NUnit3ReporterOptions = {}) {
    this.results = results;
    this.options = opts;
  }

  private adaptAssertions(module: any) {
    Object.keys(module.completed).forEach(item => {
      const testcase = module.completed[item];
      const assertions = testcase.assertions;

      for (let i = 0; i < assertions.length; i++) {
        if (assertions[i].stackTrace) {
          assertions[i].stackTrace = stackTraceFilter(assertions[i].stackTrace.split('\n'));
        }
      }

      if (testcase.failed > 0 && testcase.stackTrace) {
        const stackParts = testcase.stackTrace.split('\n');
        const errorMessage = stackParts.shift();
        testcase.stackTrace = stackTraceFilter(stackParts);
        testcase.message = errorMessage;
      }
    });
  }

  private writeReportFile(filename: string, rendered: string, shouldCreateFolder: boolean, output_folder: string) {
    const promise = shouldCreateFolder ? createReportFolder(output_folder) : Promise.resolve();
    return promise.then(() => {
      return new Promise((resolve, reject) => {
        writeFile(filename, rendered, err => (err ? reject(err) : resolve()));
      });
    });
  }

  private writeReport(moduleKey: string, data: string) {
    const currentModule = this.results.modules[moduleKey];
    const pathParts = moduleKey.split(sep);
    const moduleName = pathParts.pop();

    let className = moduleName;
    let output_folder = this.options.output_folder || '';
    let shouldCreateFolder = false;

    this.adaptAssertions(currentModule);

    if (pathParts.length) {
      output_folder = join(output_folder, pathParts.join(sep));
      className = `${pathParts.join('.')}.${moduleName}`;
      shouldCreateFolder = true;
    }

    const filename = join(output_folder, `${currentModule.reportPrefix}${moduleName}.xml`);
    const systemerr = this.results.errmessages.join('\n');
    const rendered = stripControlChars(
      ejs.render(data, {
        module: currentModule,
        moduleName: moduleName,
        className: className,
        systemerr,
      }),
    );

    return this.writeReportFile(filename, rendered, shouldCreateFolder, output_folder);
  }

  write() {
    const keys = Object.keys(this.results.modules);

    return loadTemplate().then(data => {
      const promises = keys.map(moduleKey => this.writeReport(moduleKey, data));
      return Promise.all(promises);
    });
  }
}
