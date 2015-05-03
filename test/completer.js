var assert = require( 'assert' )
  , path = require( 'path' )
  , Completer = require( '../completer.js' )
  , Expector = require( 'expector' ).Expector;

assert( typeof Completer === 'function' );

suite( 'completer', function() {
	
	var completer
	  , expector;

	setup( function() {
		completer = new Completer( { 'macroPath': 'test' } );
		expector = new Expector();
	});

	teardown( function() {
		expector.check();
	}); 

	test( 'callback', function(done) {
		expector.expect( 'done' );
		completer.complete( 'aasdfasf', function() {
			expector.emit( 'done' );
			done();
		} ); 
	});

});
