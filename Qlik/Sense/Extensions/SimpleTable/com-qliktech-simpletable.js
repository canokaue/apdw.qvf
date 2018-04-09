define( ["qlik", "jquery", "text!./simpletable.css"],
	function ( qlik, $, cssContent ) {
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
					html += "<td class='";
					if ( !isNaN( cell.qNum ) ) {
						html += "numeric ";
					}
					//total (-1)  is not selectable
					if ( key < dimensionInfo.length && cell.qElemNumber !== -1 ) {
						html += "selectable' data-value='" + cell.qElemNumber + "' data-dimension='" + key + "'";
					} else {
						html += "'";
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
						uses: "settings",
						items: {
							initFetchRows: {
								ref: "qHyperCubeDef.qInitialDataFetch.0.qHeight",
								label: "Initial fetch rows",
								type: "number",
								defaultValue: 50
							}
						}
					}
				}
			},
			support: {
				snapshot: true,
				export: true,
				exportData: true
			},
			paint: function ( $element, layout ) {
				var html = "<table><thead><tr>", self = this, morebutton = false,
					hypercube = layout.qHyperCube,
					rowcount = hypercube.qDataPages[0].qMatrix.length,
					colcount = hypercube.qDimensionInfo.length + hypercube.qMeasureInfo.length;
				//render titles
				hypercube.qDimensionInfo.forEach( function ( value ) {
					html += '<th>' + value.qFallbackTitle + '</th>';
				} );
				hypercube.qMeasureInfo.forEach( function ( value ) {
					html += '<th>' + value.qFallbackTitle + '</th>';
				} );
				html += "</tr></thead><tbody>";
				//render data
				html += createRows( hypercube.qDataPages[0].qMatrix, hypercube.qDimensionInfo );
				html += "</tbody></table>";

				//add 'more...' button
				if ( hypercube.qSize.qcy > rowcount ) {
					html += "<button id='more'>More...</button>";
					morebutton = true;
				}
				$element.html( html );
				if ( morebutton ) {
					$element.find( "#more" ).on( "click", function () {
						var requestPage = [{
							qTop: rowcount,
							qLeft: 0,
							qWidth: colcount,
							qHeight: Math.min( 50, hypercube.qSize.qcy - rowcount )
						}];
						self.backendApi.getData( requestPage ).then( function ( dataPages ) {
							rowcount += dataPages[0].qMatrix.length;
							if(rowcount>= hypercube.qSize.qcy){
								$element.find( "#more" ).hide();
							}
							var html = createRows( dataPages[0].qMatrix, hypercube.qDimensionInfo );
							$element.find("tbody" ).append(html);
						} );
					} );
				}
				//setup selections
				$element.off( 'click', '.selectable');
				$element.on( 'click', '.selectable', function () {
					if ( this.hasAttribute( "data-value" ) ) {
						var value = parseInt( this.getAttribute( "data-value" ), 10 ), dim = parseInt( this.getAttribute( "data-dimension" ), 10 );
						self.selectValues( dim, [value], true );
						$element.find( "[data-dimension='" + dim + "'][data-value='" + value + "']" ).toggleClass( "selected" );
					}
				} );
				return qlik.Promise.resolve();
			}
		};
	} );
