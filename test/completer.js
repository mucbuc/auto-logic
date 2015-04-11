var assert = require( 'assert' )
  , Completer = require( '../completer.js' );

suite( 'basic', function() {

	test( 'existance', function() {
		assert( typeof Completer === 'function' );
	});
});
