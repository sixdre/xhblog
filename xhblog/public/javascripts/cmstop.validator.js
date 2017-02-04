/**
 * validator base on jQuery 1.3+ for cmstop form-applications
 *
 * @author     kakalong
 * @copyright  2010 (c) cmstop.com
 * @version    $Id: cmstop.validator.js 9934 2014-05-19 08:08:57Z betty $
 */

(function($){

    var CLASSES = {
        'focus':'validator-focus',
        'hover':'validator-hover',
        'error':'validator-error',
        'pass':'validator-pass',
        'verifing':'validator-verifing',
        'infobox':'validator-infobox',
        'tips':'validator-tooltips',
        'ignore':'validator-ignore'
    };

    var CONFIGS = {
        xmlPath:'/',
        submitHandler:null,
        infoHandler:null
    };



    var setClass = function(jq, type) {
        return jq.removeClass(CLASSES.error+' '+CLASSES.pass+' '+CLASSES.verifing).addClass(CLASSES[type]);
    };
    var createHandler = function(el) {
        el = el.jquery ? el : $(el);
        return function(jq,text,type,e){
            text && text.length
                ? setClass(el, type).html(text).show()
                : el.hide();
            setClass(jq, type);
        };
    };
    var showInfo = function(jq,text,type,e) {
        jq.data('validator-info', {text:text, type:type, event:e});
        jq.data('handler')(jq, text, type, e);
    };
    var _val = function(jq)
    {
        var t = jq[0].type;
        if (t == 'radio') {
            for (var i=0,l=jq.length;i<l;i++)
            {
                if (jq[i].checked)
                {
                    return jq[i].value;
                }
            }
            return '';
        }
        if (t == 'checkbox')
        {
            var vals = [];
            for (var i=0,l=jq.length;i<l;i++)
            {
                if (jq[i].checked)
                {
                    vals.push(jq[i].value);
                }
            }
            return vals;
        }
        return jq.val()||'';
    };

    var _regexp = {
        email: /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/,
        username: /^[a-z]\w{3,19}$/i,
        password:/^[^\s\$]{6,20}$/,
        telephone: /^(86)?(\d{2,5}-)?(\d{7,8})$/,
        mobile: /^1\d{10}$/,
        url: /^[a-zA-z]{2,5}:\/\/(\w+(-\w+)*)(\.(\w+(-\w+)*))*(\?\S*)?\/?$/,
        ip: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
        id:/^(?:\d{14}|\d{17})[\dxX]$/,
        qq: /^[1-9]\d{4,20}$/,
        date:/^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/,
        datetime:/^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})$/,
        zipcode: /^[1-9]\d{5}$/,
        currency: /^\d+(\.\d+)?$/,
        number: /^\d+$/,
        english: /^[A-Za-z]+$/,
        chinese: /^[\u4e00-\u9fa5]+$/,
        integer: /^[-\+]?\d+$/,
        'float': /^[-\+]?\d+(\.\d+)?$/
    };
    var reRegex = /^([\/|#])(.*)\1([gim]*)$/;
    var RULES = {
        required:function(jq,args) {
            return _val(jq).length > 0;
        },
        not:function(jq,args) {
            var val = _val(jq);
            args = ','+args+',';
            if ($.isArray(val))
            {
                for (var i=0,l=val.length;i<l;i++)
                {
                    if (args.indexOf(','+val[i]+',') != -1){
                        return false;
                    }
                }
                return true;
            }
            return (!!val) && args.indexOf(','+val+',') == -1;
        },
        min:function(jq,args) {
            return _val(jq).length >= parseInt(args);
        },
        max:function(jq,args) {
            return _val(jq).length <= parseInt(args);
        },
        ajax:function(jq,args) {
            var v = jq.val();
            if (!v.length) return true;
            var lastvalid = jq.data('lastvalid');
            if (lastvalid && lastvalid.val == v) {
                jq.trigger('validateComplete', [lastvalid.state, lastvalid.info]);
                return undefined;
            }
            var data = jq[0].name+'='+encodeURIComponent(v);
            $.ajax({
                dataType : 'json',
                url : args,
                data:data,
                success:function(json){
                    var lastvalid = {
                        state:json.state,
                        info:json.state ? json.info : json.error
                    };
                    jq.data('lastvalid',lastvalid);
                    jq.trigger('validateComplete', [lastvalid.state, lastvalid.info]);
                }
            });
        },
        eq:function(jq,args) {
            var v=jq.val();
            return $(args).val() == jq.val();
        },
        regex:function(jq,args) {
            var v = jq.val();
            if (!v.length) return true;
            if (reRegex.exec(args))
            {
                var re = new RegExp(RegExp.$2,RegExp.$3);
                return re.test(v)
            }
            return false;
        },
        email:function(jq,args) {var v=jq.val(); return !v.length || _regexp.email.test(v); },
        username:function(jq,args) {var v=jq.val(); return !v.length || _regexp.username.test(v); },
        password:function(jq,args) {var v=jq.val(); return !v.length || _regexp.password.test(v); },
        ip:function(jq,args) {var v=jq.val(); return !v.length || _regexp.ip.test(v); },
        id:function(jq,args) {var v=jq.val(); return !v.length || _regexp.id.test(v); },
        date:function(jq,args) {var v=jq.val(); return !v.length || _regexp.date.test(v); },
        datetime:function(jq,args) {var v=jq.val(); return !v.length || _regexp.datetime.test(v); },
        qq:function(jq,args) {var v=jq.val(); return !v.length || _regexp.qq.test(v); },
        mobile:function(jq,args) {var v=jq.val(); return !v.length || _regexp.mobile.test(v); },
        telephone:function(jq,args) {var v=jq.val(); return !v.length || _regexp.telephone.test(v); },
        msn:function(jq,args) {var v=jq.val(); return !v.length || _regexp.email.test(v); },
        url:function(jq,args) {var v=jq.val(); return !v.length || _regexp.url.test(v); },
        zipcode:function(jq,args) {var v=jq.val(); return !v.length || _regexp.zipcode.test(v); },
        currency:function(jq,args) {var v=jq.val(); return !v.length || _regexp.currency.test(v); },
        number:function(jq,args) {var v=jq.val(); return !v.length || _regexp.number.test(v); },
        english:function(jq,args){var v=jq.val(); return !v.length || _regexp.english.test(v); },
        chinese:function(jq,args){var v=jq.val(); return !v.length || _regexp.chinese.test(v); },
        integer:function(jq,args){var v=jq.val(); return !v.length || _regexp.integer.test(v); },
        'float':function(jq,args){var v=jq.val(); return !v.length || _regexp['float'].test(v); }
    };

    var toJson = function(xml)
    {
        var json = {};
        var box = $('root',xml).attr('box');
        $('root>*',xml).each(function(){
            var tag = {};
            json[this.nodeName] = tag;
            tag.tips = this.getAttribute('tips');
            tag.pass = this.getAttribute('pass');
            tag.box  = this.getAttribute('box') || box;
            var rule = [];
            tag.rule = rule;
            $('>*',this).each(function(){
                rule.push({
                    name:this.nodeName,
                    args:this.getAttribute('args'),
                    event:this.getAttribute('event'),
                    text:$(this).text()
                });
            });
        });
        return json;
    };

    function pos(elem){
        var ret;
        if (elem[0].offsetWidth) {
            ret = elem.position();
            ret.offsetParent = elem.offsetParent();
        } else {
            var orig = {
                display:elem.css('display'),
                visibility:elem.css('visibility'),
                height:elem.css('height'),
                width:elem.css('width')
            };
            elem.css({
                display:'block',
                visibility:'hidden',
                height:1,
                width:1
            });
            var ret = elem.position();
            ret.offsetParent = elem.offsetParent();
            elem.css(orig);
        }
        return ret;
    }

    var validate = function(form,configs) {
        configs = $.extend({},CONFIGS,configs||{});
        var asyncCount, asyncStart;
        var jqForm = $(form);
        var key = jqForm.attr('name') || jqForm[0].getAttribute('id');
        if (!key) {
            jqForm.submit(function(){
                // else submit
                if (typeof configs.submitHandler == 'function')
                {
                    configs.submitHandler(jqForm);
                    return false;
                }

                // internal submit
                return true;
            });
            return jqForm;
        }
        var xmlDom = $.data(window, key);
        var tips = $('<div class="'+CLASSES.tips+'"/>').css({
            'position':'absolute',
            'z-index':99,
            'display':'none',
            'white-space':'nowrap'
        });
        var showTips = function(jq) {
            var vinfo = jq.data('validator-info');
            if (vinfo) {
                showInfo(jq, vinfo.text, vinfo.type, vinfo.event);
                hideTips();
                return;
            }
            var name = jq.attr('name').replace(/[^\w]/g,'');
            var tiptext;
            var offset = pos(jq);
            if (xmlDom && xmlDom[name] && (tiptext = (jq.attr('data-validator-tips') || xmlDom[name].tips)) && tiptext.length) {
                tips.html('<span></span>'+tiptext);
                var top, left, h = tips.appendTo(offset.offsetParent).outerHeight(true);
                if (offset.top > h) {
                    top = offset.top - h - 2;
                    left = offset.left + 25;
                } else {
                    top = offset.top + 10;
                    left = offset.left + jq.outerWidth() - 35;
                }
                tips.css({
                    top:top,
                    left:left
                }).show();
            }
            offset.offsetParent.find('.'+CLASSES.infobox).hide();
        };
        var hideTips = function(){
            tips.hide();
        };
        var _h = configs.infoHandler;
        var infoHandler = _h ? (typeof _h == 'function' ? _h : createHandler(_h))
            : function(jq, text, type, e){
            var infobox = jq.data('infobox'), offset = pos(jq);
            if (!infobox) {
                infobox = $('<div class="'+CLASSES.infobox+'"/>').css({
                    'position':'absolute',
                    'z-index':100,
                    'left':'-9999em',
                    'display':'none'
                }).appendTo(offset.offsetParent);
                jq.data('infobox', infobox);
            }
            offset.offsetParent.find('.'+CLASSES.infobox).hide();
            setClass(infobox, type).html(text);
            var top, left, h = infobox.outerHeight(true);
            console.log(offset.top);
            if (offset.top > h) {
                top = offset.top - h - 2;
                left = offset.left + 25;
            } else {
                top = offset.top;
                left = offset.left + jq.outerWidth() + 10;
            }
            //top = Math.max(top, 30);
            infobox.css({
                top:top,
                left:left
            });

            if (text) {
                infobox.show();
            } else {
                infobox.hide();
            }

            hideTips();
            setClass(jq, type);
        };
        var valid = function(jq, e, _e, session){
            var name = jq.attr('name').replace(/[^\w]/g,'');
            var rule, hasAsync = false;
            if (xmlDom && xmlDom[name] && (rule = xmlDom[name].rule)) {
                typeof jq.data('handler') != 'function'
                && jq.data('handler', infoHandler);
                for (var i=0,l=rule.length; i<l; i++) {
                    var r = rule[i], text = jq.attr('data-validator-text') || r.text;
                    r.event === null && (r.event = 'blur submit');
                    if (r.event != '*' && (' '+r.event+' ').indexOf(' '+e+' ') == -1 ) continue;
                    var func;
                    if (func = RULES[r.name]) {
                        var rs = func(jq, r.args);
                        if (rs === undefined) {
                            asyncCount++;
                            hasAsync = true;
                            jq.unbind('validateComplete').bind('validateComplete', {session:session}, function(ev, passed, info) {
                                if (ev.data.session == session) {
                                    asyncCount--;
                                    if (passed) {
                                        showInfo(jq, info || text, 'pass', _e);
                                        if (asyncCount <= 0) {
                                            jqForm.trigger('asyncComplete');
                                        }
                                    } else {
                                        showInfo(jq, info || text, 'error', _e);
                                    }
                                }
                            });
                            showInfo(jq, text, 'verifing', _e);
                            return true;
                        }
                        if (!rs) {
                            showInfo(jq, text, 'error', _e);
                            return false;
                        }
                    }
                }
                if (!hasAsync) {
                    if (jq.attr('data-validator-pass') || (xmlDom[name].pass && xmlDom[name].pass.length)) {
                        showInfo(jq, jq.attr('data-validator-pass') || xmlDom[name].pass, 'pass', _e);
                    } else {
                        jq.data('infobox') && jq.data('infobox').hide();
                        setClass(jq, 'pass');
                    }
                }
            }

            // no rule for this element, so pass validation
            jq.removeData('validator-info');
            return true;
        };
        var elements = [];
        var _group = {'radio':{},'checkbox':{}};
        // var inputs = $(form.elements).not(':button,:submit,:image,:reset,[type=hidden],[disabled]');
        var inputs = $('input,textarea,select',form).not(':button,:submit,:image,:reset,[type=hidden],[disabled]');
        inputs.filter('[name]').each(function(){
            var el = this, _t = el.type, _n = el.nodeName.toLowerCase(), jq = $(el), col,
                name = jq.attr('name').replace(/[^\w]/g,'');
            if (jq.hasClass(CLASSES.ignore)) return;
            if (_t=='radio' || _t=='checkbox')
            {
                (col = _group[_t][name])
                    ? col.push(el)
                    : (col = _group[_t][name] = jq, elements.push(jq));
            } else {
                col = jq;
                elements.push(jq);
            }

            jq.focus(function(){
                showTips(jq.addClass(CLASSES.focus));
            }).blur(function(e){
                hideTips();
                $.className.remove(this,CLASSES.focus);
                valid(col,'blur',e);
            }).hover(function(){
                $.className.add(this,CLASSES.hover);
            },function(){
                $.className.remove(this,CLASSES.hover);
            });

            jq.bind(
                ((_t == 'radio' || _t == 'checkbox') && 'click' ||
                    _n == 'select' && 'change' || 'keyup'), function(e){
                    valid(col, 'change', e);
                });
        });

        if (!xmlDom)
        {
            xmlDom = null;
            var xmlUrl = configs.xmlPath + key + '.xml';
            $.ajax({
                dataType : 'xml',
                url : xmlUrl,
                type : 'GET',
                success:function(xml){
                    xmlDom = toJson(xml);
                    $.data(window, key, xmlDom);
                }
            });
        }
        jqForm.submit(function(e){
            asyncCount = 0;
            asyncStart = (new Date()).getTime();

            if (typeof configs.beforeValidate == 'function') {
                configs.beforeValidate(jqForm);
            }
            // valid all
            var error_elements = [];
            for (var i=0,l=elements.length;i<l;i++)
            {
                valid(elements[i],'submit', e, asyncStart) || error_elements.push(elements[i]);
            }

            // error number > 0 return false;
            if (error_elements.length) {
                error_elements[0].focus().trigger('focus');
                $(this).attr('val_result', false);
                return false;
            }

            function next() {
                // else submit
                if (typeof configs.submitHandler == 'function')
                {
                    configs.submitHandler(jqForm);
                    return false;
                }

                // internal submit
                return true;
            }
            if (asyncCount > 0) {
                jqForm.unbind('asyncComplete').bind('asyncComplete', next);
                return false;
            }
            return next();
        });
    };


    validate.setRules = function(rules)
    {
        $.extend(RULES,rules);
    };

    validate.setConfigs = function(configs)
    {
        $.extend(CONFIGS,configs);
    };

    validate.setClasses = function(classes)
    {
        $.extend(CLASSES,classes);
    };


    $.validate = validate;
    $.validate.showInfo = showInfo;
    $.fn.validate = function(configs)
    {
        this.each(function(){
            validate(this, configs);
        });
        return this;
    };
})(jQuery);
