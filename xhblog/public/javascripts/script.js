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
})