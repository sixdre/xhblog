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
					window.location.href="/";
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
					window.location.href="/";
				}else{
					alert(res.message)
				}
			},
			error:function(err){
				
			}
		});
	});
	
	//留言提交
	$('#word_submit').on('click',function(){
		$.ajax({
			type:"POST",
			url:"/word",
			async:true,
			data:$("#word_form").serialize(), 
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
	//评论
	
	$('#comment_submit').on('click',function(){
		$.ajax({
			type:"POST",
			url:"/comment",
			async:true,
			data:$("#comment_form").serialize(), 
			success:function(res){
				if(res.code==-2){		//用户未登录请先登陆
					alert('请先登陆');
					window.location.href="/login";
				}else if(res.code==1){
					alert('评论成功');
					window.location.reload();
				}
				console.log(res);
			},
			error:function(err){
				
			}
		});
	});
	
	
	//
	$('.comment_user').on('click',function(){
		var cId=$(this).data('cid');		//当前评论的数据模型id
		var toId=$(this).data('tid');		//评论用户的id
		
		if($('#toId').length>0){
			$('#toId').val(toId);
		}else{
			$('<input>').attr({
				type:'hidden',
				id:'toId',
				name:'toId',
				value:toId
			}).appendTo('#comment_form');
		}
		
		if($('#cId').length>0){
			$('#cId').val(cId);
		}else{
			$('<input>').attr({
				type:'hidden',
				id:'cId',
				name:'cId',
				value:cId
			}).appendTo('#comment_form');
		}
		
		
	})
	
	
	
	
	
})