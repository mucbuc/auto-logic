var cp = require( 'child_process' )
  , path = require( 'path' )
  , fs = require( 'fs' )
  , BRANCH_NAME_PLACEHOLDER = '#BRANCH_NAME';

function tryMatchMacros(o) {
  if (  !o.hasOwnProperty('result')
      && o.hasOwnProperty('macroPath')) {
    fs.readFile( o.macroPath, function(error, data) {
      if (error) {
        o.next(o);
      }
      else {
        var macros = JSON.parse(data.toString())
          , matches = [];
                 
        for(var index in macros.sort()) {
          var macro = macros[index]
          if (!macro.indexOf(o.input)) { 
            if (macro.indexOf(BRANCH_NAME_PLACEHOLDER) != -1) {
              getCurrentBranch( function(stdout) {
                var branch = stdout.toString().slice(0, -1);
                macro = macro.replace( BRANCH_NAME_PLACEHOLDER, branch );
                macro += ' ';   
                o.next( { input: o.input, result: [ macro ] } );
              });
              return;
          
              function getCurrentBranch(cb) {
                cp.exec( 'git rev-parse --abbrev-ref HEAD', function(err, stdout) {
                  if (err) throw err;
                  cb(stdout);
                });
              }
            }
            else {
              matches.push( macro );
            }
          }
        }

        if (matches.length) {
          o.next( { input: o.input, result: matches } );
        }
        else {
          o.next(o);
        }
      }
    });
  }
  else {
    o.next(o);
  }
}

module.exports = tryMatchMacros;
