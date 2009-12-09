Resizable
=========

Creates resizable user interface elements, stores and retrieves positions from cookies, and each instance is aware of neighboring instances so the resizable limits are dynamically set to avoid resizing over each other

![Resizable](http://github.com/rpflorence/Resizable/raw/master/logo.png)

How to use
----------

Your elements need to be positioned absolutely within a container (or the body).  Handles need to be between the two elements you are resizing.  Check out the demo to see the HTML and CSS layout.

    #JS
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
    
    