"use strict";

(function ($) {

    var zIndex = 0;

    PWD.Window = function (title, icon, width, height) {
        console.log(this);
        var self = this;

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
            // Click event on the WINDOW element to set the
            // z-index (focus).
            event.preventDefault();
            self.setWindowIndex();
        });

        // Click event on the close link to close the window
        // (and remove it from the DOM).
        this.el.windowCloseLink.on('click', function(event) {
            event.preventDefault();
            self.closeWindow();
        });

        // Click event on the maximize element to maximize the window.
        this.el.windowMaximizeEl.on('click', function(event) {
            event.preventDefault();
            self.maximizeWindow();
        });

        // Double click event to either maximize or restore.
        this.el.windowTitleEl.on('dblclick', function(event) {
            event.preventDefault();
            if (self.el.windowEl.hasClass('maximized')) {
                self.restoreWindow();
            }
            else {
                self.maximizeWindow();
            }
            
        });

        // Click event on the restore element to bring it back.
        this.el.windowRestoreEl.on('click', function(event) {
            event.preventDefault();
            self.restoreWindow();
        });
    };

    // Function for maximizing the window.
    PWD.Window.prototype.maximizeWindow = function() {
        var height, width, $desktop, $startMenu;

        $desktop = $('.desktop');
        $startMenu = $('.start-menu');

        // Save the window position.
        this.saveWindowPos(this.el.windowEl);

        height = $desktop.height() - $startMenu.height();

        // Add values to the window.
        this.el.windowEl.css({
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            width: $desktop.width(),
            height: height
        }).addClass('maximized');
        // Add values to the content of the window.
        this.el.windowContentEl.css({
            width: $desktop.width() - 16,
            height: height - $startMenu.height() - this.el.windowTitleEl.height() - this.el.windowFooterEl.height() + 11
        });

        // Hide the maximize element.
        this.el.windowMaximizeEl.hide();
        // Show the restore element instead.
        this.el.windowRestoreEl.show();
    };

    // Function for restoring the window from the maximize state.
    PWD.Window.prototype.restoreWindow = function() {
        var el;

        el = this.el.windowEl;

        if (el.hasClass('maximized')) {
            el.removeClass('maximized');
        }

        this.setWindowWidthHeight();

        // Set the position to where it were before it got maximized.
        el.css(el.data('old-position'));

        // Hide the restore element.
        this.el.windowRestoreEl.hide();
        // Show the maximize element instead.
        this.el.windowMaximizeEl.show();
    };

    // Function for getting the position of the window.
    PWD.Window.prototype.getWindowPos = function(el) {
        el.top = el.offset().top;
        el.left = el.offset().left;

        return el;
    };

    // Function for setting the position of the window.
    PWD.Window.prototype.saveWindowPos = function(el) {
        var windowPosition;

        windowPosition = this.getWindowPos(el);
        el.data('old-position', {
            top: windowPosition.top,
            left: windowPosition.left
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
            windowCloseEl, windowMaximizeEl, windowRestoreEl,
            windowCloseLink, windowContentEl, windowTitleText,
            windowFooterEl;

            desktopEl = $('.desktop');
            windowEl = $('<div class="window" />');
            windowTitleEl = $('<div class="window-titlebar" />').appendTo(windowEl);
            windowTitleIcon = $('<div class="window-icon" />').appendTo(windowTitleEl);
            windowTitleText = $('<span class="window-text" />').appendTo(windowTitleEl);
            windowCloseEl = $('<div class="window-close" />').appendTo(windowTitleEl);
            windowMaximizeEl = $('<div class="window-maximize" />').appendTo(windowTitleEl);
            windowRestoreEl = $('<div class="window-restore" />').appendTo(windowTitleEl);
            windowCloseLink = $('<a href="#" title="Stäng fönster">x</a>').appendTo(windowCloseEl);

            windowContentEl = $('<div class="window-content" />').appendTo(windowEl);
            windowFooterEl = $('<div class="window-footer" />').appendTo(windowEl);
            
            windowEl.appendTo(desktopEl);
            
            // Hide the restore element to begin with.
            windowRestoreEl.hide();

            // Return 'em.
            return {
                desktopEl: desktopEl,
                windowEl: windowEl,
                windowTitleEl: windowTitleEl,
                windowTitleIcon: windowTitleIcon,
                windowTitleText: windowTitleText,
                windowCloseLink: windowCloseLink,
                windowMaximizeEl: windowMaximizeEl,
                windowRestoreEl: windowRestoreEl,
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
