/// <reference path="../_all.ts" />

module auroraApp.Directives {
    export interface IVmListScope {
        name: string
    }

    export function item($compile): ng.IDirective {
        return {
            restrict: "E",
            scope: {
                item: "=",
                key: "="
            },
            template: "<li><strong>{{key}}:</strong> </li>", 
            replace: true,
            link: (scope:any, element:any, attrs:any) => {
                if (angular.isObject(scope.item)) {
                    scope.item = [scope.item]
                }
                if (angular.isArray(scope.item)) {
                    $compile("<collection ng-repeat='child in item track by $index' collection='child'></collection>")(scope, function(cloned, scope, attrs){
                        element.append(cloned);
                        element.addClass('parent');
                    });
                } else {
                    element.append(scope.item)
                }
            }
        }
    }    
 
    export function collection($compile): ng.IDirective {
         return {
            restrict: "E",
            scope: {
                collection: "="
            },
            template: "<ul><item ng-repeat='(key, item) in collection track by key' item='item' key='key'></item></ul>", 
            replace: true,
            link: (scope:any, element:any, attrs:any) => {
                // TODO: Watch changes and update template
                /*
                scope.$watch('collection.status', (val: any, oldVal: any, scope) => {
                    console.log(val, oldVal, scope)
                    if (val != oldVal)
                        oldScope.$apply()
                })*/ 
            }
        }
     }


     export function collapse() {
         return {
            restrict: "E",
            replace: true,
            transclude: true,
            scope: {
                title: "@",
                opened: "@"
            },
            controller: ($scope, $element) => {
                $scope.toggle = () => {
                    $scope.opened = !$scope.opened
                }
                $element.find('header h2').click(() => {
                    if ($scope.opened) {
                        $element.addClass('collapsed')
                    } else {
                        $element.removeClass('collapsed')
                    }
                    
                })
                if ($scope.opened === "false") {
                    $element.addClass('collapsed')
                    $scope.opened = false
                } else if (angular.isUndefined($scope.opened)) {
                    console.log('is undefined');
                    $scope.opened = true
                }
                //container = $(@).parents(".collapsible-jq:first").find(">section").css("height", "auto").slideToggle() 
            },
            template: `
    <div class="collapsible">
        <header ng-click="toggle()">
            <h2><svg class='svg-caret' width="22px" height="13px" class='caret' viewBox="19 25 22 13" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <polyline id="Arrow" stroke="#354052" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" points="21 35.7167956 29.8567242 27 39 36"></polyline>
            </svg>
            {{title}}</h2>
        </header>
        <section ng-transclude ng-class="{opened: opened}">
        </section>
    </div>`
         }
         

     }

     
}


angular.module('auroraApp')
	.directive('collection', auroraApp.Directives.collection)
    .directive('item', auroraApp.Directives.item)
    .directive('collapse', auroraApp.Directives.collapse)