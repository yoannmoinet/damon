var chmod = require('chmod');
var path = require('path');
var phantom = path.join(__dirname, './phantomjs_2.1');
var phantom64 = path.join(__dirname, './phantomjs_2.1_64x');

chmod(phantom, 777);
chmod(phantom64, 777);

console.log('chmoded both ' + phantom + ' and ' + phantom64 + '.');
