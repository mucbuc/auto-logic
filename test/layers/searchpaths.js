var assert = require( 'assert' )
  , Expector = require( 'expector' ).Expector
  , searchpaths = require( '../../layers/searchpaths.js' );

assert( typeof searchpaths === 'function' );

suite( 'searchpaths', function() {
  
  var expector;

  setup( function() {
    expector = new Expector();
  });

  teardown( function() {
    expector.check(); 
  }); 

  test( 'completion2', function(done) {
    var context = {
          input: 'te',
          next: function(o) {
            expector.emit( o.result );
            done();
          }
        };

    expector.expect( 'test' );
    searchpaths( context );
  });

 });