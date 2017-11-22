angular.module('openshop.controllers', ['ionic'])

  .controller('AppController', ['$scope', '$http', '$localStorage', '$rootScope', '$location', '$ionicPopup',
    function ($scope, $http, $localStorage, $rootScope, $location, $ionicPopup) {
      $scope.autenticar = function (credentials) {
        if (credentials === undefined || credentials.username === undefined || credentials.password === undefined) {
          var alertPopup = $ionicPopup.alert({
            title: 'Inicio de sesión',
            template: 'Debe proporcionar las credenciales para iniciar sesión'
          });
        } else {
          $http({
            method: 'POST',
            url: 'http://api.openshop.com.mx/login/login',
            params: credentials
          }).then(function (response) {
            $localStorage.user = response.data.user;
            $localStorage.token = response.data.token;
            $rootScope.$broadcast('authorized', 'app/productos');
          }).catch(function (err) {
            var alertPopup = $ionicPopup.alert({
              title: 'Inicio de sesión',
              template: err.data.message
            });
          });
        }
      };

      $scope.getMenu = function () {
        var menu = [];
        if ($localStorage.user === undefined && $localStorage.token === undefined) {
          menu.push({
            'title': 'Iniciar sesión',
            'url': '/login',
          });
        } else {
          menu.push({
            'title': 'Empresas',
            'url': '/app/empresas',
          });
          menu.push({
            'title': 'Productos',
            'url': '/app/productos',
          });
          menu.push({
            'title': 'Cerrar sesión',
            'click': true,
            'url': '/exit',
          });
        }
        return menu;
      };

      $scope.onClick = function (item) {
        if (item.click !== undefined && item.click === true && item.url === '/exit') {
          $scope.onExit();
        } else if (item.drop === undefined || item.drop === false) {
          $location.url(item.url);
        }
      };

      $scope.listClick = function (item, ev, index) {
        $scope.onClick(item, ev);
      };

      $scope.onExit = function () {
        delete $localStorage.user;
        delete $localStorage.token;
        $rootScope.$broadcast('mustlogin', '');
      };

      $scope.year = new Date().getFullYear();

      $scope.menu = $scope.getMenu();
    }])

  .controller('EmpresasController', ['$scope', '$http', '$localStorage', '$rootScope', '$ionicPopup',
    function ($scope, $http, $localStorage, $rootScope, $ionicPopup) {
      $scope.cargaEmpresas = function () {
        $http({
          method: 'GET',
          url: 'http://api.openshop.com.mx/empresas',
        }).then(function (response) {
          $scope.empresas = response.data;
        }).catch(function (err) {
          var alertPopup = $ionicPopup.alert({
            title: 'Empresas',
            template: err.data.message
          });
        });
      };

      $scope.init = function () {
        $scope.cargaEmpresas();
      };
    }])
  .controller('EmpresaController', ['$scope', '$http', '$localStorage', '$rootScope', '$ionicPopup', '$stateParams',
    function ($scope, $http, $localStorage, $rootScope, $ionicPopup, $stateParams) {
      $scope.cargaEmpresa = function () {
        $http({
          method: 'GET',
          url: 'http://api.openshop.com.mx/empresas/view?id=' + $stateParams.id,
        }).then(function (response) {
          $scope.empresa = response.data;
        }).catch(function (err) {
          var alertPopup = $ionicPopup.alert({
            title: 'Empresa',
            template: err.data.message
          });
        });
      };

      $scope.init = function () {
        $scope.cargaEmpresa();
      };
    }])
  .controller('ProductosController', ['$scope', '$http', '$localStorage', '$rootScope', '$ionicPopup',
    function ($scope, $http, $localStorage, $rootScope, $ionicPopup) {
      $scope.cargaProductos = function () {
        $http({
          method: 'GET',
          url: 'http://api.openshop.com.mx/productos',
        }).then(function (response) {
          $scope.productos = response.data;
        }).catch(function (err) {
          var alertPopup = $ionicPopup.alert({
            title: 'Productos',
            template: err.data.message
          });
        });
      };

      $scope.init = function () {
        $scope.cargaProductos();
      };
    }])
  .controller('ProductoController', ['$scope', '$http', '$localStorage', '$rootScope', '$ionicPopup', '$stateParams',
    function ($scope, $http, $localStorage, $rootScope, $ionicPopup, $stateParams) {
      $scope.cargaProducto = function () {
        $http({
          method: 'GET',
          url: 'http://api.openshop.com.mx/productos/view?id=' + $stateParams.id,
        }).then(function (response) {
          $scope.producto = response.data;
        }).catch(function (err) {
          var alertPopup = $ionicPopup.alert({
            title: 'Producto',
            template: err.data.message
          });
        });
      };

      $scope.init = function () {
        $scope.cargaProducto();
      };
    }]);
