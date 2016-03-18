<a name="0.2.0"></a>
# [0.2.0](https://github.com/yoannmoinet/damon/compare/v0.2.0...v0.2.0) (2016-03-18)




<a name="0.2.0"></a>
# [0.2.0](https://github.com/yoannmoinet/damon/compare/v0.1.0...v0.2.0) (2016-03-18)


### Bug Fixes

* **actions:** log in prevention of extension ([d602dc0](https://github.com/yoannmoinet/damon/commit/d602dc0))
* **actions:** remove binding casper since casper is global ([6c3c845](https://github.com/yoannmoinet/damon/commit/6c3c845))
* **actions:** use default timeout if not provided to dom action ([f8744c9](https://github.com/yoannmoinet/damon/commit/f8744c9))
* **capture:** take out the inexisting parameter ([367d533](https://github.com/yoannmoinet/damon/commit/367d533))
* **casper:** have cookies saved with navigation ([ed20851](https://github.com/yoannmoinet/damon/commit/ed20851))
* **casper:** remove useless executables and silly postinstall copy ([4acc541](https://github.com/yoannmoinet/damon/commit/4acc541))
* **casper:** use fixed version of casper ([f84267d](https://github.com/yoannmoinet/damon/commit/f84267d))
* **deps:** move chalk and expect from dev to general deps ([6349f85](https://github.com/yoannmoinet/damon/commit/6349f85))
* **get resource:** use strict equality for status ([e90d5a3](https://github.com/yoannmoinet/damon/commit/e90d5a3))
* **getAttribute:** get captured group of a modifier ([46f9f9f](https://github.com/yoannmoinet/damon/commit/46f9f9f))
* **log:** print dumps correctly ([6fa5115](https://github.com/yoannmoinet/damon/commit/6fa5115))
* add a timeout function when dom times out ([ac5f25e](https://github.com/yoannmoinet/damon/commit/ac5f25e))
* **log:** print even if not a string (integer for example) ([9f3efbb](https://github.com/yoannmoinet/damon/commit/9f3efbb))
* **log:** use bind instead of call ([cc8c702](https://github.com/yoannmoinet/damon/commit/cc8c702))
* **logger:** transit the logId if already set ([6c8b578](https://github.com/yoannmoinet/damon/commit/6c8b578))
* **navigate:** get a parsed url through template plugin ([eb98a91](https://github.com/yoannmoinet/damon/commit/eb98a91))
* **phantomjs:** make unix files executable in git ([cf1516f](https://github.com/yoannmoinet/damon/commit/cf1516f))
* **plugins-get:** modify Regexp to accept a number passed as a string as a key value ([80eb235](https://github.com/yoannmoinet/damon/commit/80eb235))
* **reporter:** use supported spinner for windows ([afa8372](https://github.com/yoannmoinet/damon/commit/afa8372))
* **runner:** do not unescape anti-slash escapes ([3614d03](https://github.com/yoannmoinet/damon/commit/3614d03))
* **runner:** use 'test' and 'pass' events correctly ([13d69c6](https://github.com/yoannmoinet/damon/commit/13d69c6))
* **taskGet:** handle better returned falsy values ([eebc1f5](https://github.com/yoannmoinet/damon/commit/eebc1f5))
* add more time for timeout and give an half-second pause between each task ([0ac1814](https://github.com/yoannmoinet/damon/commit/0ac1814))
* avoid considering the 'finish' report as an error ([d34a68a](https://github.com/yoannmoinet/damon/commit/d34a68a))
* avoid multiple parallel runs ([c612b28](https://github.com/yoannmoinet/damon/commit/c612b28))
* can pass status dynamically when getting resource ([850f8c5](https://github.com/yoannmoinet/damon/commit/850f8c5))
* change how assert types are handled and log an error if no task found ([64d3909](https://github.com/yoannmoinet/damon/commit/64d3909))
* export directly actions function ([f81a021](https://github.com/yoannmoinet/damon/commit/f81a021))
* more modular actions ([21ccc12](https://github.com/yoannmoinet/damon/commit/21ccc12))
* pass the cwd to the actions ([3743f47](https://github.com/yoannmoinet/damon/commit/3743f47))
* remove unnecessary ([8d98cd4](https://github.com/yoannmoinet/damon/commit/8d98cd4))
* reset window status after getting the value ([ca19894](https://github.com/yoannmoinet/damon/commit/ca19894))
* simplify the code ([1940dcb](https://github.com/yoannmoinet/damon/commit/1940dcb))
* stop passing casper as a parameter for get helper functions ([e49c5db](https://github.com/yoannmoinet/damon/commit/e49c5db))
* stop passing casper as a parameter for request helper function ([e19f368](https://github.com/yoannmoinet/damon/commit/e19f368))
* support freaking node 0.10.x ([63bd93f](https://github.com/yoannmoinet/damon/commit/63bd93f))
* take out the wait 500ms for each task ([5d894f0](https://github.com/yoannmoinet/damon/commit/5d894f0))
* throw error when getVariable return null ([1673621](https://github.com/yoannmoinet/damon/commit/1673621))
* try to save a response body as an object and ability to access an saved object w ([751b875](https://github.com/yoannmoinet/damon/commit/751b875))
* typo ([9f80005](https://github.com/yoannmoinet/damon/commit/9f80005))
* **template:** take out global for regexp test ([fe35929](https://github.com/yoannmoinet/damon/commit/fe35929))
* use encodeURI instead of encodeURIComponent ([42d7a3d](https://github.com/yoannmoinet/damon/commit/42d7a3d))
* use one call instead of bind + call ([920332f](https://github.com/yoannmoinet/damon/commit/920332f))
* use strict comparisons ([41cd235](https://github.com/yoannmoinet/damon/commit/41cd235))
* use this instead of casper ([48ef293](https://github.com/yoannmoinet/damon/commit/48ef293))
* **unix:** update to correctly write the PATH on unix systems ([c9e62e8](https://github.com/yoannmoinet/damon/commit/c9e62e8))
* **wait:** pass a timeout function to avoid casper's throw ([7839721](https://github.com/yoannmoinet/damon/commit/7839721))
* **wait:** use params.time even if 0 ([d52d053](https://github.com/yoannmoinet/damon/commit/d52d053))

### Features

* WAY better begin/pending/end/fail/success task differentiation ([c70d739](https://github.com/yoannmoinet/damon/commit/c70d739))
* ability to get values from requests ([7218f8c](https://github.com/yoannmoinet/damon/commit/7218f8c))
* accept modifier for an attribute and accept @text as an attribute for text insid ([5f57431](https://github.com/yoannmoinet/damon/commit/5f57431))
* accept reporters not only as filepath but as objects also ([89f764c](https://github.com/yoannmoinet/damon/commit/89f764c))
* add a killAll function to the runner ([29b516d](https://github.com/yoannmoinet/damon/commit/29b516d))
* add a runner ([8ce096e](https://github.com/yoannmoinet/damon/commit/8ce096e))
* add an error handle to make sure that the variable has the right format ([9b467f2](https://github.com/yoannmoinet/damon/commit/9b467f2))
* add an initialize function to the runner ([e01b759](https://github.com/yoannmoinet/damon/commit/e01b759))
* add clear function to the runner ([1d48311](https://github.com/yoannmoinet/damon/commit/1d48311))
* add download ability ([6db5670](https://github.com/yoannmoinet/damon/commit/6db5670))
* add the `request` action to do AJAX calls during the workflow ([6326a6a](https://github.com/yoannmoinet/damon/commit/6326a6a))
* add the logger to help communicate between casper and node ([aa81e87](https://github.com/yoannmoinet/damon/commit/aa81e87))
* add the possibility to unbind the logfile watching ([c6b6b06](https://github.com/yoannmoinet/damon/commit/c6b6b06))
* add the reporter and the possibility to have custom ones ([0675a82](https://github.com/yoannmoinet/damon/commit/0675a82))
* allow a download action that actually download a file into download folder ([1b05ca7](https://github.com/yoannmoinet/damon/commit/1b05ca7))
* allow files passed as string and not only arrays ([59f9bcf](https://github.com/yoannmoinet/damon/commit/59f9bcf))
* allow to report a task description ([730a8e8](https://github.com/yoannmoinet/damon/commit/730a8e8))
* allow wait resource to accept a request method ([ba44e6a](https://github.com/yoannmoinet/damon/commit/ba44e6a))
* assert a status when trying to get a file from an url ([bfa68dc](https://github.com/yoannmoinet/damon/commit/bfa68dc))
* capture global objects/variables ([4ca9b2a](https://github.com/yoannmoinet/damon/commit/4ca9b2a))
* change name to `damon` ([de321bf](https://github.com/yoannmoinet/damon/commit/de321bf))
* colorize some outputs ([e69dc88](https://github.com/yoannmoinet/damon/commit/e69dc88))
* create better assertion model ([660c0e1](https://github.com/yoannmoinet/damon/commit/660c0e1))
* export kill, clear and runner from the entry point ([c3f5f06](https://github.com/yoannmoinet/damon/commit/c3f5f06))
* load reporter ([cc72881](https://github.com/yoannmoinet/damon/commit/cc72881))
* make attaching the reporter part of the API ([97e22dd](https://github.com/yoannmoinet/damon/commit/97e22dd))
* make src/index.js the main file ([abf5980](https://github.com/yoannmoinet/damon/commit/abf5980))
* transmit attributes between tasks ([fe8c1d5](https://github.com/yoannmoinet/damon/commit/fe8c1d5))
* update license to Apache-2.0 ([08ba699](https://github.com/yoannmoinet/damon/commit/08ba699))
* **get:** make `getVariable` to be useable on any var ([02631e6](https://github.com/yoannmoinet/damon/commit/02631e6))
* use env vars as base for the template plugin ([5559ca4](https://github.com/yoannmoinet/damon/commit/5559ca4))
* **config:** get logLevel and timeout from the config of tasks file ([590a6bd](https://github.com/yoannmoinet/damon/commit/590a6bd))
* **get:** get the number of elements satisfying a selector ([7b5be7e](https://github.com/yoannmoinet/damon/commit/7b5be7e))
* **log:** add logLevel feature in the log module ([1ccbd82](https://github.com/yoannmoinet/damon/commit/1ccbd82))
* **phantom:** update phantomJS to 2.1.1 ([36ef32f](https://github.com/yoannmoinet/damon/commit/36ef32f))
* **phantomjs:** add 64 architectures detection ([87ef9f1](https://github.com/yoannmoinet/damon/commit/87ef9f1))
* **plugin:** accept xpath for a selector ([f4796a8](https://github.com/yoannmoinet/damon/commit/f4796a8))
* **reporter:** add duration ([8518584](https://github.com/yoannmoinet/damon/commit/8518584))
* **runner:** pass the complete report to the finish event ([29d3a17](https://github.com/yoannmoinet/damon/commit/29d3a17))
* **store:** allow templating of values in deep-objects too ([dc8f504](https://github.com/yoannmoinet/damon/commit/dc8f504))
* **wait:** timeout default to 10sec instead of 30sec ([24089f1](https://github.com/yoannmoinet/damon/commit/24089f1))
* **worker:** transmit more details about errors ([1244059](https://github.com/yoannmoinet/damon/commit/1244059))

### Performance Improvements

* Wait url can now accept a regexp as option ([1d97320](https://github.com/yoannmoinet/damon/commit/1d97320))
* **dom:** use waitUntilVisible instead of random wait ([ffce4c4](https://github.com/yoannmoinet/damon/commit/ffce4c4))



<a name="0.1.0"></a>
# [0.1.0](https://github.com/yoannmoinet/damon/compare/v0.0.9...v0.1.0) (2016-01-28)


### Features

* allow passing multiple files as arguments ([1b31ee8](https://github.com/yoannmoinet/damon/commit/1b31ee8))



<a name="0.0.9"></a>
## [0.0.9](https://github.com/yoannmoinet/damon/compare/v0.0.6...v0.0.9) (2015-12-17)


### Bug Fixes

* rename phantomjs exec for ubuntu version ([3614586](https://github.com/yoannmoinet/damon/commit/3614586))
* **cli:** correct cwd when passing the file ([8fea490](https://github.com/yoannmoinet/damon/commit/8fea490))
* **phantom:** build phantom for ubuntu 12.0 ([2863f0c](https://github.com/yoannmoinet/damon/commit/2863f0c))
* **phantom:** new build ([e5f42d6](https://github.com/yoannmoinet/damon/commit/e5f42d6))



<a name="0.0.6"></a>
## [0.0.6](https://github.com/yoannmoinet/damon/compare/v0.0.4...v0.0.6) (2015-12-17)


### Bug Fixes

* remove duplicate import ([a8967bc](https://github.com/yoannmoinet/damon/commit/a8967bc))
* **agent:** clean exit ([cf72682](https://github.com/yoannmoinet/damon/commit/cf72682))
* **phantom:** update unix build ([029d2c4](https://github.com/yoannmoinet/damon/commit/029d2c4))



<a name="0.0.4"></a>
## [0.0.4](https://github.com/yoannmoinet/damon/compare/v0.0.3...v0.0.4) (2015-12-15)




<a name="0.0.3"></a>
## [0.0.3](https://github.com/yoannmoinet/damon/compare/v0.0.2...v0.0.3) (2015-12-15)


### Features

* support windows and unix platforms ([8858ef6](https://github.com/yoannmoinet/damon/commit/8858ef6))



<a name="0.0.2"></a>
## [0.0.2](https://github.com/yoannmoinet/damon/compare/90cd90e...v0.0.2) (2015-12-15)


### Bug Fixes

* update to new casper syntax for internal modules ([2939a04](https://github.com/yoannmoinet/damon/commit/2939a04))
* use absolute path ([41c6ef2](https://github.com/yoannmoinet/damon/commit/41c6ef2))

### Features

* instrumentalize with a cli ([7d59bba](https://github.com/yoannmoinet/damon/commit/7d59bba))
* **phantom:** add binary for OSX ([69c6446](https://github.com/yoannmoinet/damon/commit/69c6446))
* **phantom:** add phantom executable ([90cd90e](https://github.com/yoannmoinet/damon/commit/90cd90e))
* **worker:** exit on error ([c2c208d](https://github.com/yoannmoinet/damon/commit/c2c208d))



