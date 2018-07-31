var app = angular.module('cardApp',['commonService', 'ngRoute']);
app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when("/", {
			templateUrl : "home.html",
			controller : "cardCtrl"
		})
		.otherwise({
			templateUrl : "home.html"
		});
	$locationProvider.html5Mode(true);
});

app.controller('cardCtrl', ['$scope', 'cardService', '$timeout', function($scope, $cardService, $timeout) {
	$scope.mainHeading = "Save My Card";
	$scope.cardArr = [];
	$scope.card = {
		cardNumber: '',
		cardImage: {
			visa: '',
			mastercard: '',
			amex: '',
		},
		activeImg: ''
	};
	var cardUpdate =  {};
	$scope.booleanObj = {
        showSaveBtn : true,
        showUpdateBtn : false,
        showCancelBtn : false,
        showEditBtn : true,
        showDeleteBtn : true
	};
	
	$scope.showDeletedMsz = false;
	$scope.indexVar = "";

	$scope.month = [ "Jan", "Feb", "March", "April", "May", "June", "July", "August", "Sep", "Oct", "Nov", "Dec"]; // Select array
	$scope.year = [ 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040]; // Select array


	var visa = new RegExp("^4[0-9]{12}(?:[0-9]{3})?$");
	var amex = new RegExp("^3[47][0-9]{13}$");
	var mastercard = new RegExp("^5[1-5][0-9]{14}$");

	$scope.analyze = function(value) {
		//Number spacing
		document.getElementById('cardNumber').addEventListener('input', function (e) {
			e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
		});

		
		if(visa.test(value)) {
			$scope.card.activeImg = 'visa';
			$scope.minlength = 13;
		}

		else if(amex.test(value)) {
			$scope.card.activeImg = 'amex';
			$scope.minlength = 15;
		}

		else if(mastercard.test(value)) {
			$scope.card.activeImg = 'mastercard';
			$scope.minlength = 16;
		}
	};

	$scope.$on('onFinishRender',function(){
    	$('select').formSelect();
	});

    // Save functionality
	$scope.saveFunc = function(){
		var	add = true;
		for(var i = 0; i < $scope.cardArr.length; i++) {
			if($scope.cardArr[i].id  == $scope.card.id) {
				add = false;
			}
		}	
		if(add == true ){
			$scope.cardArr = $cardService.save($scope.cardArr, $scope.card);
			console.log($scope.cardArr);
			document.querySelector("label").classList.remove("active");
			if (typeof(Storage) !== "undefined") {
				localStorage.setItem("cardArr", JSON.stringify($scope.cardArr));
				
			}
			$scope.card = {};
			$scope.minlength = 0;	
		}
    };

	// Delete functionality(On the basis of Modal)
	$scope.showDeleteModal = function(index){
		var elem = document.querySelector('#deleteModal');
		var instance = M.Modal.init(elem);
		instance.open();

		$scope.deleteFunc = function(){
			$scope.cardArr = $cardService.delete($scope.cardArr, index);

			// delete a particular value from object
			if (typeof(Storage) !== "undefined") {
				localStorage.removeItem("cardArr");
				localStorage.setItem("cardArr", JSON.stringify($scope.cardArr));
			}
			$scope.showDeletedMsz = true;
			$timeout(function(){
				$scope.showDeletedMsz = false;
			}, 3000);

			instance.close();
		};
	};

    // Edit functionality
    $scope.onEditFunc = function(card, index) {
		document.querySelector("label").classList.add("active");
        cardUpdate = angular.copy(card);
		$scope.card = cardUpdate;
		$scope.indexVar = index;
        $scope.booleanObj = {
            showSaveBtn : false,
            showUpdateBtn : true,
            showCancelBtn : true,
            showEditBtn : false,
            showDeleteBtn : false
        };
    };

    // Update functionality
    $scope.updateFunc = function(card, index) {
		document.querySelector("label").classList.remove("active");
        $scope.cardArr = $cardService.update($scope.cardArr, card, index);
        console.log(index);
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("cradArr", JSON.stringify($scope.cardArr));
		}
        $scope.card = {};
        $scope.booleanObj = {
            showSaveBtn : true,
            showUpdateBtn : false,
            showCancelBtn : false,
            showEditBtn : true,
            showDeleteBtn : true
        };
    };

    // Cancel functionality
    $scope.onCancelFunc = function() {
		document.querySelector("label").classList.remove("active");
		var elem = document.querySelector('#deleteModal');
		var instance = M.Modal.init(elem);
		instance.close();
        $scope.card = {};
        $scope.booleanObj = {
            showSaveBtn : true,
            showUpdateBtn : false,
            showCancelBtn : false,
            showEditBtn : true,
            showDeleteBtn : true
		};
		$scope.visa = { "display": "none" };
		$scope.amex = { "display": "none" };
		$scope.mastercard = { "display": "none" };
    };

	function init(){
		$scope.cardArr = JSON.parse(localStorage.getItem("cardArr")) || [];
	}
	init();

}]).directive('onFinishRender', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			if (scope.$last === true) {
				$timeout(function () {
					scope.$emit(attr.onFinishRender);
				});
			}
		}
	}
});