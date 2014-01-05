(function ($) {
    "use strict";
    PWD.RSS = function () {
        PWD.Window.call(this, "RSS", "rss-16", 400, 600);

        this.fetchData();
    };

    // Inherit all the Window functions.
    inheritPrototype(PWD.RSS, PWD.Window);

    // Function for fetching the necessary data.
    PWD.RSS.prototype.fetchData = function() {
    	// http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/
    	var url, jqxhr;
    	var self = this;

        // Set our status.
    	this.setFooterStatus("Läser in RSS flöden...");

    	url = "http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/?url=http://www.dn.se/m/rss/senaste-nytt";

		jqxhr = $.get(url, function(data) {
            // Set our content.
			self.setWindowContent(data);
		}).fail(function() {
            // If fail, display that instead.
			self.setWindowContent("Något gick fel!");
		}).always(function() {
            // Always remove the status.
			self.removeFooterStatus();
		});
	};

})(jQuery);