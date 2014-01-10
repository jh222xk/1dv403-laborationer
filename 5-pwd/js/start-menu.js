(function ($) {
    "use strict";
    
    PWD.StartMenu = function () {
        var desktopEl, startMenuEl, imageviewerIcon,
            rssIcon, rssIcon2, memoryIcon;

        desktopEl = $('.desktop');
        startMenuEl = ($('<div>', { class: 'start-menu' }).appendTo(desktopEl));

        imageviewerIcon = ($('<div>', { class: 'image-viewer-32' }).appendTo(startMenuEl));
        rssIcon = ($('<div>', { class: 'rss-32' }).appendTo(startMenuEl));
        rssIcon2 = ($('<div>', { class: 'rss-32' }).appendTo(startMenuEl));
        memoryIcon = ($('<div>', { class: 'memory-32' }).appendTo(startMenuEl));

        imageviewerIcon.on('click', function () {
            new PWD.ImageViewer();
        });

        rssIcon.on('click', function(event) {
            new PWD.RSS("http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/?url=http://www.sweclockers.com/feeds/nyheter");
        });

        rssIcon2.on('click', function(event) {
            new PWD.RSS("http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/?url=http://www.dn.se/m/rss/senaste-nytt");
        });

        memoryIcon.on('click', function(event) {
            new PWD.Memory(4, 4);
        });


    };

})(jQuery);