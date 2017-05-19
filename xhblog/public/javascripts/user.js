'use strict';
define(['jquery','jqueryCookie'],function($,jqueryCookie){
		var userApi={
			logout:function(){
				return $.ajax({
					type:"GET",
					url:"/logout",
					async:true,
				})
			},
			login:function(data){
				return $.ajax({
					type:"POST",
					url:"/login",
					async:true,
					data:data
				})
			},
			regist:function(data){
				return $.ajax({
					type:"POST",
					url:"/regist",
					async:true,
					data:data
				});
			},
		}
		
		var user={
			logout:function(el){
				userApi.logout().then(function(res){
					if(res.code>0){
						window.location.reload();
					}else{
						alert('出错了');
					}
				},function(err){
					alert('退出登录失败，服务器错误!');
				})
				return false;
			},
			login:function(data){
				var backUrl=$.cookie('backUrl');
				userApi.login(data).then(function(res){
					if(res.code>0){
						alert(res.message);
						if(backUrl){
							window.location.href=backUrl;
						}else{
							window.location.href="/";
						} 
					}else{
						alert(res.message)
					}
				},function(err){
					alert('登录失败，服务器错误');
				})
			},
			regist:function(data){
				userApi.regist(data).then(function(res){
					if(res.code>0){
						alert(res.message);
						window.location.href="/login";
					}else{
						alert(res.message)
					}
				},function(err){
					alert('注册失败，服务器错误!');
				})
				return false;
			}
		}

	return user;
});

