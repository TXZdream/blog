var app = angular.module('blog', ['ngMaterial']);

app.controller('userLogin', userLogin);
app.controller('blogList', blogList);
app.controller('blogContent', blogContent);
app.controller('loginDialogContent', loginDialogContent);
app.controller('detailDialogContent', detailDialogContent);
app.controller('addBlogDialog', addBlogDialog);
app.factory('shareBetweenLoginAndDialog', shareBetweenLoginAndDialog);

function loginDialogContent($scope, $http, $mdDialog, $rootScope, shareBetweenLoginAndDialog) {
    $scope.login = {
        'user': '',
        'passwd': ''
    }
    $scope.reg = {
        'user': '',
        'phone': '',
        'email': '',
        'passwd': '',
        'con_passwd': ''
    }
    $scope.reset = function() {
        $scope.login = {};
        $scope.reg = {};
    }
    $scope.login_upload = function() {
        $http({
            method: 'POST',
            url: '/users/login',
            data: $scope.login
        }).success(function(data, status) {
            if (data == 'Success') {
                // $scope.user = $scope.login.id;
                shareBetweenLoginAndDialog.setUser($scope.login.user);
                $rootScope.$broadcast('updateCurrentUserMessage', '');
                $mdDialog.hide();
                Cookies.set('user', $scope.login.user, {expires: 30, path: 'importext.com'});
            } else {
                shareBetweenLoginAndDialog.clearUser();
                console.log('Login failed.');
            }
        });
    }
    $scope.register_upload = function() {
        $http({
            method: 'POST',
            url: '/users/register',
            data: $scope.reg
        }).success(function(data, status) {
            if (data == 'Success') {
                console.log('Register success.');
                $mdDialog.hide();
            } else {
                console.log('Register failed.');
            }
        })
    }
}

function detailDialogContent($scope, $mdDialog, $rootScope, shareBetweenLoginAndDialog) {
    $scope.user = shareBetweenLoginAndDialog.user;
    $scope.logout = function() {
        shareBetweenLoginAndDialog.clearUser();
        $rootScope.$broadcast('updateCurrentUserMessage', '');
        $mdDialog.hide();
        Cookies.remove('user', {path: 'importext.com'});
    }
}

function userLogin($scope, $mdDialog, shareBetweenLoginAndDialog) {
    $scope.$on('updateCurrentUserMessage', function(event, data) {
        $scope.user = shareBetweenLoginAndDialog.user;
    });
    $scope.showLoginDialog = function(ev) {
        $scope.user = shareBetweenLoginAndDialog.user;
        if (!$scope.user) {
            $mdDialog.show({
                parent: angular.element(document.body),
                controller: loginDialogContent,
                targetEvent: ev,
                templateUrl: 'html/login.html',
                clickOutsideToClose: true
            });
        } else {
            $mdDialog.show({
                parent: angular.element(document.body),
                controller: detailDialogContent,
                targetEvent: ev,
                templateUrl: 'html/detail.html',
                clickOutsideToClose: true
            });
        }
    }
    $scope.checkCookies = function(callback) {
        if (Cookies.get('user')) {
            shareBetweenLoginAndDialog.setUser(Cookies.get('user'));
            callback();
        }
    }
    $scope.checkCookies(function() {
        $scope.user = shareBetweenLoginAndDialog.user;
    });
    $scope.user = shareBetweenLoginAndDialog.user;
}

function addBlogDialog($scope, $mdConstant, $mdDialog, $http, $rootScope, shareBetweenLoginAndDialog) {
    $scope.keys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];
    $scope.blog = {
        tags: [],
        title: "",
        content: "",
        author: shareBetweenLoginAndDialog.user
    }
    $scope.upload = function() {
        $http({
            method: 'POST',
            url: '/insertblog',
            data: $scope.blog
        }).success(function(data, status) {
            if (data == 'Success') {
                console.log('Insert blog success.');
                $mdDialog.hide();
                $rootScope.$broadcast('updateBlogListEvent', '');
            } else {
                console.log('Insert blog failed.');
                console.log(data);
            }
        });
    }
    $scope.hide = function() {
        $mdDialog.hide();
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
    $scope.$on('updateBlogListEvent', function(event, data) {
        $scope.getList();
    });
    $scope.getList();
}

function blogContent($scope, $mdDialog, shareBetweenLoginAndDialog) {
    $scope.articleContent = {};
    $scope.$on("changContentInBlogContentController", function(event, data) {
        $scope.articleContent = data;
    });
    $scope.getAuthor = function() {
        if (!$scope.articleContent.author) {
            return "";
        } else {
            return "作者： " + $scope.articleContent.author;
        }
    }
    $scope.addBlog = function(ev) {
        if (shareBetweenLoginAndDialog.user == "") {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .title('请先登录')
                .textContent('您当前尚未登录，请先点击右上角登录后重试。')
                .ariaLabel('Alert Dialog Demo')
                .ok('确定')
                .targetEvent(ev)
            )
        } else {
            $mdDialog.show({
                parent: angular.element(document.body),
                controller: addBlogDialog,
                targetEvent: ev,
                templateUrl: 'html/article.html',
                clickOutsideToClose: false
            });
        }
    }
    $scope.editBlog = function() {

    }
}

function shareBetweenLoginAndDialog() {
    var messages = {};
    messages.user = "";
    messages.setUser = function(data) {
        messages.user = data;
    }
    messages.clearUser = function() {
        messages.user = "";
    }
    return messages;
}