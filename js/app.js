var app=angular.module('sign_up',[]);
app.controller('signupController',function($scope,$http,$rootScope){
	console.log("signupController called");
	$scope.cmprPass=function(){
		var check=false;
		if(($scope.user_password==null && $scope.user_confirm_password==null) || ($scope.user_password!=$scope.user_confirm_password))
		{
			
			check=true;
			return check;
		}
		else
		{
			
			check=false;
			return check;
		}
	},
	$scope.callsignUp=function(){
		$http({
			method:'POST',
			url:'http://localhost:8080/register/check',
			data:{
				user_email:$scope.user_email
			}
		}).then((res)=>{
			console.log("Check Api has been called");
			console.log(res.data)
			if(res.data)
			{
				console.log("User Email already exists");
			}
			else 
			{
				console.log("OTP function called");
				$http({
						method:'POST',
						url:'https://sendotp.msg91.com/api/generateOTP',
						headers: {
				             "application-Key": "_2NXWaVUffdYqANPke1RP6hq4fTAe-Buk1cT9ukSBJ0OO9aDlUlSeR4i7W5o1zjZo0GMhA6np5JNaka4jVYip5oUx_xAqQbhmpbgOt2nxrGVPvE6IPiemhKl6q44dmTrLsOcAiUL1OyGw8TqXpNkjg=="
				        },
						data:{
							countryCode:91,
							mobileNumber:$scope.user_mobile_no,
							getGeneratedOTP:true	 
						}
					}).then((response)=>{
							console.log("OTP has been send");
							
							$rootScope.OTP=response.data.response.oneTimePassword;
							console.log("OTP is"+$rootScope.OTP);
						});
			}
		});
	}
});

app.controller('OTPController',function($scope,$http,$rootScope){
	console.log("OTP controller called");
	$scope.verifyOTP=function(){
		console.log("verify called");
		console.log($rootScope.OTP);
		if($scope.user_OTP==$rootScope.OTP)
		{

			console.log("OTP verified");
			$scope.user_OTP=null;

		}
		else{
			console.log("oh nooooo!")
		}
	}
});
	
	/*$scope.callsignUp=function(){

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

				$scope.user_name=null;
				$scope.user_mobile_no=null;
				$scope.user_email=null;
				$scope.user_password=null;
				$scope.user_confirm_password=null;
				console.log("response is"+res.data);
				if(res.data)
				{ 	console.log("Otp sent");
					$http({
						method:'POST',
						url:'https://sendotp.msg91.com/api/generateOTP',
						headers: {
				             "application-Key": "_2NXWaVUffdYqANPke1RP6hq4fTAe-Buk1cT9ukSBJ0OO9aDlUlSeR4i7W5o1zjZo0GMhA6np5JNaka4jVYip5oUx_xAqQbhmpbgOt2nxrGVPvE6IPiemhKl6q44dmTrLsOcAiUL1OyGw8TqXpNkjg=="
				        },
						data:{
							countryCode:91,
							mobileNumber:$scope.user_mobile_no,
							getGeneratedOTP:true	 
						}
					}).then((response)=>{
							console.log("hello");
						});
				}
				else
				{
					console.log("OTP did not sent");
					var toastContent = "OTP did not sent";
  					Materialize.toast(toastContent, 7000,'red darken-3');
				}
				
				
			})
	},*/


//loginController

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