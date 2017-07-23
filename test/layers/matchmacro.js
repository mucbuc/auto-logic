var assert = require( 'assert' )
  , Expector = require( 'expector' ).Expector
  , matchMacro = require( '../../layers/matchMacro.js' )
  , macroPath = './test/macros.json';

assert( typeof matchMacro === 'function' );

suite( 'matchmacro', function() {
  
  var expector;

  setup( function() {
    expector = new Expector();
  });

  teardown( function() {
    expector.check(); 
  }); 

  test( 'git commit message', function(done) {
    var context = {
          input: 'git co',
          macroPath: macroPath,
          next: function(o) {

            assert( typeof o !== 'undefined' );
            assert( o.hasOwnProperty('result') );

            expector.emit( o.result );
            done();
          }
        };

    expector.expect( 'git commit -am \'master ' );
    matchMacro( context );
  });

  test( 'completion2', function(done) {
  	var context = {
          input: 'ls',
          macroPath: macroPath,
          next: function(o) {
            assert( typeof o !== 'undefined' );
            assert( o.hasOwnProperty('result') );
            expector.emit( o.result );
            done();
          }
        };

    expector.expect( 'ls -la ' );
    matchMacro( context ); 
  });
}); 