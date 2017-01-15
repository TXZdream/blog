var app= angular.module('blog', ['ngMaterial']);

app.controller('userLogin', userLogin);
app.controller('blogList', blogList);
app.controller('blogContent', blogContent);

function userLogin($scope) {
    
}

function blogList($scope) {
    // Message for finding.
    $scope.findMessage = "";
    // Article list.
    $scope.list = [];
    // Get list from server.
    $scope.getList = function() {
        $scope.list = [
            {
                "author": "tangxz",
                "title": "Hello World!",
                "content": "No more content here."
            },
            {
                "author": "tangxz1",
                "title": "Hello World!!",
                "content": "No more content here."
            }
        ];
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