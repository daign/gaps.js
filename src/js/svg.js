var SVG = {

	NS: 'http://www.w3.org/2000/svg',

	init: function ( w, h, m ) {
		var self = this;
		this.context = document.createElementNS( SVG.NS, 'svg' );
		this.context.setAttribute( 'viewBox', (-m) + ',' + (-m) + ',' + (w+2*m) + ',' + (h+2*m) );
		document.body.appendChild( this.context );

		this.createMarkers();
		this.drawPaper( w, h );

		function onWindowResize() {
			self.resize();
		}
		window.addEventListener( 'resize', onWindowResize, false );
	},

	resize: function () {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.context.setAttribute( 'width', this.width + 'px' );
		this.context.setAttribute( 'height', this.height + 'px' );
	},

	createMarkers: function () {
		var defs = document.createElementNS( SVG.NS, 'defs' );
		SVG.context.appendChild( defs );

		var markerEnd = document.createElementNS( SVG.NS, 'marker' );
		markerEnd.setAttribute( 'id', 'arrowEnd' );
		markerEnd.setAttribute( 'viewBox', '-1 -1 6 12' );
		markerEnd.setAttribute( 'refX', 5 );
		markerEnd.setAttribute( 'refY', 5 );
		markerEnd.setAttribute( 'markerUnits', 'strokeWidth' );
		markerEnd.setAttribute( 'markerWidth', 7 );
		markerEnd.setAttribute( 'markerHeight', 7 );
		markerEnd.setAttribute( 'orient', 'auto' );
		defs.appendChild( markerEnd );

		var endPath = document.createElementNS( SVG.NS, 'path' );
		endPath.setAttribute( 'd', 'M 0 0 L 5 5 L 0 10' );
		endPath.setAttribute( 'class', 'lineEnd' );
		markerEnd.appendChild( endPath );

		var markerStart = document.createElementNS( SVG.NS, 'marker' );
		markerStart.setAttribute( 'id', 'arrowStart' );
		markerStart.setAttribute( 'viewBox', '-1 -1 6 12' );
		markerStart.setAttribute( 'refX', 0 );
		markerStart.setAttribute( 'refY', 5 );
		markerStart.setAttribute( 'markerUnits', 'strokeWidth' );
		markerStart.setAttribute( 'markerWidth', 7 );
		markerStart.setAttribute( 'markerHeight', 7 );
		markerStart.setAttribute( 'orient', 'auto' );
		defs.appendChild( markerStart );

		var startPath = document.createElementNS( SVG.NS, 'path' );
		startPath.setAttribute( 'd', 'M 5 0 L 0 5 L 5 10' );
		startPath.setAttribute( 'class', 'lineEnd' );
		markerStart.appendChild( startPath );
	},

	drawPaper: function ( w, h ) {
		var rect = document.createElementNS( SVG.NS, 'rect' );
		rect.setAttribute( 'x', 0 );
		rect.setAttribute( 'y', 0 );
		rect.setAttribute( 'width', w );
		rect.setAttribute( 'height', h );
		rect.setAttribute( 'class', 'paper' );
		SVG.context.appendChild( rect );
	}

};

