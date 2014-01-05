"use strict";

(function ($) {
    PWD.Window = function (title, icon, width, height) {
        console.log(this);
        var self = this;
        //console.log(title);

        this.el = this.createWindow();

        this.title = title;
        this.icon = icon;
        this.width = width;
        this.height = height;

        this.setWindowTitle();
        this.setWindowIcon();
        this.setWindowPos();
        this.setWindowWidthHeight();

        this.setWindowIndex();

        this.el.windowCloseLink.on('click', function(event) {
            event.preventDefault();
            self.closeWindow();
        });

    };

    // Function for setting the index of the window 
    // (which window that should be on top).
    PWD.Window.prototype.setWindowIndex = function() {
        var windowElLength, max;

        windowElLength = $('.window').length;

        if (windowElLength) {
            max = windowElLength;
            this.el.windowEl.css("z-index", max++);
            $('.window').on('click', function(event) {
                $(this).css("z-index", max++);
            });
        }
        
    };

    // Function for creating the elements for the window.
    PWD.Window.prototype.createWindow = function() {
        var desktopEl, windowEl, windowTitleEl, windowTitleIcon,
            windowCloseEl, windowCloseLink, windowContentEl,
            windowTitleText, windowFooterEl;

            desktopEl = $('.desktop');
            windowEl = $('<div />', { class: 'window' }).appendTo(desktopEl);
            windowTitleEl = ($('<div />', { class: 'window-titlebar' }).appendTo(windowEl));
            windowTitleIcon = ($('<div />', { class: 'window-icon'}).appendTo(windowTitleEl));
            windowTitleText = ($('<span />', { class: 'title-text' }).appendTo(windowTitleEl));
            windowCloseEl = ($('<div />', { class: 'window-close'}).appendTo(windowTitleEl));
            windowCloseLink = ($('<a href="#" title="Stäng fönster">x</a>').appendTo(windowCloseEl));
            windowContentEl = ($('<div />', { class: 'window-content' }).appendTo(windowEl));
            windowFooterEl = ($('<div>', { class: 'window-footer' }).appendTo(windowEl));

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
        //console.log(data);
        this.el.windowContentEl.append(data);
    };

    // Function for setting the status of the window.
    PWD.Window.prototype.setFooterStatus = function(status) {
        var p;
        ($('<div />', { class: 'window-loading' }).appendTo(this.el.windowFooterEl));
        p = ($('<p />', { class: 'window-status' }).appendTo(this.el.windowFooterEl));
        p.text(status);
    };

    // Function for removing the status of the window.
    PWD.Window.prototype.removeFooterStatus = function() {
        this.el.windowFooterEl.empty();
    };

    // Function for closing the window.
    PWD.Window.prototype.closeWindow = function() {
        this.el.windowEl.remove();
    };

    PWD.Window.prototype.setWindowPos = function() {
        //var windowHeight = $(window).height();
        var desktopEl = $('.desktop');
        var windowEl = $('.window');

        //console.log(windowHeight);
        //console.log(windowWidth);

        windowEl.each(function(i) {
            $(this).css({ 'left': 40 * i + 'px', 'top': 10 * i + 'px'});
        });
    };
})(jQuery);
