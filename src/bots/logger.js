var fs = require('fs');

function escapeLines (val) {
    // Remove special chars and newlines.
    return val
        .replace(/[\"]/g, '\\"')
        .replace(/[\\]/g, '\\\\')
        .replace(/[\/]/g, '\\/')
        .replace(/[\b]/g, '\\b') // backspace
        .replace(/[\f]/g, '\\f') // formfeed character
        .replace(/[\n]/g, '') // newline
        .replace(/[\r]/g, '') // carriage return
        .replace(/[\t]/g, ''); // tabulation
}

module.exports = function (cwd) {
    return {
        write: function () {
            var args = Array.prototype.slice.call(arguments);
            var type = 'DEBUG';
            var d = new Date();
            var date = d.getDate()  + '/' +
                (d.getMonth() + 1) + '/' +
                d.getFullYear() + ' ' +
                d.getHours() + ':' +
                d.getMinutes() + ':' +
                d.getSeconds() + ':' +
                d.getMilliseconds();
            var logId = date.replace(/[ /:]+/gm, '');

            if (args[args.length - 1] === args[args.length - 1].toUpperCase()) {
                type = args.pop();
            }

            var st = '[' + type + '](' + date + '):';

            args.forEach(function (text) {
                if (typeof text === 'object') {
                    text.logId = text.logId || logId;
                    st += escapeLines(JSON.stringify(text, null, 2));
                } else {
                    st += text;
                }
                st += ' ';
            });

            st += '\n';

            fs.write(cwd + '/log.txt', st, 'a');
            return logId;
        }
    };
};
