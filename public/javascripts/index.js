var app = angular.module('blog', ['ngMaterial', 'textAngular']);

app.controller('userLogin', userLogin);
app.controller('blogList', blogList);
app.controller('blogContent', blogContent);
app.controller('loginDialogContent', loginDialogContent);
app.controller('detailDialogContent', detailDialogContent);
app.controller('addBlogDialog', addBlogDialog);
app.factory('shareBetweenLoginAndDialog', shareBetweenLoginAndDialog);
app.factory('shareBetweenEditAndContent', shareBetweenEditAndContent);

function loginDialogContent($scope, $http, $mdDialog, $rootScope, shareBetweenLoginAndDialog) {
    // Form validation.
    $scope.errorMessage = {
        login: "",
        reg: ""
    };
    $scope.checkAll = function() {
        if ($scope.checkUser() && $scope.checkPhone() && $scope.checkEmail() && $scope.checkPasswd() && $scope.checkCpasswd()) {
            return true;
        } else {
            return false;
        }
    }
    $scope.checkUser = function() {
        /*
        * 1. 长度限制在3到15之间
        * 2. 未被注册
        */
        if ($scope.reg.user.length < 3 || $scope.reg.user.length > 15) {
            $scope.errorMessage.reg = "用户名长度应在3到15之间";
            return false;
        } else {
            $scope.errorMessage.reg = "";
            return true;
        }
    }
    $scope.checkPhone = function() {
        /*
        * 1. 全是数字
        * 2. 长度为11位
        */
        var reg = /[^0-9]/;
        if ($scope.reg.phone.length == 11 && !reg.test($scope.reg.phone.length)) {
            $scope.errorMessage.reg = "";
            return true;
        } else {
            $scope.errorMessage.reg = "请输入正确的号码";
            return false;
        }
    }
    $scope.checkEmail = function() {
        /*
        * 1. 含有@
        * 2. .在@之后
        * 3. 含有.
        */
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if (reg.test($scope.reg.email)) {
            $scope.errorMessage.reg = "";
            return true;
        } else {
            $scope.errorMessage.reg = "请注意邮箱格式";
            return false;
        }
    }
    $scope.checkPasswd = function() {
        /*
        * 1. 长度在8-16之间
        */
        if ($scope.reg.passwd.length >= 8 && $scope.reg.passwd.length <= 16) {
            $scope.errorMessage.reg = "";
            return true;
        } else {
            $scope.errorMessage.reg = "密码长度应在8-16位之间";
            return false;
        }
    }
    $scope.checkCpasswd = function() {
        /*
        * 1. 和密码一致
        */
        if ($scope.reg.passwd == $scope.reg.con_passwd) {
            $scope.errorMessage.reg = "";
            return true;
        } else {
            $scope.errorMessage.reg = "再次输入和密码应一致";
            return false;
        }
    }
    // Input messages.
    $scope.isKeep = true;
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
    // Button event.
    $scope.reset = function() {
        $scope.login = {};
        $scope.reg = {};
        $scope.errorMessage = {};
    }
    $scope.login_upload = function() {
        $http({
            method: 'POST',
            url: '/users/login',
            data: $scope.login
        }).success(function(data, status) {
            if (data == 'Success') {
                shareBetweenLoginAndDialog.setUser($scope.login.user);
                shareBetweenLoginAndDialog.getData($scope.login.passwd, function() {
                    $rootScope.$broadcast('updateCurrentUserMessage', '');
                    if ($scope.isKeep) {
                        Cookies.set('user', shareBetweenLoginAndDialog.data, {expires: 30, path: 'importext.com'});
                    }
                    $mdDialog.hide();
                });
            } else {
                Cookies.remove('user', {path: 'importext.com'});
                shareBetweenLoginAndDialog.clearUser();
                $scope.errorMessage.login = "当前用户名和密码的组合有误，请查证后重新输入。";
                // console.log('Login failed.');
            }
        });
    }
    $scope.register_upload = function() {
        if ($scope.checkAll()) {
            $http({
                method: 'POST',
                url: '/users/register',
                data: $scope.reg
            }).success(function(data, status) {
                if (data == 'Success') {
                    // console.log('Register success.');
                    $mdDialog.hide();
                } else if (data == 'Used') {
                    // console.log('Username existed');
                    $scope.errorMessage.reg = "该用户名已被使用";
                } else {
                    // console.log('Register failed.');
                    $scope.errorMessage.reg = "注册失败，请稍后重试";
                }
            });
        }
    }
}

function detailDialogContent($scope, $mdDialog, $rootScope, shareBetweenLoginAndDialog) {
    $scope.user = shareBetweenLoginAndDialog.data;
    $scope.logout = function() {
        shareBetweenLoginAndDialog.clearUser();
        shareBetweenLoginAndDialog.data = {};
        $rootScope.$broadcast('updateCurrentUserMessage', '');
        $mdDialog.hide();
        Cookies.remove('user', {path: 'importext.com'});
    }
    // Edit personal message.
    $scope.editData = function() {

    }
}

function userLogin($scope, $mdDialog, shareBetweenLoginAndDialog) {
    $scope.$on('updateCurrentUserMessage', function(event, data) {
        $scope.user = shareBetweenLoginAndDialog.data.name;
    });
    $scope.showLoginDialog = function(ev) {
        $scope.user = shareBetweenLoginAndDialog.data.name;
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
        if (Cookies.getJSON('user')) {
            shareBetweenLoginAndDialog.data = Cookies.getJSON('user');
            callback();
        }
    }
    $scope.checkCookies(function() {
        $scope.user = shareBetweenLoginAndDialog.data.name;
    });
    $scope.user = shareBetweenLoginAndDialog.data.name;
}

function addBlogDialog($scope, $mdConstant, $mdDialog, $http, $rootScope, shareBetweenLoginAndDialog, shareBetweenEditAndContent) {
    $scope.keys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];
    $scope.errorMessage = '';
    $scope.blog = {
        tags: [],
        title: shareBetweenEditAndContent.data.title,
        content: shareBetweenEditAndContent.data.content,
        author: "",
        id: shareBetweenEditAndContent.data.id
    };
    $scope.isEdit = false;
    $scope.mode = '新增';
    (function decide() {
        if (shareBetweenEditAndContent.data.title) {
            $scope.isEdit = true;
            $scope.mode = '编辑';
            $scope.ifTagShow = false;
            $scope.blog.author = shareBetweenEditAndContent.data.author;
        } else {
            $scope.ifTagShow = true;
            $scope.blog.author = shareBetweenLoginAndDialog.data.name;
        }
    })();
    $scope.upload = function() {
        var id = $.md5($scope.blog.title + $scope.blog.content, $scope.blog.author);
        if (!$scope.isEdit) {
            $scope.blog.id = id;
            $http({
                method: 'POST',
                url: '/insertblog',
                data: $scope.blog
            }).success(function(data, status) {
                if (data == 'Success') {
                    // console.log('Insert blog success.');
                    $mdDialog.hide();
                    $rootScope.$broadcast('updateBlogListEvent', '');
                } else if (data == 'Exist') {
                    // console.log('Exist same blog.');
                    $scope.errorMessage = '当前用户已存在相同内容的博客，请修改后重新提交。';
                } else {
                    // console.log('Insert blog failed.');
                    // console.log(data);
                    $scope.errorMessage = '插入博客失败，请稍后重试。';
                }
            });
        } else {
            // console.log('Edit blog.');
            $scope.blog.tags = shareBetweenEditAndContent.data.tags;
            $scope.blog.tmpId = $scope.blog.id;
            $scope.blog.id = id;
            $scope.blog.currentUser = shareBetweenLoginAndDialog.data.name;
            $http({
                method: 'POST',
                url: '/updateblog',
                data: $scope.blog
            }).success(function(data, status) {
                if (data == 'Success') {
                    // console.log('Update blog success.');
                    $mdDialog.hide();
                    $rootScope.$broadcast('updateBlogListEvent', '');
                    $scope.blog.tags = shareBetweenEditAndContent.data.tags;
                    $rootScope.$broadcast("changContentInBlogContentController", $scope.blog);
                } else if (data == 'Exist') {
                    // console.log('Exist same blog.');
                    $scope.errorMessage = '当前用户修改后的内容重复，请修改后重试。';
                } else if (data == 'Umatch') {
                    // console.log('Did not match');
                    $scope.errorMessage = '只有博客作者才可以对博客进行修改。';
                } else {
                    // console.log('Update blog failed.');
                    $scope.errorMessage = '更新博客失败，请稍后重试。';
                }
            });
        }
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
            // console.log('Error, status: ' + status + '.');
            // console.log(data);
        });
    }
    // Change content to show.
    $scope.changeContent = function(item) {
        $scope.$broadcast("changContentInBlogContentController", item);
    }
    $scope.$on('updateBlogListEvent', function(event, data) {
        $scope.getList();
    });
    $scope.getTagString = function(item) {
        if (item.tags.length) {
            return '标签: ' + item.tags.join(',');
        } else {
            return '无标签';
        }
    }
    $scope.getList();
}

function blogContent($scope, $mdDialog, $http, $rootScope, shareBetweenLoginAndDialog, shareBetweenEditAndContent) {
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
        shareBetweenEditAndContent.data = {};
        if (!shareBetweenLoginAndDialog.data.name) {
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
    $scope.editBlog = function(ev) {
        if (!shareBetweenLoginAndDialog.data.name) {
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
        } else if (!$scope.articleContent.title) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .textContent('当前尚未查看任何文章')
                .ariaLabel('Alert Dialog Demo')
                .ok('确定')
                .targetEvent(ev)
            )
        } else {
            shareBetweenEditAndContent.setContent($scope.articleContent);
            $mdDialog.show({
                parent: angular.element(document.body),
                controller: addBlogDialog,
                targetEvent: ev,
                templateUrl: 'html/article.html',
                clickOutsideToClose: false
            });
        }
    }
    $scope.removeBlog = function(ev) {
        $mdDialog.show(
            $mdDialog.prompt()
            .title('删除 ' + $scope.articleContent.title)
            .textContent('请输入密码以验证身份')
            .placeholder('密码')
            .ok('确认删除')
            .cancel('取消')
            .targetEvent(ev)
        ).then(function(passwd) {
            $http({
                method: 'POST',
                url: '/deleteblog',
                data: {
                    'currentUser': shareBetweenLoginAndDialog.data.name,
                    'id': $scope.articleContent.id,
                    'passwd': passwd,
                    'author': $scope.articleContent.author
                }
            }).success(function(data, status) {
                $rootScope.$broadcast('updateBlogListEvent', '');
                if (data) {
                    // console.log(data);
                } else {
                    // console.log('Delete blog success.');
                    $scope.articleContent = {};
                    shareBetweenEditAndContent.clearContent();
                }
            });
        }, function() {
            // console.log('Cancelled.');
        });
    }
    $scope.showProjectMessage = function(ev) {
        $mdDialog.show({
            parent: angular.element(document.body),
            targetEvent: ev,
            templateUrl: 'html/link.html',
            clickOutsideToClose: true
        });
    }
}

function shareBetweenLoginAndDialog($http) {
    var messages = {};
    messages.user = "";
    messages.data = {};
    messages.getData = function(passwd, callback) {
        $http({
            method: 'POST',
            url: '/users/userdata',
            data: {'user': messages.user, 'passwd': passwd}
        }).success(function(data, status) {
            if (data == 'Failed') {
                // console.log('Fail to get user data.');
                messages.data = {};
            } else {
                // console.log('Get user data.');
                messages.data = data;
                messages.user = data.user;
                callback();
            }
        });
    }
    messages.setUser = function(data) {
        messages.user = data;
    }
    messages.clearUser = function() {
        messages.user = "";
        messages.data = {};
    }
    return messages;
}

function shareBetweenEditAndContent() {
    var content = {};
    content.data = {};
    content.setContent = function(data) {
        content.data = data;
    }
    content.clearContent = function() {
        content.data = {};
    }
    return content;
}