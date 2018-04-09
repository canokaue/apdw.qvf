define( ["qlik", "jquery", "text!./style.css"], function ( qlik, $, cssContent ) {
	'use strict';
	$( "<style>" ).html( cssContent ).appendTo( "head" );
	return {
		initialProperties: {
			qListObjectDef: {
				qShowAlternatives: true,
				qFrequencyMode: "V",
				qInitialDataFetch: [{
					qWidth: 2,
					qHeight: 50
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimension: {
					type: "items",
					label: "Dimensions",
					ref: "qListObjectDef",
					min: 1,
					max: 1,
					items: {
						label: {
							type: "string",
							ref: "qListObjectDef.qDef.qFieldLabels.0",
							label: "Label",
							show: true
						},
						libraryId: {
							type: "string",
							component: "library-item",
							libraryItemType: "dimension",
							ref: "qListObjectDef.qLibraryId",
							label: "Dimension",
							show: function ( data ) {
								return data.qListObjectDef && data.qListObjectDef.qLibraryId;
							}
						},
						field: {
							type: "string",
							expression: "always",
							expressionType: "dimension",
							ref: "qListObjectDef.qDef.qFieldDefs.0",
							label: "Field",
							defaultValue: "=ValueList('A','B','C')",
							show: function ( data ) {
								return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
							}
						},
						frequency: {
							type: "string",
							component: "dropdown",
							label: "Frequency mode",
							ref: "qListObjectDef.qFrequencyMode",
							options: [{
								value: "N",
								label: "No frequency"
							}, {
								value: "V",
								label: "Absolute value"
							}, {
								value: "P",
								label: "Percent"
							}, {
								value: "R",
								label: "Relative"
							}],
							defaultValue: "V"
						}
					}
				},
				settings: {
					uses: "settings"
				}
			}
		},
		support : {
			snapshot: true,
			export: true,
			exportData : false
		},
		paint: function ( $element,layout ) {
			var self = this, html = "<ul>";
			layout.qListObject.qDataPages[0].qMatrix.forEach( function ( row ) {
				html += '<li class="data state' + row[0].qState + '" data-value="' + row[0].qElemNumber + '">' + row[0].qText;
				if ( row[0].qFrequency ) {
					html += '<span>' + row[0].qFrequency + '</span>';
				}
				html += '</li>';
			} );
			html += "</ul>";
			$element.html( html );
			if ( this.selectionsEnabled ) {
				$element.find( 'li' ).on( 'click', function () {
					if ( this.hasAttribute( "data-value" ) ) {
						var value = parseInt( this.getAttribute( "data-value" ), 10 ), dim = 0;
						self.selectValues( dim, [value], true );
						this.classList.toggle("selected");
					}
				} );
			}
			return qlik.Promise.resolve();
		}
	};
} );
