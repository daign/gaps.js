var main = function () {

	var w = 120;
	var h = 80;
	SVG.init( w, h );

	var boxes = [
		{ x1:  5, x2:  20, y1: 30, y2: 35 },
		{ x1: 15, x2:  20, y1:  5, y2: 10 },
		{ x1: 10, x2:  55, y1: 15, y2: 20 },
		{ x1: 25, x2:  50, y1: 25, y2: 35 },
		{ x1: 30, x2:  45, y1: 10, y2: 30 },
		{ x1: 60, x2: 115, y1:  5, y2: 35 },
		{ x1: 80, x2:  95, y1:  8, y2: 32 },
		{ x1: 63, x2: 112, y1: 15, y2: 25 },
		{ x1:  5, x2: 115, y1: 40, y2: 50 },
		{ x1:  8, x2:  41, y1: 43, y2: 47 },
		{ x1: 44, x2:  76, y1: 43, y2: 47 },
		{ x1: 79, x2: 112, y1: 43, y2: 47 },
		{ x1:  5, x2:  50, y1: 53, y2: 57 },
		{ x1: 53, x2:  57, y1: 53, y2: 57 },
		{ x1: 60, x2:  90, y1: 53, y2: 57 },
		{ x1:  5, x2:  50, y1: 60, y2: 64 },
		{ x1: 53, x2:  57, y1: 60, y2: 64 },
		{ x1: 60, x2:  90, y1: 60, y2: 64 },
		{ x1: 95, x2: 115, y1: 70, y2: 75 },
		{ x1: 95, x2: 115, y1: 60, y2: 75 }
	];

	for ( var i = 0; i < boxes.length; i++ ) {
		var b = boxes[ i ];
		SVG.drawBox( b.x1, b.x2, b.y1, b.y2, 'rect' );
	}

	boxes.push( { x1: 0, x2: w, y1: 0, y2: h } );
	var lines = GAPS.compute( boxes );

	for ( var i = 0; i < lines.length; i++ ) {
		var l = lines[ i ];
		SVG.drawLine( l.x1, l.x2, l.y1, l.y2 );
	}

};

