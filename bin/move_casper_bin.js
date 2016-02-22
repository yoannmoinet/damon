var fs = require('fs-extra');
var path = require('path');

var path_exe1 = path.join(__dirname,
    'casperjs');
var path_exe2 = path.join(__dirname,
    'casperjs.exe');
var path_dest1 = path.join(__dirname,
    '../node_modules/casperjs/bin/casperjs');
var path_dest2 = path.join(__dirname,
    '../node_modules/casperjs/bin/casperjs.exe');

// Move files
fs.copySync(path_exe1, path_dest1, {clobber: true});
fs.copySync(path_exe2, path_dest2, {clobber: true});

console.log('Moved casperjs executables.');
