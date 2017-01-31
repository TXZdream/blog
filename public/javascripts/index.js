var app = angular.module('blog', ['ngMaterial']);

app.controller('userLogin', userLogin);
app.controller('blogList', blogList);
app.controller('blogContent', blogContent);

function userLogin($scope, $mdDialog) {
    $scope.showLoginDialog = function(ev) {
        $mdDialog.show({
            parent: angular.element(document.body),
            controller: userLogin,
            targetEvent: ev,
            templateUrl: 'html/login.html',
            clickOutsideToClose: true
        });
    }
}

function blogList($scope, $http) {
    // Message for finding.
    $scope.findMessage = "";
    // Article list.
    $scope.list = [];
    // Get list from server.
    $scope.getList = function() {
        $http({
            method: 'GET',
            url: '/showall'
        }).success(function(data, status) {
            console.log(data[0]);
            $scope.list = data;
        }).error(function(data, status) {
            console.log('Error, status: ' + status + '.');
            console.log(data);
        });
    }
    // Change content to show.
    $scope.changeContent = function(item) {
        $scope.$broadcast("changContentInBlogContentController", item);
    }
    $scope.getList();
}

function blogContent($scope) {
    $scope.articleContent = {};
    $scope.$on("changContentInBlogContentController", function(event, data) {
        $scope.articleContent = data;
    });
}