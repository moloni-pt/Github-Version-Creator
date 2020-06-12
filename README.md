# Github Version Creator

This action will try to create a new version based on the version from package.json, composer.json or on the latest version used.

## Inputs

### `method`

**Required** The method to be used `"auto"`,`"composer.json"` or `"package.json"`.

## Outputs

### `version`

The version title.

## Example usage

uses: moloni-pt/github-version-creator
with:
  method: 'composer.json'
