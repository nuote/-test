/**
 * Created by Administrator on 2016/11/28.
 */
angular.module('starter.account',[])
  .controller('AccountCtrl', function ($scope,$location,$ionicPopup,$ionicModal,$ionicLoading,$http) {
    console.log('account');
    var userStorage = JSON.parse(window.localStorage['userStorage'] || '{}');
    $scope.signout = function(){
      $ionicPopup.confirm({
        title: '消息提示',
        template: "确认退出当前账号？",
        buttons: [
          {
            text: '取消',
            type: 'button-light',
            onTap: function(e) {

            }
          },
          {
            text: '确认 ',
            type: 'button-light',
            onTap: function(e) {
              //window.location.reload();
              $location.url("/login");
              window.localStorage['userStorage'] = "";

            }
          }
        ]
      });

    };


  //
  });
