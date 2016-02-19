var config = function (casper, pid, level) {
    // Logging what's happening on the page.
    casper.on('remote.message', function (message) {
        log('[log] ' + message, 'INFO');
    });

    var levelKeys = {
        none: -1,
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        trace: 5
    };

    level = levelKeys[level ? level.toLowerCase() : 'fatal'] || 0;

    return function log() {
        var color = patchRequire(require)('colorizer')
            .create('Colorizer').format;

        var d = new Date();
        var args = Array.prototype.slice.call(arguments);

        var type = 'DEFAULT';
        var styles = {
            'DEFAULT': {fg: 'white'},
            'PARAMETER': {fg: 'cyan'},
            'COMMENT': {fg: 'yellow'},
            'WARNING': {fg: 'red', bold: true},
            'SUCCESS': {bg: 'green', fg: 'white', bold: true},
            'GREEN_BAR': {fg: 'white', bg: 'green', bold: true},
            'RED_BAR': {fg: 'white', bg: 'red', bold: true},
            'INFO_BAR': {bg: 'cyan', fg: 'white', bold: true},
            'WARN_BAR': {bg: 'yellow', fg: 'white', bold: true},
            'SKIP': {fg: 'magenta', bold: true},
            'SKIP_BAR':  {bg: 'magenta', fg: 'white', bold: true},
            'TEST_SUCCESS': {fg: 'green'},
            'TEST_FAILED': {fg: 'red'},
            // TODO remove those before this point.
            'FATAL': {bg: 'red', fg: 'white', bold: true},
            'ERROR': {fg: 'red', bold: true},
            'WARN': {fg: 'yellow', bold: true},
            'INFO': {fg: 'cyan', bold: true},
            'DEBUG': {fg: 'white', bold: true},
            'TRACE': {fg: 'white'}
        };

        var levels = [
            ['FATAL'],
            ['ERROR', 'RED_BAR', 'TEST_FAILED'],
            ['WARN', 'WARN_BAR'],
            ['INFO_BAR', 'INFO', 'SKIP', 'SKIP_BAR',
                'SUCCESS', 'TEST_SUCCESS', 'GREEN_BAR'],
            ['DEFAULT', 'DEBUG'],
            ['PARAMETER', 'COMMENT', 'TRACE']
        ];

        if (Object.keys(styles).indexOf(args[args.length - 1]) > -1) {
            type = args.pop();
        }

        // Should we log it ?
        var toLog = false;
        for (var i = 0, max = level; i <= max; i += 1) {
            if (levels[i].indexOf(type) > -1) {
                toLog = true;
                break;
            }
        }

        if (!toLog) {
            return;
        }

        var dumps = [];
        var out = color('\n# ' + pid + ' ', styles.WARN_BAR);
        var date = d.getDate()  + '/' +
            (d.getMonth() + 1) + '/' +
            d.getFullYear() + ' ' +
            d.getHours() + ':' +
            d.getMinutes() + ':' +
            d.getSeconds() + ':' +
            d.getMilliseconds();

        out += color(' ' + date + ' ', styles.INFO);
        out += '\n';

        args.forEach(function (message) {
            if (typeof message === 'string') {
                out += color(' ' + message + ' ', styles[type]) + '\n';
            } else if (typeof message === 'object') {
                dumps.push(message);
            }
        });
        casper.echo(out);
        dumps.forEach(function (dump) {
            out += color(' - dump : ', styles[type]);
            utils.dump(dump);
            out += '\n';
        });
    };
};

module.exports = {
    config: config
};
