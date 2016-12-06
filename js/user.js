/**
 * Created by Administrator on 2016/11/28.
 */
angular.module('starter.user',[])
  .controller('UserCtrl', function ($scope,$location,$ionicPopup,$ionicModal,$ionicLoading,$http,$ionicSlideBoxDelegate) {
    console.log('start');
    //start
    $scope.startApp = function() {
      $state.go('main');
    };
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };
    $scope.doLogin = function () {
      $location.path('/login');
    };
    //end
    $scope.User = {};
    var userStorage = JSON.parse(window.localStorage['userStorage'] || '{}');
    $scope.signUp = function(){
      if($scope.User.username == 'ph' && $scope.User.password == '666666'){
        $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br/>登录中...'
        })
        $location.path('/tab/dash');
        $ionicLoading.hide();
      } else{
        $ionicPopup.alert({
          title: '请填写正确的用户名和密码!',
          //template: '请填写正确的用户名和密码!',
          okText: '确定',
          okType: 'button-light'
        })
      }

    };
    /*$scope.datePickerCallback = function (val) {

      //$scope.dob = val;
      if(typeof(val)==='undefined'){
        console.log('Date not selected');
      }else{
        console.log('Selected date is : ', val);
      }
    };*/
    //注册
    $scope.signIn = function () {
      $ionicModal.fromTemplateUrl('sign-in', {
        scope: $scope,
        // animation: 'slide-in-up',
        animation: 'slide-in-right',
        hardwareBackButtonClose: true
      }).then(function(modal) {
        $scope.signinModal = modal;
        $scope.signinModal.show();
      });
      $scope.signOn = function () {
        console.log($scope.User.username);
        console.log($scope.User.email);
        console.log($scope.User.password);
        console.log($scope.User.confirm_psd);
        console.log($scope.User.tel);
        if($scope.User.username == undefined || $scope.User.password == undefined|| $scope.User.confirm_psd == undefined || $scope.User.tel == undefined){
          $ionicPopup.alert({
            title: '请完善资料!',
            //template: '请填写正确的用户名和密码!',
            okText: '确定',
            okType: 'button-light'
          });
          return false;
        }
        if($scope.User.password != $scope.User.confirm_psd) {
          $ionicPopup.alert({
            title: '密码不一致!',
            //template: '请填写正确的用户名和密码!',
            okText: '确定',
            okType: 'button-light'
          });
          return false;
        }
        $scope.signUp();

      };

      $scope.closeSignInModal = function () {
        $scope.signinModal.remove();
        $scope.User = {};
      };

    };

    //
    $scope.signForget = function(){
      $ionicModal.fromTemplateUrl('sign-forget', {
        scope: $scope,
        // animation: 'slide-in-up',
        animation: 'slide-in-right',
        hardwareBackButtonClose: true
      }).then(function(modal) {
        $scope.signforgetModal = modal;
        $scope.signforgetModal.show();
      });

      $scope.closePass = function () {
        $scope.signforgetModal.remove();
      };
    };

  //end
  });
