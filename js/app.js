var app=angular.module('sign_up',[]);

app.factory('share_details',function($rootScope){
	var scope={};

	return{
		store: function(key,value){
			scope[key]=value;
		},
		get: function(key){
			return scope[key];
		}
	}
});


app.controller('signupController',function($scope,$http,$rootScope,share_details){
	console.log("signupController called");
	
	share_details.store('signupController',$scope);
	$scope.modal_check=false;
	/*$scope.check_fields()=function(){
		var checking=false;
		if(($scope.user_name==null)||($scope.user_email==null)||($scope.user_mobile_no==null)||($scope.user_blood_grp==null)||($scope.user_dob==null)||($scope.user_gender==null))
		{
			checking=true;
			return checking;
		}
		else
		{
			checking=false;
			return checking;
		}
	},*/

	$scope.check_fields=function(){
		var check_select=true;
		if(($scope.user_dob==null)||($scope.user_blood_grp==null)||($scope.user_gender==null))
		{
			check_select=true;
			return check_select;
		}
		else
		{
			check_select=false;
			return check_select;
		}
	}

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
		alert("signup called");
		$http({
			method:'POST',
			url:'http://localhost:8080/register/check',
			data:{
				user_email:$scope.user_email
			}
		}).then((res)=>{
			console.log(res);
			$scope.modal_check=res.data;
			console.log("modal_check"+$scope.modal_check);
			if(res.data)
			{
				alert("User Email already exists");
			}
			else 
			{	//'https://sendotp.msg91.com/api/generateOTP
				alert("OTP function called");
				$scope.modal_check=true;
				$('#modal1').show();
				$('#modal1').css({
          			zIndex:4
        		});
				console.log("dob"+share_details.get('signupController').user_dob);
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
							alert("OTP has been send");
							
							$rootScope.OTP=response.data.response.oneTimePassword;
							alert("OTP is"+$rootScope.OTP);
						});
			}
		});
	}
});

app.controller('OTPController',function($scope,$http,$rootScope,share_details){
	console.log("OTP controller called");
	
	$scope.verifyOTP=function(){

	if($scope.user_OTP)
	{
		

		if($scope.user_OTP==$rootScope.OTP)
		{
			console.log("OTP verified");
			$scope.user_OTP=null;

			//alert("otp verified");
			
				//alert("signup called");
				console.log("dob"+share_details.get('signupController').user_dob);
				$http({
					method: 'POST',
					url: 'http://localhost:8080/register/signup',
					data:{
						user_name: share_details.get('signupController').user_name,
					user_email: share_details.get('signupController').user_email,
					user_mobile_no: share_details.get('signupController').user_mobile_no,
					user_blood_grp: share_details.get('signupController').user_blood_grp,
					user_dob: share_details.get('signupController').user_dob,
					user_gender: share_details.get('signupController').user_gender,
					user_password:share_details.get('signupController').user_password,
					user_confirm_password: share_details.get('signupController').user_confirm_password
					}
				}).then(function(response){
					alert(response.data);
					Materialize.toast(response.data, 7000,'red darken-3');
				})
			
		}
		else{
			Materialize.toast("OTP doesn't match", 7000,'red darken-3');
		}
	}
	else
	{
		alert("Please enter the otp");
		//Materialize.toast("Please Enter the OTP ", 7000,'red darken-3');
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

app.controller('loginController',function($scope,$http,$location){
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
  			alert("before redirection");
  			$location.url('http://localhost:8000');
  			$http({
  				url: 'http://localhost:8000',
  				method: 'POST',
  				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            	dataType: 'json'
  			}).success(function(response){
  				console.log(response);
  				alert(response);
  			})
  			/*var a=$location.absUrl();
  			a=$location.host();
  			alert(a);*/

		});
	}
});