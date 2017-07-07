var app=angular.module('sign_up',[]);

app.controller('signupController',function($scope,$http){
	$scope.callsignUp=function(){

		$http({
			method:'POST',
			url:'http://localhost:8000/register/signup',
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