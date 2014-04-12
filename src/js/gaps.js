var GAPS = {

	compute: function ( boxes ) {
		var lines = [];
		lines = lines.concat( this.sweep( boxes, 'vertical' ) );
		lines = lines.concat( this.sweep( boxes, 'horizontal' ) );
		return lines;
	},

	sweep: function ( boxes, direction ) {
		var events = this.setUpEvents( boxes, direction );
		var ulines = this.processEvents( events );
		var lines = this.orientLines( ulines, direction );
		return lines;
	},

	setUpEvents: function ( boxes, direction ) {
		var events = [];
		var lineEvent = function ( o, s, e, i, t ) {
			this.order = o;
			this.start = Math.min( s, e );
			this.end = Math.max( s, e );
			this.id = i;
			this.topside = t;
		};
		if ( direction === 'vertical' ) {
			for ( var i = 0; i < boxes.length; i++ ) {
				var b = boxes[ i ];
				events.push( new lineEvent( Math.min( b.y1, b.y2 ), b.x1, b.x2, i, true ) );
				events.push( new lineEvent( Math.max( b.y1, b.y2 ), b.x1, b.x2, i, false ) );
			}
		} else if ( direction === 'horizontal' ) {
			for ( var i = 0; i < boxes.length; i++ ) {
				var b = boxes[ i ];
				events.push( new lineEvent( Math.min( b.x1, b.x2 ), b.y1, b.y2, i, true ) );
				events.push( new lineEvent( Math.max( b.x1, b.x2 ), b.y1, b.y2, i, false ) );
			}
		}
		events.sort( function ( a, b ) {
			if ( a.order < b.order ) {
				return -1;
			} else if ( a.order > b.order ) {
				return 1;
			} else {
				if ( !a.topside && b.topside ) {
					return -1;
				} else if ( a.topside && !b.topside ) {
					return 1;
				} else if ( a.topside && b.topside ) {
					if ( a.start < b.start ) {
						return -1;
					} else if ( a.start > b.start ) {
						return 1;
					} else {
						if ( a.end > b.end ) {
							return -1;
						} else if ( a.end < b.end ) {
							return 1;
						} else {
							return 0;
						}
					}
				} else {
					if ( a.start > b.start ) {
						return -1;
					} else if ( a.start < b.start ) {
						return 1;
					} else {
						if ( a.end < b.end ) {
							return -1;
						} else if ( a.end > b.end ) {
							return 1;
						} else {
							return 0;
						}
					}
				}
			}
		} );
		return events;
	},

	processEvents: function ( events ) {
		var ulines = [];
		var divisionMap = function () {
			this.map = [];
			this.insert = function ( e ) {
				var o = { start: e.start, end: e.end, offset: e.order, id: e.id };
				var range = this.overlap( e );
				if ( range ) {
					var arr = [ o ];
					var a = this.map[ range[ 0 ] ];
					if ( a.start < e.start ) {
						arr.unshift( { start: a.start, end: e.start, offset: a.offset, id: a.id } );
					}
					var b = this.map[ range[ 1 ] ];
					if ( b.end > e.end ) {
						arr.push( { start: e.end, end: b.end, offset: b.offset, id: b.id } );
					}
					this.map.splice( range[ 0 ], range[ 1 ] - range[ 0 ] + 1 );
					for ( var i = arr.length; i > 0; i-- ) {
						this.map.splice( range[ 0 ], 0, arr[ i-1 ] );
					}
				} else {
					this.map.push( o );
				}
			};
			this.getOverlapElements = function ( e, inclusive ) {
				var range = ( inclusive ) ? this.overlapInclusive( e ) : this.overlap( e );
				if ( range ) {
					return this.map.slice( range[ 0 ], range[ 1 ]+1 );
				} else {
					return [];
				}
			};
			this.overlap = function ( e ) {
				var i = 0;
				while ( this.map[ i ] && this.map[ i ].end <= e.start ) { i++; }
				if ( this.map[ i ] ) {
					var a = i;
					while ( this.map[ i ] && this.map[ i ].start < e.end ) { i++; }
					return [ a, i-1 ];
				} else {
					return null;
				}
			};
			this.overlapInclusive = function ( e ) {
				var i = 0;
				while ( this.map[ i ] && this.map[ i ].end < e.start ) { i++; }
				if ( this.map[ i ] ) {
					var a = i;
					while ( this.map[ i ] && this.map[ i ].start <= e.end ) { i++; }
					return [ a, i-1 ];
				} else {
					return null;
				}
			};
			this.print = function () {
				console.log( 'divisionMap:' );
				for ( var i = 0; i < this.map.length; i++ ) {
					console.log( '\t', i, this.map[ i ] );
				}
			};
		};
		var sweepstate = new divisionMap();
		for ( var i = 0; i < events.length; i++ ) {
			var e = events[ i ];
			var overlaps = sweepstate.getOverlapElements( e, true );
			for ( var j = 0; j < overlaps.length; j++ ) {
				var isLocalMaximum = function ( x, a ) {
					if ( (x-1) >= 0 && a[ x-1 ].offset > a[ x ].offset ) {
						return false;
					} else if ( (x+1) < a.length && a[ x+1 ].offset > a[ x ].offset ) {
						return false;
					} else {
						return true;
					}
				};
				if ( isLocalMaximum( j, overlaps ) ) {
					var o = overlaps[ j ];
					if ( o.id !== e.id && o.offset < e.order ) {
						var p1 = Math.max( o.start, e.start );
						var p2 = Math.min( o.end, e.end );
						ulines.push( { start: o.offset, end: e.order, pos: (p1+p2)/2 } );
					}
				}
			}
			sweepstate.insert( e );
		}
		return ulines;
	},

	orientLines: function ( ulines, direction ) {
		var lines = [];
		for ( var i = 0; i < ulines.length; i++ ) {
			u = ulines[ i ];
			if ( direction === 'vertical' ) {
				lines.push( { x1: u.pos, x2: u.pos, y1: u.start, y2: u.end } );
			} else if ( direction === 'horizontal' ) {
				lines.push( { x1: u.start, x2: u.end, y1: u.pos, y2: u.pos } );
			}
		}
		return lines;
	}

};

