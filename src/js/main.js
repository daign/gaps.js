var main = function () {

	var w = 120;
	var h = 80;
	var m = 2;
	SVG.init( w, h, m );

	var box = function ( p, g ) {

		this.x1 = Math.min( p.x1, p.x2 );
		this.x2 = Math.max( p.x1, p.x2 );
		this.y1 = Math.min( p.y1, p.y2 );
		this.y2 = Math.max( p.y1, p.y2 );
		this.guard = g;
		this.rect = document.createElementNS( SVG.NS, 'rect' );
		this.rect.setAttribute( 'class', 'rect' );
		SVG.context.appendChild( this.rect );

		this.repaint = function () {
			this.rect.setAttribute( 'x', this.x1 );
			this.rect.setAttribute( 'y', this.y1 );
			this.rect.setAttribute( 'width', this.x2-this.x1 );
			this.rect.setAttribute( 'height', this.y2-this.y1 );
		};
		this.repaint();

		this.update = function () {
			this.repaint();
			this.guard.update();
		};
		this.throttledUpdate = UTIL.throttle( this.update, 20, this );

		var self = this;
		function beginDrag( event ) {

			event.preventDefault();
			event.stopPropagation();

			var startX = event.clientX || ( event.touches && event.touches[ 0 ].clientX );
			var startY = event.clientY || ( event.touches && event.touches[ 0 ].clientY );
			var startX1 = self.x1;
			var startX2 = self.x2;
			var startY1 = self.y1;
			var startY2 = self.y2;

			var factor = 1;
			if ( window.innerWidth * (h+2*m) > window.innerHeight * (w+2*m) ) {
				factor = (h+2*m) / window.innerHeight;
			} else {
				factor = (w+2*m) / window.innerWidth;
			}

			document.addEventListener( 'selectstart', cancelSelect, false );

			document.addEventListener( 'mousemove',   continueDrag, false );
			document.addEventListener( 'touchmove',   continueDrag, false );

			document.addEventListener( 'mouseup',     endDrag, false );
			document.addEventListener( 'touchend',    endDrag, false );
			document.addEventListener( 'touchcancel', endDrag, false );
			document.addEventListener( 'touchleave',  endDrag, false );

			function cancelSelect( event ) {
				event.preventDefault();
				event.stopPropagation();
			}

			function continueDrag( event ) {

				event.preventDefault();
				event.stopPropagation();

				var cX = event.clientX || ( event.touches && event.touches[ 0 ].clientX );
				var offsetX = ( cX - startX ) * factor;
				if ( !isNaN( offsetX ) ) {
					offsetX = Math.max( -startX1, Math.min( w-startX2, offsetX ) );
					self.x1 = startX1 + offsetX;
					self.x2 = startX2 + offsetX;
				}

				var cY = event.clientY || ( event.touches && event.touches[ 0 ].clientY );
				var offsetY = ( cY - startY ) * factor;
				if ( !isNaN( offsetY ) ) {
					offsetY = Math.max( -startY1, Math.min( h-startY2, offsetY ) );
					self.y1 = startY1 + offsetY;
					self.y2 = startY2 + offsetY;
				}

				self.throttledUpdate();

			}

			function endDrag() {
				document.removeEventListener( 'selectstart', cancelSelect, false );

				document.removeEventListener( 'mousemove',   continueDrag, false );
				document.removeEventListener( 'touchmove',   continueDrag, false );

				document.removeEventListener( 'mouseup',     endDrag, false );
				document.removeEventListener( 'touchend',    endDrag, false );
				document.removeEventListener( 'touchcancel', endDrag, false );
				document.removeEventListener( 'touchleave',  endDrag, false );
			}

		}

		this.rect.addEventListener( 'mousedown',  beginDrag, false );
		this.rect.addEventListener( 'touchstart', beginDrag, false );

	};

	var boxStorage = function ( input ) {
		this.store = [];
		for ( var i = 0; i < input.length; i++ ) {
			this.store.push( new box( input[ i ], this ) );
		}
		this.update();
	};
	boxStorage.prototype = {
		constructor: boxStorage,
		exportBoxes: function () {
			var res = [];
			for ( var i = 0; i < this.store.length; i++ ) {
				var b = this.store[ i ];
				res.push( { x1: b.x1, x2: b.x2, y1: b.y1, y2: b.y2 } );
			}
			return res;
		},
		update: function () {
			var bex = this.exportBoxes();
			bex.push( { x1: 0, x2: w, y1: 0, y2: h } );
			lines.update( GAPS.compute( bex ) );
		}
	};

	var lineStorage = function () {
		this.store = [];
	};
	lineStorage.prototype = {
		constructor: lineStorage,
		update: function ( ls ) {
			var x = ls.length - this.store.length;
			for ( var i = 0; i < x; i++ ) {
				var line = document.createElementNS( SVG.NS, 'line' );
				line.setAttribute( 'class', 'line' );
				SVG.context.appendChild( line );
				this.store.push( line );
			}
			for ( var i = 0; i < this.store.length; i++ ) {
				var line = this.store[ i ];
				if ( i < ls.length ) {
					var l = ls[ i ];
					line.style.display = 'block';
					line.setAttribute( 'x1', l.x1 );
					line.setAttribute( 'y1', l.y1 );
					line.setAttribute( 'x2', l.x2 );
					line.setAttribute( 'y2', l.y2 );
					if ( Math.max( l.x2 - l.x1, l.y2 - l.y1 ) > 2.5 ) {
						line.setAttribute( 'marker-start', 'url(#arrowStart)' );
						line.setAttribute( 'marker-end', 'url(#arrowEnd)' );
					} else {
						line.setAttribute( 'marker-start', '' );
						line.setAttribute( 'marker-end', '' );
					}
				} else {
					line.style.display = 'none';
				}
			}
		}
	};

	var lines = new lineStorage();
	var boxes = new boxStorage( [
		{ x1:   5, x2:  20, y1: 30, y2: 35 },
		{ x1:  15, x2:  20, y1:  5, y2: 10 },
		{ x1:  10, x2:  55, y1: 15, y2: 20 },
		{ x1:  25, x2:  50, y1: 25, y2: 35 },
		{ x1:  30, x2:  45, y1: 10, y2: 30 },
		{ x1:  60, x2:  80, y1:  5, y2: 35 },
		{ x1:  66, x2:  74, y1:  8, y2: 32 },
		{ x1:  63, x2:  77, y1: 15, y2: 25 },
		{ x1:  75, x2: 115, y1: 40, y2: 50 },
		{ x1:  82, x2:  90, y1: 43, y2: 47 },
		{ x1:  93, x2: 101, y1: 43, y2: 47 },
		{ x1: 104, x2: 112, y1: 43, y2: 47 },
		{ x1:   5, x2:  30, y1: 53, y2: 57 },
		{ x1:  53, x2:  57, y1: 53, y2: 57 },
		{ x1:  60, x2:  80, y1: 53, y2: 57 },
		{ x1:   5, x2:  50, y1: 60, y2: 64 },
		{ x1:  53, x2:  57, y1: 60, y2: 64 },
		{ x1:  80, x2:  60, y1: 64, y2: 60 },
		{ x1:  95, x2: 115, y1: 60, y2: 75 },
		{ x1:  95, x2: 100, y1: 60, y2: 75 },
		{ x1: 105, x2: 110, y1: 60, y2: 75 }
	] );

	function cancelTouch( event ) {
		event.preventDefault();
		event.stopPropagation();
	}
	document.addEventListener( 'touchstart', cancelTouch, false );
	document.addEventListener( 'touchmove',  cancelTouch, false );

};

