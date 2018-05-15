var app = angular.module('ngDynamicForms',['ngMessages']);
app.controller('FormBuilderCtrl',function FormBuilderCtrl($scope, $window, $http)
{
	$scope.newField = {};
	$scope.newFormName = {};
	$scope.fields = [
	];
	$scope.editing = false;
	$scope.formNameExistError = false;
	
	$scope.formNameCheck = function(myformName_form){
		var formNameCheckData = {
			formName  : $scope.newFormName.Name,
			clientName: document.getElementById("customerName").getAttribute('name')
		}
		
		$http({
			url: '/createNewForm/checkFormName',
			method :"POST",
			data :formNameCheckData,
			headers :{'Content-Type': 'application/json'} 	

		})
		.then(function(response){
		//response always returns a -1 if doesnt exist
			if(response.data.formNameExist == -1)
				$scope.formNameExistError = false;
			else
				$scope.formNameExistError =  true;

		});

	}
	$scope.saveField = function() {
		//On edit , will not add a new field 
		if ($scope.editing !== false) {
			$scope.fields[$scope.editing] = $scope.newField;
			$scope.editing = false;
		} else{
			//on non selection of fieldtype-creates a textfield by default
			if($scope.newField.type==undefined || $scope.newField.type==""){
				$scope.newField.type='text'
			}
				//creates the field 
				$scope.fields.push($scope.newField);

			}
				//creation of new field on saving the previous field info
				$scope.newField = {
		};
	};

	$scope.editField = function(field) {
		$scope.editing = $scope.fields.indexOf(field);
		$scope.newField = field;
	};


	$scope.splice = function(field, fields) {
		fields.splice(fields.indexOf(field), 1);
	};


	$scope.addOption = function() {
		if ($scope.newField.options === undefined) {
			$scope.newField.options = [];
		}
		$scope.newField.options.push({
		});
	};
	
	$scope.typeSwitch = function(type) {
		if (type == 'checkboxes')
			return 'multiple';
		if (type == 'select')
			return 'multiple';
		if (type == 'radio')
			return 'multiple';

		return type;
	};

	$scope.submitFieldsOfForm = function(){
		var fn =$scope.newFormName.Name;
		var allFields = {
			formName : fn,
			fields : $scope.fields,
			//client : document.getElementById("customerName").getAttribute('name')
			customer : document.getElementById("customerName").getAttribute('name')
		};
		
		console.log(allFields)
		$http({
			url: '/getFieldsOfNewForm',
			method :"POST",
			data :allFields,
			headers :{'Content-Type': 'application/json'} 	

		})
		.then(function(response){
		$window.location.href = '/customer/getForms'
		});
	};

 });
 

app.directive('ngDynamicForm', function () { 
    return { 
         restrict : 'A',
        templateUrl : '/js/dynamicForms.html',
    } 
});