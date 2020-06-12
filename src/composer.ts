import fs from 'fs';
import { join } from 'path';

/**
 * Find package.json with path.
 * @param path
 */
export const findComposer = (path: string): string => {
  return fs.readFileSync(join(path, 'composer.json')).toString();
};

export const composerVersion = (path: string): string => {

  let composerFile = findComposer(path);
  let composerData = JSON.parse(composerFile);
  console.log(composerData);

  return 'V1';
}