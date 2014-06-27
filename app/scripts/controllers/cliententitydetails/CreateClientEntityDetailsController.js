(function (module) {
    mifosX.controllers = _.extend(module, {
    	CreateClientEntityDetailsController: function (scope, location, http, routeParams, API_VERSION, $upload, $rootScope,dateFilter) {
            scope.clientId = routeParams.id;
            scope.formData = {};
            scope.first = {};
            scope.first.date = new Date();
            scope.onFileSelect = function ($files) {
                scope.file = $files[0];
            };

            scope.submit = function () {
            	scope.formData.dateOfIncorporation = scope.first.date.getTime();
            	scope.formData.clientId = scope.clientId;
                $upload.upload({
                    url: $rootScope.hostUrl + API_VERSION + '/cliententitydetails',
                    data: scope.formData,
                    file: scope.file
                }).then(function (data) {
                        // to fix IE not refreshing the model
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                        location.path('/viewclient/' + scope.clientId);
                    });
            };
        }
    });
    mifosX.ng.application.controller('CreateClientEntityDetailsController', ['$scope', '$location', '$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope','dateFilter', mifosX.controllers.CreateClientEntityDetailsController]).run(function ($log) {
        $log.info("CreateClientEntityDetailsController initialized");
    });
}(mifosX.controllers || {}));