define( ["qlik", "text!./horizlist.css"],
	function ( qlik, cssContent ) {
		'use strict';
		$( "<style>" ).html( cssContent ).appendTo( "head" );
		return {
			initialProperties: {
				qListObjectDef: {
					qShowAlternatives: true,
					qFrequencyMode: "V",
					qSortCriterias: {
						qSortByState: 1
					},
					qInitialDataFetch: [{
						qWidth: 2,
						qHeight: 50
					}]
				},
				fixed: true,
				width: 25,
				percent: true,
				selectionMode: "CONFIRM"
			},
			definition: {
				type: "items",
				component: "accordion",
				items: {
					width: {
						type: "items",
						label: "Width and Selections",
						items: {
							fixed: {
								ref: "fixed",
								label: "Fixed width",
								type: "boolean",
								defaultValue: true
							},
							width: {
								ref: "width",
								label: "Width",
								type: "number",
								defaultValue: 25,
								show: function ( data ) {
									return data.fixed;
								}
							},
							percent: {
								ref: "percent",
								type: "boolean",
								label: "Unit",
								component: "switch",
								defaultValue: true,
								options: [{
									value: true,
									label: "Percent"
								}, {
									value: false,
									label: "Pixels"
								}],
								show: function ( data ) {
									return data.fixed;
								}
							},
							selection: {
								type: "string",
								component: "dropdown",
								label: "Selection mode",
								ref: "selectionMode",
								options: [{
									value: "NO",
									label: "No selections"
								}, {
									value: "CONFIRM",
									label: "Confirm selections"
								}, {
									value: "QUICK",
									label: "Quick selection"
								}, {
									value: "REPLACE",
									label: "Replace selection"
								}]
							}
						}
					},
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
								defaultValue: "=ValueList('A','B','C')",
								label: "Field",
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
							},
							qSortByLoadOrder: {
								type: "numeric",
								component: "dropdown",
								label: "Sort by Load Order",
								ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByLoadOrder",
								options: [{
									value: 1,
									label: "Ascending"
								}, {
									value: 0,
									label: "No"
								}, {
									value: -1,
									label: "Descending"
								}],
								defaultValue: 0
							},
							qSortByState: {
								type: "numeric",
								component: "dropdown",
								label: "Sort by State",
								ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByState",
								options: [{
									value: 1,
									label: "Ascending"
								}, {
									value: 0,
									label: "No"
								}, {
									value: -1,
									label: "Descending"
								}],
								defaultValue: 0
							},
							qSortByFrequency: {
								type: "numeric",
								component: "dropdown",
								label: "Sort by Frequence",
								ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByFrequency",
								options: [{
									value: -1,
									label: "Ascending"
								}, {
									value: 0,
									label: "No"
								}, {
									value: 1,
									label: "Descending"
								}],
								defaultValue: 0
							},
							qSortByNumeric: {
								type: "numeric",
								component: "dropdown",
								label: "Sort by Numeric",
								ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByNumeric",
								options: [{
									value: 1,
									label: "Ascending"
								}, {
									value: 0,
									label: "No"
								}, {
									value: -1,
									label: "Descending"
								}],
								defaultValue: 0
							},
							qSortByAscii: {
								type: "numeric",
								component: "dropdown",
								label: "Sort by Alphabetical",
								ref: "qListObjectDef.qDef.qSortCriterias.0.qSortByAscii",
								options: [{
									value: 1,
									label: "Ascending"
								}, {
									value: 0,
									label: "No"
								}, {
									value: -1,
									label: "Descending"
								}],
								defaultValue: 0
							}
						}
					},
					settings: {
						uses: "settings"
					}
				}
			},
			support: {
				snapshot: true,
				export: true,
				exportData: false
			},
			paint: function ( $element, layout ) {
				var self = this, html = "<ul>", style;
				if ( layout.fixed ) {
					style = 'style="width:' + layout.width + (layout.percent ? '%' : 'px') + ';"';
				} else {
					style = '';
				}
				layout.qListObject.qDataPages[0].qMatrix.forEach( function ( row ) {
					html += '<li ' + style + ' class="data state' + row[0].qState + '" data-value="' + row[0].qElemNumber + '">' + row[0].qText;
					if ( row[0].qFrequency ) {
						html += '<span>' + row[0].qFrequency + '</span>';
					}
					html += '</li>';
				} );
				html += "</ul>";
				$element.html( html );
				if ( this.selectionsEnabled && layout.selectionMode !== "NO" ) {
					$element.find( 'li' ).on( 'click', function () {
						if ( this.hasAttribute( "data-value" ) ) {
							var value = parseInt( this.getAttribute( "data-value" ), 10 ), dim = 0;
							if ( layout.selectionMode === "CONFIRM" ) {
								self.selectValues( dim, [value], true );
								this.classList.toggle( "selected" );
							} else if ( layout.selectionMode === "REPLACE" ) {
								self.backendApi.selectValues( dim, [value], false );
							} else {
								self.backendApi.selectValues( dim, [value], true );
							}
						}
					} );
				}
				return qlik.Promise.resolve();
			}
		};
	} );
