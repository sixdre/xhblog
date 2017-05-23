'use strict';
define(['jquery'],function($){
	var comment=function(){
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
			
		//用户操作接口
		var commentApi={
			getComment:function(articleId,params){			//获取评论
				return $.ajax({
					url:'/api/article/'+articleId+'/comments',
					type:'GET',
					data:params,
//					beforeSend:function(XMLHttpRequest){ 
//			              //alert('远程调用开始...'); 
//			            console.log('beforeSend');
//			         }, 
//					success:function(res){
//						console.log(res);
//						$('#comment_list').html(res);
//					},
//					complete:function(XMLHttpRequest,textStatus){ 
//		              	// alert('远程调用成功，状态文本值：'+textStatus); 
//		             	console.log('complete');
//		           	}, 
					
				})
			},
			submitComment:function(articleId,data){		//提交文章评论
				return $.ajax({
					type:"POST",
					url:"/api/article/"+articleId+"/comments",
					async:true,
					data:data
				});
			},
			commentLikes:function(commentId,params){		//评论点赞
				return $.ajax({
					url:'/api/comments/'+commentId+'/like',
					type:'POST',
					data:params,
					async:true,
				});
			}
		}
		
		//评论
		function Comment(formId){
			var content=$(formId).find('textarea[name="content"]').val().trim();
			if(content.length){
				var data=$(formId).serialize();
				var articleId=$(formId).find('input[name="articleId"]').val();
				commentApi.submitComment(articleId,data).then(function(res){
					if(res.code==1){
						alert('评论成功');
						window.location.reload();
					}
				},function(err){
					if(err.status==403){
						var backUrl=window.location.href;
						$.cookie('backUrl',backUrl,{path: '/' })
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
			var data={
				replyId:self.data('replyid')
			}
			var commentId=self.data('cid');
			commentApi.commentLikes(commentId,data).then(function(res){
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
				order_by:$(this).data('sort')
			}
			var articleId=$('#articleId').val();
			commentApi.getComment(articleId,params).then(function(res){
				$('#comment_list').html(res);
			},function(err){
				alert('服务器出错了');
			});
		})

	}
	return comment;
});
