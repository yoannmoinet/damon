var config = function (casper) {
    return function log() {
        var color = require('colorizer').create('Colorizer').format;
        var d = new Date();
        var args = Array.prototype.slice.call(arguments);
        var type = 'DEFAULT';
        var styles = {
            'DEFAULT': {fg: 'white'},
            'ERROR': {bg: 'red', fg: 'white', bold: true},
            'INFO': {fg: 'cyan', bold: true},
            'TRACE': {fg: 'green', bold: true},
            'PARAMETER': {fg: 'cyan'},
            'COMMENT': {fg: 'yellow'},
            'WARNING': {fg: 'red', bold: true},
            'SUCCESS': {bg: 'green', fg: 'white', bold: true},
            'GREEN_BAR': {fg: 'white', bg: 'green', bold: true},
            'RED_BAR': {fg: 'white', bg: 'red', bold: true},
            'INFO_BAR': {bg: 'cyan', fg: 'white', bold: true},
            'WARN_BAR': {bg: 'yellow', fg: 'white', bold: true},
            'SKIP': {fg: 'magenta', bold: true},
            'SKIP_BAR':  {bg: 'magenta', fg: 'white', bold: true}
        };

        if (Object.keys(styles).indexOf(args[args.length - 1]) > -1) {
            type = args.pop();
        }

        var dumps = [];
        var out = color('\n# ' + pid + ' ', styles.WARN_BAR);
        var date = d.getDate()  + '/' +
            (d.getMonth() + 1) + '/' +
            d.getFullYear() + ' ' +
            d.getHours() + ':' +
            d.getMinutes() + ':' +
            d.getSeconds();
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
