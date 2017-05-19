require(['./config'], function(config) {
	require(['createPage','art-template','nivoSlider'],function(createPage,template,nivoSlider){
		//	//获取友情链接
		function getFriends(flag){
			var page=parseInt($('#friend_wrapper .page-count').data('cp'))||1;
			var allPage=parseInt($('#friend_wrapper .page-count').data('allpage'));
			if(flag&&flag=='next'){
				page+=1;
				if(page>allPage){
					page=1;
				}
			}else if(flag&&flag=='prev'){
				page-=1;
				if(page<1){
					page=allPage;
				}
			}
			$.ajax({
				type:"get",
				url:"/api/friend",
				data:{page:page},
				async:true
			}).then(function(res){
				var data = res;
				var html = template('firend_list_tpl', data);
				$('#friend_wrapper').html(html);
	//			$('#friend_wrapper').html(res);
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
		
		//分页
		var pagehtml=createPage({
			pagecount:parseInt($('#pagination').data('total')),
			pagesize:parseInt($('#pagination').data('pagesize')),
			currentpage:parseInt($('#pagination').data('curp'))
		});
		$("#pagination").html(pagehtml);
		
		
		//轮播
//		$('#slider').nivoSlider();
		
		//瀑布流
//		function waterfall(){
////			var loading = false;
//			$(window).scroll(function() {
//				if((($(window).scrollTop() + $(window).height()) + 150) >= $(document).height()) {
////					if(loading == false) {
////						loading = true;
//						getData()
////					}
//				}
//			});
//		}
//		
//		waterfall()
//
//		
//		function getData(){
//			var loading = false;
//			var target = $('#article_list');   
////			console.log(target.data('curp'))
//			if(!target){return false;}  
//			var current_page = parseInt(target.data('curp')); 
//			var max_page =Math.ceil( parseInt(target.data('total'))/parseInt(target.data('pagesize')));
//
//		    if(current_page >= max_page){  
//		      return false;  
//		    }  
//		    if(loading == false) {
//		    	loading = true;
//			    $.ajax({
//					type:"get",
//					url:"/page/"+(parseInt(current_page)+1),
//					async:true
//				}).then(function(res){
//					console.log(res);
//					$('#article_list').append(res);
//					target.data('curp',parseInt(current_page)+1);
//					loading=false;
//				},function(err){
//					console.log(err)
//				})
//		   }
//		    
//		}
	
				
		
	})
	
});