(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientActionsController: function (scope, resourceFactory, location, routeParams, dateFilter) {

            scope.action = routeParams.action || "";
            scope.clientId = routeParams.id;
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.taskPermissionName = 'ALL_FUNCTIONS';

            // Transaction UI Related

            switch (scope.action) {
                case "activate":
                    resourceFactory.clientResource.get({clientId: routeParams.id}, function (data) {
                        scope.client = data;
                        if (data.timeline.submittedOnDate) {
                            scope.mindate = new Date(data.timeline.submittedOnDate);
                        }
                    });
                    scope.labelName = 'label.input.activationdate';
                    scope.breadcrumbName = 'label.anchor.activate';
                    scope.modelName = 'activationDate';
                    scope.showActivationDateField = true;
                    scope.showDateField = false;
                    scope.taskPermissionName = 'ACTIVATE_CLIENT';
                    break;
                case "assignstaff":
                    scope.breadcrumbName = 'label.anchor.assignstaff';
                    scope.labelName = 'label.input.staff';
                    scope.staffField = true;
                    resourceFactory.clientResource.get({clientId: routeParams.id, template: 'true',staffInSelectedOfficeOnly:true}, function (data) {
                        if (data.staffOptions) {
                            scope.staffOptions = data.staffOptions;
                            scope.formData.staffId = scope.staffOptions[0].id;
                        }
                    });
                    scope.taskPermissionName = 'ASSIGNSTAFF_CLIENT';
                    break;
                case "close":
                    scope.labelName = 'label.input.closuredate';
                    scope.labelNameClosurereason = 'label.input.closurereason';
                    scope.breadcrumbName = 'label.anchor.close';
                    scope.modelName = 'closureDate';
                    scope.closureReasonField = true;
                    scope.showDateField = true;
                    resourceFactory.clientResource.get({anotherresource: 'template', commandParam: 'close'}, function (data) {
                        scope.closureReasons = data.closureReasons;
                        scope.formData.closureReasonId = scope.closureReasons[0].id;
                    });
                    scope.taskPermissionName = 'CLOSE_CLIENT';
                    break;
                case "delete":
                    scope.breadcrumbName = 'label.anchor.delete';
                    scope.labelName = 'label.areyousure';
                    scope.showDeleteClient = true;
                    scope.taskPermissionName = 'DELETE_CLIENT';
                    break;
                case "unassignstaff":
                    scope.labelName = 'label.areyousure';
                    scope.showDeleteClient = true;
                    scope.taskPermissionName = 'UNASSIGNSTAFF_CLIENT';
                    break;
                case "updatedefaultaccount":
                    scope.breadcrumbName = 'label.anchor.updatedefaultaccount';
                    scope.labelName = 'label.input.savingsaccount';
                    scope.savingsField = false;
                    resourceFactory.clientResource.get({clientId: routeParams.id, template: 'true'}, function (data) {
                        if (data.savingAccountOptions) {
                            scope.savingsField = true;
                            scope.savingAccountOptions = data.savingAccountOptions;
                            scope.formData.savingsAccountId = scope.savingAccountOptions[0].id;
                            if(data.savingsAccountId){
                                scope.formData.savingsAccountId = data.savingsAccountId;
                            }
                            
                        }
                    });
                    break;
                case "acceptclienttransfer":
                    scope.showNoteField = true;
                    scope.taskPermissionName = 'ACCEPTTRANSFER_CLIENT';
                    break;
                case "rejecttransfer":
                    scope.showNoteField = true;
                    scope.taskPermissionName = 'REJECTTRANSFER_CLIENT';
                    break;
                case "undotransfer":
                    scope.showNoteField = true;
                    scope.taskPermissionName = 'WITHDRAWTRANSFER_CLIENT';
                    break;
            }

            scope.cancel = function () {
                location.path('/viewclient/' + routeParams.id);
            }

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                if (this.formData[scope.modelName]) {
                    this.formData[scope.modelName] = dateFilter(this.formData[scope.modelName], scope.df);
                }

                if (scope.action == "activate") {
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'activate'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "assignstaff") {
                    delete this.formData.locale;
                    delete this.formData.dateFormat;
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'assignStaff'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "unassignstaff") {
                    delete this.formData.locale;
                    delete this.formData.dateFormat;
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'unassignstaff'}, {staffId: routeParams.staffId}, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "close") {
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'close'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "acceptclienttransfer") {
                    delete this.formData.locale;
                    delete this.formData.dateFormat;
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'acceptTransfer'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "rejecttransfer") {
                    delete this.formData.locale;
                    delete this.formData.dateFormat;
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'rejectTransfer'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "undotransfer") {
                    delete this.formData.locale;
                    delete this.formData.dateFormat;
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'withdrawTransfer'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                if (scope.action == "updatedefaultaccount") {
                    delete this.formData.locale;
                    delete this.formData.dateFormat;
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'updateSavingsAccount'}, this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
            };
        }
    });
    mifosX.ng.application.controller('ClientActionsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.ClientActionsController]).run(function ($log) {
        $log.info("ClientActionsController initialized");
    });
}(mifosX.controllers || {}));
