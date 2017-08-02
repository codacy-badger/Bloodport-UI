var temp=[];
var locations=[];
var lang=[];
var lat=[];


	function initMap() 
	{


	}
	$.ajax({
        type: "GET",
        url:'http://localhost:8080/hospital/all_hospitals' ,
        contentType: "application/json",
        success: function(response) {
            //console.log(response);
            temp=response;
           	run();
        },
        error: function(response) {
            console.log(response);
        }
		});
	function getAllHospitals(){
		$.ajax({
        type: "GET",
        url:'http://localhost:8080/hospital/all_hospitals' ,
        contentType: "application/json",
        success: function(response) {
            //console.log(response);
            temp=response;
           	run();
        },
        error: function(response) {
            console.log(response);
        }
		});
	}


	function getAllHospitalsbyName(){

		$.ajax({
        type: "POST",
        url:'http://localhost:8080/hospital/sortByName' ,
        contentType: "application/json",
        data:JSON.stringify({
        	hospital_name:$('#hospitalName').val()
        }),
        success: function(response) {
           // console.log("heelo"+response);
            //console.log(temp);
            temp=response;
            console.log(response);
           	run();
        },
        error: function(response) {
            console.log(response.data
            	);
        }
		});
	}



	function getHospitalsByLocations(){
		if($('#hospitalLocation').val()=="Delhi")
		{
			$.ajax({
	        type: "POST",
	        url:'http://localhost:8080/hospital/sortByLocationDelhi' ,
	        contentType: "application/json",
	        success: function(response) {
	            //console.log(response);
	            temp=response;
	           	run();
	        },
	        error: function(response) {
	            console.log(response);
	        }
			});
		}

		if($('#hospitalLocation').val()=="ncr")
		{
			
			$.ajax({
				method:'POST',
				url:'http://localhost:8080/hospital/sortByLocationNCR',
				contentType: "application/json",
				success: function(response){
					temp=response;
					run();
				},
				error:function(response)
				{
					console.log(response);
				}
			});
		}
		
	}

	function run(){
		
		for(var i=0;i<temp.length;i++)
		{
			lang[i]=parseFloat(temp[i].lattitude);
			lat[i]=parseFloat(temp[i].longitude)
			locations[i]=[temp[i].hospital_name,lang[i],lat[i],i];	
		}	
		runMap();
	}

		function runMap()
			{
				var map = new google.maps.Map(document.getElementById('map'), {
					zoom: 6,
					center: new google.maps.LatLng(28.6139391,77.20902120000005),
					mapTypeId: google.maps.MapTypeId.ROADMAP
				});

				var infowindow = new google.maps.InfoWindow({});

				var marker, i;

				for (i = 0; i < temp.length; i++) 
				{
					
					marker = new google.maps.Marker({
						position: new google.maps.LatLng(locations[i][1], locations[i][2]),
						map: map
					});

					google.maps.event.addListener(marker, 'click', (function (marker, i) {
						return function () {
							infowindow.setContent(locations[i][0]);
							infowindow.open(map, marker);
						}
					})(marker, i));
				}
			}