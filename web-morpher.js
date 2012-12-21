var temp;
temp = require('./config.json');
if ((temp.paths = temp.paths)) {
   for (var i in temp.paths) {
      module.paths.push(temp.paths[i]);
   }
}
var express = require('express');
var app = express();
app.use(express.logger());
app.use(app.router);
app.set('port',temp.server.port)
temp = require('./package.json');
module.name = temp.name;
module.version = temp.version;
delete temp;

//console.log('module --->')
//console.log(1)

//module.paths.push('C:\\Program Files\\nodejs\\node_modules')

/*
console.log('\n-----------------')
console.log('require --->')
console.log(require)
console.log('\n-----------------')
console.log('module --->')
console.log(module)
console.log('\n-----------------')
console.log('__filename --->')
console.log(__filename)
console.log('\n-----------------')
console.log('__dirname --->')
console.log(__dirname)
console.log('\n-----------------')
Seq = require('seq');
*/


app.get('/', function(req, res, next){
       res.send('hello world');
});

app.listen(app.get('port'));

console.log(module.name + ' v.' + module.version);
console.log('запущен на порту '+app.get('port'));
