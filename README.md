# nightwatch-nunit3-reporter

[![Build Status](https://florianrappl.visualstudio.com/nightwatch-nunit3-reporter/_apis/build/status/nightwatch-nunit3-reporter-CI?branchName=master)](https://florianrappl.visualstudio.com/nightwatch-nunit3-reporter/_build/latest?definitionId=9&branchName=master)
[![npm Version](https://img.shields.io/npm/v/nightwatch-nunit3-reporter.svg)](https://www.npmjs.com/package/nightwatch-nunit3-reporter)
[![GitHub Tag](https://img.shields.io/github/tag/FlorianRappl/nightwatch-nunit3-reporter.svg)](https://github.com/FlorianRappl/nightwatch-nunit3-reporter/releases)
[![GitHub Issues](https://img.shields.io/github/issues/FlorianRappl/nightwatch-nunit3-reporter.svg)](https://github.com/FlorianRappl/nightwatch-nunit3-reporter/issues)

This is a custom reporter for Nightwatch.js that generated [NUnit 3 compatible XML](https://github.com/nunit/docs/wiki/Test-Result-XML-Format) files. This is particularly useful to support, e.g., Azure DevOps, which cannot handle attachments in the JUnit reports generated out of the box by Nightwatch.js.

## Getting Started

You need to have [Node](https://nodejs.org/) with NPM installed. In your repository run

```sh
npm i nightwatch-nunit3-reporter
```

This install the reporter. Besides Node.js and everything that comes with it you need to have [Nightwatch](https://nightwatchjs.org/) installed.

The configuration of the package in Nightwatch is fairly simple. You can either use the package via the command line overriding the standard JUnit reporter:

```sh
nightwatch --reporter node_modules/nightwatch-nunit3-reporter/index.js
```

Or you can use it via your globals.js file in addition to the JUnit reporter:

```js
import { createReporter } from 'nightwatch-nunit3-reporter';

const reporter = createReporter({
  output_folder: './reports', // should be different to the JUnit folder
});

module.exports = {
  // ...
  reporter,
};
```

This way you need to set up the output folder. In the CLI case the output folder is determined by Nightwatch.js.

Alternatively, if you start Nightwatch from the root directory where your *nightwatch.json* is located you can use:

```js
import { reporter } from 'nightwatch-nunit3-reporter';

module.exports = {
  // ...
  reporter,
};
```

This one uses the `output_folder` from the *nightwatch.json*. In this case a subfolder called *nunit3* will be created at the location specified by `output_folder`.

## License

nightwatch-nunit3-reporter is released using the MIT license. For more information see the [LICENSE file](LICENSE).
