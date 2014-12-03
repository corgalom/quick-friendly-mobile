var app = angular.module('testApp', ['ngRoute']);
app.service('menuSrv', function() {
    //Some pre-loaded data
    var customers = ['George', 'Michael', 'Roger', 'Sasha', 'Bill', 'Indiana Jones'];
    var prods = [{name: 'Wine', price: 13.89}, {name: 'Brandy', price: 16.99}, {name: 'Beer', price: 8.49}, {name: 'Steak', price: 19.99}, {name: 'Chicken Sandwich', price: 12.99}];
    var customer = '';
    
    this.getCustomers = function() {
        return customers;   
    }
    this.getProds = function() {
        return prods;   
    }
    this.setCustomer = function(cust) {
        customer = cust;
    }
    this.getCustomer = function() {
        return customer;   
    }
});


app.controller('mainCtrl', function ($scope, menuSrv, $location) {
    $scope.Customers = menuSrv.getCustomers();
    
    $scope.setCust = function(customer) {
        menuSrv.setCustomer(customer);
        $location.path('/page-2/');
    }
    
});

app.controller('menuCtrl', function ($scope, $location, menuSrv, $http) {
    $scope.customer = menuSrv.getCustomer();
    $scope.prods = menuSrv.getProds();
    $scope.orderLst = [];
    
    $scope.orderProd = function(product){
        
        index = $scope.orderLst.indexOf(product);
        if (index===-1){
            $scope.orderLst.push(product);
        }else $scope.orderLst.splice(index,1);
    }
    
    $scope.getStyle = function(product){
        index = $scope.orderLst.indexOf(product);
        if (index===-1) return ''
        else return 'img-thumbnail'
    }
    
    $scope.getCharge = function() {
        //There's no support of legacy web servers here because of Node.js
        $http({
            url: 'http://YOUR_URL.com', //#TODO MM - just replace this url
            method: "POST",
            data: { 'order' : $scope.orderLst }
        }).success(function(){
        $location.path('/');  
        }).error(function(status, statusText) {
            alert('error '+ status);
    });
    }
});

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/page-2/', {
                title: 'Page 2',
                templateUrl: 'pages/page-2.html',
                controller: 'menuCtrl'
            })
            .when('/', {
                title: 'Page 1',
                templateUrl: 'pages/page-1.html',
                controller: 'mainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
app.run(['$location', '$rootScope', function ($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);
