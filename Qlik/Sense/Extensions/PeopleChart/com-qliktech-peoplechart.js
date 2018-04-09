define(["qlik", "jquery", "./peoplechart-properties", "text!./peoplechart.css"],
function(qlik, $, properties, cssContent) {
	'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
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
		definition : properties,
		support : {
			snapshot: true,
			export: true,
			exportData : true
		},
		paint : function($element, layout) {
			var self = this, html = "", measures = layout.qHyperCube.qMeasureInfo, w = $element.width() - 130, qData = layout.qHyperCube.qDataPages[0], vmax = (measures && measures[0]) ? measures[0].qMax * 1.5 : 1;
			if(qData && qData.qMatrix) {
				qData.qMatrix.forEach(function( row) {
					if(row.length > 1) {
						//dimension is first, measure second
						var dim = row[0], meas = row[1];
						if(dim.qIsOtherCell) {
							dim.qText = layout.qHyperCube.qDimensionInfo[0].othersLabel;
						}
						html += '<div title="' + dim.qText + ':' + meas.qText + '"';
						//total (-1) is not selectable
						if(dim.qElemNumber !== -1) {
							html += "class='selectable' data-value='" + dim.qElemNumber + "'"
						}
						html += '>';
						html += "<div class='item-label'>" + dim.qText + "</div>";
						html += "<div class='bar' style='width:" + Math.round(w * (meas.qNum / vmax )) + "px;'>&nbsp;</div>";
						html += "</div>";
					}
				});
				$element.html(html);
				$element.find('.selectable').on('click', function() {
					if(this.hasAttribute("data-value")) {
						var value = parseInt(this.getAttribute("data-value"), 10), dim = 0;
						self.selectValues(dim, [value], true);
						this.classList.toggle("selected");
					}
				});
			}
			return qlik.Promise.resolve();
		}
	};
});
