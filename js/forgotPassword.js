var app=angular.module('forgot_password_app',['ui.router']);

app.config(function($stateProvider,$urlRouterProvider){

	$urlRouterProvider.otherwise("/forgot_password")
	$stateProvider
		.state('forgot_password',{
			url: '/forgot_password',
			templateUrl: '../fpass.html',
			controller: 'fpassController'
		})
});

app.controller('fpassController',function($scope,$http){
	console.log("controller called");
	$scope.submitbtn=function(){

		$http({
			method: 'POST',
			url: 'http://localhost:8080/register/forgotpassword',
			data: {
				user_email: $scope.user_email
			}
		}).then(function(res){
			console.log("user found here.");
			$scope.response= res.data;
		});
	}
});