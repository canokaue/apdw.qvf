define( ["qlik", "text!./chart-template.ng.html", "css!./chart-template.css"],
	function ( qlik, template ) {
		"use strict";
		return {
			template: template,
			initialProperties: {
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
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
					dimensions: {
						uses: "dimensions",
						min: 1,
						max: 1
					},
					measures: {
						uses: "measures",
						min: 1,
						max: 1
					},
					sorting: {
						uses: "sorting"
					}
				}
			},
			support: {
				snapshot: true,
				export: true,
				exportData: true
			},
			paint: function () {
				//needed for export
				this.$scope.selections = [];
				return qlik.Promise.resolve();
			},
			controller: ["$scope", "$element", function ( $scope ) {
				$scope.getPercent = function ( val ) {
					return Math.round( (val * 100 / $scope.layout.qHyperCube.qMeasureInfo[0].qMax) * 100 ) / 100;
				};

				$scope.selections = [];

				$scope.sel = function ( $event ) {
					if ( $event.currentTarget.hasAttribute( "data-row" ) ) {
						var row = parseInt( $event.currentTarget.getAttribute( "data-row" ), 10 ), dim = 0,
							cell = $scope.$parent.layout.qHyperCube.qDataPages[0].qMatrix[row][0];
						if ( cell.qIsNull !== true ) {
							cell.qState = (cell.qState === "S" ? "O" : "S");
							if ( $scope.selections.indexOf( cell.qElemNumber ) === -1 ) {
								$scope.selections.push( cell.qElemNumber );
							} else {
								$scope.selections.splice( $scope.selections.indexOf( cell.qElemNumber ), 1 );
							}
							$scope.selectValues( dim, [cell.qElemNumber], true );
						}
					}
				};
			}]
		};

	} );
