# Github Version Creator

This action will try to create a new version based on the version from package.json or composer.json.

## Usage

### Inputs
- `method`: **Required** The method to be used `"composer.json"` or `"package.json"`
- `path`: Path to the composer.json or package.json file. Default `./`

### Outputs
- `version`: Version on the composer.json or package.json file
- `title`: Title of the commit message
- `description`: Work in progress

The title and descriptions can be set in the `composer.json` under the extras like in the following example:
 ```json
"extra": {
    "changelog": [
      {
        "version": "v1.0.0",
        "title": "Release v1.0.0",
        "description": [
          "First Line",
          "Second Line"
        ]
      }
    ]
  }
```

The version title.

### Example workflow - create a release

```yaml
jobs:
  build:
    name: Create Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Reading Version
        uses: moloni-pt/github-version-creator@master
        with:
          method: composer.json
          path: "./"
        id: package-version
```