window.addEvent('domready',function(){

	leftResize = new Resizable('left_handle',{
		limit: {x: [20,null]},
		cookie: 'leftResize'
	});

	rightResize = new Resizable('right_handle',{
		invert: true,
		cookie: 'rightResize'
	});

	centerTopResize = new Resizable('center_top_handle',{
		mode: 'vertical',
		cookie: 'centerTopResize'
	});

	centerBottomResize = new Resizable('center_bottom_handle',{
		invert: true,
		mode: 'vertical',
		cookie: 'centerBottomResize'
	});

	ResizableLimits.attach();

});