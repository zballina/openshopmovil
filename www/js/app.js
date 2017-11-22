angular.module('openshop', ['ionic', 'ngStorage', 'openshop.controllers'])

  .run(['$ionicPlatform', '$rootScope', '$location', '$ionicPopup',
    function ($ionicPlatform, $rootScope, $location, $ionicPopup) {
      $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
        $rootScope.$on('$stateChangeStart', function () {
          // cfpLoadingBar.start();
        });
        $rootScope.$on('$stateChangeSuccess', function () {
          // cfpLoadingBar.complete();
        });
        $rootScope.$on('$stateChangeError', function () {
          // cfpLoadingBar.complete();
        });
        $rootScope.$on('authorized', function (event, message) {
          // $location.url(url);
        });
        $rootScope.$on('mustlogin', function (event, message) {
          $location.url('/login');
          if (message !== undefined) {
            var alertPopup = $ionicPopup.alert({
              title: 'Inicio de sesión',
              template: message
            });
          }
        });
        $rootScope.$on('unauthorized', function (event, message) {
          // appService.showAlert('Sin autorización', message);
          // appService.onCapabilities();
        });
        $rootScope.$on('notfound', function (event, message) {
          // appService.showAlert('Error', message);
        });
        $rootScope.$on('errorserver', function (event, message) {
          // appService.showAlert('Error', message);
        });
        $rootScope.$on('success', function (event, message) {
          // appService.showSimpleToast(message);
        });
      });
    }])

  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider) {
      $urlRouterProvider.otherwise('/app/productos');

      $stateProvider

        .state('login', {
          url: '/login',
          templateUrl: 'templates/login.html',
          controller: 'AppController'
        })
        .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: 'templates/menu.html',
          controller: 'AppController'
        })
        .state('app.search', {
          url: '/search',
          views: {
            'menuContent': {
              templateUrl: 'templates/search.html'
            }
          }
        })
        .state('app.browse', {
          url: '/browse',
          views: {
            'menuContent': {
              templateUrl: 'templates/browse.html'
            }
          }
        })
        .state('app.empresas', {
          url: '/empresas',
          views: {
            'menuContent': {
              templateUrl: 'templates/empresas.html',
              controller: 'EmpresasController'
            }
          }
        })
        .state('app.empresa', {
          url: '/empresas/:id',
          views: {
            'menuContent': {
              templateUrl: 'templates/empresa.html',
              controller: 'EmpresaController'
            }
          }
        })
        .state('app.productos', {
          url: '/productos',
          views: {
            'menuContent': {
              templateUrl: 'templates/productos.html',
              controller: 'ProductosController'
            }
          }
        })

        .state('app.producto', {
          url: '/productos/:id',
          views: {
            'menuContent': {
              templateUrl: 'templates/producto.html',
              controller: 'ProductoController'
            }
          }
        });

      $httpProvider.interceptors.push(['$q', '$localStorage', '$rootScope', function ($q, $localStorage, $rootScope) {
        return {
          request: function (config) {
            if ($localStorage.token) {
              config.headers.Authorization = 'Bearer ' + $localStorage.token;
            }
            return config;
          },
          response: function (response) {
            if ($localStorage.token === undefined && $localStorage.user === undefined) {
              $rootScope.$broadcast('mustlogin', response.data.message);
            } else
              $rootScope.$broadcast('authorized', response.data.message);
            return $q.resolve(response);
          },
          responseError: function (response) {
            switch (response.status) {
              case 200:
                $rootScope.$broadcast('success', response.data.message);
              case 401:
                if ($localStorage.token !== undefined && $localStorage.user !== undefined) {
                  delete $localStorage.token;
                  delete $localStorage.user;
                  $rootScope.$broadcast('mustlogin', response.data.message);
                } else
                  $rootScope.$broadcast('unauthorized', response.data.message);
                break;
              case 403:
                if ($localStorage.token === undefined && $localStorage.user === undefined)
                  $rootScope.$broadcast('mustlogin', response.data.message);
                else
                  $rootScope.$broadcast('unauthorized', response.data.message);
                break;
              case 404:
                $rootScope.$broadcast('notfound', response.data.message);
                break;
              case 500:
                $rootScope.$broadcast('errorserver', response.data.message);
                break;
            }
            return $q.reject(response);
          }
        };
      }]);

    }]);
