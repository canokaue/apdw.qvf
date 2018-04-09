define( ["qlik", "text!./template.html"],
	function ( qlik, template ) {

		return {
			template: template,
			support: {
				snapshot: true,
				export: true,
				exportData: false
			},
			paint: function () {
				return qlik.Promise.resolve();
			},
			controller: ['$scope', function ( $scope ) {
				//add your rendering code here
				$scope.html = "Hello World";
			}]
		};

	} );

