"use strict";

var PWD = PWD || {};

// Onload, call our StartMenu!
$(window).load(function () {
    var desktopEl, width, height;

    // If we doesn't want fullscreen.
    desktopEl = $('.desktop');
    width = 1024;
    height = 640;
    /*desktopEl.css({
    	width: width,
    	height: height,
    	margin: 'auto',
        position: 'relative'
    });*/

    // Default background.
    desktopEl.css("background-image", "url(img/default-background.jpg)");

    PWD.StartMenu.call(this);
    console.log(PWD);
});