define( ["qlik","jquery", "text!./style.css", "text!./template.html"], function (qlik, $, cssContent, template ) {'use strict';
    $("<style>").html(cssContent).appendTo("head");
	return {
       template: template,
       initialProperties : {
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 10,
					qHeight : 50
				}]
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 1
				},
				measures : {
					uses : "measures",
					min : 0
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings",
					items : {
						initFetchRows : {
							ref : "qHyperCubeDef.qInitialDataFetch.0.qHeight",
							label : "Initial fetch rows",
							type : "number",
							defaultValue : 50
						}
					}
				}
			}
		},
		support : {
			snapshot: true,
			export: true,
			exportData : true
		},
		paint: function ( ) {
			//setup scope.table
			if ( !this.$scope.table ) {
				this.$scope.table = qlik.table( this );
			}
			return qlik.Promise.resolve();
		},
		controller: ['$scope', function (/*$scope*/) {
		}]
	};

} );
