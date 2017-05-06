$(function() {

	//评论回复html
	var replyForm='<form id="reply_form" class="comment_form" method="post" onsubmit="return false;">'+
			'<input type="hidden" name="toId" value="">'+
			'<input type="hidden" name="cId" value="">'+
			'<input type="hidden" name="articleId" value="">'+
			'<div class="form-textarea">'+
				'<textarea name="content" title="Ctrl+Enter快捷提交" placeholder="说点什么吧…"></textarea>'+
			'</div>'+
			'<div class="form-toolbars clearfix">'+
				'<div class="form-action">'+
					'<input type="button" class="cancel" value="取消"  id="replay_cancel"/>'+
					'<input type="submit" value="回复"  id="replay_submit"/>'+
				'</div>'+
			'</div>'+
		'</form>';
		
	var UserHandle={
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
		submitWord:function(data){		//提交留言
			return $.ajax({
				type:"POST",
				url:"/word",
				async:true,
				data:data
			});
		},
		submitComment:function(data){		//提交文章评论
			return $.ajax({
				type:"POST",
				url:"/comment",
				async:true,
				data:data
			});
		},
		commentLikes:function(params){		//评论点赞
			return $.ajax({
				url:'/comment/point',
				type:'POST',
				data:params,
				async:true,
			});
		}
	}
	
	//退出登录
	$('#logout').on('click',function(){
		UserHandle.logout().then(function(res){
			if(res.code>0){
				window.location.reload();
			}else{
				alert('出错了');
			}
		},function(err){
			alert('退出登录失败，服务器错误!');
		})
		return false;
	})
	
	
	//注册
	$('#regist_submit').on('click',function(){
		var data=$("#registForm").serialize();
		UserHandle.regist(data).then(function(res){
			if(res.code>0){
				alert(res.message);
				window.location.href="/";
			}else{
				alert(res.message)
			}
		},function(err){
			alert('注册失败，服务器错误!');
		})
		return false;
	});
	
	//登录
	$('#login_submit').on('click',function(){
		var data=$("#loginForm").serialize();
		var backUrl=$.cookie('backUrl');
		UserHandle.login(data).then(function(res){
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
	});
	
	//提交留言
	$('#word_submit').on('click',function(){
		var data=$("#word_form").serialize();
		UserHandle.submitWord(data).then(function(res){
			if(res.code==1){
				alert('留言成功');
				window.location.reload();
			}
		},function(err){
			if(err.status==403){
				alert('请先登录')
				window.location.href="/login";
			}
		})
	});
	
	//评论
	function Comment(formId){
		var content=$(formId).find('textarea[name="content"]').val().trim();
		if(content.length>0){
			var data=$(formId).serialize();
			UserHandle.submitComment(data).then(function(res){
				if(res.code==1){
					alert('评论成功');
					window.location.reload();
				}
			},function(err){
				if(err.status==403){
					window.location.href="/login";
				}
			})
		}else{
			alert('请输入评论内容!');
		}
		
	}
	//文章评论
	$('#comment_submit').on('click',function(){
		Comment('#comment_form');
	});
	
	//评论点赞
	$('body').delegate('.zan','click',function(){
		var self=$(this);
		var params={
			commentId:self.data('cid'),
			replyId:self.data('replyid')
		}
		UserHandle.commentLikes(params).then(function(res){
			if(res.code==1){
				var nums=parseInt(self.find('.nums').html());
					nums+=1;
				self.find('.nums').html(nums);
			}else if(res.code==-2){
				alert(res.message);
			}
		},function(err){
			console.log(err);
			if(err.status==403){
//						alert('请先登陆');
				var url=window.location.href;
				$.cookie('backUrl',url,{path: '/'});
				window.location.href="/login";
			}
		})
		return false;
	})
	
	
	$('body').delegate('.reply_a','click',function(){
		var cId=$(this).data('cid');		//当前评论的数据模型id
		var toId=$(this).data('tid');		//评论用户的id
		$('#reply_form').remove();
		$(this).parent().parent().parent().append(replyForm);
		$('#reply_form input[name="toId"]').val(toId);
		$('#reply_form input[name="cId"]').val(cId);
		$('#reply_form input[name="articleId"]').val($('#articleId').val());
	});
	
	//评论回复
	$('body').delegate('#replay_submit',"click",function(){
		Comment('#reply_form');
	});
	
	//回复取消
	$('body').delegate('#replay_cancel',"click",function(){
		$('#reply_form').remove();
	});
	

	//根据分类获取评论
	$('#commentSort a').on('click',function(){
		if($(this).hasClass('active')){
			return;
		}
		$(this).siblings().removeClass('active');
		$(this).addClass('active');
		var params={
			order_by:$(this).data('sort'),
			articleId:$('#articleId').val()
		}
		$.ajax({
			url:'/comment',
			type:'GET',
			data:params,
			success:function(res){
				console.log(res);
				$('#comment_list').html(res);
			}
			
		})
	})
	
	//获取友情链接
	function getFriends(flag){
		var page=parseInt($('#friend_wrapper .page-count').data('cp'))||1;
		var allPage=parseInt($('#friend_wrapper .page-count').data('allpage'));
		if(flag&&flag=='next'){
			page+=1;
			if(page>allPage){
				page=1;
			}
		}else if(flag&&flag=='prev'){
			console.log('ss');
			page-=1;
			console.log(allPage);
			if(page<1){
				page=allPage;
			}
		}
		$.ajax({
			type:"get",
			url:"/friends",
			data:{page:page},
			async:true
		}).then(function(res){
			$('#friend_wrapper').html(res);
		},function(err){
			
		})
	}
	getFriends();
	//友情链接翻页，上一页
	$('body').delegate('#friend_wrapper .prev','click',function(){
		getFriends('prev')
	})
	
	//友情链接翻页，下一页
	$('body').delegate('#friend_wrapper .next','click',function(){
		getFriends('next');
	})
	
	
})