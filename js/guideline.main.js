/*-----------------------------------------------------------------*/
/* LightShow v0.8												   */
/* http://www.github.com/comfirm/LightShow.js/					   */
/* https://raw.github.com/comfirm/LightShow.js/master/license.txt  */
/*-----------------------------------------------------------------*/
var LightShow=window.LightShow||{};LightShow.log=LightShow.log||function(e){};LightShow=function(e){this.options=$.extend(true,{},LightShow.default_options,e);this.initialize()};LightShow.initialize=function(){if(!LightShow.is_initialized){LightShow.is_initialized=true;LightShow.registerKeyCommands()}};LightShow.registerKeyCommands=function(){$(document).keydown(function(e){if(e.keyCode==27){var t=0;var n=null;$.each(LightShow.instances,function(e,r){if(r.isVisible()&&r.z_index_base>t){t=r.z_index_base;n=r}});if(n&&n.options.hideOnEscape){n.hide()}}})};LightShow.getRelativeElementPosition=function(e,t,n,r,i,s,o){var u=$.isWindow(e.get(0));var a=u?e.scrollLeft():e.position().left;var f=u?e.scrollTop():e.position().top;switch(n){case"left":break;case"center":a+=e.outerWidth()/2-t.outerWidth()/2;break;case"right":a+=e.outerWidth()-t.outerWidth();break}switch(r){case"top":break;case"middle":f+=e.outerHeight()/2-t.outerHeight()/2;break;case"bottom":f+=e.outerHeight()-t.outerHeight();break}return{top:f,left:a}};LightShow.elementHitTest=function(e,t){var n=e.position();if(t.x>=n.left&&t.x<n.left+e.width()){if(t.y>=n.top&&t.y<n.top+e.height()){return true}}return false};LightShow.waitUntilDimensioned=function(e,t,n){var r;r=function(e){var i=[];$(e).each(function(){if(!this.complete&&this.readyState!==4){if(!($(this).width()>0&&$(this).height()>0)){i.push(this)}}});if(i.length==0){t()}else{setTimeout(function(){r(i)},n)}};r(e)};LightShow.instances={};LightShow.is_initialized=false;LightShow.implicit_id_offset=0;LightShow.current_z_index=-1;LightShow.default_options={id:"null",overlay:"document",content:null,showOnStartup:false,showOnHover:false,hideButtonSelector:".hide-button",hideOnEscape:true,style:{opacity:1,overflow:"hidden",background:null,backgroundColor:"#fff"},position:{content:{x_directive:"center",y_directive:"middle"}},callback:{initialization:{before:function(){},after:function(){}},show:{before:function(){},after:function(){}},hide:{before:function(){},after:function(){}}},effect:{type:"fade",duration:500,show:null,hide:null}};LightShow.getHighestZIndex=function(e){var t=0;$(e).each(function(){var e=LightShow.getElementZIndex($(this));if(e>t){t=e}});return t};LightShow.getElementZIndex=function(e){return parseInt(e.css("zIndex"),10)};LightShow.getInternalId=function(e){return"ls-"+(e==null?"unnamed-"+ ++LightShow.implicit_id_offset:e)};LightShow.showAll=function(){$.each(LightShow.instances,function(e,t){t.show()})};LightShow.hideAll=function(){$.each(LightShow.instances,function(e,t){t.hide()})};LightShow.prototype.is_initialized=false;LightShow.prototype.is_visible=false;LightShow.prototype.resize_source=null;LightShow.prototype.overlay_element=null;LightShow.prototype.content_element=null;LightShow.prototype.z_index_base=-1;LightShow.prototype.effect_wait_for_load=false;LightShow.prototype.effect_deferred_callback=null;LightShow.prototype.reposition_timer_id=0;LightShow.prototype.initialize=function(){var e=this;if(!this.options.is_initialized){this.options.is_initialized=true;this.options.callback.initialization.before(this);if(!LightShow.is_initialized){LightShow.initialize()}if(this.options.overlay){this.effect_wait_for_load=true;LightShow.waitUntilDimensioned($("img, iframe",this.options.overlay),function(){e.effect_wait_for_load=false;e.effect_deferred_callback&&e.effect_deferred_callback();e.effect_deferred_callback=null},50,true)}this.setContent(this.options.content);this.initializeOverlay();this.setEffect(this.options.effect.type,this.options.effect.duration,true);this.readapt(true);if(this.options.overlay&&this.options.showOnHover){$(document).mousemove(function(t){if(LightShow.elementHitTest(e.options.overlay,{x:t.pageX,y:t.pageY})){e.show()}else{e.hide()}})}else if(this.options.showOnStartup){this.show()}this.options.callback.initialization.after(this)}};LightShow.prototype.initializeOverlay=function(){var e=this;if(!this.overlay_element){var t=this.createContainer();this.resize_source=e.isDocumentOverlay()?$(document):this.options.overlay;var n=e.isDocumentOverlay()?{top:0,left:0}:this.options.overlay.offset();t.attr("id",this.options.id+"-overlay").addClass("ls-overlay").css({top:n.top,left:n.left,background:this.options.style.background?this.options.style.background:this.options.style.backgroundColor,"background-color":this.options.style.backgroundColor,opacity:this.options.style.opacity});if(e.isDocumentOverlay()){t.click(function(){e.hide();return false})}this.overlay_element=t;t.appendTo($("body"))}};LightShow.prototype.createContainer=function(){return $("<div />").hide().css({position:"absolute",top:"0px",left:"0px",padding:"0px",margin:"0px",overflow:this.options.style.overflow})};LightShow.prototype.isVisible=function(){return this.is_visible};LightShow.prototype.isElementOverlay=function(){return this.options.overlay&&this.options.overlay!="document"};LightShow.prototype.moveToTop=function(){var e=LightShow;if(e.current_z_index==-1){e.current_z_index=e.getHighestZIndex("*")+1e3}this.z_index_base=!this.options.overlay&&this.isElementOverlay()?LightShow.getElementZIndex(this.options.overlay)+1:e.current_z_index+=100;this.overlay_element.css("z-index",this.z_index_base+5);this.content_element.css("z-index",this.z_index_base+10);return this};LightShow.prototype.show=function(e){var t=this;if(this.effect_wait_for_load){this.effect_deferred_callback=function(){t.readapt();t.show(e)};return}if(!this.is_visible){this.is_visible=true;t.options.callback.show.before(this);if(this.z_index_base==-1){this.moveToTop()}(this.options.effect.showOverlay||this.options.effect.show)(t.overlay_element,function(){});(this.options.effect.showContent||this.options.effect.show)(t.content_element,function(){e&&e();t.options.callback.show.after(t)})}return this};LightShow.prototype.hide=function(e){var t=this;if(this.effect_wait_for_load){this.effect_deferred_callback=function(){t.readapt();t.hide(e)};return}if(this.is_visible){this.is_visible=false;this.options.callback.hide.before(this);(this.options.effect.hideOverlay||this.options.effect.hide)(this.overlay_element,function(){});(this.options.effect.hideContent||this.options.effect.hide)(t.content_element,function(){e&&e();t.options.callback.hide.after(t)});this.options.callback.hide.after(this)}return this};LightShow.prototype.release=function(){this.overlay_element.remove();this.content_element.remove();this.overlay_element=this.content_element=null;delete LightShow.instances[this.options.id]};LightShow.prototype.isDocumentOverlay=function(){return this.options.overlay=="document"};LightShow.prototype.readapt=function(e){var t=this;var n=function(){if(!t.effect_wait_for_load){var e=t.isDocumentOverlay()?{top:0,left:0}:t.options.overlay.offset();t.overlay_element.css({top:e.top,left:e.left,width:t.resize_source.outerWidth(),height:t.resize_source.outerHeight()});var n=LightShow.getRelativeElementPosition(t.isDocumentOverlay()?$(window):t.options.overlay,t.content_element,t.options.position.content.x_directive,t.options.position.content.y_directive);if(t.reposition_timer_id){clearTimeout(t.reposition_timer_id);t.reposition_timer_id=setTimeout(function(){t.content_element.animate(n,400);reposition_timer_id=0},50)}else{t.reposition_timer_id=1;t.content_element.css(n)}}};if(e){$(window).resize(n).ready(n).load(n).scroll(n);$("img, iframe, script",t.options.overlay).load(n).each(function(){if(this.complete){$(this).trigger("load")}});this.resize_source.resize(n)}n();return this};LightShow.prototype.setEffect=function(e,t,n){var r,i=null;t=t||this.options.effect.duration;switch(e){case"fade":r=function(e,n){e.fadeIn(t,n)};i=function(e,n){e.fadeOut(t,n)};break;case"slide":r=function(e,n){e.slideDown(t,n)};i=function(e,n){e.slideUp(t,n)};break;case"toggle":r=function(e,n){e.show(t,n)};i=function(e,n){e.hide(t,n)};break;default:LightShow.log("Invalid effect type '"+e+"'. Effect does not exist.");break}if(r&&i){if(!(n&&this.options.effect.show)){this.options.effect.show=r}if(!(n&&this.options.effect.hide)){this.options.effect.hide=i}}return this};LightShow.prototype.setContent=function(e){var t=this;if(this.content_element){this.content_element.remove();this.content_element=null}var n=(typeof e).toLowerCase()=="string"?$(e):e instanceof jQuery?e:null;if(n){var r=this.createContainer().addClass("ls-content").append(n);if($(this.options.hideButtonSelector,r).length>0){$(this.options.hideButtonSelector,r).click(function(){t.hide();return false})}this.content_element=r;$("body").append(r)}else{LightShow.log("Unable to set content. Content neither JQuery element or string (HTML).")}return this};var JQuery=JQuery||$||{};jQuery.lightShow=function(e){var t;var n=LightShow;if((typeof e).toLowerCase()=="string"){var r=n.getInternalId(e);if(r in n.instances){t=n.instances[r]}else{LightShow.log("Invalid ID '"+r+"'. LightShadow instance not found.")}}else{var r=e.id=n.getInternalId(e.id);if(r in n.instances){LightShow.log("LightShadow instance ID '"+r+"' already used. Please select another one")}else{t=n.instances[r]=new n(e)}}return t};

/*-----------------------------------------------------------------------------------------------*/
/* jQuery.ScrollTo 1.4.6																		 */
/* Copyright (c) 2007-2013 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com  */
/* Dual licensed under MIT and GPL.																 */
/*-----------------------------------------------------------------------------------------------*/
;(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c)};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(e==null)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key]}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,targ,g)})}}).end()};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);

/*--------------*/
/* Guideline.js */
/*--------------*/
;(function(){
	var Guideline = window.Guideline = window.Guideline || {};

	Guideline._guides = {};
	Guideline._currentPage = null;
	Guideline._conditionQueue = null;

	// Utilities

	var Utility = {};

	// Attach a handler to the top of the event queue
	Utility.attachOnFirst = function(selector, eventName, callback) {
		// Inspired by this SO post
		// http://stackoverflow.com/a/2641047/1967542
		var element = $(selector).on(eventName, callback)[0];
	    var safeEventName = eventName.split('.')[0].split(' ')[0];
	    var handlers = $._data(element, 'events')[safeEventName];
	    var handler = handlers.pop();
	    handlers.splice(0, 0, handler);
	};

	// Parse an event 
	Utility.parseEvent = function(rawEvent){
		var data = {};
		var buffer = "";
		var state = "name";

		for(var i=0;i<rawEvent.length;++i){
			var character = rawEvent[i];
			buffer += character;
			if(state == 'name' && character == ' '){
				data[state] = buffer;
				state = "selector";
				buffer = '';
			}
		}

		data[state] = buffer;
		
		return data;
	};

	Utility.getRelativeElementPosition = function(source, targetElement, xDirective, yDirective){
		var isSourceWindow = $.isWindow(source.get(0));

		var xPosition = isSourceWindow ? source.scrollLeft() : source.offset().left;
		var yPosition = isSourceWindow ? source.scrollTop() : source.offset().top;

		if(isSourceWindow){
			switch(xDirective){
				case 'left':
					break;
				case 'center':
					xPosition += (source.outerWidth()/2)-(targetElement.outerWidth()/2);
					break;
				case 'right':
					xPosition += source.outerWidth()-targetElement.outerWidth();
					break;
			}

			switch(yDirective){
				case 'top':
					break;
				case 'middle':
					yPosition += (source.outerHeight()/2)-(targetElement.outerHeight()/2);
					break;
				case 'bottom':
					yPosition += source.outerHeight();//-targetElement.outerHeight();
					break;
			}	
		}else{
			switch(xDirective){
				case 'left':
					xPosition -= targetElement.outerWidth();
					break;
				case 'center':
					xPosition += (source.outerWidth()/2)-(targetElement.outerWidth()/2);
					break;
				case 'right':
					xPosition += source.outerWidth();
					break;
			}

			switch(yDirective){
				case 'top':
					yPosition -= targetElement.outerHeight();
					break;
				case 'middle':
					yPosition += (source.outerHeight()/2)-(targetElement.outerHeight()/2);
					break;
				case 'bottom':yPosition
					yPosition += source.outerHeight();
					break;
			}
		}

		return {
			'x': xPosition,
			'y': yPosition
		};
	};

	// Cookie handling
	// https://github.com/comfirm/Kaka.js

	Utility.Cookie = {};

	Utility.Cookie.get = function(name){
		var cookies = {};
		var decodeComponent = decodeURIComponent;
		var data = (document.cookie || "").split("; ");

		for(var i=0;i<data.length;++i){
			var segments = data[i].split("=", 2);
			if(segments.length == 2){
				cookies[decodeComponent(segments[0])] = decodeComponent(segments[1]);
			}
		}

		return (name === undefined ? cookies : (name in cookies ? cookies[name] : null));
	};

	Utility.Cookie.set = function(name, value, expires, path){
		var variables = {};
		var encodeComponent = encodeURIComponent;

		variables[name] = value == undefined || value == null ? '' : value;
		variables['path'] = path || '/';

		if(expires && expires.toGMTString){
			variables["expires"] = expires.toGMTString();
		}

		var cookie = "";

		for(var key in variables){
			cookie += (cookie != "" ? "; " : "") + encodeComponent(key) + "=" + encodeComponent(variables[key]);
		}

		document.cookie = cookie;
	};

	Utility.Cookie.remove = function(name){
		Utility.Cookie.set(name, null, new Date(0));
	};

	// Core

	Guideline.assertEnginesOn = function(){
		if(Guideline._conditionQueue === null){
			Guideline._conditionQueue = new ConditionQueue();
		}
	};

	// Page handling

	Guideline.setCurrentPage = function(pageName){
		if(Guideline._currentPage != pageName){
			Guideline._currentPage = pageName;
			Guideline.notifyPageChange(Guideline._guides);
		}
	};

	Guideline.notifyPageChange = function(guides){
		if(Guideline._currentPage != null){
			for(var name in guides){
				var guide = guides[name];
				guide.notifyPageChange(Guideline._currentPage);
			}
		}
	};

	// Guide registration

	Guideline.registerGuide = function(guide){
		var guideName = guide.getName();
		if(!(guideName in Guideline._guides)){
			Guideline._guides[guideName] = guide;
			Guideline.notifyPageChange({'0':guide});
		}
	};

	Guideline.getGuide = function(name){
		return name in Guideline._guides ? Guideline._guides[name] : null;
	};

	// Conditions

	Guideline.registerConditionCheck = function(conditionFunction, callback, timeout){
		Guideline.assertEnginesOn();
		return Guideline._conditionQueue.add(conditionFunction, callback, timeout);
	};

	// Event emitter

	var EventEmitter = function(){
		this._events = {};
	};

	EventEmitter.prototype.emit = function(){
		if(arguments.length == 0){
			return false;
		}

		var argumentsCopy = $.makeArray(arguments).sort();
		var eventName = argumentsCopy.pop();

		if(eventName in this._events){
			var eventHandlers = this._events[eventName];
			for(var i=0;i<eventHandlers.length;++i){
				var handler = eventHandlers[i];
				handler.apply(handler, argumentsCopy || []);
			}
		}
	};

	EventEmitter.prototype.on = function(eventName, handler){
		if(!(eventName in this._events)){
			this._events[eventName] = [handler];
		}else{
			this._events[eventName].push(handler);
		}
	};

	// Condition queue

	var ConditionQueue = function(){
		this._items = null;
		this._polling = false;
		this._identityOffset = 0;
		this._defaultMsTimeout = 30*1000; // 30s
		this._msPollInterval = 250; // 250ms
	};

	ConditionQueue.prototype.assertPolling = function(){
		if(!this._polling){
			this.poll();
		}
	};

	ConditionQueue.prototype.add = function(conditionFunction, callback, timeout){
		if(timeout === undefined){
			timeout = this._defaultMsTimeout;
		}

		var identityOffset = ++this._identityOffset;

		if(this._items == null){
			this._items = [];
		}
		
		this._items.push({
			id: identityOffset,
			condition:conditionFunction,
			callback:callback,
			expireAt: timeout === null ? null : new Date().getTime()+timeout
		});
		
		this.assertPolling();

		return identityOffset;
	};

	ConditionQueue.prototype.cancel = function(itemId){
		for(var i=0;i<this._items.length;++i){
			var item = this._items[i];
			if(item.id == itemId){
				item.expireAt = 0;
				break;
			}
		}
	};

	ConditionQueue.prototype.poll = function(){
		if(!this._polling){
			this._polling = true;

			var items = [];
			var outerScope = this;
			var currentTime = new Date().getTime();

			for(var i=0;i<this._items.length;++i){
				var result = null;
				var item = this._items[i];
				if(item !== null){
					if(item.expireAt !== null && item.expireAt < currentTime){
						item.callback('Callback expired');
					}else if((result = item.condition())){
						item.callback(null, result);
					}else{
						// Not finished yet, push back onto queue
						items.push(item);
					}
				}
			}

			this._items = items;
			this._polling = false;

			if(items.length > 0){
				setTimeout(function(){outerScope.poll();}, this._msPollInterval);
			}
		}
	};
	
	// Guide

	var Guide = Guideline.Guide = function(name, options){
		options = options || {};

		this._pages = [];
		this._emitter = new EventEmitter();

		this.setName(name);
		this.setStartOnUrl(options.startOnUrl);
		this.setSkipAsDefault(options.skipAsDefault);

		this.reset();
	};

	// Properties

	// Name

	Guide.prototype.getName = function(){
		return this._name;
	};

	Guide.prototype.setName = function(name){
		this._name = name;
	};

	// Started

	Guide.prototype.getStarted = function(){
		return this._started || false;
	};

	Guide.prototype.setStarted = function(started){
		this._started = started || false;
	};

	// Start on url

	Guide.prototype.getStartOnUrl = function(){
		return this._startOnUrl;
	};

	Guide.prototype.setStartOnUrl = function(url){
		this._startOnUrl = url || null;
	};

	// Skip on start

	Guide.prototype.getSkipAsDefault = function(){
		return this._skipAsDefault;
	};

	Guide.prototype.setSkipAsDefault = function(skip){
		this._skipAsDefault = skip === undefined ? true : skip;
	};

	// Page

	Guide.prototype.getNextPage = function(){
		var pageOffset = this.getPageOffset()+1;

		if(pageOffset >= 0 && pageOffset <= this._pages.length-1){
			return this.getPage(pageOffset);
		}

		return null;
	};

	Guide.prototype.getPage = function(offset){
		if(offset === undefined){
			offset = this.getPageOffset();
		}
		return this._pages[offset];
	};

	Guide.prototype.changeToNextPage = function(){
		var nextPage = this.getNextPage();
		
		if(nextPage != null){
			this.setStepOffset(-1);
			this.incrementPageOffset();
			this._steps = this.getPage().getSteps();
		}

		this.changeToNextStep();
	};

	// Step

	Guide.prototype.changeToNextStep = function(){
		var parentStep = this.getParentStep();

		var nextStep = this.getNextStep();
		this.incrementStepOffset();
		
		if(parentStep == null){
			this._emitter.emit('start', this);
		}else{	
			parentStep.hide();
		}

		if(nextStep == null){
			// Is this the last page? If so, the guide is complete!
			if(this.getNextPage() == null){
				this._emitter.emit('complete', this);
			}

			// Write page to begin at
			Utility.Cookie.set("guideline_"+this.getName(), this.getPageOffset());
		}else{
			this.setParentStep(nextStep);
			nextStep.show();
		}
	};

	Guide.prototype.getNextStep = function(){
		var stepOffset = this.getStepOffset()+1;

		if(stepOffset >= 0 && stepOffset <= this._steps.length-1){
			return this.getStep(stepOffset);
		}

		return null;
	};

	Guide.prototype.getStep = function(offset){
		if(offset === undefined){
			offset = this.getStepOffset();
		}
		return this._steps[offset];
	};

	// Page offset

	Guide.prototype.getPageOffset = function(){
		var storedPageOffset = parseInt(Utility.Cookie.get("guideline_"+this.getName()));

		if(this._pageOffset == -1 && storedPageOffset >= -1){
			this._pageOffset = parseInt(storedPageOffset);
		}

		return this._pageOffset;
	};

	Guide.prototype.setPageOffset = function(offset){
		this._pageOffset = offset;
	};

	Guide.prototype.incrementPageOffset = function(){
		++this._pageOffset;
		return this._pageOffset;
	};

	// Step offset

	Guide.prototype.getStepOffset = function(){
		return this._stepOffset;
	};

	Guide.prototype.setStepOffset = function(offset){
		this._stepOffset = offset;
	};

	Guide.prototype.incrementStepOffset = function(){
		++this._stepOffset;
		return this._stepOffset;
	};

	Guide.prototype.isLastStepOffset = function(){
		return this.getStepOffset() == this._steps.length;
	};

	// Parent Step

	Guide.prototype.setParentStep = function(step){
		this._parentStep = step;
	};

	Guide.prototype.getParentStep = function(){
		return this._parentStep;
	}

	// Events

	Guide.prototype.on = function(event, handler){
		this._emitter.on(event, handler);
		return this;
	};

	Guide.prototype.notifyPageChange = function(pageName){
		var parentStep = this.getParentStep();
		
		if(parentStep != null){
			parentStep.hide();
		}

		if(!this.getStarted()){
			var cookieValue = Utility.Cookie.get("guideline_"+this.getName());

			if(cookieValue === null && this._skipAsDefault){
				cookieValue = "skipped";
				Utility.Cookie.set("guideline_"+this.getName(), "skipped");
			}

			// Check whether or not this guide is skipped
			if(cookieValue == "skipped"){
				return;
			}
		}	

		var nextPage = this.getNextPage();

		if(nextPage != null){
			if(nextPage.getName() == pageName && (this.getStepOffset() == -1 || this.isLastStepOffset())){
				this.changeToNextPage();
			}else if(this.getPageOffset() != -1){
				this.skip();
			}
		}
	};

	// Pages

	Guide.prototype.addPage = function(name, options){
		options = options || {};
		options.guide = this;
		options.name = name;
		
		var page = new Guideline.Page(options);
		this._pages.push(page);

		return page;
	};

	Guide.prototype.start = function(){
		if(this.getStarted()){
			return false;
		}

		this.reset();
		this.setStarted(true);
		Utility.Cookie.set("guideline_"+this.getName(), -1);

		// Check whether current page is our start page
		if(Guideline._currentPage == this.getPage(0).getName()){
			this.notifyPageChange(Guideline._currentPage);
		}else if(this.getStartOnUrl() != null){
			window.location.href = this.getStartOnUrl();
		}
	};

	Guide.prototype.restart = function(){
		this._emitter.emit('restart', this);
		
		Utility.Cookie.set("guideline_"+this.getName(), -1);
		this.reset();

		return this;
	};

	Guide.prototype.register = function(){
		// Register the guide globally so we can
		// receive global page change notifications
		Guideline.registerGuide(this);
	};

	// Skip the guide
	Guide.prototype.skip = function(){
		var currentStep = this.getStep();

		if(currentStep){
			currentStep.hide();
		}

		this._emitter.emit('skip', this);
		Utility.Cookie.set("guideline_"+this.getName(), "skipped");

		this.reset();
	};

	Guide.prototype.reset = function(){
		this._steps = [];
		this.setStarted(false);
		this.setParentStep(null);
		this.setPageOffset(-1);
		this.setStepOffset(-1);
	};

	// Page

	// A page is a collection of steps that are a part of a guide. 

	var Page = Guideline.Page = function(options){
		this._steps = [];
		this.stepOffset = -1;
		this.name = options.name || null;
		this.guide = options.guide || null;
	};

	// Name

	Page.prototype.getName = function(){
		return this.name;
	};

	// Step

	Page.prototype.addStep = function(options){
		options = options || {};
		options.guide = this.guide;
		
		var step = new Guideline.Step(options);
		this._steps.push(step);

		return step;
	};

	Page.prototype.getStep = function(offset){
		return offset < this._steps.length ? this._steps[offset] : null;
	}

	Page.prototype.getSteps = function(){
		return this._steps;
	};

	// Step

	// A guide consists of many steps

	var Step = Guideline.Step = function(options){
		this._actor = null;
		this._hasChanged = false;
		this._hideTimeout = null;
		this._progressBar = null;
		this._bubble = null;
		this._emitter = new EventEmitter();

		this.type = options.type || 'bubble';
		this.guide = options.guide || null;
		this.title = options.title || null;
		this.content = options.content || null;
		this.showAt = options.showAt || "document";
		this.showSkip = options.showSkip || true;
		this.align = options.align || "auto";
		this.overlayOptions = options.overlayOptions || {};
		
		this.continueHtml = options.continueHtml || null;
		this.continueAfter = options.continueAfter || 0;
		this.showContinue = options.showContinue === true;

		if(options.continueWhen !== undefined && typeof (options.continueWhen) != 'string'){
			this.continueWhen = options.continueWhen;
		}else{
			if(options.continueWhen === undefined && typeof (options.showAt) == 'string'){
				options.continueWhen = 'click ' + this.showAt;
			}

			this.continueWhen = options.continueWhen ? Utility.parseEvent(options.continueWhen) : null;
		}
	};

	Step.prototype.on = function(event, handler){
		this._emitter.on(event, handler);
		return this;
	};

	Step.prototype.show = function(){
		var outerScope = this;

		var wasHidden = !this._visible;
		this._visible = true;

		if(wasHidden){
			this._emitter.emit('show', this);

			this.getActor().show();

			if(this.continueAfter){
				this._hideTimeout = setTimeout(
					function(){ outerScope.changeToNextStep(); },
					this.continueAfter*1000
				);
			}
		}
	};

	Step.prototype.hide = function(){
		var wasVisible = this._visible;
		this._visible = false;

		if(this._hideTimeout){
			clearTimeout(this._hideTimeout);
		}

		if(this._progressBar){
			this._progressBar.stop();
		}

		if(wasVisible){
			this._emitter.emit('hide', this);
			this.getActor().hide();
		}
	};

	Step.prototype.changeToNextStep = function(){
		if(!this._hasChanged && this._visible){
			this._hasChanged = true;
			if(this.guide){
				this.guide.changeToNextStep();
			}
		}
	};

	Step.prototype.getContentElements = function(){
		var outerScope = this;
		var contentElements = $("<div />");

		if(this.title){
			var headingLevel = this.type == "overlay" ? 1 : 2;
			contentElements.append($("<h"+headingLevel+" />").text(this.title));
		}

		if(this.content){
			var contentElement = $("<div />").html(this.content);
			
			$(".gl-continue", contentElement).click(function(){
				outerScope.changeToNextStep();
			});

			$(".gl-skip", contentElement).click(function(){
				outerScope.guide.skip();
				return false;
			});

			contentElements.append(contentElement);
		}

		if (this.showSkip && this.type != "overlay") {
			var skipElement = $('<a href="#" class="gl-skip gl-close" title="Close Guide">&times;</a>');
			skipElement.click(function(){
				outerScope.guide.skip();
				return false;
			});
			contentElements.append(skipElement);
		}

		if(this.showContinue){
			var continueElement;
			
			if (typeof(this.continueHtml) === "string") {
				continueElement = $(this.continueHtml);
			} else {
				continueElement = $("<a />").attr("href", "#").text("Continue");
			}
			
			contentElements.append(
				continueElement.click(function(){
					outerScope.changeToNextStep();
					return false;
				})
			);
		}

		if(this.continueAfter > 0){
			var percentage = 0;
			var outerScope = this;

			var progressBar = this._progressBar = $("<div />")
				.addClass("progress-bar")
				.animate({ width: '100%' }, outerScope.continueAfter*1000);

			contentElements.append(progressBar);
		}

		if(this.continueWhen){
			var event = outerScope.continueWhen;
			var isEventFunction = event && typeof (event) == 'function';

			Guideline.registerConditionCheck(isEventFunction ? event : function(){
				return $(event.selector).length > 0;
			}, function(error, result){
				if(!error){
					$(document).ready(function(){
						if(isEventFunction){
							outerScope.changeToNextStep();
						}else{
							Utility.attachOnFirst(event.selector, event.name, function(){
								outerScope.changeToNextStep();
							});
						}
					});
				}
			}, null);
		}

		return contentElements;
	};

	Step.prototype.getActor = function(){
		if(!this._actor){
			this._actor = this.type == 'bubble' ? this.getBubble() : this.getOverlay();
		}
		return this._actor;
	};

	Step.prototype.getOverlay = function(){
		var outerScope = this;

		var overlayTarget = this.showAt == "window" || this.showAt == "document" ? undefined : $(this.showAt);
		var contentElement = $("<div />").addClass('gl-overlay').append(this.getContentElements());

		return $.lightShow({
			overlay: overlayTarget,
			content: contentElement,
			callback: {
				hide: {
					after: function(){
						outerScope.changeToNextStep();
					}
				}
			},
			style: this.overlayOptions.style
		});
	};

	Step.prototype.getBubble = function(){
		if(!this._bubble){
			this._bubble = new Bubble({
				content: this.getContentElements(),
				showAt: this.showAt,
				align: this.align
			});
		}
		return this._bubble;
	};

	// Bubble

	var Bubble = Guideline.Bubble = function(options){
		this._visible = false;
		this._cachedElement = null;
		this._redraw_position_timer_id = -1;
		this.content = options.content ||null;
		this.showAt = options.showAt ||null;
		this.align = options.align ||null;
	};

	Bubble.parseAlignment = function(alignment){
		var segments = alignment.split(' ', 2);

		if(segments.length == 0 || segments[0] == 'auto'){
			return {'x':'right','y':'bottom'};
		}

		if(segments.length != 2){
			return false;
		}

		return {'x':segments[0],'y':segments[1]};
	};

	Bubble.getArrowAlignment = function(alignment){
		if(alignment.x != 'center'){
			return alignment.x;
		}
		if(alignment.y != 'middle'){
			return alignment.y;
		}
		return null;
	};

	// Decide how we should position the bubble relative to the element
	Bubble.prototype.positionAt = function(target, align){
		var outerScope = this;

		target = $(target);
		var element = this.getElement();
		
		var alignment = Bubble.parseAlignment(align);
		var position = Utility.getRelativeElementPosition(target, element, alignment.x, alignment.y);
		element.addClass(Bubble.getArrowAlignment(alignment));

		if(scroll){
			if(!$.isWindow(target.get(0))){
				$.scrollTo(position.y-($(window).outerHeight()/2)+(element.outerHeight()/2), 400);
			}
		}

		var redrawPosition;
		redrawPosition = function(){
			if(!outerScope._visible){
				return;
			}

			var position = Utility.getRelativeElementPosition(target, element, alignment.x, alignment.y);

			outerScope.redrawPosition(position.x, position.y);
			outerScope._redraw_position_timer_id = setTimeout(redrawPosition, 100);
		};

		redrawPosition();
	};

	// Draws the element onto a new position. Could possibly animate using delta for smoothness.
	Bubble.prototype.redrawPosition = function(left, top){
		this.getElement().css({
			left: left,
			top: top
		});
	};

	Bubble.prototype.getElement = function(){
		if(!this._cachedElement){
			var arrow = $("<div />")
				.addClass("arrow");

			var content = this.content ? $("<div />")
				.addClass("content").html(this.content) : null;

			this._cachedElement = $("<div />")
				.addClass("gl-bubble")
				.css({
					display: "none",
					position: "absolute",
					"z-index": 999999999,
					left: 0,
					top: 0
				})
				.append(arrow)
				.append(content)
				.appendTo("body");
		}

		return this._cachedElement;
	};

	Bubble.prototype.show = function(){
		var outerScope = this;

		if(!this._visible){
			this._visible = true;
			var element = this.getElement();

			if(typeof(outerScope.showAt) == 'function'){
				Guideline.registerConditionCheck(
					outerScope.showAt,
					function(error, result){
						outerScope.showAt = result;
						outerScope.positionAt(outerScope.showAt, outerScope.align);
						element.fadeIn();
					}
				);
			}else{
				Guideline.registerConditionCheck(function(){
					return $(outerScope.showAt).length > 0;
				}, function(error){
					outerScope.positionAt(outerScope.showAt, outerScope.align);
					element.fadeIn();
				});
			}

			return element;
		}
	};

	Bubble.prototype.hide = function(){
		if(this._visible){
			this._visible = false;
			clearTimeout(this._redraw_position_timer_id);
			this.getElement().fadeOut();
		}
	};
})();