/*global define */

define(["jquery", "text!./com-qliktech-toolbar.css","qlik"], function($, cssContent, qlik ) {
	$("<style>").html(cssContent).appendTo("head");
	function createBtn(cmd, text) {
		return '<button class="lui-button" style="font-size:13px;" data-cmd="' + cmd + '">' + text + '</button>';
	}

	return {
		initialProperties : {
			qBookmarkListDef : {
				qType : "bookmark",
				qData : {
					title : "/title",
					description : "/description"
				}
			},
			qFieldListDef : {
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				buttons : {
					type : "items",
					label : "App buttons",
					items : {
						clearButton : {
							ref : "buttons.clear",
							label : "ClearAll",
							type : "boolean",
							defaultValue : true
						},
						backButton : {
							ref : "buttons.back",
							label : "Back",
							type : "boolean",
							defaultValue : true
						},
						forwardButton : {
							ref : "buttons.forward",
							label : "Forward",
							type : "boolean",
							defaultValue : true
						},
						lockButton : {
							ref : "buttons.lockall",
							label : "Lock All",
							type : "boolean",
							defaultValue : false
						},
						unlockButton : {
							ref : "buttons.unlockall",
							label : "Unlock All",
							type : "boolean",
							defaultValue : false
						}
					}
				},
				field : {
					type : "items",
					label : "Field and field buttons",
					items : {
						showfield : {
							ref : "field.show",
							type : "boolean",
							label : "Show",
							defaultValue : false
						},
						list : {
							ref : "field.list",
							component : "switch",
							type : "boolean",
							label : "Field",
							defaultValue : true,
							options : [{
								value : true,
								label : "List Fields"
							}, {
								value : false,
								label : "Fixed field"
							}],
							show : function(data) {
								return data.field && data.field.show;
							}
						},
						fixed : {
							ref : "field.fixed",
							label : "Use field",
							type : "string",
							defaultValue : "",
							show : function(data) {
								return data.field && data.field.show && !data.field.list;
							}
						},
						clearButton : {
							ref : "field.clear",
							label : "Clear",
							type : "boolean",
							defaultValue : false,
							show : function(data) {
								return data.field && data.field.show;
							}
						},
						lockButton : {
							ref : "field.lock",
							label : "Lock",
							type : "boolean",
							defaultValue : false,
							show : function(data) {
								return data.field && data.field.show;
							}
						},
						unlockButton : {
							ref : "field.unlock",
							label : "Unlock",
							type : "boolean",
							defaultValue : false,
							show : function(data) {
								return data.field && data.field.show;
							}
						},
						matchButton : {
							ref : "field.selectmatch",
							label : "Select match",
							type : "boolean",
							defaultValue : false,
							show : function(data) {
								return data.field && data.field.show;
							}
						}
					}
				},
				bookmark : {
					type : "items",
					label : "Bookmarks",
					items : {
						applyButton : {
							ref : "bookmark.apply",
							type : "boolean",
							label : "Apply",
							defaultValue : false
						},
						createButton : {
							ref : "bookmark.create",
							label : "Create",
							type : "boolean",
							defaultValue : false
						}
					}
				},
				settings : {
					uses : "settings"
				}
			}
		},
		support: {
			snapshot: false,
			export: true,
			exportData: false
		},
		paint : function($element, layout) {
			//create the app button group
			var html = '', app = qlik.currApp(this);
			html += '<div class="lui-buttongroup">';
			if(layout.buttons.clear) {
				html += createBtn("clearAll", "Clear All");
			}
			if(layout.buttons.back) {
				html += createBtn("back", "Back");
			}
			if(layout.buttons.forward) {
				html += createBtn("forward", "Forward");
			}
			if(layout.buttons.lockall) {
				html += createBtn("lockAll", "Lock All");
			}
			if(layout.buttons.unlockall) {
				html += createBtn("unlockAll", "Unlock All");
			}
			html += '</div><br/>';
			if(layout.field && layout.field.show) {
				html += '<div class="lui-buttongroup">';
				//create the field btn group
				if(layout.field.list && layout.qFieldList) {
					html += '<select class="lui-select fields">';
					layout.qFieldList.qItems.forEach( function( value) {
						html += "<option value='" + value.qName + "'>" + value.qName + "</option>";
					});
					html += '</select>';
				} else {
					//display the fixed field
					html += '<div class="qv-object-title">' + layout.field.fixed + '</div>';
				}
				if(layout.field.clear) {
					html += createBtn("clear", "Clear");
				}
				if(layout.field.lock) {
					html += createBtn("lock", "Lock");
				}
				if(layout.field.unlock) {
					html += createBtn("unlock", "Unlock");
				}
				if(layout.field.selectmatch) {
					html += '<div class="lui-buttongroup">';
					html += createBtn("selectmatch", "Select match");
					html += '<input class="lui-input match" type="text"  value="" name="match"/>';
					html += '</div>';
				}
				html += '</div>';
			}
			if(layout.bookmark && layout.bookmark.apply && layout.qBookmarkList) {
				html += '<div class="lui-buttongroup">';
				html += '<select class="lui-select bookmark_list">';
				layout.qBookmarkList.qItems.forEach( function( value) {
					if(value.qMeta && value.qMeta.title) {
						html += "<option value='" + value.qInfo.qId + "'>" + value.qMeta.title + "</option>";
					}
				});
				html += '</select>';
				html += createBtn("bmapply", "Apply");
				html += '</div>';
			}
			if(layout.bookmark && layout.bookmark.create) {
				html += '<div class="lui-buttongroup">';
				html += createBtn("bmcreate", "Create Bookmark");
				html += '<input class="lui-input bmtitle" type="text" value="" name="bmtitle"/>';
				html += '</div>';
			}

			$element.html(html);
			//
			var $fields = $element.find(".fields"), $bookmarks = $element.find(".bookmark_list");

			$element.find('button').on('click', function() {
				switch(this.dataset.cmd) {
					case 'clearAll':
						app.clearAll();
						break;
					case 'back':
						app.back();
						break;
					case 'forward':
						app.forward();
						break;
					case 'lockAll':
						app.lockAll();
						break;
					case 'unlockAll':
						app.unlockAll();
						break;
					//field actions
					case 'clear':
						app.field(layout.field.list ? $fields.val() : layout.field.fixed).clear();
						break;
					case 'lock':
						app.field(layout.field.list ? $fields.val() : layout.field.fixed).lock();
						break;
					case 'unlock':
						app.field(layout.field.list ? $fields.val() : layout.field.fixed).unlock();
						break;
					case 'selectmatch':
						app.field(layout.field.list ? $fields.val() : layout.field.fixed).selectMatch($element.find(".match").val(), true);
						break;
					//bookmark actions
					case 'bmapply':
						app.bookmark.apply($bookmarks.val());
						break;
					case 'bmcreate':
						app.bookmark.create($element.find(".bmtitle").val(), null, qlik.navigation.getCurrentSheetId().sheetId);
						break;
				}
			});
			return qlik.Promise.resolve();
		}
	};
});
