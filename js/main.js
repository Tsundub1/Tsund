var app = angular.module('myApp', []);


app.controller('registrationController', function($http,$scope,$window) {

 $scope.register = function() {
   $window.localStorage.clear();
	$http({
	method : "POST",
	url : "https://gen-y-tech.com/bursary/insertcredentials.php",
	crossDomain:true,
	data: $scope.newperson,
	}).then(function mySuccess(response) {
        alert(response.data);
		$window.location.href = "dashboard.html";
	});
};

});

app.controller('loginController', function($http,$scope,$window) {

 $scope.login = function() {
   
    $window.localStorage.clear();	
    let logins = {"id":"none","username":$scope.newperson.username,"password":$scope.newperson.password};

	$http({
	method : "POST",
	url : "https://gen-y-tech.com/bursary/getcredentials.php",
	crossDomain:true,
	data: logins,
	}).then(function mySuccess(response) {
        console.log(response);
		  if(response.data.username == undefined)
			{
				alert("This user does not exist.Please provide correct credentials or register.");
			}
			else
			{
				$window.localStorage.setItem("username",response.data.username);
		         let id = $window.localStorage.getItem("id");
                 let email = $window.localStorage.getItem("username");				 
				 $http({
					method : "POST",
					url : "https://gen-y-tech.com/bursary/getperson.php",
					crossDomain:true,
					data: {"email":email,"id":id},
					}).then(function mySuccess(response) {
						
						console.log(response);
						
						 if(response.data == 0)
						 {
							 console.log("Nothing");
							 $window.localStorage.setItem("id","none");
							 $window.location.href = "dashboard.html";
							
						 }
						 else
						 {
							 
							 $window.localStorage.setItem("id",response.data.ID);
							 var student = response.data.Name + " " + response.data.Surname;
                             $window.localStorage.setItem("student",student);							 
							 $window.location.href = "dashboard.html";
						 }
						
					});
				
			}

	});
};

});


app.controller('dashboardController', function($http,$scope,$window) {
let id = $window.localStorage.getItem("id");
let email = $window.localStorage.getItem("username");
let student = $window.localStorage.getItem("student");
$scope.student = student;
console.log(id,email);
});

app.controller('personController', function($http,$scope,$window) {

   let id = $window.localStorage.getItem("id");
   let email = $window.localStorage.getItem("username");
   console.log(id,email);

 $http({
	method : "POST",
	url : "https://gen-y-tech.com/bursary/getperson.php",
	crossDomain:true,
	data: {"email":email,"id":id},
	}).then(function mySuccess(response) {
		
		
		 if(response.data == 0)
		 {
			 console.log("Nothing");
			 $scope.newpersonemail = email;
		 }
		 else
		 {
			 $scope.newpersonname = response.data.Name;
			 $scope.newpersonsurname = response.data.Surname;
			 $scope.newpersonID =response.data.ID;
			 $window.localStorage.setItem("id",response.data.ID);
			 $scope.newpersontitle = response.data.Title;
			 $scope.newpersongender = response.data.Gender;
			 $scope.newpersonmarital = response.data.MaritalStatus;
			 $scope.newpersonemail = response.data.Email;
			 $scope.newpersoncell = response.data.Cell;
			 $scope.newpersonaddress = response.data.Address;  
		 }
		
	});
  
  let accholder = $scope.accHolder;
  let accNo = $scope.accNo;
  let bankname = $scope.bankName;
  
  
  let bank = {"id":id};
  
 
  $http({
	method : "POST",
	url : "https://gen-y-tech.com/bursary/getbank.php",
	crossDomain:true,
	data: bank,
	}).then(function mySuccess(response) {
		 if(response.data == 0)
		 {
			 console.log("Nothing");
			
		 }
		 else
		 {
			$scope.accHolder = response.data.AccountHolder;
			$scope.accNo = response.data.AccountNumber;
			$scope.accType = response.data.AccountType;
			$scope.bankName = response.data.BankName;
			$scope.branchCode = response.data.BranchCode;
		 }
	});
	
	$http({
	method : "POST",
	url : "https://gen-y-tech.com/bursary/geteducation.php",
	crossDomain:true,
	data: {"id":id},
	}).then(function mySuccess(response) {
		 if(response.data == 0)
		 {
			 console.log("Nothing");
			
		 }
		 else
		 {
			 console.log(response.data[0].EducationID,response.data.length);
			 if(response.data.length == 1)
			 {
				 $window.localStorage.setItem("schooledid",response.data[0].EducationID);
				 $window.localStorage.setItem("qualifyedid",'none');
				 $scope.qualification = response.data[0].Qualification;
			     $scope.schoolname = response.data[0].Institute;
			     $scope.yearschool = response.data[0].YearCompleted;
				 console.log("1");
				 
			
			 }
			 else
			 {
				 console.log("2");
				 $window.localStorage.setItem("schooledid",response.data[0].EducationID);
				
				 $scope.qualification = response.data[0].Qualification;
			     $scope.schoolname = response.data[0].Institute;
			     $scope.yearschool = response.data[0].YearCompleted;
				 $scope.howmanyqualification = response.data.length-1;
				 for(var i=1;i< response.data.length-1;i++)
				 {
					 addEd();
					 //$window.localStorage.setItem("qualifyedid",response.data[i].EducationID);
					 console.log(response.data[i].EducationID);
				
				 }
				 for(var i=0;i< response.data.length-1;i++)
				 {
					 
					 var j = i+1;
					 $scope.educations[i].institute = response.data[j].Institute;
				     $scope.educations[i].qualify = response.data[j].Qualification;
				     $scope.educations[i].year = response.data[j].YearCompleted;
					 console.log(response.data[j].EducationID);
					 $window.localStorage.setItem("qualifyedid",response.data[j].EducationID);
				 }
				 
			 }

		 }
		
	});
$scope.educations = [{id: 'choice1'}];
$scope.addEducation = function() {
   console.log("Education",$scope.howmanyqualification);
   if($scope.howmanyqualification != null)
   {
	 
	   console.log("ADD");
	   $window.localStorage.setItem("howmany",$scope.howmanyqualification);
	    for(var i=0;i<$scope.howmanyqualification - 1;i++)
	   {
			  addEd(); 
	   }
   }
   else if($scope.howmanyqualification == null)
   {
	       let howmany = $window.localStorage.getItem("howmany");
		   console.log("REMOVE",howmany);
	       for(var i=0;i<howmany - 1;i++)
		   {
				  removeEd(); 
		   }
   }
 
  
   
};
function addEd()
{
var add = $scope.howmanyqualification;
var newItemNo = $scope.educations.length + 1;

$scope.educations.push({'id':'choice'+newItemNo});

console.log( $scope.educations,add);

}
function removeEd()
{
	  if($scope.educations.length != 1)
	  {
		  var lastItem = $scope.educations.length-1;
		  $scope.educations.splice(lastItem);
	  }
}
 $scope.savePerson = function(isValid) {
    alert(isValid);
   	if(isValid)
	{
		alert("Valid");
		let person = {
		          "name": $scope.newpersonname,
				  "surname":$scope.newpersonsurname,
				  "personID":$scope.newpersonID,
				  "title":$scope.newpersontitle,
				  "gender":$scope.newpersongender,
				  "maritalstatus":$scope.newpersonmarital,
				  "email":$scope.newpersonemail
				 };
	$http({
	method : "POST",
	url : "https://gen-y-tech.com/bursary/updateperson.php",
	crossDomain:true,
	data: person,
	}).then(function mySuccess(response) {
        alert(response.data);
           $window.localStorage.setItem("id",$scope.newpersonID);
	});
	}
	else
	{
	 $scope.savesubmitted = true;
		alert("Not Valid");
	}   
    
};

$scope.saveContact = function(isValid) {
	
	alert(isValid);
   	if(isValid)
	{
		alert("Valid");
		if($scope.newpersonID == "")
   {
	   alert("Please fill in Personal details before saving contact details.");
   }
   else
   {
	    let contact = {
		"id":$scope.newpersonID,
		"email":$scope.newpersonemail,
		"cell":$scope.newpersoncell,
		"address":$scope.newpersonaddress
		};
		$http({
		method : "POST",
		url : "https://gen-y-tech.com/bursary/updatecontact.php",
		crossDomain:true,
		data: contact,
		}).then(function mySuccess(response) {
			alert(response.data);
		});  
   }
	}
	else
	{
	 $scope.savesubmitted = true;
		alert("Not Valid");
	}   
  
   
 
};

 $scope.saveEducation = function(isValid) {
  alert(isValid);
   	if(isValid)
	{
		alert("Valid");
		 if($scope.newpersonID == "")
   {
	   alert("Please fill in Personal details before saving academic details.");
   }
   else
   {
	 let schooledid = $window.localStorage.getItem("schooledid");
     let qualifyedid = $window.localStorage.getItem("qualifyedid");
     let schooleducation = {
		"personid":$scope.newpersonID,
		"educationid":schooledid,
		"qualification":$scope.qualification,
        "institute":$scope.schoolname,
		"year":$scope.yearschool};
		$http({
		method : "POST",
		url : "https://gen-y-tech.com/bursary/updateeducation.php",
		crossDomain:true,
		data: schooleducation,
		}).then(function mySuccess(response) {
			//alert(response.data);
			console.log("Qualify",qualifyedid);
				if($scope.howmanyqualification == 1)
				{
				
				   let academic = 
				   {
					"personid":$scope.newpersonID,
					"educationid":qualifyedid,
					"qualification":$scope.educations[0].qualify,
					"institute":$scope.educations[0].institute,
					"year":$scope.educations[0].year
					};
					$http({
					method : "POST",
					url : "https://gen-y-tech.com/bursary/updateeducation.php",
					crossDomain:true,
					data: academic,
					}).then(function mySuccess(response) {
						alert(response.data);
					});
				}
				else
				{
				}
		});  
   }
	}
	else
	{
	 $scope.savesubmitted = true;
		alert("Not Valid");
	}   
  
 };	


$scope.saveBank = function(isValid) {
	alert(isValid);
   	if(isValid)
	{
		alert("Valid");
		 if($scope.newpersonID == "")
   {
	   alert("Please fill in Personal details before saving bank details.");
   }
   else
   {
	   let bank = {
		"personid":$scope.newpersonID,
		"accHolder":$scope.accHolder,
		"accNo":$scope.accNo,
		"accType":$scope.accType,
		"bankName":$scope.bankName,
		"branchCode":$scope.branchCode
		 
	 };
		$http({
		method : "POST",
		url : "https://gen-y-tech.com/bursary/updatebank.php",
		crossDomain:true,
		data: bank,
		}).then(function mySuccess(response) {
		  alert(response.data);
		  console.log(response);
		}); 
   }
	}
	else
	{
	 $scope.savesubmitted = true;
		alert("Not Valid");
	}   


};

});

app.controller('appController', function($http,$scope,$window) {


let id = $window.localStorage.getItem("id");
console.log(id);
let bursary ={"id":id,"selecttype":"table","bursaryacc":"null"};


$http({
method : "POST",
url : "https://gen-y-tech.com/bursary/getbursary.php",
crossDomain:true,
data: bursary,
}).then(function mySuccess(response) {
	 $scope.bursary = response.data.records;
	 console.log(response);
	
});	

$scope.updateapplication = function(xbursaryacc) {
    
	console.log(xbursaryacc);
	$window.localStorage.setItem("bursaryacc",xbursaryacc);
	$window.location.href = "applyapplication.html";
	
	 
};

$scope.viewapplication = function(xbursaryacc) {
    console.log(xbursaryacc);
	$window.localStorage.setItem("bursaryacc",xbursaryacc);
	$window.location.href = "bursarystatus.html";
};
$scope.newapplication = function() {
    $window.localStorage.setItem("bursaryacc","null");
	$window.location.href = "applyapplication.html";
	
};

});

app.controller('applicationController', function($http,$scope,$window) {

let id = $window.localStorage.getItem("id");
let bursaryacc = $window.localStorage.getItem("bursaryacc");
console.log(id,bursaryacc); 

 $http({
	method : "POST",
	url : "https://gen-y-tech.com/bursary/getbursary.php",
	crossDomain:true,
	data: {"bursaryacc":bursaryacc,"id":id,"selecttype":"form"},
	}).then(function mySuccess(response) {
		
		 $scope.typeofqualification = response.data.TypeOfQualification;
		 $scope.academicyear = response.data.AcademicYear;
         $scope.duration = response.data.Duration;
         $scope.institution =response.data.Institution;
		 $scope.academicyear = response.data.AcademicYear;
		 $scope.startdate = response.data.StartDateQualification;
		 $scope.totalfunds = response.data.AmountTotalBursary;
		 console.log(response);
	});	

$scope.totalfunds = 0;  
$scope.sumTotal = function() {  
// alert("Change");
 $scope.totalfunds = ($scope.fundsinstitute * 1) + ($scope.fundsbooks * 1) + ($scope.fundstransport* 1) +($scope.fundsother * 1);  
}	
$scope.saveDocument = function(isValid) {
    alert(isValid);
   	if(isValid)
	{
		alert("Valid");
	}
	else
	{
	 $scope.savesubmitted = true;
		alert("Not Valid");
	}   
    
};
$scope.saveApplication = function(isValid) {
    alert(isValid);
   	if(isValid)
	{
		alert("Valid");
	}
	else
	{
	 $scope.savesubmitted = true;
		alert("Not Valid");
	}   
    
};

$scope.applies = function() {

	
	  var fd = new FormData();
	  var idfiles = document.getElementById('idfile').files[0];
	  var matricfiles = document.getElementById('matricfile').files[0];
	  var addressfiles = document.getElementById('addressfile').files[0];
	  var employmentfiles = document.getElementById('employmentfile').files[0];
	  var qualificationfiles = document.getElementById('qualificationfile').files[0];
	  fd.append('idfiles',idfiles);
	  fd.append('matricfiles',matricfiles);
	  fd.append('addressfiles',addressfiles);
	  fd.append('employmentfiles',employmentfiles);
	  fd.append('qualificationfiles',qualificationfiles);
	  fd.append('typeofqualification', $scope.typeofqualification);
	  fd.append('duration', $scope.duration);
	  fd.append('academicyear', $scope.academicyear);
	  fd.append('bursaryacc', bursaryacc);
	  fd.append('institution',$scope.institution);
	  fd.append('startdate', $scope.startdate);
	  fd.append('amount', $scope.totalfunds);
	  fd.append('status', "Submitted");
      fd.append('personid', id);
	  fd.append('reason', '');
	  fd.append('instituteamt', $scope.fundsinstitute);
	  fd.append('bookamt', $scope.fundsbooks);
	  fd.append('transportamt', $scope.fundstransport);
	  fd.append('otheramt', $scope.fundsother);
	  
	  $http({
	   method: 'POST',
	   url: 'https://gen-y-tech.com/bursary/updatebursary.php',
	   data: fd,
	   headers: {'Content-Type': undefined},
	   crossDomain:true,
	  }).then(function mySuccess(response) { 
		// Store response data
		   alert(response.data);
	  });
	
	
};
});



app.controller('bursarystatusController', function($http,$scope,$window) {

let id = $window.localStorage.getItem("id");
let bursaryacc = $window.localStorage.getItem("bursaryacc");
console.log(id,bursaryacc); 

let bursary ={"bursaryacc":bursaryacc,"id":id,"selecttype":"other"};
   
	$http({
	method : "POST",
	url : "https://gen-y-tech.com/bursary/getbursary.php",
	crossDomain:true,
	data: bursary,
	}).then(function mySuccess(response) {
         $scope.typeofqualification = response.data.TypeOfQualification;
		 $scope.academicyear = response.data.AcademicYear;
         $scope.duration = response.data.Duration;
         $scope.institution =response.data.Institution;
		 $scope.academicyear = response.data.AcademicYear;
		 $scope.startdate = response.data.StartDateQualification;
		 $scope.totalfunds = response.data.AmountTotalBursary;
		 $scope.statuses = response.data.Status;
		 $scope.reason = response.data.Reason;
		 let fundno = response.data.FundNo;
		 let fund ={"fundno":fundno,"selecttype":"other","transno":"none"};
		   
			$http({
			method : "POST",
			url : "https://gen-y-tech.com/bursary/getfundhistory.php",
			crossDomain:true,
			data: fund,
			}).then(function mySuccess(responses) {
				console.log(responses.data.records);
				var length = responses.data.records.length;
				
				var institute = responses.data.records.find(item => {
					   return item.Category == 'Institute'
					})
					if(institute != undefined)
					{
						$scope.institute = institute.AmountRequested;
					}
					else
					{
						$scope.institute = 0;
					}
					
			   	var book = responses.data.records.find(item => {
					   return item.Category == 'Book'
					})
					
				if(book != undefined)
				{
					$scope.books = book.AmountRequested;
				}
				else
				{
					$scope.books = 0;
				}
				
			   	var transport = responses.data.records.find(item => {
					   return item.Category == 'Transport'
					})
					
				if(transport != undefined)
				{
					$scope.transport = f
				}
				else
				{
					$scope.transport = 0;
				}
					
				var other = responses.data.records.find(item => {
					   return item.Category == 'Other'
					})
					
				if(other != undefined)
				{
					$scope.other = other.AmountRequested;
				}
				else
				{
					$scope.other = 0;
				}

				
				
			});
		 console.log(response);
		
	});
	
   $http({
	method : "POST",
	url : " https://gen-y-tech.com/bursary/getdocument.php",
	crossDomain:true,
	data: {"bursaryacc":bursaryacc,"id":id,"academicid":"none","transno":"none","selecttype":"contract"},
	}).then(function mySuccess(response) {
		
		 console.log(response,response.data.length);
		
		 $scope.contract = response.data.FileName;
		 $scope.contractfile = 'https://gen-y-tech.com/bursary/'+ response.data.File;
		 
	});	
   $scope.contractsign = function() {
     alert("Update document");
  };

});


app.controller('academiclogController', function($http,$scope,$window) {

let id = $window.localStorage.getItem("id");
let bursaryacc = $window.localStorage.getItem("bursaryacc");
let academicID = $window.localStorage.getItem("academicID");
console.log(id,bursaryacc,academicID); 

let academic ={"bursaryacc":bursaryacc,"selecttype":"table","academicID":"0","id":id};
   
	$http({
	method : "POST",
	url : "https://gen-y-tech.com/bursary/getacademic.php",
	crossDomain:true,
	data: academic,
	}).then(function mySuccess(response) {
        $scope.academics = response.data.records;
		console.log(response,response.data.records);
		
	});
$scope.updateacademic = function(xbursaryacc,academicID) {
    
	$window.localStorage.setItem("bursaryacc",xbursaryacc);
	$window.localStorage.setItem("academicID",academicID);
	console.log(academicID);
	$window.location.href = "addacademiclog.html";
};

$scope.viewacademic = function(xbursaryacc,academicID) {
	
    $window.localStorage.setItem("bursaryacc",xbursaryacc);
	$window.localStorage.setItem("academicID",academicID);
	console.log(academicID);
	$window.location.href = "academiclogview.html";
};
$scope.newacademic = function() {
	
    $window.localStorage.setItem("bursaryacc",bursaryacc);
	$window.localStorage.setItem("academicID","none");
	$window.location.href = "addacademiclog.html"; 
};
});


app.controller('addacademicController', function($http,$scope,$window) {

let id = $window.localStorage.getItem("id");
let bursaryacc = $window.localStorage.getItem("bursaryacc");
let academicID = $window.localStorage.getItem("academicID");
console.log(id,bursaryacc,academicID); 
let bursary ={"id":id,"selecttype":"table","bursaryacc":"null"};
$http({
method : "POST",
url : "https://gen-y-tech.com/bursary/getbursary.php",
crossDomain:true,
data: bursary,
}).then(function mySuccess(response) {
	$scope.bursaryaccs = response.data.records;
	$scope.bursaryacc = response.data.records[0];
	$scope.academicyear = response.data.records[0].AcademicYear;

});	

$scope.updateacademic = function() {
	
    console.log("Change");
	$scope.academicyear = $scope.bursaryacc.AcademicYear;

};


let academic ={"bursaryacc":bursaryacc,"selecttype":"form","academicID":academicID,"id":id};
   
	$http({
	method : "POST",
	url : "https://gen-y-tech.com/bursary/getacademic.php",
	crossDomain:true,
	data: academic,
	}).then(function mySuccess(response) {
		
		 console.log(response);
         $scope.academicyear = response.data.AcademicYear;
		 $scope.academicdescription = response.data.Description;
       
		
	});
 $scope.addAcademics = function() {
	 
  var fd = new FormData();
  var files = document.getElementById('file').files[0];
  fd.append('file',files);
  fd.append('academicID', academicID);
  fd.append('academicdesc', $scope.academicdescription);
  fd.append('academicyear', $scope.academicyear);
  fd.append('bursaryacc', bursaryacc);
  fd.append('comment', '');
  fd.append('progress', '');
 
	  $http({
	   method: 'POST',
	   url: 'https://gen-y-tech.com/bursary/updateacademic.php',
	   data: fd,
	   cache: true,
	   headers: {'Content-Type': undefined},
	   crossDomain:true,
	  }).then(function mySuccess(response) { 
		// Store response data
		   alert(response.data);
	  });

};

});


app.controller('academiclogviewController', function($http,$scope,$window) {

let id = $window.localStorage.getItem("id");
let bursaryacc = $window.localStorage.getItem("bursaryacc");
let academicID = $window.localStorage.getItem("academicID");
console.log(id,bursaryacc); 

let academic ={"bursaryacc":bursaryacc,"academicID":academicID,"selecttype":"other","id":id};
   
	$http({
	method : "POST",
	url : "https://gen-y-tech.com/bursary/getacademic.php",
	crossDomain:true,
	data: academic,
	}).then(function mySuccess(response) {
		console.log(response);
         $scope.academicyear = response.data.AcademicYear;
		 $scope.academicdescription = response.data.Description;
		 $scope.date = response.data.Date;
		 $scope.progress = response.data.Progress;
		 $scope.comment = response.data.Comment;
		 $scope.filename = response.data.FileName;
		
	});

});

app.controller('fundswalletController', function($http,$scope,$window) {

let id = $window.localStorage.getItem("id");
let bursaryacc = $window.localStorage.getItem("bursaryacc");
console.log(id,bursaryacc); 

let fund ={"bursaryacc":bursaryacc,"id":id,"selecttype":"table","fundno":"no"};
   
	$http({
	method : "POST",
	url : "https://gen-y-tech.com/bursary/getfunds.php",
	crossDomain:true,
	data: fund,
	}).then(function mySuccess(response) {
        $scope.funds = response.data.records;
		console.log(response,response.data.records);
		
	});
$scope.updatefunds = function(xbursaryacc,xfundno) {
 
    $window.localStorage.setItem("bursaryacc",xbursaryacc);
	$window.localStorage.setItem("fundno",xfundno);
	$window.location.href = "fundsrequest.html";
};

$scope.viewfunds = function(xbursaryacc,xfundno) {
	
    $window.localStorage.setItem("bursaryacc",xbursaryacc);
	$window.localStorage.setItem("fundno",xfundno);
	$window.location.href = "fundshistory.html";

};
$scope.newfunds = function(xbursaryacc,xfundno) {
    $window.localStorage.setItem("bursaryacc",xbursaryacc);
	$window.localStorage.setItem("fundno",xfundno);
	$window.location.href = "fundsrequest.html";
};

$scope.transhistory = function(xfundno) {
	$window.localStorage.setItem("fundno",xfundno);
	$window.location.href = "fundshistory.html";
};
});




app.controller('addfundController', function($http,$scope,$window) {

let id = $window.localStorage.getItem("id");
let bursaryacc = $window.localStorage.getItem("bursaryacc");
let fundno = $window.localStorage.getItem("fundno");
console.log(id,bursaryacc,fundno); 



$scope.addFund = function() {
 
 console.log(fundno);
  var fd = new FormData();
  var files = document.getElementById('file').files[0];
  fd.append('file',files);
  fd.append('fundno', fundno);
  fd.append('amtrequest', $scope.amtrequest);
  fd.append('fundcat', $scope.fundcat);
  fd.append('transno', '');
  fd.append('reason', $scope.reason);
  fd.append('id', id);
  fd.append('status', "Requested");

  
  
  $http({
   method: 'POST',
   url: 'https://gen-y-tech.com/bursary/updatefundhistory.php',
   data: fd,
   cache: true,
   headers: {'Content-Type': undefined},
   crossDomain:true,
  }).then(function mySuccess(response) { 
	// Store response data
	   alert(response.data);
	   calculate(bursaryacc,id,$scope.amtrequest);
  });
};

function calculate(bursaryacc,id,amtrequest)
{
	
	let funds ={"bursaryacc":bursaryacc,"selecttype":"new","id":id,"fundno":fundno};
   
	$http({
	method : "POST",
	url : "https://gen-y-tech.com/bursary/getfunds.php",
	crossDomain:true,
	data: funds,
	}).then(function mySuccess(response) {
		 console.log(response);
		 
		 let availableamt = response.data.AvailableAmount;
		 let amtpending = response.data.AmountPending + $scope.amtrequest;
		 let utilisedamt = response.data.UtilisedAmount;
		 let ufunds ={"bursaryacc":bursaryacc,"utilisedamt":utilisedamt,"availableamt":availableamt,"amtpending":amtpending,"fundno":response.data.FundNo};
		 console.log(ufunds);
		  
		
         $http({
			method : "POST",
			url : "https://gen-y-tech.com/bursary/updatefund.php",
			crossDomain:true,
			data: ufunds,
			}).then(function mySuccess(responses) {
				 console.log(responses);
				 
			});	
	});	
}

});

app.controller('fundhistoryController', function($http,$scope,$window) {
	
let fundno = $window.localStorage.getItem("fundno");
let fund ={"fundno":fundno,"selecttype":"table","transno":"none"};
   
	$http({
	method : "POST",
	url : "https://gen-y-tech.com/bursary/getfundhistory.php",
	crossDomain:true,
	data: fund,
	}).then(function mySuccess(response) {
        $scope.funds = response.data.records;
		console.log(response,response.data.records);
		
	});
});