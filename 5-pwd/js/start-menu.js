(function ($) {
    "use strict";
    
    PWD.StartMenu = function () {
        var desktopEl, startMenuEl, imageviewerIcon, rssIcon;

        desktopEl = $('.desktop');
        startMenuEl = ($('<div>', { class: 'start-menu' }).appendTo(desktopEl));

        imageviewerIcon = ($('<div>', { class: 'image-viewer-icon' }).appendTo(startMenuEl));
        rssIcon = ($('<div>', { class: 'rss-32' }).appendTo(startMenuEl));

        imageviewerIcon.on('click', function () {
            new PWD.ImageViewer();
        });

        rssIcon.on('click', function(event) {
            new PWD.RSS();
        });
    };

})(jQuery);