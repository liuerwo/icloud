$(function () {
    var app = angular.module("reminder", [])
    app.controller('mainCtrl', ['$scope', function ($scope) {
        $scope.colorList = [
            {
                id: 1000, title: "默认", theme: "orange",
                todos: [
                    {id: 0, title: "回家", state: 1},
                    {id: 1, title: "吃饭", state: 0},
                    {id: 2, title: "爬山", state: 1},
                    {id: 3, title: "看书", state: 0}]
            },
            {id: 1001, title: "新列表1", theme: "pink", todos: []},
            {id: 1002, title: "新列表2", theme: "brown", todos: []},
            {id: 1003, title: "新列表3", theme: "yellow", todos: []},
            {id: 1004, title: "新列表4", theme: "blue", todos: []},
            {id: 1005, title: "新列表5", theme: "green", todos: []},
            {id: 1006, title: "新列表6", theme: "purple", todos: []}
        ];
        $scope.circle = [
            {id: 1000, theme: "orange"},
            {id: 1001, theme: "pink"},
            {id: 1002, theme: "brown"},
            {id: 1003, theme: "yellow"},
            {id: 1004, theme: "blue"},
            {id: 1005, theme: "green"},
            {id: 1006, theme: "purple"}

        ]
        // $(document).on("mousedown",false)
        $(document).on("click", function () {
            $(".complete-list li").removeClass("active")
            $(".complete-list li input").blur()
            $(".list li").removeClass("active")
            $(".list li input").blur()
            $(".new-item input").blur()
        })

        $scope.add = function () {
            var max = -Infinity
            $scope.colorList.forEach(function (v, i) {
                if (v.id > max) {
                    max = v.id
                }
            })
            max = max + 1
            $scope.colorList.push({
                id: max,
                title: "新列表" + ($scope.colorList.length),
                theme: $scope.colorList[$scope.colorList.length % 7].theme,
                todos: []
            })
        }
        $scope.current = $scope.colorList[0]
        $(document).on("keyup", function (e) {
            if (e.keyCode === 46) {
                var id = parseInt(($(".list-group")).find("li.active").attr("id"))
                $scope.$apply(function () {
                    $scope.colorList = $scope.colorList.filter(function (v, i) {
                        return v.id !== id
                    })
                    // $scope.current.theme = $scope.colorList[0].theme
                    $scope.current = $scope.colorList[0]
                })
            }


        })

        $scope.setcurrent = function (v) {
            $scope.current = v
        }
        $scope.del = function (id) {
            $scope.current.todos = $scope.current.todos.filter(function (v, i) {
                return v.id !== id
            })
        }
        $scope.count=function(){
            var num=0
            $scope.current.todos.forEach(function(v,i){
                if(v.state===1){
                    num+=1
                }
            })
           return num;
        }
        $scope.cancel = function () {
            $(".choose").toggleClass("active")
        }
        $(".list").on("click", "li", function () {
            $(".list").find("li").removeClass("active")
            $(this).addClass("active")
        })
        $(".new-item").on("click", function (e) {
            e.stopPropagation()
            var input = $(this).find("input")
            $(document).on("keyup", function (e) {
                var newval = input.focus().val()
                if (e.keyCode === 13) {
                    if (newval !== "新条目...") {
                        $scope.$apply(function () {
                            $scope.current.todos.push({
                                id: $scope.current.todos.length + 1,
                                title: newval,
                                state: 0
                            })
                        })

                    }
                    input.val("新条目...")
                    input.blur()
                }
            })

        })
        $scope.shouqi = function () {
            $(".complete .caret").toggleClass("active")
            $(".complete-list").slideToggle()
        }
        $scope.delall = function () {
            $scope.current.todos = $scope.current.todos.filter(function (v, i) {
                return v.state !== 1
            })
            console.log($scope.current.todos)
        }
        $scope.delete = function () {
            var id = parseInt($(".list-group").find(".active").attr("id"))
            $scope.colorList = $scope.colorList.filter(function (v, i) {
                return v.id !== id;
            })
            $scope.cancel()
            // $scope.current.theme = $scope.circle[0].theme

        }
        $(".input-group-addon").on("click",function(){

        })
        $(".input-group input").on("click",function(){
            $(this).focus()
            var key=$(".input-group input").val();
            var arr=[];
            $scope.current.todos.forEach(function(v,i){
                if(!((v.title.indexOf(key))==-1)){
                    arr.push(v)
                    console.log(arr)
                }else{
                    // alert("没有该事项")
                    // $('.show').css({
                    // 	textAlign:'center',
                    // })
                }
            })
        })


    }])
    app.directive("colorList", function () {
        return {
            restrict: "AE",
            transclude: true,
            template: '<ul class="list-group" ng-transclude></ul>',
            replace: true,
            link: function (scope, el) {
                $(el).on("dblclick", "li", function (e) {
                    e.stopPropagation()
                    $(this).find(".r span").addClass("active")
                    var input = $(this).find(".r input")
                    input.focus()
                    input.toggleClass("active")
                    input.val(input.val())
                })
                $(el).on("blur", "li", function () {
                    $(this).find(".r input").removeClass("active")
                    $(this).find(".r span").toggleClass("active")
                })
                $(el).on("click", "li", function () {
                    $(".list-group li").removeClass("active")
                    $(this).addClass("active")
                })
            }
        }
    })
    app.directive("colorClick", function () {
        return {
            restrict: "AE",
            transclude: true,
            template: '<div class="color" ng-transclude ></div>',
            replace: true,
            link: function ($scope, el) {
                $scope.change = function (t, $index) {
                    $scope.current.theme = t.theme
                }
                $scope.complete = function () {
                    var val = $(".choose .content input").val()
                    $scope.colorList.push({
                        id: $scope.colorList.length + 1,
                        title: val,
                        theme: $scope.current.theme,
                        todos: []
                    })
                    $scope.cancel()
                    $(".choose .content input").val("新列表")
                }

            }
        }
    })
    app.directive("inputClick", function () {
        return {
            restrict: "AE",
            transclude: true,
            template: '<ul ng-transclude></ul>',
            replace: true,
            link: function ($scope, el) {
                $(el).on("click", "li", function (e) {
                    e.stopPropagation()
                    $(".list li").removeClass("active")
                    $(".list li input").blur()
                    $(el).find("li").removeClass("active")
                    $(this).toggleClass("active")
                    var input = $(this).find("input")
                    input.focus()
                    var oldval = input.val()
                    var id = $(this).attr("id")
                    input.blur(function () {
                        var newval = input.val()
                        $scope.$apply(function () {
                            if (oldval !== newval) {
                                $scope.current.todos[id].title = newval
                            }
                        })
                    })
                })

            }
        }
    })
    app.directive("todoClick", function () {
        return {
            restrict: "AE",
            transclude: true,
            template: '<ul ng-transclude></ul>',
            replace: true,
            link: function ($scope, el) {
                $(el).on("click", "li", function (e) {
                    e.stopPropagation()
                    $(".complete-list li").removeClass("active")
                    $(".complete-list li input").blur()
                    $(el).find("li").removeClass("active")
                    $(this).toggleClass("active")
                    var input = $(this).find("input")
                    input.focus()
                    var oldval = input.val()
                    var id = $(this).attr("id")
                    input.blur(function () {
                        var newval = input.val()
                        $scope.$apply(function () {
                            if (oldval !== newval) {
                                $scope.current.todos[id].title = newval
                            }
                        })
                    })
                })

            }
        }
    })
    
})