(function ($) {
    "use strict";

    var required = /\S/;

    PWD.Messenger = function (updateTime) {
        var self = this;
        var username, messageNum;

        this.setUsername = function(_username) {
            username = _username;
        };

        this.getUsername = function() {
            username = typeof username !== 'undefined' ? username : "Anonym";
            return username;
        };

        this.setUpdateTime = function (_updateTime) {
            updateTime = _updateTime;
        }

        this.getUpdateTime = function () {
            updateTime = updateTime = typeof updateTime !== 'undefined' ? updateTime : 10000 * 60;
            return updateTime;
        }

        this.getMessageNum = function () {
            messageNum = messageNum = typeof messageNum !== 'undefined' ? messageNum : 10;
            return messageNum;
        }

        this.setMessageNum = function (_messageNum) {
            messageNum = _messageNum;
        }

        PWD.Window.call(this, "Messenger", "messenger-16", 600, 500);

        this.messengerEl = this.createContent();

        this.getMessages();

        this.intervalID = null; 
        this.jqxhr = null;

        this.menu = this.addMenuToWindow();

        this.menuEls = this.createMenuElements();

        this.insertPopupData();

        this.updateData();

        // If we close the window, abort the ajax call.
        this.el.windowCloseLink.on('click', function(event) {
            self.removeCall(self.jqxhr, self.intervalID);
        });
    };

    // Inherit all the Window functions.
    inheritPrototype(PWD.Messenger, PWD.Window);

    // Function for creating the menu elements.
    PWD.Messenger.prototype.createMenuElements = function() {
        var ul, li, lie, settingsUl, archiveUl,
            $closeLink, $updateIntervalLink,
            $setUsernameLink, $forceUpdateLink,
            $setMessageNumLink;

        $closeLink = $('<li><a class="close" href="#">Stäng</a></li>');
        $updateIntervalLink = $('<li><a class="update-interval" href="#">Uppdateringsintervall</a></li>');
        $setMessageNumLink = $('<li><a class="set-messageNum" href="#">Antal meddelanden</a></li>');
        $setUsernameLink = $('<li><a class="set-username" href="#">Välj användarnamn</a></li>');
        $forceUpdateLink = $('<li><a class="force-update" href="#">Uppdatera nu</a></li>');

        ul = $('<ul class="top-level-ul"></ul>');
        li = $('<li><a href="#">Arkiv</a></li>').appendTo(ul);
        archiveUl = $('<ul class="archive-ul"></ul>').appendTo(li);
        $closeLink.appendTo(archiveUl);
        lie = $('<li><a href="#">Inställningar</a></li>').appendTo(ul);
        settingsUl = $('<ul class="settings-ul"></ul>').appendTo(lie);
        $updateIntervalLink.appendTo(settingsUl);
        $setMessageNumLink.appendTo(settingsUl);
        $setUsernameLink.appendTo(settingsUl);
        $forceUpdateLink.appendTo(settingsUl);

        this.menu.windowMenuEl.append(ul);

        return {
            closeLink: $closeLink,
            updateIntervalLink: $updateIntervalLink,
            setMessageNumLink: $setMessageNumLink,
            setUsernameLink: $setUsernameLink,
            forceUpdateLink: $forceUpdateLink
        }
    };

    PWD.Messenger.prototype.insertPopupData = function() {
        var self = this;
        var optionsArr, textArr, els, 
            time, username, messageNum,
            $optionEl, $selectEl, $inputEl, $h1;

        // On click on the force-update call the getMessages method.
        this.menuEls.forceUpdateLink.on('click', function(event) {
            event.preventDefault();
            self.getMessages();
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

            $h1 = $('<h1>Ändra uppdateringsintervall</h1>');

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

        // On click on the set-messageNum let the user input value in input.
        this.menuEls.setMessageNumLink.on('click', function(event) {
            event.preventDefault();

            els = self.showPopup();

            $inputEl = $("<input type='text' value='"+self.getMessageNum()+"' /> <br /><br />");
            $h1 = $('<h1>Antal meddelanden som ska visas</h1>');

            $h1.appendTo(els.popupInfoEl).insertBefore(els.changeButton);

            $inputEl.appendTo(els.popupInfoEl).insertBefore(els.changeButton);

            // On click on the change button.
            els.changeButton.on('click', function(event) {
                event.preventDefault();

                // Get the value.
                messageNum = $('.popup-info input').val();

                if (!messageNum.match(required)) {
                    return;
                };

                // Remove the popup.
                els.popupEl.remove();

                // Change the messageNum.
                self.setMessageNum(messageNum);

                // And get the messages.
                self.getMessages();
            });
        });

        // On click on the set-username let the user input value in input.
        this.menuEls.setUsernameLink.on('click', function(event) {
            event.preventDefault();

            els = self.showPopup();

            $inputEl = $("<input type='text' value='"+self.getUsername()+"' /> <br /><br />");
            $h1 = $('<h1>Välj användarnamn</h1>');

            $h1.appendTo(els.popupInfoEl).insertBefore(els.changeButton);

            $inputEl.appendTo(els.popupInfoEl).insertBefore(els.changeButton);

            // On click on the change button.
            els.changeButton.on('click', function(event) {
                event.preventDefault();

                // Get the value.
                username = $('.popup-info input').val();

                if (!username.match(required)) {
                    return;
                };

                // Remove the popup.
                els.popupEl.remove();

                // Change the username.
                self.setUsername(username);

                // And set a new interval.
                self.updateData();
            });
        });
    };

    // Function for showing a popup.
    PWD.Messenger.prototype.showPopup = function(options, text) {
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

    // Function for aborting an ajax call and clear the update interval.
    PWD.Messenger.prototype.removeCall = function(call, intervalID) {
        clearInterval(intervalID);

        if (call !== null) {
            call.abort();
        };
    };

    // Function for updating the data with a specific 
    // time in MS.
    PWD.Messenger.prototype.updateData = function(time) {
        var self = this;
        var intervalID;

        // Remove the old call.
        this.removeCall(this.jqxhr, this.intervalID);

        // Get the time.
        time = this.getUpdateTime();

        // Set the interval.
        this.intervalID = setInterval(function() {
            console.log("Uppdaterar!");
            self.getMessages();
        }, time);
    };

    PWD.Messenger.prototype.getMessages = function(time) {
        var self = this;
        var url, jqxhr, param;

        param = {
            history: self.getMessageNum()
        }
        
        url = "http://homepage.lnu.se/staff/tstjo/labbyserver/getMessage.php";

        // Set our status.
        self.setFooterStatus("Läser in meddelanden...");

        this.jqxhr = $.get(url, param, function(data) {
            // Set our content.
            self.messengerEl.dataEl.html(data);
            self.messengerEl.textarea.show();
            self.messengerEl.submitButton.show();
        }).fail(function() {
            // If fail, display that instead.
            self.messengerEl.dataEl.html('<div class="error">Något gick fel när meddelanden skulle hämtas. Vänligen försök igen lite senare.</div>');
        }).always(function() {
            // Always remove the status.
            self.removeFooterStatus();
        });
    };

    PWD.Messenger.prototype.createContent = function(data) {
        var self = this;
        var $messageWrap, $textarea, $submitButton, $error,
            $dataEl;

        $messageWrap = $('<div class="message-wrap" />');
        $dataEl = $('<div class="data" />').appendTo($messageWrap);
        //$messageWrap.append(data);
        $textarea = $('<textarea id="id_bodytext" />').appendTo($messageWrap);
        $submitButton = $('<input class="button" type="submit" value="Skicka meddelande" />').appendTo($messageWrap);
        $error = $('<div class="error hide">Vänligen fyll i textrutan!</div>').appendTo($messageWrap).insertBefore($textarea);

        $textarea.hide();
        $submitButton.hide();

        $textarea.keydown(function(event) {
            if (event.which === 13 && event.shiftKey === false) {
                event.preventDefault();
                self.sendMessage($textarea.val());
            }
        });
        
        $submitButton.on('click', function(event) {
            event.preventDefault();
            self.sendMessage($textarea.val());
        });

        this.setWindowContent($messageWrap);

        return {
            submitButton: $submitButton,
            textarea: $textarea,
            dataEl: $dataEl,
            errorEl: $error
        }
    };

    PWD.Messenger.prototype.sendMessage = function(text) {
        var self = this;
        var url, jqxhr, param, errorEl;

        console.log(text);

        if (!text.match(required)) {
                self.messengerEl.errorEl.removeClass('hide');
                self.messengerEl.errorEl = self.messengerEl.errorEl.addClass('show');
                self.messengerEl.textarea.focus();
                return;
            };
            self.messengerEl.textarea.val('');

        if (this.messengerEl.errorEl.length) {
            this.messengerEl.errorEl.removeClass('show');
            this.messengerEl.errorEl.addClass('hide');
        }

        url = "http://homepage.lnu.se/staff/tstjo/labbyserver/setMessage.php";

        param = {
            username: this.getUsername(),
            text: text
        }

        // Set our status.
        this.setFooterStatus("Skickar meddelande...");

        jqxhr = $.post(url, param, function(data) {
            console.log(data);
            self.getMessages();
        }).fail(function() {
            // If fail, display that instead.
            self.messengerEl.dataEl.html('<div class="error">Något gick fel när meddelandet skulle skickas. Vänligen försök igen lite senare.</div>');
        }).always(function() {
            // Always remove the status.
            self.removeFooterStatus();
        });
    };

})(jQuery);