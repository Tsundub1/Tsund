(function(){
var app = angular.module('smmesaApp', []);
//DEONV
var url_api = "https://dsbd-api.net/";
//var url_api = "http://ec2-13-245-26-46.af-south-1.compute.amazonaws.com:8080/";
//DEONV

app.controller('smmesamainController', function ($scope,$http,$window) {

$scope.Search = function(isValid,event){

	if(isValid)
	{

	   var referenceno = $scope.referenceno;
	   var emailid = $scope.email;
	   var mobileno = $scope.mobileNumber;
	   var mobileurl = url_api + "funding-application-cellphones/"+ mobileno;												//DEONV
	   var emailrefurl = url_api + "funding-application-reference-numbers/" + referenceno + "+" +emailid;					//DEONV
	   
	   if(emailid && referenceno)
	   {
		  
		   getFundApplicationEmailRef(emailrefurl,mobileno);
		

		
	   }
	   else if(emailid && referenceno && mobileno)
	   {
		   getFundApplicationEmailRef(emailrefurl,mobileno);
	   }
	   else
	   {
		
			getFundApplication(mobileurl,emailid,referenceno);
	   }

	}
	else
	{
		$scope.referencenoreq = true;
		$scope.emailIDreq = true;
		$scope.mobileNoreq = true;
	}


};


function getFundApplicationEmailRef(urls,mobileno)
{
	   $http({
		method : "GET",
		headers: {
		'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
		'Content-Type': 'application/json'
		},
		url : urls
	  }).then(function mySuccess(response) {
	   
			$scope.searcherror ='';
			$window.localStorage.setItem("smmesaData", JSON.stringify(response));
			console.log("Success",response);
			$window.location.href = "SMMESA.html?Page=Search";
		 
		}, function myError(response) {
			console.log("Failed",response);
			$scope.searcherror = "There is no application.Please use the register now link below.";
			/*if(mobileno == "")
			{
				 $scope.searcherror = "There is no application.Please use the register now link below.";
			}
			else
			{
				getFundApplication(mobileurl,emailid,referenceno);
			}*/
		 
	  });	
}
function getFundApplication(urls,email,referenceno)
{
  $http({
	method : "GET",
	headers: {
	'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
	'Content-Type': 'application/json'
	},
	url : urls
  }).then(function mySuccess(response) {
      console.log("Success",response,response.data.length);
	   
	    for(var i=0;i<response.data.length;i++)
		{
			if(response.data[i].referenceNumber == referenceno)
			{
				$window.localStorage.setItem("smmesaData", JSON.stringify(response.data[i]));
				$window.location.href = "SMMESA.html?Page=Search";
			}
			else if(response.data[i].applicant.email == email)
			{
				 console.log("Email");
			   	$window.localStorage.setItem("smmesaData", JSON.stringify(response.data[i]));
			    $window.location.href = "SMMESA.html?Page=Search";			   
			}
			/*else
			{
				$scope.searcherror = "There is no application.Please use the register now link below.";
			}*/
			
		}
	  

	}, function myError(response) {
		
		 console.log("Fail",response);
		 $scope.searcherror = "There is no application.Please use the register now link below.";

  });
}  	
	
});
app.controller('smmesaController',  function($scope, $http,$window,$filter,$timeout) {
var current_fs, next_fs, previous_fs; //fieldsets
var opacity;
var current = 1;
var steps = $(".fieldsections").length;
var address;

var url_string = $window.location.href;
var url = new URL(url_string);
var page = url.searchParams.get("Page");
$scope.smmesa = {};
$scope.shareholders = [{id: 'choice1'}];
//XOLANI
$scope.onlineinformations = [{id: 'choice1'}]
$scope.marketinformations = [{id: 'choice1'}]
$scope.manufproducts = [{id:'choice1'}]
$scope.productionaddresses = [{id:'choice1'}]
$scope.selmanufacturers = 'N';
//XOLANI


function init(callback)
{



//Returns a list of all business-types
$http({
method : "GET",
headers: {
'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
'Content-Type': 'application/json'
},
url : `${url_api}business-types` 									/*DEONV*/							
}).then(function mySuccess(response) {

  $scope.businesstype = response.data;
  $scope.selbusinesstype = response.data[0];
}, function myError(response) {
  $scope.businesstype = response.statusText;
});


//Returns a list of all economic-sectors
$http({
	method : "GET",
	headers: {
	'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
	'Content-Type': 'application/json'
	},
	url : `${url_api}provinces` 									/*DEONV*/							
	}).then(function mySuccess(response) {
	
	  $scope.prdprovinces = response.data;
	}, function myError(response) {
	  $scope.prdprovinces = response.statusText;
});

//Returns a list of all economic-sectors
$http({
	method : "GET",
	headers: {
	'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
	'Content-Type': 'application/json'
	},
	url : `${url_api}towns` 									/*DEONV*/							
	}).then(function mySuccess(response) {
	
	  $scope.prdtowns = response.data;
	}, function myError(response) {
	  $scope.prdtowns = response.statusText;
});



 //Returns a list of all economic-sectors
$http({
method : "GET",
headers: {
'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
'Content-Type': 'application/json'
},
url : `${url_api}economic-sectors` 									/*DEONV*/							
}).then(function mySuccess(response) {

  $scope.economicsectors = response.data;
  $scope.seleconomicsectors = response.data[0];
}, function myError(response) {
  $scope.economicsectors = response.statusText;
});

/*DEONV        NEW API GET*/	
// Returns a list of all BBBEE levels
$http({
	method : "GET",
	headers: {
	'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
	'Content-Type': 'application/json'
	},
	url : `${url_api}bbbee-levels` 									/*DEONV*/							
	}).then(function mySuccess(response) {
	
	  $scope.bbbeelevels = response.data;
	  $scope.selbbbeelevels = response.data[0];
	}, function myError(response) {
	  $scope.bbbeelevels = response.statusText;
	});


	$http({
		method : "GET",
		headers: {
		'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
		'Content-Type': 'application/json'
		},
		url : `${url_api}manufacturing-products` 															
		}).then(function mySuccess(response) {
		
		  $scope.manufacturingproducts = response.data;
		  $scope.selmanufacturingproducts = response.data[0];
		}, function myError(response) {
		  $scope.manufacturingproducts = response.statusText;
		});


	$http({
		method : "GET",
		headers: {
		'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
		'Content-Type': 'application/json'
		},
		url : `${url_api}market-types` 												/*DEONV*/							
		}).then(function mySuccess(response) {
		
			$scope.markettypes = response.data;
			$scope.selmarkettypes = response.data[0];
		}, function myError(response) {
			$scope.markettypes = response.statusText;
		});

	$http({
		method : "GET",
		headers: {
		'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
		'Content-Type': 'application/json'
		},
		url : `${url_api}quality-approvers` 										/*DEONV*/							
		}).then(function mySuccess(response) {
		
			$scope.qualityapprovers = response.data;
			$scope.selqualityapprovers = response.data[0];
		}, function myError(response) {
			$scope.qualityapprovers = response.statusText;
		});

	$http({
		method : "GET",
		headers: {
		'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
		'Content-Type': 'application/json'
		},
		url : `${url_api}subcategories` 										/*DEONV*/							
		}).then(function mySuccess(response) {
		
			$scope.subcategories = response.data;
			$scope.selsubcategories = response.data[0];
		}, function myError(response) {
			$scope.subcategories = response.statusText;
		});

		//DEONV    
		$scope.FillProducts = function(subcategory)  
		{  
			$http({
			method : "GET",
			headers: {
			'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
			'Content-Type': 'application/json'
			},
			url : `${url_api}manufacturing-products-by-subcategory/` + 	subcategory.id													
			}).then(function mySuccess(response) {
			
				$scope.manufacturingproducts = response.data;
			}, function myError(response) {
				$scope.manufacturingproducts = response.data;
			});
		} 
		/*
		$scope.FillProducts = function(subcategory)  
		{  
			$http({
			method : "GET",
			headers: {
			'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
			'Content-Type': 'application/json'
			},
			url : `${url_api}manufacturing-products-by-subcategory/` + 	subcategory.id													
			}).then(function mySuccess(response) {
			
				$scope.manufacturingproducts = response.data;
			}, function myError(response) {
				$scope.manufacturingproducts = response.data;
			});
		} */
//DEONV  

/*DEONV*/		
$http({
	method : "GET",
	headers: {
	'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
	'Content-Type': 'application/json'
	},
	url : `${url_api}manufacturing-products` 											/*DEONV*/								
	}).then(function mySuccess(response) {
	
	  $scope.manufacturingproducts = response.data;
	  
	}, function myError(response) {
	 
	});   

// Returns a list of all genders
$http({
method : "GET",
headers: {
'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
'Content-Type': 'application/json'
},
url : `${url_api}genders` 											/*DEONV*/								
}).then(function mySuccess(response) {

  $scope.genders = response.data;
  var length = $scope.shareholders.length;
  if(length == 1)
  {
	  $scope.shareholders[0].selgenders = response.data[0];
  }
  
  
}, function myError(response) {
 
});    
	     
// Returns a list of all populationgroups
$http({
method : "GET",
headers: {
'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
'Content-Type': 'application/json'
},
url : `${url_api}population-groups` 								/*DEONV*/					
}).then(function mySuccess(response) {


   var populationgroups = response.data[0];
   $scope.populationgroups = response.data;
	var length = $scope.shareholders.length;
	  if(length == 1)
	  {
		  $scope.shareholders[0].selpopulationgroups = response.data[0];
	  }
}, function myError(response) {

});


   callback();
};
initsmmesaApp();
async function initsmmesaApp() {

  init(function() {
        console.log('I\'m done!');
		//search();
	if(page == "Search")
    {
	 var smmesaData = JSON.parse($window.localStorage.getItem("smmesaData"));

			if(smmesaData.data === undefined)
			{
				console.log("Data undefined",smmesaData);
				
				 var promise = $timeout(function() {
				 displaySMMESA(smmesaData);
				}, 600);
			}
			else
			{
				console.log("Data defined",smmesaData.data.referenceNumber,smmesaData.data.id,smmesaData.data);
				 var promise = $timeout(function() {
				 displaySMMESA(smmesaData.data);
				 }, 600);
			}
		  
	   }
	   else
	   {
		     $window.sessionStorage.setItem("referenceno","register");	
			 
	   }
	   
	   
    });

}

setProgressBar(current);
function setProgressBar(curStep){
	var percent = parseFloat(100 / steps) * curStep;
	percent = percent.toFixed();
	$(".progress-bar")
	.css("width",percent+"%")
}

$(".previous").click(function(){

	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();

	//Remove class active
	$("#progressbar li").eq($(".fieldsections").index(current_fs)).removeClass("active");

	//show the previous fieldset
	previous_fs.show();

	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
	step: function(now) {
	// for making fielset appear animation
	opacity = 1 - now;

	current_fs.css({
	'display': 'none',
	'position': 'relative'
	});
	previous_fs.css({'opacity': opacity});
	},
	duration: 500
	});
	setProgressBar(--current);
});


function Next(id)
{

  console.log($scope.place);
  
	current_fs = $(id).parent();
	next_fs = $(id).parent().next();

	//Add Class Active
	$("#progressbar li").eq($(".fieldsections").index(next_fs)).addClass("active");

	//show the next fieldset
	next_fs.show();
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
	step: function(now) {
	// for making fielset appear animation
	opacity = 1 - now;

	current_fs.css({
	'display': 'none',
	'position': 'relative'
	});
	next_fs.css({'opacity': opacity});
	},
	duration: 500
	});
	setProgressBar(++current);

		
} 

function checkDefined(fieldvalue)
{
  var value;
  if (typeof fieldvalue === 'undefined') {
	  value = null;
	}
	else
	{
		value = fieldvalue;
	}
	return value;
}  

function checkboxDefined(fieldvalue)
{
  var value;
  if (typeof fieldvalue === 'undefined') {
	  value = false;
	}
	else
	{
		value = fieldvalue;
	}
	return value;
}  


var map = L.map('map').setView([45.5165, -122.6764], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider({countries: ['ZA']});
var search = L.esri.BootstrapGeocoder.search({
inputTag: 'place',
providers: [arcgisOnline],
placeholder:"Enter a location"
}).addTo(map);

search.on('results', function(e){

 console.log(e.results[0]);
// $scope.address = e.results[0].text;
 document.getElementById('place').value = e.results[0].properties.LongLabel;
 $scope.place = e.results[0].properties.LongLabel;
 $scope.province = e.results[0].properties.Region;
 $scope.district = e.results[0].properties.Subregion;
 $scope.erroraddress = "";
 $scope.$apply();


// DEONV		PRD ADDRESS
document.getElementById('prdplace').value = e.results[0].properties.LongLabel;
$scope.prdplace = e.results[0].properties.LongLabel;
$scope.prdprovince = e.results[0].properties.Region;
$scope.prddistrict = e.results[0].properties.Subregion;
$scope.prderroraddress = "";
$scope.$apply();
});

/*$scope.autocompleteOptions = {
                        componentRestrictions: { country: 'za' },
                        types: ['geocode']
                    }


$scope.$on('gmPlacesAutocomplete::placeChanged', function(){

    var location = $scope.place.getPlace().geometry.location;
    address = $scope.place.getPlace().formatted_address;
	var place = $scope.place.getPlace();
    console.log(place);
	var componentprovince = {
	 
	  administrative_area_level_1: 'long_name'
	};
	var componentdistrict = {
	 
	  administrative_area_level_2: 'long_name'
	};

	 for (var i = 0; i < place.address_components.length; i++) {
		var addressType = place.address_components[i].types[0];
		if (componentprovince[addressType]) {
		  var provinceval = place.address_components[i][componentprovince[addressType]];
		   $scope.province = provinceval;
		}
		
		 if (componentdistrict[addressType]) {
		  var districtval = place.address_components[i][componentdistrict[addressType]];
		   $scope.district = districtval;
		}
	  }
	$scope.erroraddress = "";
    $scope.$apply();
});*/

/*XOLANI : Online Info*/
$scope.addNewOChoice = function(){
	addOChoice();
};
function addOChoice()
{
	var newItemNo = $scope.onlineinformations.length+1;
	$scope.onlineinformations.push({'id':'choice'+newItemNo});
}

$scope.removeOChoice = function() {
	if($scope.onlineinformations.length != 1)
	{
		var lastItem = $scope.onlineinformations.length-1;
	   $scope.onlineinformations.splice(lastItem);
	}
  
  }; 
/*XOLANI END*/

/*XOLANI : Market Info*/
$scope.addNewCChoice = function(){
	addCChoice();
};

function addCChoice()
{
	var newItemNo = $scope.marketinformations.length+1;
	$scope.marketinformations.push({'id':'choice'+newItemNo});
}

$scope.removeCChoice = function() {
	if($scope.marketinformations.length != 1)
	{
		var lastItem = $scope.marketinformations.length-1;
	   $scope.marketinformations.splice(lastItem);
	}
  
  }; 
/*XOLANI END*/


/*XOLANI : Product*/
$scope.addNewPChoice = function(){
addPChoice();
};
function addPChoice()
{
var newItemNo = $scope.manufproducts.length+1;
$scope.manufproducts.push({'id':'choice'+newItemNo});
}

$scope.removePChoice = function() {
if($scope.manufproducts.length != 1)
{
	var lastItem = $scope.manufproducts.length-1;
	$scope.manufproducts.splice(lastItem);
}

}; 
/*XOLANI END*/

/*XOLANI : ProductionAddress*/
$scope.smmesa.selproductionaddress = true;
$scope.addNewAChoice = function(){
addAChoice();
};
function addAChoice()
{
var newItemNo = $scope.productionaddresses.length+1;
$scope.productionaddresses.push({'id':'choice'+newItemNo});
}

$scope.removeAChoice = function() {
if($scope.productionaddresses.length != 1)
{
	var lastItem = $scope.productionaddresses.length-1;
	$scope.productionaddresses.splice(lastItem);
}

}; 
/*XOLANI END*/

$scope.addNewChoice = function() {
  addChoice();
};
function addChoice()
{
var newItemNo = $scope.shareholders.length+1;
$scope.shareholders.push({'id':'choice'+newItemNo});

}

$scope.removeChoice = function() {
  if($scope.shareholders.length != 1)
  {
	  var lastItem = $scope.shareholders.length-1;
	 $scope.shareholders.splice(lastItem);
  }

};
$scope.numberOfEmployees = 0;  
$scope.sumEmployees = function() {  
$scope.numberOfEmployees = ($scope.nummale * 1) + ($scope.numfemale * 1);  
}  


$scope.ValidateContact = function(isValid) {

	if(isValid)
	{
	    Next("#next1");
	}
	else
	{
		$scope.contactsubmitted = true;
	}
};

$scope.ValidateCompany = function(isValid) {
	if(isValid)
	{
		Next("#next2");
	}
	else
	{
	$scope.companysubmitted = true;	
	}
};
$scope.ValidateShare = function(isValid) {
	
 	if(isValid)
	{
	  Next("#next3");
	}
	else
	{
	  $scope.sharesubmitted = true;
	}
};



$scope.smmesaSubmit = function(isValid1,isValid2,isValid3,isValid4,event) {
  


	 if (isValid1 && isValid2 && isValid3 && isValid4) {
		$scope.buttonDisabled = true;
		$scope.assistance = "";
	
	
		var referenceno = $window.sessionStorage.getItem("referenceno");
		var idrecord = $window.sessionStorage.getItem("idrecord");
		var businessid = $window.sessionStorage.getItem("businessid");
		var personid = $window.sessionStorage.getItem("personid");
		if(referenceno == "register")
		{
			
			newRegistration();
		}
		else
		{
	
			updateRegistration(idrecord,referenceno,businessid,personid);
		}

	}
	else
	{  
	   $scope.financesubmitted = true;
	  // $scope.assistance = "Please provide the assistance required.";
	   alert("Please confirm that all fields are filled in the form.");
	   //return;
	}
	

}




function displaySMMESA(response)
{
	console.log(response);
     var idrecord = response.id;
	 var dateCreated = response.dateCreated;
	 var referenceno = response.referenceNumber;
	 var businessid = response.applicant.business.id;
	 var personid = response.applicant.id;
	 $window.sessionStorage.setItem("idrecord",idrecord);
	 $window.sessionStorage.setItem("referenceno",referenceno);
	 $window.sessionStorage.setItem("businessid",businessid);
	 $window.sessionStorage.setItem("personid",personid);
	 $window.sessionStorage.setItem("dateCreated",dateCreated);
	 $scope.smmesa.firstName = response.applicant.firstName;
	 $scope.smmesa.lastName = response.applicant.lastName;
	 $scope.smmesa.emailId = response.applicant.email;
	 $scope.smmesa.idNumber = response.applicant.idNumber;
	 $scope.smmesa.mobileNumber = response.applicant.phoneMobile;
	 $scope.smmesa.landline = response.applicant.phoneLandline;
	 document.getElementById('place').value = response.applicant.physical_address;
	 $scope.place = response.applicant.physical_address;
	 $scope.province = response.applicant.province;
	 $scope.district = response.applicant.district;
	 $scope.erroraddress = true;
	 //getLocation(response.applicant.physical_address);
	 //DEONV
	 $scope.selbbbeelevels = response.applicant.business.bbbeeLevel;													//DEONV  TO-DO    set from response  
	 var busmanufacturer = response.applicant.business.manufacturer;
	 if(busmanufacturer==null||busmanufacturer == undefined){
		busmanufacturer = 'N';
	 }
	 $scope.selmanufacturers = busmanufacturer;
		
	//DEONV

	 $scope.selbusinesstype = response.applicant.business.businessType;
	 $scope.seleconomicsectors = response.applicant.business.economicSector;
	 $scope.smmesa.companyRegistrationNumber = response.applicant.business.companyName;
	 $scope.smmesa.cipcRegistrationNumber = response.applicant.business.companyRegistrationNumber;
	 $scope.smmesa.tradingName =response.applicant.business.tradingName;
	 $scope.smmesa.incomeTaxNumber = response.applicant.business.incomeTaxNumber;
	 $scope.smmesa.uifReferencNumber =response.applicant.business.uifRegistrationNumber;
	 $scope.registeredVAT =response.applicant.business.registeredVAT;
	 $scope.registeredCSD = response.applicant.business.registeredCSD;
	 $scope.vatnumber = response.applicant.business.vatRegistrationNumber;
	 $scope.csdnumber = response.applicant.business.csdRegistrationNumber;
	 $scope.smmesa.womenOwnedEnterprise = response.applicant.business.womenOwned;
	 $scope.smmesa.youthOwnedEnterprise = response.applicant.business.youthOwned;
	 $scope.smmesa.annualTurnover = Number(response.business.annualTurnover);
	 $scope.smmesa.financialsystem = response.applicant.business.financialSystem;
	 $scope.smmesa.electronicsPayments = response.applicant.business.electronicPayment;
	 $scope.seasonalsales = response.applicant.business.seasonalSales;
	 $scope.salesdescription = response.applicant.business.seasonalSalesDescription;
	 $scope.smmesa.sourceMaterials = response.applicant.business.sourceOfMaterials;
	 $scope.smmesa.product = response.applicant.business.productsSold;
	 $scope.smmesa.services = response.applicant.business.servicesRendered;
	 $scope.nummale = response.applicant.business.numberOfMales;
	 $scope.numfemale = response.applicant.business.numberOfFemales;
	 $scope.numberOfEmployees = response.applicant.business.numberOfEmployees;
	 $scope.numblack = response.applicant.business.numberOfBlackEmployees;
	 $scope.numdisability = response.applicant.business.numberOfDisabledEmployees;
	 $scope.numyouth = response.applicant.business.numberOfYouth;
	 $scope.numberOfCitizen = response.applicant.business.numberOfCitizens;
	 $scope.smmesa.FinancialAssistance = response.financialAssistanceRequired;
	 $scope.FinancialDescription = response.financialAssistanceDescription;
	 $scope.smmesa.nonFinancialAssistance = response.nonFinancialAssistanceRequired;
	 $scope.nonFinancialDescription = response.nonFinancialAssistanceDescription;
	 $scope.smmesa.selproductionaddress = true;

	 var businessid = response.applicant.business.id;


	//DEONV
	 var prdaddresslength = response.applicant.business.productionAddress.length;
	 var prdaddressrecords = response.applicant.business.productionAddress;
	 for(var j=0;j<prdaddresslength;j++)
	 {	  
		 if(prdaddresslength>1 && j>0){
				addAChoice();
		   }
		   var myaddress = prdaddressrecords[j].address;
		   $scope.productionaddresses[j].addressid = myaddress.id;
		   $scope.productionaddresses[j].prdplace = myaddress.addressLine1;
		   $scope.smmesa.selproductionaddress = false;
		}
	 

	var onlineinlength = response.applicant.business.onlineInformation.length;
	var onlineinforecords = response.applicant.business.onlineInformation;
	for(var j=0;j<onlineinlength;j++)
	{	  if(onlineinlength>1 && j>0){
			addOChoice();
		  }
		  $scope.onlineinformations[j].onlineid = onlineinforecords[j].id;
		  $scope.onlineinformations[j].pageaddress = onlineinforecords[j].pageAddress;
	}

	 var shareholdinglength = response.applicant.business.shareholdings.length;
	 var shareholdings = response.applicant.business.shareholdings;
	 //var addChoiceLength = shareholdinglength - 1;

	 
	 for(var j=0;j<shareholdinglength;j++)
	 {
		if(shareholdinglength> 1 && j>0) {
			addChoice();
		}
		   $scope.shareholders[j].shareholderid = shareholdings[j].id;
		   $scope.shareholders[j].shareholding = shareholdings[j].percentage;
		   $scope.shareholders[j].idNumbers = shareholdings[j].idNumber;
		   $scope.shareholders[j].shareholderFirstName = shareholdings[j].firstName;
		   $scope.shareholders[j].shareholderLastName = shareholdings[j].lastName;
		   $scope.shareholders[j].shareholderDisabled = shareholdings[j].disabled;
		   var genderresult = $filter('filter')($scope.genders, {description:shareholdings[j].gender})[0];
		   $scope.shareholders[j].selgenders = genderresult;
		   var raceresult = $filter('filter')($scope.populationgroups, {code:shareholdings[j].race})[0];
		   $scope.shareholders[j].selpopulationgroups = raceresult;
	}

	var productslength = response.applicant.business.products.length;
	var productsrecords = response.applicant.business.products;
	for(var j=0;j<productslength;j++)
	{	  if(productslength>1 && j>0){
			addPChoice();
		}
		$scope.manufproducts[j].productid = productsrecords[j].id;
		$scope.manufproducts[j].productname = productsrecords[j].name;
		$scope.manufproducts[j].capacityvolume = productsrecords[j].capacity;
		$scope.manufproducts[j].subCategory = productsrecords[j].subCategory;

//		$scope.FillProducts(productsrecords[j].subCategory);
//		var prodresult = $filter('filter')($scope.manufacturingproducts, {id:productsrecords[j].manufacturingProduct.id})[0];
		var prodresult = $filter('filter')($scope.manufacturingproducts, {id:productsrecords[j].manufacturingProduct.id})[0];
		$scope.manufproducts[j].selmanufacturingproduct = prodresult;
		var qualityresult = $filter('filter')($scope.qualityapprovers, {id:productsrecords[j].qualityApprover.id})[0];
		$scope.manufproducts[j].selqualityapprover = qualityresult;
		$scope.manufproducts[j].barcoded = productsrecords[j].products_barcoded;
		$scope.manufproducts[j].locallyproduced = productsrecords[j].locally_produced;
	} 

	var marketpartnerlength = response.applicant.business.marketPartner.length;
	var marketinformationrecords = response.applicant.business.marketPartner;
	for(var j=0;j<marketpartnerlength;j++)
	{	 
		if(marketpartnerlength>1 && j>0){
			addCChoice();
		}
		$scope.marketinformations[j].marketidid = marketinformationrecords[j].id;
		$scope.marketinformations[j].company = marketinformationrecords[j].name;
		var marketresult = $filter('filter')($scope.markettypes, {id:marketinformationrecords[j].marketType.id})[0];
		$scope.marketinformations[j].selmarkettype = marketresult;
	} 


	var marketrecords = response.applicant.business.marketInformation;

	for(var j=0;j<1;j++)
	{	 
		$scope.smmesa.marketrecordsid = marketrecords[j].id;
		$scope.smmesa.readyToBeListed = marketrecords[j].readyToBeListed;
		$scope.smmesa.capacityChallenges = marketrecords[j].capacityChallenges;
		$scope.smmesa.productionchallenges = marketrecords[j].productionChallenges;
	} 
	
	//DEONV

	 

}

function newRegistration()
{
  var businessid;

  $scope.process = "Please wait for your reference number. Your application is being processed.";
  var mymanufacturer = $scope.selmanufacturers;
  if(mymanufacturer == null || mymanufacturer == undefined){
	  mymanufacturer = 'N';
  }
  var businessdata =
		{
			"annualTurnover": checkDefined($scope.smmesa.annualTurnover),
			"companyName": $scope.smmesa.companyRegistrationNumber,
			"companyRegistrationNumber": checkDefined($scope.smmesa.cipcRegistrationNumber),
			"registeredCSD": $scope.registeredCSD,
			"csdRegistrationNumber": checkDefined($scope.csdnumber),
			"electronicPayment": $scope.smmesa.electronicsPayments,
			"email": $scope.smmesa.emailId,
			"financialSystem": $scope.smmesa.financialsystem,
			"incomeTaxNumber": checkDefined($scope.smmesa.incomeTaxNumber),
			"numberOfBlackEmployees": $scope.numblack,
			"numberOfCitizens": $scope.numberOfCitizen,
			"numberOfDisabledEmployees": $scope.numdisability,
			"numberOfEmployees": $scope.numberOfEmployees,
			"numberOfFemales": $scope.numfemale,
			"numberOfMales": $scope.nummale,
			"numberOfYouth": $scope.numyouth,
			"phoneMobile": $scope.smmesa.mobileNumber,
			"phoneOffice": checkDefined($scope.smmesa.landline),
			"seasonalSales": $scope.seasonalsales,
			"seasonalSalesDescription": checkDefined($scope.salesdescription),
			"sourceOfMaterials": checkDefined($scope.smmesa.sourceMaterials),
			"productsSold": checkDefined($scope.smmesa.product),
            "servicesRendered": checkDefined($scope.smmesa.services),
			"tradingName": $scope.smmesa.tradingName,
			"uifRegistrationNumber": checkDefined($scope.smmesa.uifReferencNumber),
			"registeredVAT": $scope.registeredVAT,
			"vatRegistrationNumber": checkDefined($scope.vatnumber),
			"womenOwned": $scope.smmesa.womenOwnedEnterprise,
			"youthOwned":$scope.smmesa.youthOwnedEnterprise,
			"address": null,
			"parentBusiness": null,
			"businessType": {
				"id": $scope.selbusinesstype.id
			},
			"economicSector": {
				"id": $scope.seleconomicsectors.id,
			},
			"manufacturer": checkDefined($scope.selmanufacturers),
			"bbbeeLevel": {"id": checkDefined($scope.selbbbeelevels.id)}	
		};
	//Insert into Company/Business
	$http({
		method : "POST",
		headers: {
		'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
		'Content-Type': 'application/json'
		},
		url : `${url_api}businesses`,											
		data: JSON.stringify(businessdata),
	}).then(function mySuccess(response) 
	{
		
		  businessid = response.data;

		  var shareholderlength = $scope.shareholders.length;
		   if(shareholderlength == 0)
		  {

			var shareholderdata =
			{
				"disabled": checkboxDefined($scope.shareholders[0].shareholderDisabled),
				"firstName": $scope.shareholders[0].shareholderFirstName,
                "lastName": $scope.shareholders[0].shareholderLastName,
				"idNumber": $scope.shareholders[0].idNumbers,
				"gender": $scope.shareholders[0].selgenders.description,
				"percentage": $scope.shareholders[0].shareholding,
				"race": $scope.shareholders[0].selpopulationgroups.code,
				"business": {
					"id": businessid
				}
			};
			$http({
				method : "POST",
				headers: {
				'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
				'Content-Type': 'application/json'
				},
				url : `${url_api}shareholdings`,						//DEONV
				data: JSON.stringify(shareholderdata),
			  }).then(function mySuccess(response) {
				}, function myError(response) {
			  }).then(function mySuccess(response) {
				
			}, function myError(response) {
			
			});
		} else
		{
			for(var i=0;i< $scope.shareholders.length; i++)
			{
				var shareholderdata =
				{
					"disabled": checkboxDefined($scope.shareholders[i].shareholderDisabled),
					"firstName": $scope.shareholders[i].shareholderFirstName,
					"lastName": $scope.shareholders[i].shareholderLastName,
					"idNumber": $scope.shareholders[i].idNumbers,
					"gender": $scope.shareholders[i].selgenders.description,
					"percentage": $scope.shareholders[i].shareholding,
					"race": $scope.shareholders[i].selpopulationgroups.code,
					"business": {
						"id": businessid
					}
				};
					$http({
						method : "POST",
						headers: {
						'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
						'Content-Type': 'application/json'
						},
						url : `${url_api}shareholdings`,													//DEONV
						data: JSON.stringify(shareholderdata),
					}).then(function mySuccess(response) {
				
					}, function myError(response) {
					
					});
			} 
		}
	}).then(function mySuccess(response) {

		var onlinelength = $scope.onlineinformations.length;
		for(var i=0;i< onlinelength; i++)
		{
			var onlineaddress = $scope.onlineinformations[i].pageaddress;
			if(onlineaddress!= undefined) {
				var onlinedata =
				{
					"pageAddress": onlineaddress,
					"business": {
						"id": businessid
					}
				};
				$http({
					method : "POST",
					headers: {
					'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
					'Content-Type': 'application/json'
					},
					url : `${url_api}online-information`,											//DEONV
					data: JSON.stringify(onlinedata),
				}).then(function mySuccess(response) {
					
					}, function myError(response) {
				});
			}
		}		
	}).then(function mySuccess(response) {

		var productlength = $scope.manufproducts.length;
		for(var i=0;i< productlength; i++)
		{
			var productdata =
			{
				"name": $scope.manufproducts[i].productname,
				"capacity": $scope.manufproducts[i].capacityvolume,
				"subCategory": $scope.manufproducts[i].subCategory,
				"manufacturingProduct": $scope.manufproducts[i].selmanufacturingproduct,
				"qualityApprover": $scope.manufproducts[i].selqualityapprover,
				"products_barcoded": checkboxDefined($scope.manufproducts[i].barcoded),
				"locally_produced": checkboxDefined($scope.manufproducts[i].locallyproduced),
				"business": {
					"id": businessid
				}
			};
			$http({
				method : "POST",
				headers: {
				'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
				'Content-Type': 'application/json'
				},
				url : `${url_api}products`,											//DEONV
				data: JSON.stringify(productdata),
			}).then(function mySuccess(response) {
				
				}, function myError(response) {
			});
		
		}
	
	}).then(function mySuccess(response) {

		var companylength = $scope.marketinformations.length;
		for(var i=0;i< companylength; i++)
		{
			var companydata =
			{
				"name": $scope.marketinformations[i].company,
				"marketType": $scope.marketinformations[i].selmarkettype,
				"business": {
					"id": businessid
				}
			};
			$http({
				method : "POST",
				headers: {
				'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
				'Content-Type': 'application/json'
				},
				url : `${url_api}market-partners`,											//DEONV
				data: JSON.stringify(companydata),
			}).then(function mySuccess(response) {
				
				}, function myError(response) {
			});
		
		}

	}).then(function mySuccess(response) {

		var prdaddresseslength = $scope.productionaddresses.length;
		var prdaddressrecords = $scope.productionaddresses;
		for(var i=0;i< prdaddresseslength; i++)
		{
			var prdaddressdata =
			{
				"addressLine1": prdaddressrecords[i].prdplace
			};
			$http({
				method : "POST",
				headers: {
				'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
				'Content-Type': 'application/json'
				},
				url : `${url_api}addresses`,											
				data: JSON.stringify(prdaddressdata),
			}).then(function mySuccess(response) {

				var myadressid = response.data;
				var prdaddresslinkdata =
				{
					"address": {"id": myadressid},
					"business": {"id": businessid} 
				};
				$http({
					method : "POST",
					headers: {
					'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
					'Content-Type': 'application/json'
					},
					url : `${url_api}production-addresses`,											
					data: JSON.stringify(prdaddresslinkdata),
				});
			
			});
		}
	}).then(function mySuccess(response) {

		var marketinformationdata =
		{
			"readyToBeListed": $scope.smmesa.readyToBeListed,
			"capacityChallenges": $scope.smmesa.capacityChallenges,
			"productionChallenges": $scope.smmesa.productionchallenges,
			"business": {
				"id": businessid
			}
		};
		$http({
			method : "POST",
			headers: {
			'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
			'Content-Type': 'application/json'
			},
			url : `${url_api}market-information`,											//DEONV
			data: JSON.stringify(marketinformationdata),
		}).then(function mySuccess(response) {
			
			}, function myError(response) {
		});
	

	}).then(function mySuccess(response) {
		var persondata = 
		{
			"disability": null,
			"email": $scope.smmesa.emailId,
			"firstName": $scope.smmesa.firstName,
			"idNumber": $scope.smmesa.idNumber,
			"lastName": $scope.smmesa.lastName,
			"phoneMobile": $scope.smmesa.mobileNumber,
			"phoneLandline": $scope.smmesa.landline,
			"district": $scope.district,
			"province": $scope.province,
			"physical_address": $scope.place,
			"address": null,
			"gender": null,
			"business": {
				"id": businessid
			},
			"populationGroup": null
		};
		$http({
			method : "POST",
			headers: {
			'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
			'Content-Type': 'application/json'
			},
			url : `${url_api}persons`,											//DEONV
			data: JSON.stringify(persondata),
		}).then(function mySuccess(response) 
		{
			var personid = response.data;

			var funddata = 
			{
				"dateCreated": new Date().getTime(),
				"dateModified": new Date().getTime(),
				"nonFinancialAssistanceRequired": $scope.smmesa.nonFinancialAssistance,
				"nonFinancialAssistanceDescription": checkDefined($scope.nonFinancialDescription),
				"financialAssistanceRequired": $scope.smmesa.FinancialAssistance,
				"financialAssistanceDescription": checkDefined($scope.FinancialDescription),
				"fundingApplicationType": {
					"id": 1
				},
				"business": {
					"id": businessid
				},
				"applicant": {
					"id": personid
				}
			};  
			$http({
				method : "POST",
				headers: {
				'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
				'Content-Type': 'application/json'
				},
				url : `${url_api}funding-applications`,								//DEONV
				data: JSON.stringify(funddata),
			}).then(function mySuccess(response) {
			
				$scope.message = "Your registration has been successfully completed.";
				$scope.reference ='Please note your application reference number '+response.data +' and quote it in any correspondence with the Department.';
				Next("#next4");   
			
		}, function myError(response) {
			
				
		});	
	})
					
	}, function myError(response) {
				
					 
	});

}

function updateRegistration(idrecord,referenceno,mybusinessid,personid)
{
  
	var businessid = mybusinessid;
  	$scope.process = "Please wait for your reference number. Your application is being updated.";
 
	  var mymanufacturer = $scope.selmanufacturers;
	  if(mymanufacturer == null || mymanufacturer == undefined){
		  mymanufacturer = 'N';
	  }
	  var businessdata =
			{
				"id": businessid,
				"annualTurnover": checkDefined($scope.smmesa.annualTurnover),
				"companyName": $scope.smmesa.companyRegistrationNumber,
				"companyRegistrationNumber": checkDefined($scope.smmesa.cipcRegistrationNumber),
				"registeredCSD": $scope.registeredCSD,
				"csdRegistrationNumber": checkDefined($scope.csdnumber),
				"electronicPayment": $scope.smmesa.electronicsPayments,
				"email": $scope.smmesa.emailId,
				"financialSystem": $scope.smmesa.financialsystem,
				"incomeTaxNumber": checkDefined($scope.smmesa.incomeTaxNumber),
				"numberOfBlackEmployees": $scope.numblack,
				"numberOfCitizens": $scope.numberOfCitizen,
				"numberOfDisabledEmployees": $scope.numdisability,
				"numberOfEmployees": $scope.numberOfEmployees,
				"numberOfFemales": $scope.numfemale,
				"numberOfMales": $scope.nummale,
				"numberOfYouth": $scope.numyouth,
				"phoneMobile": $scope.smmesa.mobileNumber,
				"phoneOffice": checkDefined($scope.smmesa.landline),
				"seasonalSales": $scope.seasonalsales,
				"seasonalSalesDescription": checkDefined($scope.salesdescription),
				"sourceOfMaterials": checkDefined($scope.smmesa.sourceMaterials),
				"productsSold": checkDefined($scope.smmesa.product),
				"servicesRendered": checkDefined($scope.smmesa.services),
				"tradingName": $scope.smmesa.tradingName,
				"uifRegistrationNumber": checkDefined($scope.smmesa.uifReferencNumber),
				"registeredVAT": $scope.registeredVAT,
				"vatRegistrationNumber": checkDefined($scope.vatnumber),
				"womenOwned": $scope.smmesa.womenOwnedEnterprise,
				"youthOwned":$scope.smmesa.youthOwnedEnterprise,
				"address": null,
				"parentBusiness": null,
				"businessType": {
					"id": $scope.selbusinesstype.id
				},
				"economicSector": {
					"id": $scope.seleconomicsectors.id,
				},
				"manufacturer": checkDefined($scope.selmanufacturers),
				"bbbeeLevel": {"id": checkDefined($scope.selbbbeelevels.id)}	
			};
		//Insert into Company/Business
		$http({
			method : "POST",
			headers: {
			'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
			'Content-Type': 'application/json'
			},
			url : `${url_api}businesses`,											
			data: JSON.stringify(businessdata),
		}).then(function mySuccess(response) 
		{

		    var businessid = response.data;
			var shareholderlength = $scope.shareholders.length;
		
			for(var i=0;i< $scope.shareholders.length; i++)
			{
				var fullname = $scope.shareholders[i].shareholderFirstName + $scope.shareholders[i].shareholderLastName;
				var shareholderdata;
				var shareholderid = $scope.shareholders[i].shareholderid;
	 
				if(shareholderid == undefined) {
					shareholderdata =
					{
						"disabled": $scope.shareholders[i].shareholderDisabled,
						"firstName": $scope.shareholders[i].shareholderFirstName,
						"lastName": $scope.shareholders[i].shareholderLastName,
						"idNumber": $scope.shareholders[i].idNumbers,
						"gender": $scope.shareholders[i].selgenders.description,
						"percentage": $scope.shareholders[i].shareholding,
						"race": $scope.shareholders[i].selpopulationgroups.code,
						"business": {
							"id": businessid
						}
					};
				} else {
					shareholderdata =
					{
						"id":$scope.shareholders[i].shareholderid,
						"disabled": $scope.shareholders[i].shareholderDisabled,
						"firstName": $scope.shareholders[i].shareholderFirstName,
						"lastName": $scope.shareholders[i].shareholderLastName,
						"idNumber": $scope.shareholders[i].idNumbers,
						"gender": $scope.shareholders[i].selgenders.description,
						"percentage": $scope.shareholders[i].shareholding,
						"race": $scope.shareholders[i].selpopulationgroups.code,
						"business": {
							"id": businessid
						}
					};
				}
	
				$http({
					method : "POST",
					headers: {
					'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
					'Content-Type': 'application/json'
				},
				url : `${url_api}shareholdings`,											//DEONV
				data: JSON.stringify(shareholderdata),
				}).then(function mySuccess(response) {
					
				}, function myError(response) {
				
				 
			  });
			}
	
			var onlinelength = $scope.onlineinformations.length;
			for(var i=0;i< onlinelength; i++)
			{
				var onlineaddress = $scope.onlineinformations[i].pageaddress;
	
				if(onlineaddress!= undefined) {
	
					var onlineid =  $scope.onlineinformations[i].onlineid;
					var onlinedata =
						{
							"id": onlineid,
							"pageAddress": onlineaddress,
							"business": {
								"id": businessid
							}
						};
					if(onlineid == undefined) {
						onlinedata =
							{
								"pageAddress": onlineaddress,
								"business": {
									"id": businessid
								}
							};
					}
					$http({
							method : "POST",
							headers: {
							'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
							'Content-Type': 'application/json'
							},
							url : `${url_api}online-information`,											
							data: JSON.stringify(onlinedata),
					}).then(function mySuccess(response) {
							
						}, function myError(response) {
					});
				}
			}		
	
			var productlength = $scope.manufproducts.length;
			for(var i=0;i< productlength; i++)
			{
				var productid =  $scope.manufproducts[i].productid;
				var productdata =
				{
					"id": productid,
					"name": $scope.manufproducts[i].productname,
					"capacity": $scope.manufproducts[i].capacityvolume,
					"subCategory": $scope.manufproducts[i].subCategory,
					"manufacturingProduct": $scope.manufproducts[i].selmanufacturingproduct,
					"qualityApprover": $scope.manufproducts[i].selqualityapprover,
					"products_barcoded": $scope.manufproducts[i].barcoded,
					"locally_produced": $scope.manufproducts[i].locallyproduced,
					"business": {
						"id": businessid
					}
				};
				if(productid == undefined) {
					productdata =
					{
						"name": $scope.manufproducts[i].productname,
						"capacity": $scope.manufproducts[i].capacityvolume,
						"subCategory": $scope.manufproducts[i].subCategory,
						"manufacturingProduct": $scope.manufproducts[i].selmanufacturingproduct,
						"qualityApprover": $scope.manufproducts[i].selqualityapprover,
						"products_barcoded": $scope.manufproducts[i].barcoded,
						"locally_produced": $scope.manufproducts[i].locallyproduced,
						"business": {
							"id": businessid
						}
					};
				}
				$http({
					method : "POST",
					headers: {
					'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
					'Content-Type': 'application/json'
					},
					url : `${url_api}products`,											//DEONV
					data: JSON.stringify(productdata),
				}).then(function mySuccess(response) {
					
					}, function myError(response) {
				});
			
			}
		
			var companylength = $scope.marketinformations.length;
			for(var i=0;i< companylength; i++)
			{
				var companyid =  $scope.marketinformations[i].companyid;
				var companydata =
				{
					"id": companyid,
					"name": $scope.marketinformations[i].company,
					"marketType": $scope.marketinformations[i].selmarkettype,
					"business": {
						"id": businessid
					}
				};
				if(companyid == undefined) {
				   companydata =
					{
						"name": $scope.marketinformations[i].company,
						"marketType": $scope.marketinformations[i].selmarkettype,
						"business": {
							"id": businessid
						}
					};
				}
				$http({
					method : "POST",
					headers: {
					'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
					'Content-Type': 'application/json'
					},
					url : `${url_api}market-partners`,											//DEONV
					data: JSON.stringify(companydata),
				}).then(function mySuccess(response) {
					
					}, function myError(response) {
				});
			
			}
	
			var prdaddresseslength = $scope.productionaddresses.length;
			var prdaddressrecords = $scope.productionaddresses;
			var processfull = false;
			for(var i=0;i< prdaddresseslength; i++)
			{
				var addressid =  $scope.prdaddressrecords[i].addressid;
				var prdaddressdata =
				{
					"id": addressid,
					"addressLine1": prdaddressrecords[i].prdplace
				};
				if(addressid == undefined) {
					prdaddressdata =
					{
						"addressLine1": prdaddressrecords[i].prdplace
					};
					processfull = true;
				}
				$http({
					method : "POST",
					headers: {
					'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
					'Content-Type': 'application/json'
					},
					url : `${url_api}addresses`,											
					data: JSON.stringify(prdaddressdata),
				}).then(function mySuccess(response) {
					if(processfull){
						var myadressid = response.data;
						var prdaddresslinkdata =
						{
							"address": {"id": myadressid},
							"business": {"id": businessid} 
						};
						$http({
							method : "POST",
							headers: {
							'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
							'Content-Type': 'application/json'
							},
							url : `${url_api}production-addresses`,											
							data: JSON.stringify(prdaddresslinkdata),
						});;
	
					}
				});
			}
			

			var mymarketrecordsid = $scope.smmesa.marketrecordsid;
			var marketinformationdata =
			{
				"id": mymarketrecordsid,
				"readyToBeListed": $scope.smmesa.readyToBeListed,
				"capacityChallenges": $scope.smmesa.capacityChallenges,
				"productionChallenges": $scope.smmesa.productionchallenges,
				"business": {
					"id": businessid
				}
			};
			if(mymarketrecordsid == undefined) {
			    marketinformationdata =
				{
					"readyToBeListed": $scope.smmesa.readyToBeListed,
					"capacityChallenges": $scope.smmesa.capacityChallenges,
					"productionChallenges": $scope.smmesa.productionchallenges,
					"business": {
						"id": businessid
					}
				};
				}
		$http({
				method : "POST",
				headers: {
				'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
				'Content-Type': 'application/json'
				},
				url : `${url_api}market-information`,											//DEONV
				data: JSON.stringify(marketinformationdata),
			}).then(function mySuccess(response) {
				
				}, function myError(response) {
			});
		
	
			var persondata = 
			{
				"id": personid,
				"disability": null,
				"email": $scope.smmesa.emailId,
				"firstName": $scope.smmesa.firstName,
				"idNumber": $scope.smmesa.idNumber,
				"lastName": $scope.smmesa.lastName,
				"phoneMobile": $scope.smmesa.mobileNumber,
				"phoneLandline": $scope.smmesa.landline,
				"district": $scope.district,
				"province": $scope.province,
				"physical_address": $scope.place,
				"address": null,
				"gender": null,
				"business": {
					"id": businessid
				},
				"populationGroup": null
			};
			$http({
				method : "POST",
				headers: {
				'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
				'Content-Type': 'application/json'
				},
				url : `${url_api}persons`,											//DEONV
				data: JSON.stringify(persondata),
			}).then(function mySuccess(response) 
			{

				var funddata = 
				{
					"id":idrecord,
					"dateCreated": new Date().getTime(),
					"dateModified": new Date().getTime(),
					"nonFinancialAssistanceRequired": $scope.smmesa.nonFinancialAssistance,
					"nonFinancialAssistanceDescription": checkDefined($scope.nonFinancialDescription),
					"financialAssistanceRequired": $scope.smmesa.FinancialAssistance,
					"financialAssistanceDescription": checkDefined($scope.FinancialDescription),
					"fundingApplicationType": {
						"id": 1
					},
					"business": {
						"id": businessid
					},
					"applicant": {
						"id": personid
					}
				};  
				$http({
					method : "POST",
					headers: {
					'Authorization': 'Basic ' + btoa('COVID:Dsbdsmme_09'),
					'Content-Type': 'application/json'
					},
					url : `${url_api}funding-applications`,								//DEONV
					data: JSON.stringify(funddata),
				}).then(function mySuccess(response) {
				
					$scope.message = "Your registration has been successfully completed.";
					$scope.reference ='Please note your application reference number '+response.data +' and quote it in any correspondence with the Department.';
					Next("#next4");   
				
			}, function myError(response) {
				
					
			});	
		})
						
		}, function myError(response) {
					
						 
	});
	

}



$scope.Exit = function(){
	
	$window.location.href = "index.html";
};
});
})();




