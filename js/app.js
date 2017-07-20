var app=angular.module('main_app',['ui.router']);

app.config(function($stateProvider,$urlRouterProvider,$locationProvider){

	$urlRouterProvider.otherwise('/mainpage');
	$locationProvider.html5Mode(true);
	$stateProvider
		.state('mainpage',{
			url: '/mainpage',
			templateUrl: 'mainPage.html',
			controller:'mainpageController'
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

		.state('dashboard',{
			url:'/dashboard',
			templateUrl:'dashboard.html',
			controller:'dashboardController'
		})
		.state('dashboard.bloodsure',{
			url: '/bloodsure',
			templateUrl: 'bloodsure.html',
			controller: 'bloodsure_controller'
		})

		.state('dashboard.userprofile',{
			url: '/userprofile',
			templateUrl: 'userprofile.html',
			controller: 'userprofileController'
		})

		.state('dashboard.history',{
			url: '/history',
			templateUrl: 'history.html',
			controller: 'historyController'
		})

		.state('dashboard.hospital',{
			url: '/s',
			templateUrl: 'hospital.html',
			controller: 'hospitalController'
		})
		.state('dashboard.donor',{
			url:'/search',
			templateUrl:'donor.html',
			controller:''
		})
		.state('dashboard.donor.findDonor',{
		url:'/donorfind',
			templateUrl:'findDonor.html',
			controller:'findDonorController'

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
app.controller('mainpageController',function($state,$scope,$rootScope){
	$scope.findDonor=function(){
		if($rootScope.loggedIn==true)
		{
			$state.go('dashboard.donor.findDonor');
		}
		else
		{
			$state.go('signup');
		}
	}
	$scope.findHospitals=function(){
		if($rootScope.loggedIn==true)
		{
			$state.go('dashboard.hospital');
		}
		else
		{
			$state.go('signup')
		}
	}

	$scope.donateBlood=function(){
		if($rootScope.loggedIn==true)
		{
			$state.go('dashboard.donor.findDonor');//to be corrected
		}
		else
		{
			$state.go('signup')
		}
	}

	$scope.bloodsure=function(){
		if($rootScope.loggedIn==true)
		{
			$state.go('dashboard.bloodsure');//to be corrected
		}
		else
		{
			$state.go('signup')
		}
	}
})

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
				$scope.user_name=null;
				$scope.user_mobile_no=null;
				$scope.user_password=null;
				$scope.user_confirm_password=null;
				$scope.user_blood_grp.selected=null;
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
							/* added by sakshi on 20/7/17*/
							$scope.user_email=null;
							$scope.user_name=null;
							$scope.user_mobile_no=null;
							$scope.user_password=null;
							$scope.user_confirm_password=null;
							$scope.user_blood_grp.selected=null;
							$scope.OTPsent=false;
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
		$rootScope.loggedIn=false;
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
				$rootScope.loggedIn=true;
				/* addded by sakshi on 20/7/17 */
				$rootScope.logged_email=$scope.user_login_email;
				/*add ended */
				$state.go('dashboard.bloodsure');
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
app.controller('dashboardController',function($scope,$rootScope,$state){
	console.log('Dahsboard console called');
	$scope.logout=function(){
		$rootScope.loggedIn=false;
		$state.go('mainpage');
	}
})

app.controller('bloodsure_controller',function($scope,$http,$rootScope){
	$scope.data={};

	$scope.check_fields=function(){
		var check_field1=true;
		if(($scope.data.blood_grp==null)||($scope.data.hospital==null)||($scope.data.unit_of_blood==null)||($scope.data.city==null)){
			return true;
		}
		else
		{
			return false;
		}
	}

	console.log("bloodsure_controller called");

	$scope.cost_calculation=function(){
			var unit=$scope.data.unit_of_blood;
			var bloodgrp=$scope.data.blood_grp;

			if(bloodgrp=="Whole HUman Blood IP")
			{
				if(unit==2)
				{
					$scope.data.cost=5000;
					return 5000;
				}
				else if(unit==3)
				{
					$scope.data.cost=7500;
					return 7500;
				}
				else if(unit==4)
				{
					$scope.data.cost=10000;
					return 10000;
				}
				else if(unit==5)
				{
					$scope.data.cost=12500;
					return 12500;
				}
			}
			else if (bloodgrp=="Concentrated Human Red Blood Corpuscles IP (Packed Red Cells)")
			{
				if(unit==2)
				{
					$scope.data.cost=5000;
					return 5000;
				}
				else if(unit==3)
				{
					$scope.data.cost=7500;
					return 7500;
				}
				else if(unit==4)
				{
					$scope.data.cost=10000;
					return 10000;
				}
				else if(unit==5)
				{
					$scope.data.cost=12500;
					return 12500;
				}
			}
			else if(bloodgrp=="Platelet Concentrate BP")
			{
				if(unit==2)
				{
					$scope.data.cost=2200;
					return 2200;
				}
				else if(unit==3)
				{
					$scope.data.cost=3300;
					return 3300;
				}
				else if(unit==4)
				{
					$scope.data.cost=4400;
					return 4400;
				}
				else if(unit==5)
				{
					$scope.data.cost=5500;
					return 5500;
				}
			}
			else if (bloodgrp=="Fresh Frozen Plasma")
			{
				if(unit==2)
				{
					$scope.data.cost=2500;
					return 2500;
				}
				else if(unit==3)
				{
					$scope.data.cost=3750;
					return 3750;
				}
				else if(unit==4)
				{
					$scope.data.cost=5000;
					return 5000;
				}
				else if(unit==5)
				{
					$scope.data.cost=6250;
					return 6250;
				}
			}
			else if(bloodgrp=="Plateletphersis")
			{
				if(unit==2)
				{
					$scope.data.cost=22100;
					return 22100;
				}
				else if(unit==3)
				{
					$scope.data.cost=33150;
					return 33150;
				}
				else if(unit==4)
				{
					$scope.data.cost=44200;
					return 44200;
				}
				else if(unit==5)
				{
					$scope.data.cost=55250;
					return 55250;
				}
			}
			else if(bloodgrp=="Leucoreduced (Packed Red Cells)")
			{
				if(unit==2)
				{
					$scope.data.cost=5300;
					return 5300;
				}
				else if(unit==3)
				{
					$scope.data.cost=7950;
					return 7950;
				}
				else if(unit==4)
				{
					$scope.data.cost=10600;
					return 10600;
				}
				else if(unit==5)
				{
					$scope.data.cost=13250;
					return 13250;
				}	
			}
			else if(bloodgrp=="Cryoprecipitate")
			{
				if(unit==2)
				{
					$scope.data.cost=2400;
					return 2400;
				}
				else if(unit==3)
				{
					$scope.data.cost=3600;
					return 3600;
				}
				else if(unit==4)
				{
					$scope.data.cost=4800;
					return 4800;
				}
				else if(unit==5)
				{
					$scope.data.cost=6000;
					return 6000;
				}	
			}
			else if(bloodgrp=="Blood Group & Rh Typing (by automated system)"){
				if(unit==2)
				{
					$scope.data.cost=200;
					return 200;
				}
				else if(unit==3)
				{
					$scope.data.cost=300;
					return 300;
				}
				else if(unit==4)
				{
					$scope.data.cost=400;
					return 400;
				}
				else if(unit==5)
				{
					$scope.data.cost=500;
					return 500;
				}	
			}
			else if(bloodgrp=="Therapeutic Phlebotomy")
			{
				if(unit==2)
				{
					$scope.data.cost=1000;
					return 1000;
				}
				else if(unit==3)
				{
					$scope.data.cost=1500;
					return 1500;
				}
				else if(unit==4)
				{
					$scope.data.cost=2000;
					return 2000;
				}
				else if(unit==5)
				{
					$scope.data.cost=2500;
					return 2500;
				}
			}
		}

		

	$scope.mysubmit=function(){
	/* code for payment gateway*/
		$scope.data.calculatedcost=$scope.cost_calculation();
		console.log($scope.data.calculatedcost);
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
			cost: $scope.data.calculatedcost,
			/* addded by sakshi on 20/7/17 */
			email: $rootScope.logged_email
			/* add ended */
		}
	}).then(function(response){
		console.log(response.data);
		if(response.data=="Your request has been successfully saved!!!"){
			Materialize.toast(response.data,7000,'red darken-3');	
			$scope.data.patient_name=null;
			 $scope.data.blood_grp=null;
			 $scope.data.doctor_name=null;
			 hospital: $scope.data.hospital=null;
			 $scope.data.unit_of_blood=null;
			 $scope.data.city=null;
			 $scope.data.cost=null;
		}
		else{
			Materialize.toast("Some error has occured. Please try again!!!",7000,'red darken-3');
		}
	});
	}
});
/* addded by sakshi on 20/7/17 */
app.controller('userprofileController',function($scope,$http,$state,$rootScope){
	/* add ended */
	console.log("userprofileController controller");

	console.log("getting details");

	$http({
		method: 'POST',
		url: 'http://localhost:8080/register/get_details',
		data:{
			/* addded by sakshi on 20/7/17 */
			user_email: $rootScope.logged_email
			/* add ended */
		}
	}).then(function(response){
		$scope.show_data=response.data;
	})

	console.log("updating details");

	$scope.update_profile=function(){
		/* addded by sakshi on 20/7/17 */
		$scope.user_email=$rootScope.logged_email
		/* add ended */
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

			Materialize.toast(response.data,7000,'red darken-3');

			$http({
				method: 'POST',
				url: 'http://localhost:8080/register/get_details',
				data:{
					/* addded by sakshi on 20/7/17 */
					user_email: $rootScope.logged_email
					/* add ended */
				}
			}).then(function(response){
				$scope.show_data=response.data;
			})
		})
	}
})

/* addded by sakshi on 20/7/17 */
app.controller('historyController',function($scope,$http,$rootScope){
	/* add ended */
	console.log("historyController called");

	$http({
			method: 'POST',
			url: 'http://localhost:8080/dashboard/get_patient_data',
			data: {
				/* addded by sakshi on 20/7/17 */
				email: $rootScope.logged_email
				/* add ended */
			}
		}).then(function(response){
			console.log(response.data);
			$scope.detail=response.data;
		})
		
	$scope.get_history_patient=function(){
		console.log("getting details of patient");

		$http({
			method: 'POST',
			url: 'http://localhost:8080/dashboard/get_patient_data',
			data: {
				/* addded by sakshi on 20/7/17 */
				email: $rootScope.logged_email
				/* add ended */
			}
		}).then(function(response){
			console.log(response.data);
			$scope.detail=response.data;
		})
	}
})

app.controller('hospitalController',function($scope,$http){
	console.log("hospitalController called");
})