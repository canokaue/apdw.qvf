define(["jquery", "text!extensions/com-qliktech-angularchart/template.html", "text!./angularchart.css", "qlik"],
function($, template, cssContent, qlik) {
	'use strict';

	$("<style>").html(cssContent).appendTo("head");
	return {
		template : template,
		initialProperties : {
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 2,
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
					min : 1,
					max : 1
				},
				measures : {
					uses : "measures",
					min : 1,
					max : 1
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings"
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
		controller : ['$scope',
		function(/*$scope*/) {

		}]

	};

});
