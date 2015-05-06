var assert = require( 'assert' )
  , path = require( 'path' )
  , Stack = require( 'flow-troll' )
  , searchPaths = require( './layers/searchpaths.js' )
  , matchMacro = require( './layers/matchmacro.js' );

assert( typeof Stack === 'function' );
assert( typeof searchPaths === 'function' );
assert( typeof matchMacro === 'function' );

function Completer(options) {

  var stack = new Stack();
  
  stack.use( function(context) {
    if (!context.hasOwnProperty('macroPath')) {
      context.macroPath = getMacroPath();
    }
    context.next(context);
  
    function getMacroPath() {
      if (    typeof options !== 'undefined'
          &&  options.hasOwnProperty('macroPath')) {
        return options.macroPath;
      }
      return path.join(__dirname, 'macros.json');
    }
  });
  stack.use( matchMacro );
  stack.use( searchPaths );

  this.complete = function(partial, callback) {
    stack.process( partial, function(o) {
      callback( null, [ o.result, o.input ] );
    });
  };

}

module.exports = Completer;