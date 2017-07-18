var app=angular.module('main_app',['ui.router']);

app.config(function($stateProvider,$urlRouterProvider,$locationProvider){

	$urlRouterProvider.otherwise('/mainpage');
	$locationProvider.html5Mode(true);
	$stateProvider
		.state('mainpage',{
			url: '/mainpage',
			templateUrl: 'mainPage.html'
		})
		.state('signup',{
			url:'/signup',
			templateUrl:'sign_up.html',
			controller:'signupController'
		})
		.state('forgotpassword',{
			url:'/forgotpassword',
			templateUrl:'forgotPassword.html',
			controller:'fpassController'
		})

		.state('bloodsure',{
			url: '/bloodsure',
			templateUrl: 'bloodsure.html',
			controller: 'bloodsure_controller'
		})

		.state('userprofile',{
			url: '/userprofile',
			templateUrl: 'userprofile.html',
			controller: 'userprofileController'
		})

		.state('history',{
			url: '/history',
			templateUrl: 'history.html',
			controller: 'historyController'
		})

		.state('hospital',{
			url: '/s',
			templateUrl: 'hospital.html',
			controller: 'hospitalController'
		})
		/*.state('updatepassword',{
			url: '/updatepassword',
			templateUrl: 'updatepass.html',
			controller: 'updatePasswordController'
		})*/
});

/*app.factory('share_details',function($rootScope){
	var scope={};

	return{
		store: function(key,value){
			scope[key]=value;
		},
		get: function(key){
			return scope[key];
		}
	}
});*/


app.controller('signupController',function($scope,$http,$rootScope,$state){
	console.log("signupController called");
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
		console.log("signup called");
		$scope.OTPsent=false;
		$http({
			method:'POST',
			url:'http://localhost:8080/register/check',
			data:{
				user_email:$scope.user_email
			}
		}).then((res)=>{
			console.log("res is "+res.data);
			if(res.data=="true")
			{
				Materialize.toast("User Email already exists,Please signup with a different I'd", 7000,'red darken-3');
				$scope.user_email=null;
				$scope.OTPsent=false;
			}
			else 
			{	//'https://sendotp.msg91.com/api/generateOTP
				console.log("Inside else of signupController");
				$('#modal1').show();
				$('#modal1').css({
          			zIndex:4
        		});
				console.log("dob "+$scope.user_dob);
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
							$scope.OTPsent=true;
							$rootScope.OTP=response.data.response.oneTimePassword;
							console.log("OTP is"+$rootScope.OTP);
						});
			}
		});

	},

		$scope.verifyOTP=function(){
			if($scope.user_OTP && $scope.OTPsent)
			{
				if($scope.user_OTP==$rootScope.OTP)
				{
					console.log("OTP verified");
					$scope.user_OTP=null;
						$http({
							method: 'POST',
							url: 'http://localhost:8080/register/signup',
							data:{
							user_name: $scope.user_name,
							user_email: $scope.user_email,
							user_mobile_no: $scope.user_mobile_no,
							user_blood_grp: $scope.user_blood_grp,
							user_dob: $scope.user_dob,
							user_gender: $scope.user_gender,
							user_password:$scope.user_password,
							user_confirm_password:$scope.user_confirm_password
							}
						}).then(function(response){
							Materialize.toast(response.data, 7000,'red darken-3');
						})
					
				}
				else
				{
					Materialize.toast("OTP doesn't match", 7000,'red darken-3');
				}
			}
			else
			{
				$scope.errorMsg="Please Enter the OTP sent to your Phone No."
			}
		}


		$scope.login =function(){
		$scope.loggedIn=false;
		$http({
		method: 'POST',
		url: 'http://localhost:8080/register/login_user',
		data:{
			user_email: $scope.user_login_email,
			user_password: $scope.user_login_password
		}
		}).then(function(res){
			if(res.data=="true")
			{
				loggedIn=true;
				$state.go('mainpage');
			}
			else
			{
				Materialize.toast(res.data, 7000,'red darken-3');
			}
			
		});
	}
});



app.controller('fpassController',function($scope,$http,$state){
	console.log("fpassController  called");
	$scope.submitbtn=function(){
		if($scope.user_email)
		{
			$http({
			method: 'POST',
			url: 'http://localhost:8080/register/forgotpassword',
			data: {
				user_email: $scope.user_email
				}
			}).then(function(res){
				console.log("user found here.");
				$scope.response= res.data;
				$state.go('signup');
			});
		}
		else
		{
			$scope.response="Please Enter an e-mail I'd";
		}

	}
});

/*app.controller('updatePasswordController',function($scope,$http,$state){
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
});*/

app.controller('bloodsure_controller',function($scope,$http){
	$scope.data={};

	console.log("bloodsure_controller called");
	$scope.mysubmit=function(){
	/* code for payment gateway*/
	
		$http({
		method: 'POST',
		url: 'http://localhost:8080/dashboard/submit_patient_detail',
		data:{
			patient_name: $scope.data.patient_name,
			blood_grp: $scope.data.blood_grp,
			doctor_name: $scope.data.doctor_name,
			hospital: $scope.data.hospital,
			unit_of_blood: $scope.data.unit_of_blood,
			city: $scope.data.city,
			//cost: $scope.cost
		}
	}).then(function(response){
		
		console.log(response.data);
		alert("done");
	});
	}
});

app.controller('userprofileController',function($scope,$http,$state){
	console.log("userprofileController controller");

	console.log("getting details");

	$http({
		method: 'POST',
		url: 'http://localhost:8080/register/get_details',
		data:{
			user_email: 'sakshi781996@gmail.com'
		}
	}).then(function(response){
		$scope.show_data=response.data;
	})

	console.log("updating details");

	$scope.update_profile=function(){
		$scope.user_email='sakshi781996@gmail.com'
		$http({
			method: 'POST',
			url: 'http://localhost:8080/register/update_details',
			data:{
				user_name: $scope.user_name,
				user_email: $scope.user_email,
				user_blood_grp: $scope.user_blood_grp,
				user_mobile_no: $scope.user_mobile_no,
				user_dob: $scope.user_dob,
				user_gender: $scope.user_gender
			}
		}).then(function(response){
			console.log("user updated");
			console.log(response.data);
			$http({
				method: 'POST',
				url: 'http://localhost:8080/register/get_details',
				data:{
					user_email: 'sakshi781996@gmail.com'
				}
			}).then(function(response){
				$scope.show_data=response.data;
			})
		})
	}
})


app.controller('historyController',function($scope,$http){
	console.log("historyController called");
})

app.controller('hospitalController',function($scope,$http){
	console.log("hospitalController called");
})