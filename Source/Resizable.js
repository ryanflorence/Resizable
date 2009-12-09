/*
---

script: Resizable.js

description: Creates resizable user interface elements, stores and retrieves positions from cookies, and each instance is aware of neighboring instances so the resizable limits are dynamically set to avoid resizing over each other

license: MIT-style license.

authors: Ryan Florence <http://ryanflorence.com>

docs: http://moodocs.net/rpflo/mootools-rpflo/Resizable

requires:
- more:1.2.4.2/Drag

provides: [Resizable, ResizableLimits]

...
*/


var Resizable = new Class({
	
	Extends: Drag,

		options: {
			/* onSet: $empty, */
			limit: {
				x:[0,null],
				y:[0,null]
			},
			mode: 'horizontal',
			addToResizableLimits: true,
			cookie: false
		},

	initialize: function(element,options){
		this.parent(element,options);
		this.parentElement = this.element.getParent();
		if(this.options.mode == 'horizontal'){
			this.isHorizontal = true;
			this.options.modifiers.y = false;
			this.firstProperty = 'width';
			this.handleSize = this.element.getSize().x;
			if(this.options.invert){
				this.first = this.element.getNext();
				this.second = this.element.getPrevious();
				this.secondProperty = 'right';
				this.options.modifiers.x = 'right';
			} else {
				this.first = this.element.getPrevious();
				this.second = this.element.getNext();
				this.secondProperty = 'left';
				this.options.modifiers.x = 'left';
			}
		} else {
			this.isHorizontal = false;
			this.options.modifiers.x = false;
			this.firstProperty = 'height';
			this.handleSize = this.element.getSize().y;
			if(this.options.invert){
				this.first = this.element.getNext();
				this.second = this.element.getPrevious();
				this.secondProperty = 'bottom';
				this.options.modifiers.y = 'bottom';
			} else {
				this.first = this.element.getPrevious();
				this.second = this.element.getNext();
				this.secondProperty = 'top';
				this.options.modifiers.y = 'top';
			}
		}
		
		if(this.options.addToResizableLimits){
			(this.isHorizontal) ? ResizableLimits.horizontal.include(this) : ResizableLimits.vertical.include(this);	
		}
		
		if(this.options.cookie){
			this.setFromCookie();
			this.addEvent('complete',this.setCookie.bind(this));
		}
		
	},
	
	drag: function(event){
		this.parent(event);
		if(this.isHorizontal){
			this.distance = (this.options.invert) ? 
				this.parentElement.getSize().x - this.element.getPosition(this.parentElement).x - (this.handleSize * 2) :
				this.element.getPosition(this.parentElement).x - this.handleSize;
		} else {
			this.distance = (this.options.invert) ?
				this.parentElement.getSize().y - this.element.getPosition(this.parentElement).y - this.handleSize :
				this.element.getPosition(this.parentElement).y;
		}
		this.set(this.distance,true);
		return this;
	},
	
	set: function(distance,fromDrag){
		this.first.setStyle(this.firstProperty, distance);
		this.second.setStyle(this.secondProperty, distance + this.handleSize);
		if(!fromDrag) this.element.setStyle(this.secondProperty, distance);
		this.fireEvent('set');
		return this;
	},
	
	setFromCookie: function(){
		var cookie = Cookie.read(this.options.cookie);
		if(cookie) this.set(cookie.toInt());
		return this;
	},

	setCookie: function(){
		Cookie.write(this.options.cookie, this.distance, { duration: 30});
		return this;
	}

});

var ResizableLimits = new Hash({

	horizontal: [],
	vertical: [],
	
	setLimits : {
		all: function(){
			ResizableLimits.setLimits.vertical();
			ResizableLimits.setLimits.horizontal();
			return ResizableLimits;
		},
		
		horizontal: function(){
			ResizableLimits.horizontal.each(function(instance,index){
				if(instance.options.invert){
					var previous = ResizableLimits.horizontal[index - 1];
					var limit = (previous) ? instance.parentElement.getSize().x - previous.element.getPosition(instance.parentElement).x - (instance.handleSize * 3) : false;
				} else {
					var next = ResizableLimits.horizontal[index + 1];
					var limit = (next) ? next.element.getPosition(instance.parentElement).x - (instance.handleSize * 2) : false;
				}
				if(limit) instance.options.limit.x[1] = limit;
			});
			return ResizableLimits
		},
		
		vertical: function(){
			ResizableLimits.vertical.each(function(instance,index){
				if(instance.options.invert){
					var previous = ResizableLimits.vertical[index - 1];
					var limit = (previous) ? instance.parentElement.getSize().y - previous.element.getPosition(previous.parentElement).y - (instance.handleSize * 2) : false;
				} else {
					var next = ResizableLimits.vertical[index + 1];
					var limit = (next) ? next.element.getPosition(next.parentElement).y - instance.handleSize : false;
				}
				if(limit) instance.options.limit.y[1] = limit;
			});
			return ResizableLimits;
		}
	},
		
	attach: function(){
		ResizableLimits.setLimits.all();
		ResizableLimits.horizontal.each(function(instance){
			instance.addEvent('complete',ResizableLimits.setLimits.horizontal);
		});
		ResizableLimits.vertical.each(function(instance){
			instance.addEvent('complete',ResizableLimits.setLimits.vertical);
		});
		window.addEvent('resize',ResizableLimits.setLimits.all);
		return ResizableLimits
	}
	
});