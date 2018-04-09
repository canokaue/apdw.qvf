/*globals define*/
define( ["qlik", "jquery", "text!./style.css"], function ( qlik, $, cssContent ) {
	'use strict';
	$( "<style>" ).html( cssContent ).appendTo( "head" );
	function createRows ( rows, dimensionInfo ) {
		var html = "";
		rows.forEach( function ( row ) {
			html += '<tr>';
			row.forEach( function ( cell, key ) {
				if ( cell.qIsOtherCell ) {
					cell.qText = dimensionInfo[key].othersLabel;
				}
				html += "<td ";
				if ( !isNaN( cell.qNum ) ) {
					html += "class='numeric'";
				}
				html += '>' + cell.qText + '</td>';
			} );
			html += '</tr>';
		} );
		return html;
	}

	return {
		initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 10,
					qHeight: 50
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 1
				},
				measures: {
					uses: "measures",
					min: 0
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings"
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},
		paint: function ( $element, layout ) {
			var html = "<table><thead><tr>", self = this,
				morebutton = false,
				hypercube = layout.qHyperCube,
				rowcount = hypercube.qDataPages[0].qMatrix.length,
				colcount = hypercube.qDimensionInfo.length + hypercube.qMeasureInfo.length;
			//render titles
			hypercube.qDimensionInfo.forEach( function ( cell ) {
				html += '<th>' + cell.qFallbackTitle + '</th>';
			} );
			hypercube.qMeasureInfo.forEach( function ( cell ) {
				html += '<th>' + cell.qFallbackTitle + '</th>';
			} );
			html += "</tr></thead><tbody>";
			//render data
			html += createRows( hypercube.qDataPages[0].qMatrix, hypercube.qDimensionInfo );
			html += "</tbody></table>";
			//add 'more...' button
			if ( hypercube.qSize.qcy > rowcount ) {
				html += "<button class='more'>More...</button>";
				morebutton = true;
			}
			$element.html( html );
			if ( morebutton ) {
				$element.find( ".more" ).on( "click", function () {
					var requestPage = [{
						qTop: rowcount,
						qLeft: 0,
						qWidth: colcount,
						qHeight: Math.min( 50, hypercube.qSize.qcy - rowcount )
					}];
					self.backendApi.getData( requestPage ).then( function ( dataPages ) {
						rowcount += dataPages[0].qMatrix.length;
						if ( rowcount >= hypercube.qSize.qcy ) {
							$element.find( ".more" ).hide();
						}
						var html = createRows( dataPages[0].qMatrix, hypercube.qDimensionInfo );
						$element.find( "tbody" ).append( html );
					} );
				} );
			}
			return qlik.Promise.resolve();
		}
	};
} );
