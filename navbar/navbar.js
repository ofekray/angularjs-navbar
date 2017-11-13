'use strict';

// Register `navigation` service
angular.module('services.navigation', ['ngResource']);
angular.
  module('services.navigation').
  factory('Navigation', ['$resource', '$location',
    function($resource, $location) {

      var Navigation = function() {
        var self = this;

        var resources = $resource('resources/navigation.json', {}, {
          get: {
            method: 'GET'
          }
        });

        self.getNavigation = resources.get;

        self.isActiveNavigationItem = function(item) {
          var currentRoute = "#!" + $location.path();
          if (item.route) {
            return item.route === currentRoute;
          }
          if (item.childs) {
            for(var i = 0; i < item.childs.length; i++) {
              if (self.isActiveNavigationItem(item.childs[i])) {
                return true;
              }
            }            
          }
          return false;
        };

      };
      return new Navigation();
    }
  ]);

// Register `navbar` component, along with its associated controller and template
angular.module('navbar', ['services.navigation', 'navbarItem']);
angular.
  module('navbar').
  component('navbar', {
    templateUrl: 'navbar.template.html',
    controller: ['Navigation', '$timeout',
      function NavbarController(Navigation, $timeout) {
	     var self = this;
		 
		 var setRootElements = function(mainItem) {
			if (mainItem) {
				for (var i = 0; i < mainItem.length; i++) {
					mainItem[i].rootElement = true;
				}
			}
		 };
		 
         Navigation.getNavigation().$promise.then(function(response) {
			self.navigationData = response;
			setRootElements(self.navigationData.right);
			setRootElements(self.navigationData.left);
			$timeout(function(){
				$('[data-submenu]').submenupicker();
			}, 500);
		 });
        self.isActive = Navigation.isActiveNavigationItem;
      }
    ]
  });
  
 // Register `navbarItem` directive, along with its associated controller and template
angular.module('navbarItem', ['services.navigation']);
angular.
  module('navbarItem').
  directive('navbarItem', function () {
    return {
      restrict: 'A',
      bindToController: {
        item: '=navbarItem'
      },
      templateUrl: 'navbar-item.template.html',
      controller: ['Navigation', '$location',
        function NavbarItemController(Navigation, $location) {
          this.isActive = Navigation.isActiveNavigationItem;
        }
      ],
      controllerAs: '$ctrl'
    };
  });
