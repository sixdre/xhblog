(function($) {
	var ms = {
		init: function(obj, args) {
			return(function() {
				args.pageCount = numberOfPages(args.listCount,10);
				ms.fillHtml(obj, args);
				obj.off('click');
				ms.bindEvent(obj, args);
			})();
		},
		fillHtml: function(obj, args) {
			return(function() {
				var liStr = "";
				for(var liLen = 1;liLen<=4;liLen++){
					var liText = 0;
					switch(liLen){
						case 3:
							liText = liLen * (args.areaCount * 2);
							break;
						case 4:
							liText = liLen * (args.areaCount * 2.5);
							break;
						default:
							liText = liLen * args.areaCount;
							break;
					}
					liStr = liStr + "<li>" + liText + "</li>";
				}
				var pageStr = "跳转到：<input class='goPage' type='text' value='1'/><a href='javascript:void(0);' class='go'>GO</a>每页显示：<div class='pages-list'><span class='pages-textList'>"+args.textCount+"</span><i></i><ul>" + liStr + "</ul></div>";
				obj.find('.pages-more').empty();
				obj.find('.pages-more').append(pageStr);
				console.log(args.textCount);
				obj = obj.children('.pages');
				obj.empty();
				if(args.current > 1) {
					obj.append('<a href="javascript:;" class="prevPage"><i class="i-prev"></i></a>');
				} else {
					obj.remove('.prevPage');
					obj.append('<span class="disabled"><i class="i-prev"></i></span>');
				}
				if(args.current != 1 && args.current >= 4 && args.pageCount != 4) {
					obj.append('<a href="javascript:;" class="tcdNumber">' + 1 + '</a>');
				}
				if(args.current - 2 > 2 && args.current <= args.pageCount && args.pageCount > 5) {
					obj.append('<span>...</span>');
				}
				var start = args.current - 2,
					end = args.current + 2;
				if((start > 1 && args.current < 4) || args.current == 1) {
					end++;
				}
				if(args.current > args.pageCount - 4 && args.current >= args.pageCount) {
					start--;
				}
				for(; start <= end; start++) {
					if(start <= args.pageCount && start >= 1) {
						if(start != args.current) {
							obj.append('<a href="javascript:;" class="tcdNumber">' + start + '</a>');
						} else {
							obj.append('<span class="current">' + start + '</span>');
						}
					}
				}
				if(args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5) {
					obj.append('<span>...</span>');
				}
				if(args.current != args.pageCount && args.current < args.pageCount - 2 && args.pageCount != 4) {
					obj.append('<a href="javascript:;" class="tcdNumber">' + args.pageCount + '</a>');
				}
				if(args.current < args.pageCount) {
					obj.append('<a href="javascript:;" class="nextPage"><i class="i-next"></i></a>');
				} else {
					obj.remove('.nextPage');
					obj.append('<span class="disabled"><i class="i-next"></i></span>');
				}
			})();
		},
		bindEvent: function(obj, args) {
			//点击空白隐藏
			$(document).bind("click", function (e) {
			  var target = $(e.target);
			  if (target.closest('.pages-list').length == 0) {
			    $('.pages-list').find('ul').slideUp();
			  }
			});
			
			//分页下拉
			obj.on('click','.pages-list span',function(){
				$('.pages-list ul').slideToggle();
			});
			obj.on('click','.pages-list li',function(){
			  $('.pages-list ul').slideUp();
			});
			return(function() {
				obj.on("click", "a.tcdNumber", function() {
					var current = parseInt($(this).text());
					args.pageCount = numberOfPages(args.listCount,args.textCount);
					var areaCount = args.areaCount;
					ms.fillHtml(obj, {
						"current": current,
						"pageCount": args.pageCount,
						"textCount": args.textCount,
						"areaCount": areaCount
					});
					if(typeof(args.backFn) == "function") {
						args.backFn(current,args.textCount);
					}
				});
				
				obj.on('click','a.go',function(){
					var current = $('.goPage').val();
					var pageCount = args.pageCount;
					args.textCount = parseInt($('.pages-list span').text());
					if(current == null || current == ''){
						alert('请输入要跳转的页码！');
					}else if(parseInt(current) > pageCount || parseInt(current) <= 0 || isNaN(parseInt(current))){
						alert('请出入正确页码！');
					}else{
						current = parseInt(current);
						var areaCount = args.areaCount;
						ms.fillHtml(obj, {
							"current": current,
							"pageCount": args.pageCount,
							"textCount": args.textCount,
							"areaCount": areaCount
						});
						if(typeof(args.backFn) == "function") {
							args.backFn(current,args.textCount);
						}
					}
				});
				
				obj.on('click','.pages-list li',function(){
					args.textCount = parseInt($(this).text());
					args.pageCount = numberOfPages(args.listCount,args.textCount);
					var areaCount = args.areaCount;
					ms.fillHtml(obj, {
						"current": 1,
						"pageCount": args.pageCount,
						"textCount": args.textCount,
						"areaCount": areaCount
					});
					if(typeof(args.backFn) == "function") {
						args.backFn(1,args.textCount);
					}
				});
				obj.on("click", "a.prevPage", function() {
					var current = parseInt(obj.find('.pages').children("span.current").text());
					args.pageCount = numberOfPages(args.listCount,args.textCount);
					var areaCount = args.areaCount;
					ms.fillHtml(obj, {
						"current": current - 1,
						"pageCount": args.pageCount,
						"textCount": args.textCount,
						"areaCount": areaCount
					});
					if(typeof(args.backFn) == "function") {
						args.backFn(current - 1,args.textCount);
					}
				});
				obj.on("click", "a.nextPage", function() {
					var current = parseInt(obj.find('.pages').children("span.current").text());
					console.log(args.textCount);
					args.pageCount = numberOfPages(args.listCount,args.textCount);
					var areaCount = args.areaCount;
					ms.fillHtml(obj, {
						"current": current + 1,
						"pageCount": args.pageCount,
						"textCount": args.textCount,
						"areaCount": areaCount
					});
					if(typeof(args.backFn) == "function") {
						args.backFn(current + 1,args.textCount);
					}
				});
			})();
		}
	}
	$.fn.createPage = function(options) {
		var args = $.extend({
			pageCount: 10,
			current: 1,
			listCount: 0,
			textCount: 10,
			areaCount: 10,
			backFn: function() {}
		}, options);
		ms.init(this, args);
	}
})(jQuery);
function numberOfPages(listCount,pageSize){
	var defaultPageCount =  Math.ceil(listCount/pageSize);
	if(defaultPageCount == 0){
		defaultPageCount = 1;
	}
	console.log("defaultPageCount="+defaultPageCount);
	return defaultPageCount;
}
