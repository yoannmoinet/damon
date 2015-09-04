# agents
----
> Bot agents navigating urls and doing tasks.

----

#### Npm Scripts
##### `npm postest` (auto)
> Is run automatically after `npm test` and controls formatting and linting.

##### `npm preversion` (auto)
> Is run automatically before `npm bump` and runs `npm build`.

##### `npm postversion` (auto)
> Is run automatically after `npm bump` and will synchronize `bower.json` with `package.js`'s new version.

##### `npm build` (manual)
> It runs `test`, `changelog`, `umd` and `uglify`.

##### `npm test` (manual)
> Tests.

#### Custom Scripts
They are all run by the previous npm scripts but you can run them at your convenience.

##### `npm run-script format`
> Test the formatting with **JSCS**

##### `npm run-script lint`
> Lint with **ESLint**

##### `npm run-script umd`
> UMDify your library

##### `npm run-script changelog`
> Generate a changelog for your library based on your commits if you've followed one of the supported [convention](https://github.com/ajoslin/conventional-changelog/tree/master/conventions).

##### `npm run-script uglify`
> Uglify your library
