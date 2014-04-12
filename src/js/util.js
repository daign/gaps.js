var UTIL = {

	throttle: function ( callback, wait, context ) {
		var canrun = true;
		return function () {
			if ( !canrun ) { return; }
			canrun = false;
			callback.apply( context || callback, arguments );
			setTimeout( function () {
				canrun = true;
			}, wait );
		};
	},

	postpone: function ( callback, wait, context ) {
		return function () {
			setTimeout( function () {
				callback.apply( context || callback, arguments );
			}, wait );
		};
	}

};

