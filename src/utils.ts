import * as mkdirp from 'mkdirp';

export function contains(str: string, text: Array<string> | string) {
  if (Array.isArray(text)) {
    for (let i = 0; i < text.length; i++) {
      if (contains(str, text[i])) {
        return true;
      }
    }
  } else {
    return str.includes(text);
  }

  return false;
}

export function stripControlChars(input: string) {
  return input && input.replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '');
}

export function stackTraceFilter(parts: Array<string>) {
  return parts
    .reduce<Array<string>>(function(list, line) {
      if (contains(line, ['node_modules', '(node.js:', '(timers.js:', '(events.js:', '(util.js:', '(net.js:'])) {
        return list;
      }

      list.push(line);

      return list;
    }, [])
    .join('\n');
}

export function createReportFolder(output_folder: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdirp(output_folder, err => (err ? reject(err) : resolve()));
  });
}
