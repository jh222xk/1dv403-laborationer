(function ($) {
    "use strict";
    PWD.RSS = function (url, updateTime) {
        var self = this;

        this.setURL = function(_url) {
            url = _url;
        };

        this.getURL = function() {
            return url;
        };

        this.setUpdateTime = function (_updateTime) {
            updateTime = _updateTime;
        }

        this.getUpdateTime = function () {
            updateTime = updateTime = typeof updateTime !== 'undefined' ? updateTime : 10000;
            return updateTime;
        }

        PWD.Window.call(this, "RSS", "rss-16", 400, 400);

        this.rssEl = this.createDataEl();

        this.fetchData();

        this.intervalID = null; 
        this.jqxhr = null;

        this.updateData();

        // If we close the window, abort the ajax call.
        this.el.windowCloseLink.on('click', function(event) {
            self.removeCall(self.jqxhr, self.intervalID);
        });

        this.menu = this.addMenuToWindow();

        this.menuEls = this.createMenuElements();

        this.insertPopupData();
    };

    // Inherit all the Window functions.
    inheritPrototype(PWD.RSS, PWD.Window);

    // Function for creating the menu elements.
    PWD.RSS.prototype.createMenuElements = function() {
        var ul, li, lie, settingsUl, archiveUl,
            $closeLink, $updateIntervalLink,
            $setUrlLink, $forceUpdateLink;

        $closeLink = $('<li><a class="close" href="#">Stäng</a></li>');
        $updateIntervalLink = $('<li><a class="update-interval" href="#">Uppdateringsintervall</a></li>');
        $setUrlLink = $('<li><a class="set-url" href="#">Välj källa</a></li>');
        $forceUpdateLink = $('<li><a class="force-update" href="#">Uppdatera nu</a></li>');

        ul = $('<ul class="top-level-ul"></ul>');
        li = $('<li><a href="#">Arkiv</a></li>').appendTo(ul);
        archiveUl = $('<ul class="archive-ul"></ul>').appendTo(li);
        $closeLink.appendTo(archiveUl);
        lie = $('<li><a href="#">Inställningar</a></li>').appendTo(ul);
        settingsUl = $('<ul class="settings-ul"></ul>').appendTo(lie);
        $updateIntervalLink.appendTo(settingsUl);
        $setUrlLink.appendTo(settingsUl);
        $forceUpdateLink.appendTo(settingsUl);

        this.menu.windowMenuEl.append(ul);

        return {
            closeLink: $closeLink,
            updateIntervalLink: $updateIntervalLink,
            setUrlLink: $setUrlLink,
            forceUpdateLink: $forceUpdateLink
        }
    };

    PWD.RSS.prototype.insertPopupData = function() {
        var self = this;
        var optionsArr, textArr, els, 
            time, url,
            $optionEl, $selectEl, $inputEl, $h1;

        // On click on the force-update call the fetchData method.
        this.menuEls.forceUpdateLink.on('click', function(event) {
            event.preventDefault();
            self.fetchData();
        });

        // On close, remove the ajax call and the interval.
        this.menuEls.closeLink.on('click', function(event) {
            event.preventDefault();
            self.closeWindow();
            self.removeCall(self.jqxhr, self.intervalID);
        });

        // On click on the update-interval let the user choose from 
        // the arrays.
        this.menuEls.updateIntervalLink.on('click', function(event) {
            event.preventDefault();

            // Arrays with shit.
            optionsArr = [10000 * 60, 20000 * 60, 30000 * 60, 40000 * 60, 50000 * 60];
            textArr = ["1 minut", "2 minuter", "3 minuter", "4 minuter", "5 minuter"];

            els = self.showPopup();

            $selectEl = $("<select /><br /><br />");

            // Iterate throught the options array and append.
            for (var i = 0; i < optionsArr.length; i++) {
                var $optionEl = $("<option value='"+optionsArr[i]+"'>"+textArr[i]+"</option>").appendTo($selectEl);
            };

            $h1 = $('<h1>Ändra Uppdateringsintervall</h1>');

            $h1.appendTo(els.popupInfoEl).insertBefore(els.changeButton);
            $selectEl.appendTo(els.popupInfoEl).insertBefore(els.changeButton);

            // On click on the change button.
            els.changeButton.on('click', function(event) {
                event.preventDefault();

                // Get the value.
                time = $('option:selected').val();

                // Remove the popup.
                els.popupEl.remove();

                // Change the time.
                self.setUpdateTime(time);

                // And set a new interval with the new value.
                self.updateData();
            });
        });

        // On click on the set-url let the user input value in input.
        this.menuEls.setUrlLink.on('click', function(event) {
            event.preventDefault();

            els = self.showPopup();

            $inputEl = $('<input type="text" value="" /> <br /><br />');
            $h1 = $('<h1>Välj källa</h1>');

            $h1.appendTo(els.popupInfoEl).insertBefore(els.changeButton);

            $inputEl.appendTo(els.popupInfoEl).insertBefore(els.changeButton);

            // On click on the change button.
            els.changeButton.on('click', function(event) {
                event.preventDefault();

                // Get the value.
                url = $('input').val();

                // Remove the popup.
                els.popupEl.remove();

                // Change the URL.
                self.setURL(url);

                // And set a new interval.
                self.updateData();
            });
        });
    };

    // Function for showing a popup.
    PWD.RSS.prototype.showPopup = function(options, text) {
        var self = this;
        var $popupEl, $popupInfo, $desktopEl,
            $selectEl, $optionEl, $changeButton,
            $topRightCloseEl;

        // Some elements.
        $desktopEl = $('.desktop');
        $popupEl = $('<div class="popup" />');
        $popupInfo = $('<div class="popup-info" />').appendTo($popupEl);
        $topRightCloseEl = $('<div class="close"><a href="#">X</a>').appendTo($popupInfo);

        $changeButton = $('<a class="button" href="#">Ändra</a>').appendTo($popupInfo);

        $popupEl.appendTo($desktopEl);

        // Just remove it...
        $topRightCloseEl.on('click', function(event) {
            event.preventDefault();
            $popupEl.remove();
        });

        // Remove on ESC.
        $(document).keydown(function(event) {
            if (event.which === 27) {
                event.preventDefault();
                $popupEl.remove();
            }
        });

        return {
            popupEl: $popupEl,
            popupInfoEl: $popupInfo,
            changeButton: $changeButton
        }
    };

    // Just a function for creating a data element.
    PWD.RSS.prototype.createDataEl = function() {
        var $dataEl;

        $dataEl = $('<div class="data" />');

        this.setWindowContent($dataEl);

        return {
            dataEl: $dataEl
        }
    };

    // Function for removing the ajax call and the setInterval.
    PWD.RSS.prototype.removeCall = function(call, intervalID) {
        clearInterval(intervalID);

        if (call !== null) {
            call.abort();
        };
    };

    // Function for updating the data with setInterval.
    PWD.RSS.prototype.updateData = function() {
        var self = this;
        var intervalID, time;

        // Remove the old call.
        this.removeCall(this.jqxhr, this.intervalID);

        // Get the time.
        time = this.getUpdateTime();

        // Set the interval.
        this.intervalID = setInterval(function() {
            console.log("Uppdaterar!");
            self.fetchData();
        }, time);
    };

    // Function for fetching the necessary data.
    PWD.RSS.prototype.fetchData = function() {
    	var url, jqxhr;
    	var self = this;

        // Set our status.
        this.setFooterStatus("Läser in RSS flöden...");

        url = "http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/?url=" + this.getURL();

		this.jqxhr = $.get(url, function(data) {
            // Set our content.
            self.rssEl.dataEl.html(data);
			//self.setWindowContent(data);
		}).fail(function() {
            // If fail, display that instead.
			self.setWindowContent('<div class="error">Något gick fel när RSS flödet skulle hämtas. Vänligen försök igen lite senare.</div>');
		}).always(function() {
            // Always remove the status.
	        self.removeFooterStatus();
		});
	};

})(jQuery);