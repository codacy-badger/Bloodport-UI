var app=angular.module('update_password_app',['ui.router']);

app.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise('/update_password')

	$stateProvider	
		.state('update_password',{
			url: '/update_password',
			templateUrl: '../updatepass.html',
			controller: 'updatePasswordController'
		})

		.state('reset',{
			url: '/reset',
			templateUrl: '../sign_up.html',
			controller: 'loginController'
		})
});

app.controller('updatePasswordController',function($scope,$http,$state){
	console.log("update password controller called");
	$scope.updatebtn=function(){
		
		$http({
			method: 'POST',
			url: 'http://localhost:8080/register/updatePassword',
			data: {
				user_password: $scope.user_password,
				user_confirm_password: $scope.user_confirm_password
			}
		}).then(function(res){
			console.log("password reset!!!");
			$scope.response=res.data;
			if(res.data=="Passwords don't match"){
				$scope.response=res.data;
			}
			else{
				//setInterval(2000);
				$state.go('reset');
			}
		});
	}
});

//login controller
app.controller('loginController',function($scope,$http){
	var loggedIn=false;
	$scope.login =function(){
		
		$http({
		method: 'POST',
		url: 'http://localhost:8080/register/login_user',
		data:{
			user_email: $scope.user_email,
			user_password: $scope.user_password
		}
		}).then(function(res){
			loggedIn=true;
			var toastContent = res.data;
  			Materialize.toast(toastContent, 7000,'red darken-3');
		});
	}
});

app.controller('signupController',function($scope,$http){
	$scope.callsignUp=function(){

		$http({
			method:'POST',
			url:'http://localhost:8080/register/signup',
			data:{
				user_name:$scope.user_name,
				user_mobile_no:$scope.user_mobile_no,
				user_email:$scope.user_email,
				user_password:$scope.user_password,
				user_confirm_password:$scope.user_confirm_password
			}
		}).then((res)=>{
				console.log(res.data);
				console.log("Data has been stored in database");
				$scope.user_name=null;
				$scope.user_mobile_no=null;
				$scope.user_email=null;
				$scope.user_password=null;
				$scope.user_confirm_password=null;
				var toastContent = res.data;
  				Materialize.toast(toastContent, 7000,'red darken-3');
			})
	},
	$scope.cmprPass=function(){
		if(($scope.user_password==null && $scope.user_confirm_password==null) || ($scope.user_password!=$scope.user_confirm_password))
		{
			console.log(true);
			return true;
		}
		else
		{
			console.log(false);
			return false;
		}
	}
	
});


