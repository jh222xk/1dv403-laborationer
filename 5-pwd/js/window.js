"use strict";

(function ($) {

    var zIndex = 0;

    PWD.Window = function (title, icon, width, height) {
        console.log(this);
        var self = this;
        var rangeTop, rangeLeft, windowOffset, windowOffsetLeft;

        this.el = this.createWindow();

        this.title = title;
        this.icon = icon;
        this.width = width = typeof width !== 'undefined' ? width : 250;
        this.height = height = typeof height !== 'undefined' ? height : 400;

        this.setWindowTitle();
        this.setWindowIcon();
        this.setWindowPos();
        this.setWindowWidthHeight();

        this.setWindowIndex();

        this.el.windowEl.on('click', function(event) {
            event.preventDefault();
            self.setWindowIndex();
        });

        this.el.windowCloseLink.on('click', function(event) {
            event.preventDefault();
            self.closeWindow();
        });
    };

    // Function for setting the position of the window.
    PWD.Window.prototype.setWindowPos = function() {
        var self = this;
        var rangeTop, rangeLeft, windowOffset, 
            startMenuHeight, windowOffsetLeft,
            offsetLeft, offsetTop,
            $desktop, $startMenu, $window;

        // Set up some stuff.
        $desktop = $('.desktop');
        $startMenu = $('.start-menu');
        $window = $('.window');
        startMenuHeight = $startMenu.height();
        rangeTop = $desktop.height() - startMenuHeight;
        rangeLeft = $desktop.width();

        // The top offset of the window.
        windowOffset = this.el.windowEl.offset().top;
        // The left offset of the window.
        windowOffsetLeft = this.el.windowEl.offset().left;
         
        // Iterate over the jQuery window object.
        // And then set the offset and increase it.
        $window.each(function(i) {
            offsetLeft = windowOffsetLeft + self.width + 50;
            offsetTop = windowOffset + self.height + startMenuHeight + 50;
            windowOffset += 10;
            windowOffsetLeft += 10;
            if (rangeTop < offsetTop) {
                windowOffset = 10;
            }
            if (rangeLeft < offsetLeft) {
                windowOffsetLeft = 10;
            };
        });

        this.el.windowEl.css({
            top: windowOffset,
            left: windowOffsetLeft
        });
    }

    // Function for setting the index of the window 
    // (which window that should be on top).
    PWD.Window.prototype.setWindowIndex = function() {
        var el, $windowFocused;

        el = this.el.windowEl;
        $windowFocused = $(".window.focused");

        if (el.hasClass('focused')) {
            return;
        }

        $windowFocused.removeClass('focused');
        el.addClass('focused').css('z-index', ++zIndex);
    };

    // Function for creating the elements for the window.
    PWD.Window.prototype.createWindow = function() {
        var desktopEl, windowEl, windowTitleEl, windowTitleIcon,
            windowCloseEl, windowCloseLink, windowContentEl,
            windowTitleText, windowFooterEl;

            desktopEl = $('.desktop');
            windowEl = $('<div class="window" />');
            windowTitleEl = $('<div class="window-titlebar" />').appendTo(windowEl);
            windowTitleIcon = $('<div class="window-icon" />').appendTo(windowTitleEl);
            windowTitleText = $('<span class="window-text" />').appendTo(windowTitleEl);
            windowCloseEl = $('<div class="window-close" />').appendTo(windowTitleEl);
            windowCloseLink = $('<a href="#" title="Stäng fönster">x</a>').appendTo(windowCloseEl);
            windowContentEl = $('<div class="window-content" />').appendTo(windowEl);
            windowFooterEl = $('<div class="window-footer" />').appendTo(windowEl);
            
            windowEl.appendTo(desktopEl);

            // Return 'em.
            return {
                desktopEl: desktopEl,
                windowEl: windowEl,
                windowTitleEl: windowTitleEl,
                windowTitleIcon: windowTitleIcon,
                windowTitleText: windowTitleText,
                windowCloseLink: windowCloseLink,
                windowContentEl: windowContentEl,
                windowFooterEl: windowFooterEl
            }
    };

    // Function for setting the width and height of the window.
    PWD.Window.prototype.setWindowWidthHeight = function() {
        this.el.windowEl.css({
            width: this.width + 16,
            height: this.height
        });
        this.el.windowContentEl.css({
            width: this.width,
            height: this.height
        });
    };

    // Function for setting the title of the window.
    PWD.Window.prototype.setWindowTitle = function() {
        this.el.windowTitleText.text(this.title);
    };

    // Function for setting the icon of the window.
    PWD.Window.prototype.setWindowIcon = function() {
        this.el.windowTitleIcon.addClass(this.icon);
    };

    // Function for setting the content of the window.
    PWD.Window.prototype.setWindowContent = function(data) {
        //this.el.windowContentEl.html(data);
        this.el.windowContentEl.append(data);
    };

    // Function for setting the status of the window.
    PWD.Window.prototype.setFooterStatus = function(status) {
        var p;
        if (this.el.windowFooterEl.children().length < 2) {
            $('<div class="window-loading" />').appendTo(this.el.windowFooterEl);
            p = $('<p class="window-status" />').appendTo(this.el.windowFooterEl);
            p.text(status);
        }
    };

    // Function for removing the status of the window.
    PWD.Window.prototype.removeFooterStatus = function() {
        this.el.windowFooterEl.empty();
    };

    // Function for closing the window.
    PWD.Window.prototype.closeWindow = function() {
        this.el.windowEl.remove();
    };
})(jQuery);
