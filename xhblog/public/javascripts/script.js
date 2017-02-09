$(function() {
	
	//首页顶部轮播
	$("#demo1").slide({ mainCell:".bd ul",effect:"topLoop",autoPlay:true,triggerTime:0 });
	//滚动到顶部
	$('#scroll .scroll-h').click(function() {
		$('html,body').animate({
			scrollTop: '0px'
		}, 500);
	});
	//滚动到底部
	$('#scroll .scroll-b').click(function() {
		$('html,body').animate({
			scrollTop:$('.bottom-nav').offset().top
		}, 500);
	});
	
	//登录提交
	$('#login_submit').on('click',function(){
		$.ajax({
			type:"GET",
			url:"/doLogin",
			async:true,
			data:$("#loginForm").serialize(), 
			success:function(res){
				if(res.code>0){
					alert(res.message);
				}else{
					alert(res.message)
				}
			},
			error:function(err){
				
			}
		});
	});
	
	//注册提交
	$('#regist_submit').on('click',function(){
		$.ajax({
			type:"POST",
			url:"/doRegist",
			async:true,
			data:$("#registForm").serialize(), 
			success:function(res){
				if(res.code>0){
					alert(res.message);
				}else{
					alert(res.message)
				}
			},
			error:function(err){
				
			}
		});
	});
	
	
	
})