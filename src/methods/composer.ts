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

  try {
    let composerFile = findComposer(path);
    let composerData = JSON.parse(composerFile);

    if (composerData.version) {
      return composerData.version;
    }

    return '';
  } catch (error) {
    throw new Error(`Could not load the file from  ${path}composer.json`);
  }
}

export const releaseDescription = (path: string): { version: string, title: string, description: string } => {
  const releaseDescription = {
    'title': '',
    'description': '',
    'version': ''
  };

  try {
    const composerFile = findComposer(path);
    const composerData = JSON.parse(composerFile);

    if (composerData.version) {
      releaseDescription.version = composerData.version;
    }

    if (composerData.extra && composerData.extra.changelog) {
      if (composerData.extra.changelog[0].version) {
        releaseDescription.version = composerData.extra.changelog[0].version;
      }

      if (composerData.extra.changelog[0].title) {
        releaseDescription.title = composerData.extra.changelog[0].title;
      }

      if (composerData.extra.changelog[0].description.lenght > 0) {
        composerData.extra.changelog[0].description.forEach(line => {
          releaseDescription.description += `${line}\n`;
        });
      }
    }

  } catch (error) {
    throw new Error(`Could not load the file from  ${path}composer.json`);
  }

  return releaseDescription;
}