'use strict';
require.config({
    baseUrl: '/javascripts',  
    paths: {  
        jquery: '/libs/jquery/dist/jquery.min',  
        bootstrap: '/libs/bootstrap/dist/js/bootstrap.min',
        jqueryCookie: '/javascripts/plugins/jquery.cookie',
        'art-template': '/libs/art-template/lib/template-web',
        nivoSlider:'/libs/nivo-slider/jquery.nivo.slider'
//      createPage:'/javascripts/newPage'
    },  
    shim: {
        jquery: {
            exports: 'jquery'
        },
        bootstrap: {
            deps: ['jquery']
        },
        jqueryCookie: {
          	deps: ['jquery']
        },
        nivoSlider:{
            deps:['jquery']
        }
    },
    waitSeconds: 200  
});  
  
require(['jquery','user'], function ($,user) {  
	//获取地址栏参数
	function GetQueryString(name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}
    //滚动到顶部
	$('#backTop .scroll-h').click(function() {
		$('html,body').animate({
			scrollTop: '0px'
		}, 500);
	});
	//滚动到底部
	$('#backTop .scroll-b').click(function() {
		$('html,body').animate({
			scrollTop:$('html').height()
		}, 500);
	});
	
	//退出登陆
	$('#logout').on('click',function(){
		user.logout();
	})
	
	//登陆
	$('#login_submit').on('click',function(){
		var data=$("#loginForm").serialize();
		user.login(data);
	})
	
	//注册
	$('#regist_submit').on('click',function(){
		var data=$("#registForm").serialize();
		user.regist(data);
	})
	
});  