(function ($) {
    "use strict";
    
    PWD.StartMenu = function () {
        var desktopEl, startMenuEl, imageviewerIcon, rssIcon, rssIcon2;

        desktopEl = $('.desktop');
        startMenuEl = ($('<div>', { class: 'start-menu' }).appendTo(desktopEl));

        imageviewerIcon = ($('<div>', { class: 'image-viewer-icon' }).appendTo(startMenuEl));
        rssIcon = ($('<div>', { class: 'rss-32' }).appendTo(startMenuEl));
        rssIcon2 = ($('<div>', { class: 'rss-32' }).appendTo(startMenuEl));

        imageviewerIcon.on('click', function () {
            new PWD.ImageViewer();
        });

        rssIcon.on('click', function(event) {
            new PWD.RSS("http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/?url=http://www.sweclockers.com/feeds/nyheter");
        });

        rssIcon2.on('click', function(event) {
            new PWD.RSS("http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/?url=http://www.dn.se/m/rss/senaste-nytt");
        });
    };

})(jQuery);