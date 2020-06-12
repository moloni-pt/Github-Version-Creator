import fs from 'fs';
import { join } from 'path';

/**
 * Find package.json with path.
 * @param path
 */
export const findPackage = (path: string): string => {
  return fs.readFileSync(join(path, 'package.json')).toString();
};

export const packageVersion = (path: string): string => {

  try {
    let packageFile = findPackage(path);
    let packageData = JSON.parse(packageFile);

    if (packageData.version) {
      return packageData.version;
    }

    return '';
  } catch (error) {
    throw new Error(`Could not load the file from  ${path}package.json`);
  }
}