import { join } from 'path';
import { readFile } from 'fs';

let __tmplData__ = '';

function getTemplateFile() {
  return join(__dirname, '../template/nunit3.xml.ejs');
}

function setTemplateData(value: string) {
  __tmplData__ = value;
  return value;
}

function getTemplateData() {
  return __tmplData__;
}

export function loadTemplate(): Promise<string> {
  return new Promise((resolve, reject) => {
    const data = getTemplateData();

    if (data) {
      return resolve(data);
    }

    readFile(getTemplateFile(), (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(setTemplateData(data.toString()));
      }
    });
  });
}
