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
        var macros = JSON.parse(data.toString()).sort()
          , matches = []
          , doneCounter = 0;
            
        for(var index in macros) {
          var macro = macros[index] + " ";
          if (!macro.indexOf(o.input)) {
            
            if (macro.indexOf(BRANCH_NAME_PLACEHOLDER) != -1) {
              var macroCpy = macro;
              getCurrentBranch( function(stdout) {
                var branch = stdout.toString().slice(0, -1);
                matches.push( macroCpy.replace( BRANCH_NAME_PLACEHOLDER, branch ) );
                check_done();
              });
              
              function getCurrentBranch(cb) {
                cp.exec( 'git rev-parse --abbrev-ref HEAD', function(err, stdout) {
                  if (err) throw err;
                  cb(stdout);
                });
              }
            }
            else {
              matches.push( macro );
              check_done();
            }
          }
          else {
            check_done();
          }

          function check_done() {
            ++doneCounter;
            if (doneCounter == macros.length) {
              if (matches.length) {
                o.next( { input: o.input, result: matches } );
              }
              else {
                o.next(o);
              }
            }
          }

        }
      }
    });
  }
  else {
    o.next(o);
  }
}

module.exports = tryMatchMacros;
