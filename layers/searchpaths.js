var assert = require( 'assert' )
  , cdAgent = require( 'cd-agent' );

function searchPaths(o) {
  

  if (!o.hasOwnProperty('result')) {
    var lookAheadDir = ''
      , separatorIndex = o.input.lastIndexOf( '/' )
      , spaceIndex = o.input.lastIndexOf( ' ' )
      , rel;

    assert( o.input.length ); 

    if (    separatorIndex != -1 
        &&  separatorIndex > spaceIndex) {
      lookAheadDir = o.input.substr(spaceIndex + 1, separatorIndex - spaceIndex);
      rel = o.input.substr( separatorIndex + 1 );
    }
    else {
      rel = o.input.substr( spaceIndex + 1 );
    }

    cdAgent({
        argv: [ 'cd', lookAheadDir ]
      }, function(cwd, files) { 
        var options = [];
        if (    typeof files === 'undefined'
            ||  !files.length) {
          o.next( { input: rel, result: options } );
        }
        else {
          files.forEach( function( e, index, array ) {
            if (e.indexOf(rel) == 0) {
              options.push( e );
            }
            if (index === array.length - 1) {
              o.next( { input: rel, result: options } );
            }
          } );
        }
      });
  }
  else {
    o.next( { input: o.input, result: o.result } );
  }
}

module.exports = searchPaths;