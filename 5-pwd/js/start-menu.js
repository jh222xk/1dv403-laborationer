(function ($) {
    "use strict";
    
    PWD.StartMenu = function () {
        var desktopEl, startMenuEl, imageviewerIcon,
            rssIcon, memoryIcon, messengerIcon;

        desktopEl = $('.desktop');
        startMenuEl = ($('<div>', { class: 'start-menu' }).appendTo(desktopEl));

        imageviewerIcon = ($('<div>', { class: 'image-viewer-32' }).appendTo(startMenuEl));
        rssIcon = ($('<div>', { class: 'rss-32' }).appendTo(startMenuEl));
        memoryIcon = ($('<div>', { class: 'memory-32' }).appendTo(startMenuEl));
        messengerIcon = ($('<div>', { class: 'messenger-32' }).appendTo(startMenuEl));

        imageviewerIcon.on('click', function () {
            new PWD.ImageViewer();
        });

        rssIcon.on('click', function(event) {
            new PWD.RSS("http://www.sweclockers.com/feeds/nyheter");
        });

        memoryIcon.on('click', function(event) {
            new PWD.Memory(4, 2);
        });

        messengerIcon.on('click', function(event) {
            new PWD.Messenger();
        });


    };

})(jQuery);