var app = angular.module('ngDynamicForms',['ngMessages']);
app.controller('FormBuilderCtrl',function FormBuilderCtrl($scope, $window, $http)
{
	$scope.newField = {};
	$scope.newFormName = {};
	$scope.fields = [
	];
	$scope.editing = false;
	$scope.tokenize = function(slug1, slug2) {
		var result = slug1;
		result = result.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
		result = result.replace(/-/gi, "_");
		result = result.replace(/\s/gi, "-");
		if (slug2) {
			result += '-' + $scope.token(slug2);
		}
		return result;
	};
	$scope.saveField = function() {
		console.log($scope.newField)
		if ($scope.newField.type == 'checkboxes') {
			//$scope.newField.value = {};
		}
		if ($scope.editing !== false) {
			$scope.fields[$scope.editing] = $scope.newField;
			$scope.editing = false;
		} 
		else {
			if($scope.newField.name==undefined || $scope.newField.name==""){
			}
			else {
				if($scope.newField.type==undefined || $scope.newField.type==""){
				$scope.newField.type='text'
				}
				$scope.fields.push($scope.newField);
				}
			}
		

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
		var fn =$scope.newFormName.name.replace(/\s+/g, '');
		var allFields = {
			
			formName : fn,
			fields : $scope.fields,
			client : document.getElementById("customerName").getAttribute('name')
		};
		
		$http({
			url: '/getFieldsOfNewForm',
			method :"POST",
			data :allFields,
			headers :{'Content-Type': 'application/json'} 	

		})
		.success(function(response){
		$window.location.href = '/customer/getForms'
		});

	
	};

});

app.directive('ngDynamicForm', function () { 
    return { 
         restrict : 'A',
        replace : false,
        templateUrl : '/js/dynamicForms.html'
    } 
});
