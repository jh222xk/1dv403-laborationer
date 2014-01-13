(function ($) {
    "use strict";
    PWD.ImageViewer = function (singleImage) {
        if (singleImage) {
            var img;
            img = $("<img src='"+singleImage.URL+"' />");

            PWD.Window.call(this, "ImageViewer > Visa Bild", "image-viewer-16", singleImage.width, singleImage.height);

            this.setWindowContent(img);
        }
        else {
            PWD.Window.call(this, "Image Viewer", "image-viewer-16");
            this.fetchImages();
        }
        
    };

    // Inherit all the Window functions.
    inheritPrototype(PWD.ImageViewer, PWD.Window);

    // Function for fetching our images.
    PWD.ImageViewer.prototype.fetchImages = function() {
        var url, jqxhr 
        var self = this;
        
        this.setFooterStatus("Läser in bilder...");

        url = "http://homepage.lnu.se/staff/tstjo/labbyServer/imgviewer/";

        jqxhr = $.getJSON(url, function(data) {
            // Set our content.
            self.displayImage(data);
        }).fail(function() {
            // If fail, display that instead.
            self.setWindowContent("Något gick fel!");
        }).always(function() {
            // Always remove the status.
            self.removeFooterStatus();
        });
    };

    // Function for displaying our images in our window.
    PWD.ImageViewer.prototype.displayImage = function(images) {
        var self = this;
        var img, maxSize;

        maxSize = this.calculateMaxWidthHeight(images);

        // Iterate through our images.
        $.each(images, function(index, value) {

            // Create element.
            img = $("<div class='image-box'><img src='"+value.thumbURL+"' /></div>");

            // Set the window content to our newly created element.
            self.setWindowContent(img);

            // Set our width and height for our thumbnails.
            img.css({"width": maxSize.width + "px", "height": maxSize.height + "px"});

            img.on('click', function(event) {
                event.preventDefault();
                self.openImage(value);
            });

            img.on('mousedown', function(event) {
                event.preventDefault();
                if(event.button == 2) { 
                    self.setImageAsBG(value);
                    return false; 
                }
            });

        });
    };

    // Function for calculating the max width and height of the thumbnails.
    PWD.ImageViewer.prototype.calculateMaxWidthHeight = function(images) {
        var width = 0, height = 0;

        // Iterate through the image data.
        $.each(images, function(index, value) {
            if (value.thumbWidth > width) {
                width = value.thumbWidth;
            }

            if (value.thumbHeight > height) {
                height = value.thumbHeight;
            }
        });

        // Return our width and height so we can use it.
        return {
            width: width,
            height: height
        }
    };

    PWD.ImageViewer.prototype.openImage = function(image) {
        new PWD.ImageViewer(image);
    };

    // Function for setting the "clicked" image as background.
    PWD.ImageViewer.prototype.setImageAsBG = function(image) {
        var desktopEl;

        desktopEl = $('.desktop');
        desktopEl.css("background-image", "url(" + image.URL + ")");
        
    };

})(jQuery);