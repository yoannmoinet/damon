<a name="0.5.6"></a>
## [0.5.6](https://github.com/damonjs/damon/compare/v0.5.5...v0.5.6) (2016-07-05)



<a name="0.5.5"></a>
## [0.5.5](https://github.com/damonjs/damon/compare/v0.5.4...v0.5.5) (2016-07-05)



<a name="0.5.4"></a>
## [0.5.4](https://github.com/damonjs/damon/compare/v0.5.3...v0.5.4) (2016-07-05)


### Bug Fixes

* **reporter:** check for object before logging it ([fe33076](https://github.com/damonjs/damon/commit/fe33076))



<a name="0.5.3"></a>
## [0.5.3](https://github.com/damonjs/damon/compare/v0.5.2...v0.5.3) (2016-07-04)


### Bug Fixes

* **navigate:** clean listeners to avoid leaks and handle load fails ([5fc73dd](https://github.com/damonjs/damon/commit/5fc73dd))
* **navigate:** remove undefined requests usage ([965f541](https://github.com/damonjs/damon/commit/965f541))
* **runner:** escape double-quotes one more time ([26eafa7](https://github.com/damonjs/damon/commit/26eafa7))


### Features

* **worker:** add the resourceTimeout setting ([a0e2c04](https://github.com/damonjs/damon/commit/a0e2c04))



<a name="0.5.2"></a>
## [0.5.2](https://github.com/damonjs/damon/compare/v0.5.1...v0.5.2) (2016-07-04)


### Bug Fixes

* **start, navigate:** add a timeout to handle long requests ([f9a7dfa](https://github.com/damonjs/damon/commit/f9a7dfa))
* better error reporting on navigation ([de84fab](https://github.com/damonjs/damon/commit/de84fab))


### Features

* **casper:** add a flag to ignore errors ([01995fd](https://github.com/damonjs/damon/commit/01995fd))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/damonjs/damon/compare/v0.5.0...v0.5.1) (2016-06-29)


### Bug Fixes

* **reporter:** update the display of the report ([69f73a7](https://github.com/damonjs/damon/commit/69f73a7))
* **worker:** add missing error type ([ca35e58](https://github.com/damonjs/damon/commit/ca35e58))


### Features

* **runner:** attach the error object to the error report byError ([e4207f2](https://github.com/damonjs/damon/commit/e4207f2))
* **runner:** ignore 'Operation canceled' errors ([816b56b](https://github.com/damonjs/damon/commit/816b56b))
* **runner:** pass the type into the error event and task object ([33ec590](https://github.com/damonjs/damon/commit/33ec590))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/damonjs/damon/compare/v0.4.4...v0.5.0) (2016-06-29)


### Bug Fixes

* **worker:** consider the first navigate as a regular task ([4a74307](https://github.com/damonjs/damon/commit/4a74307))


### Features

* **reporter:** consider errors in the CLI ([55aaa4b](https://github.com/damonjs/damon/commit/55aaa4b))
* **reporter:** display a report at the end ([2ed8c9e](https://github.com/damonjs/damon/commit/2ed8c9e))
* **reporter:** display times in seconds ([37d76a2](https://github.com/damonjs/damon/commit/37d76a2))
* **runner:** create a report at the end of the run ([efa0796](https://github.com/damonjs/damon/commit/efa0796))
* **runner:** emit an 'error' event ([78d67ea](https://github.com/damonjs/damon/commit/78d67ea))
* **worker:** add a type to errors ([815aa47](https://github.com/damonjs/damon/commit/815aa47))
* **worker:** report both resource and javascript errors ([95793d1](https://github.com/damonjs/damon/commit/95793d1))



<a name="0.4.4"></a>
## [0.4.4](https://github.com/damonjs/damon/compare/v0.4.3...v0.4.4) (2016-06-22)


### Bug Fixes

* **runner:** remove fs.watch leak when not running ([1051d3b](https://github.com/damonjs/damon/commit/1051d3b))



<a name="0.4.3"></a>
## [0.4.3](https://github.com/damonjs/damon/compare/v0.4.2...v0.4.3) (2016-06-21)


### Bug Fixes

* **npm:** remove useless chmod script ([2328d2e](https://github.com/damonjs/damon/commit/2328d2e))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/damonjs/damon/compare/v0.4.1...v0.4.2) (2016-06-20)


### Bug Fixes

* **actions:** correctly pass the timeout from parent ([e2c8e7e](https://github.com/damonjs/damon/commit/e2c8e7e))
* **runner:** better handle file changes on unix ([5e40cf7](https://github.com/damonjs/damon/commit/5e40cf7))
* **runner:** remove watch leak ([13785c5](https://github.com/damonjs/damon/commit/13785c5))


### Features

* **actions:** add the navigate action ([9d1e69f](https://github.com/damonjs/damon/commit/9d1e69f))
* **phantomjs:** update execs and add Mac's one ([6576732](https://github.com/damonjs/damon/commit/6576732))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/damonjs/damon/compare/v0.4.0...v0.4.1) (2016-06-20)



<a name="0.4.0"></a>
# [0.4.0](https://github.com/damonjs/damon/compare/v0.3.0...v0.4.0) (2016-06-20)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/damonjs/damon/compare/v0.2.1...v0.3.0) (2016-06-20)


### Bug Fixes

* add phantomjs ssl "support" via flags ([a4ae5ff](https://github.com/damonjs/damon/commit/a4ae5ff))
* **runner:** empty runner file queue when killing the bots process ([bda265a](https://github.com/damonjs/damon/commit/bda265a))
* cleanChild only if the child process has been killed ([c548152](https://github.com/damonjs/damon/commit/c548152))
* kill casper and phantom processes with killAll ([e150b6e](https://github.com/damonjs/damon/commit/e150b6e))
* take out the double assignment ([2e1d60c](https://github.com/damonjs/damon/commit/2e1d60c))


### Features

* ability to pass a custom userAgent in config ([50619e8](https://github.com/damonjs/damon/commit/50619e8))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/damonjs/damon/compare/v0.2.0...v0.2.1) (2016-03-22)


### Bug Fixes

* email ([0e2b7a8](https://github.com/damonjs/damon/commit/0e2b7a8))


### Features

* add a postinstall script to chmod *nix executables ([2fb232d](https://github.com/damonjs/damon/commit/2fb232d))
* add logo ([f6a18ed](https://github.com/damonjs/damon/commit/f6a18ed))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/damonjs/damon/compare/v0.1.0...v0.2.0) (2016-03-18)


### Bug Fixes

* **actions:** log in prevention of extension ([1aa80c5](https://github.com/damonjs/damon/commit/1aa80c5))
* **actions:** remove binding casper since casper is global ([87c6fa3](https://github.com/damonjs/damon/commit/87c6fa3))
* **actions:** use default timeout if not provided to dom action ([2212826](https://github.com/damonjs/damon/commit/2212826))
* **capture:** take out the inexisting parameter ([ef885dc](https://github.com/damonjs/damon/commit/ef885dc))
* **casper:** have cookies saved with navigation ([e29902b](https://github.com/damonjs/damon/commit/e29902b))
* **casper:** remove useless executables and silly postinstall copy ([a65dc4c](https://github.com/damonjs/damon/commit/a65dc4c))
* **casper:** use fixed version of casper ([5713781](https://github.com/damonjs/damon/commit/5713781))
* **deps:** move chalk and expect from dev to general deps ([0c42e07](https://github.com/damonjs/damon/commit/0c42e07))
* **get resource:** use strict equality for status ([97923e8](https://github.com/damonjs/damon/commit/97923e8))
* **getAttribute:** get captured group of a modifier ([693994a](https://github.com/damonjs/damon/commit/693994a))
* **log:** print dumps correctly ([9c4f5cc](https://github.com/damonjs/damon/commit/9c4f5cc))
* add a timeout function when dom times out ([d551a80](https://github.com/damonjs/damon/commit/d551a80))
* **log:** print even if not a string (integer for example) ([7f596f8](https://github.com/damonjs/damon/commit/7f596f8))
* **log:** use bind instead of call ([8c70e97](https://github.com/damonjs/damon/commit/8c70e97))
* **logger:** transit the logId if already set ([3c8ce30](https://github.com/damonjs/damon/commit/3c8ce30))
* **navigate:** get a parsed url through template plugin ([f4774a9](https://github.com/damonjs/damon/commit/f4774a9))
* **phantomjs:** make unix files executable in git ([5ecba68](https://github.com/damonjs/damon/commit/5ecba68))
* **plugins-get:** modify Regexp to accept a number passed as a string as a key value ([341f8a4](https://github.com/damonjs/damon/commit/341f8a4))
* **reporter:** use supported spinner for windows ([c4da9ed](https://github.com/damonjs/damon/commit/c4da9ed))
* **runner:** do not unescape anti-slash escapes ([39b5d46](https://github.com/damonjs/damon/commit/39b5d46))
* **runner:** use 'test' and 'pass' events correctly ([5571dcc](https://github.com/damonjs/damon/commit/5571dcc))
* **taskGet:** handle better returned falsy values ([97b5a24](https://github.com/damonjs/damon/commit/97b5a24))
* add more time for timeout and give an half-second pause between each task ([ad144a9](https://github.com/damonjs/damon/commit/ad144a9))
* avoid considering the 'finish' report as an error ([162a493](https://github.com/damonjs/damon/commit/162a493))
* avoid multiple parallel runs ([ce0371b](https://github.com/damonjs/damon/commit/ce0371b))
* can pass status dynamically when getting resource ([e2e5be0](https://github.com/damonjs/damon/commit/e2e5be0))
* change how assert types are handled and log an error if no task found ([a836806](https://github.com/damonjs/damon/commit/a836806))
* export directly actions function ([61e516c](https://github.com/damonjs/damon/commit/61e516c))
* more modular actions ([c5ba0c9](https://github.com/damonjs/damon/commit/c5ba0c9))
* pass the cwd to the actions ([a5fba01](https://github.com/damonjs/damon/commit/a5fba01))
* remove unnecessary ([081de9d](https://github.com/damonjs/damon/commit/081de9d))
* reset window status after getting the value ([8e3db48](https://github.com/damonjs/damon/commit/8e3db48))
* simplify the code ([29dc820](https://github.com/damonjs/damon/commit/29dc820))
* stop passing casper as a parameter for get helper functions ([235c57f](https://github.com/damonjs/damon/commit/235c57f))
* stop passing casper as a parameter for request helper function ([e22f6b1](https://github.com/damonjs/damon/commit/e22f6b1))
* support freaking node 0.10.x ([7f7a053](https://github.com/damonjs/damon/commit/7f7a053))
* take out the wait 500ms for each task ([1cc8ce5](https://github.com/damonjs/damon/commit/1cc8ce5))
* throw error when getVariable return null ([fa30092](https://github.com/damonjs/damon/commit/fa30092))
* try to save a response body as an object and ability to access an saved object when doing assert key ([052231c](https://github.com/damonjs/damon/commit/052231c))
* typo ([de43472](https://github.com/damonjs/damon/commit/de43472))
* **template:** take out global for regexp test ([7579a5d](https://github.com/damonjs/damon/commit/7579a5d))
* use encodeURI instead of encodeURIComponent ([92ed2f9](https://github.com/damonjs/damon/commit/92ed2f9))
* use one call instead of bind + call ([80e60bb](https://github.com/damonjs/damon/commit/80e60bb))
* use strict comparisons ([4ddbe66](https://github.com/damonjs/damon/commit/4ddbe66))
* use this instead of casper ([e8bdbd2](https://github.com/damonjs/damon/commit/e8bdbd2))
* **unix:** update to correctly write the PATH on unix systems ([7bd1384](https://github.com/damonjs/damon/commit/7bd1384))
* **wait:** pass a timeout function to avoid casper's throw ([d82982c](https://github.com/damonjs/damon/commit/d82982c))
* **wait:** use params.time even if 0 ([6e78ecc](https://github.com/damonjs/damon/commit/6e78ecc))


### Features

* ability to get values from requests ([2843eb5](https://github.com/damonjs/damon/commit/2843eb5))
* accept modifier for an attribute and accept [@text](https://github.com/text) as an attribute for text inside of the selector ([7b2b3d5](https://github.com/damonjs/damon/commit/7b2b3d5))
* accept reporters not only as filepath but as objects also ([6bdffdb](https://github.com/damonjs/damon/commit/6bdffdb))
* add a killAll function to the runner ([f37c642](https://github.com/damonjs/damon/commit/f37c642))
* add a runner ([887ac21](https://github.com/damonjs/damon/commit/887ac21))
* add an error handle to make sure that the variable has the right format ([2206cdb](https://github.com/damonjs/damon/commit/2206cdb))
* add an initialize function to the runner ([1ef865c](https://github.com/damonjs/damon/commit/1ef865c))
* add clear function to the runner ([26a3020](https://github.com/damonjs/damon/commit/26a3020))
* add download ability ([2f99fd7](https://github.com/damonjs/damon/commit/2f99fd7))
* add the `request` action to do AJAX calls during the workflow ([8817c9a](https://github.com/damonjs/damon/commit/8817c9a))
* add the logger to help communicate between casper and node ([9edb988](https://github.com/damonjs/damon/commit/9edb988))
* add the possibility to unbind the logfile watching ([05706ed](https://github.com/damonjs/damon/commit/05706ed))
* add the reporter and the possibility to have custom ones ([336c45a](https://github.com/damonjs/damon/commit/336c45a))
* allow a download action that actually download a file into download folder ([8c028d2](https://github.com/damonjs/damon/commit/8c028d2))
* allow files passed as string and not only arrays ([31a6876](https://github.com/damonjs/damon/commit/31a6876))
* allow to report a task description ([aadf433](https://github.com/damonjs/damon/commit/aadf433))
* allow wait resource to accept a request method ([d93d4cd](https://github.com/damonjs/damon/commit/d93d4cd))
* assert a status when trying to get a file from an url ([55f0597](https://github.com/damonjs/damon/commit/55f0597))
* capture global objects/variables ([92944d4](https://github.com/damonjs/damon/commit/92944d4))
* change name to `damon` ([782bb75](https://github.com/damonjs/damon/commit/782bb75))
* colorize some outputs ([2abfa05](https://github.com/damonjs/damon/commit/2abfa05))
* create better assertion model ([821ec43](https://github.com/damonjs/damon/commit/821ec43))
* export kill, clear and runner from the entry point ([772eff7](https://github.com/damonjs/damon/commit/772eff7))
* load reporter ([f2c73f2](https://github.com/damonjs/damon/commit/f2c73f2))
* make attaching the reporter part of the API ([82ff27b](https://github.com/damonjs/damon/commit/82ff27b))
* make src/index.js the main file ([c7f3836](https://github.com/damonjs/damon/commit/c7f3836))
* transmit attributes between tasks ([3505937](https://github.com/damonjs/damon/commit/3505937))
* update license to Apache-2.0 ([e30ae5c](https://github.com/damonjs/damon/commit/e30ae5c))
* **store:** allow templating of values in deep-objects too ([af1a217](https://github.com/damonjs/damon/commit/af1a217))
* use env vars as base for the template plugin ([d44073f](https://github.com/damonjs/damon/commit/d44073f))
* **config:** get logLevel and timeout from the config of tasks file ([f8f78a6](https://github.com/damonjs/damon/commit/f8f78a6))
* **get:** get the number of elements satisfying a selector ([1b8277f](https://github.com/damonjs/damon/commit/1b8277f))
* **get:** make `getVariable` to be useable on any var ([b4f899f](https://github.com/damonjs/damon/commit/b4f899f))
* **log:** add logLevel feature in the log module ([9b96fb5](https://github.com/damonjs/damon/commit/9b96fb5))
* **phantom:** update phantomJS to 2.1.1 ([ba88ad4](https://github.com/damonjs/damon/commit/ba88ad4))
* **phantomjs:** add 64 architectures detection ([cc1ac54](https://github.com/damonjs/damon/commit/cc1ac54))
* **plugin:** accept xpath for a selector ([fcde1c4](https://github.com/damonjs/damon/commit/fcde1c4))
* **reporter:** add duration ([e4a737e](https://github.com/damonjs/damon/commit/e4a737e))
* **runner:** pass the complete report to the finish event ([cc09a26](https://github.com/damonjs/damon/commit/cc09a26))
* **wait:** timeout default to 10sec instead of 30sec ([8f6cb5e](https://github.com/damonjs/damon/commit/8f6cb5e))
* WAY better begin/pending/end/fail/success task differentiation ([a42f101](https://github.com/damonjs/damon/commit/a42f101))
* **worker:** transmit more details about errors ([618e434](https://github.com/damonjs/damon/commit/618e434))


### Performance Improvements

* Wait url can now accept a regexp as option ([1a53678](https://github.com/damonjs/damon/commit/1a53678))
* **dom:** use waitUntilVisible instead of random wait ([a0b983e](https://github.com/damonjs/damon/commit/a0b983e))



<a name="0.1.0"></a>
# [0.1.0](https://github.com/damonjs/damon/compare/v0.0.9...v0.1.0) (2016-01-28)



<a name="0.0.9"></a>
## [0.0.9](https://github.com/damonjs/damon/compare/v0.0.8...v0.0.9) (2015-12-17)


### Bug Fixes

* **cli:** correct cwd when passing the file ([8fea490](https://github.com/damonjs/damon/commit/8fea490))



<a name="0.0.8"></a>
## [0.0.8](https://github.com/damonjs/damon/compare/v0.0.7...v0.0.8) (2015-12-17)


### Bug Fixes

* **phantom:** new build ([e5f42d6](https://github.com/damonjs/damon/commit/e5f42d6))



<a name="0.0.7"></a>
## [0.0.7](https://github.com/damonjs/damon/compare/v0.0.6...v0.0.7) (2015-12-17)


### Bug Fixes

* rename phantomjs exec for ubuntu version ([3614586](https://github.com/damonjs/damon/commit/3614586))
* **phantom:** build phantom for ubuntu 12.0 ([2863f0c](https://github.com/damonjs/damon/commit/2863f0c))



<a name="0.0.6"></a>
## [0.0.6](https://github.com/damonjs/damon/compare/v0.0.5...v0.0.6) (2015-12-17)


### Bug Fixes

* remove duplicate import ([a8967bc](https://github.com/damonjs/damon/commit/a8967bc))
* **agent:** clean exit ([cf72682](https://github.com/damonjs/damon/commit/cf72682))



<a name="0.0.5"></a>
## [0.0.5](https://github.com/damonjs/damon/compare/v0.0.4...v0.0.5) (2015-12-17)


### Bug Fixes

* **phantom:** update unix build ([029d2c4](https://github.com/damonjs/damon/commit/029d2c4))



<a name="0.0.4"></a>
## [0.0.4](https://github.com/damonjs/damon/compare/v0.0.3...v0.0.4) (2015-12-15)



<a name="0.0.3"></a>
## [0.0.3](https://github.com/damonjs/damon/compare/v0.0.2...v0.0.3) (2015-12-15)


### Features

* support windows and unix platforms ([8858ef6](https://github.com/damonjs/damon/commit/8858ef6))



<a name="0.0.2"></a>
## [0.0.2](https://github.com/damonjs/damon/compare/90cd90e...v0.0.2) (2015-12-15)


### Bug Fixes

* update to new casper syntax for internal modules ([2939a04](https://github.com/damonjs/damon/commit/2939a04))
* use absolute path ([41c6ef2](https://github.com/damonjs/damon/commit/41c6ef2))


### Features

* instrumentalize with a cli ([7d59bba](https://github.com/damonjs/damon/commit/7d59bba))
* **phantom:** add binary for OSX ([69c6446](https://github.com/damonjs/damon/commit/69c6446))
* **phantom:** add phantom executable ([90cd90e](https://github.com/damonjs/damon/commit/90cd90e))
* **worker:** exit on error ([c2c208d](https://github.com/damonjs/damon/commit/c2c208d))



