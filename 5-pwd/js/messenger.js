(function ($) {
    "use strict";
    PWD.Messenger = function (updateTime) {
        var self = this;

        PWD.Window.call(this, "Messenger", "messenger-16", 600, 500);

        this.messengerEl = this.createContent();

        this.updateTime = updateTime = typeof updateTime !== 'undefined' ? updateTime : 10000;

        this.jqxhr = this.getMessages();
        this.intervalID = this.updateData(updateTime);

        // If we close the window, abort the ajax call.
        this.el.windowCloseLink.on('click', function(event) {
            self.removeCall(self.jqxhr.jqxhr, self.intervalID.intervalID);
        });
    };

    // Inherit all the Window functions.
    inheritPrototype(PWD.Messenger, PWD.Window);

    // Function for aborting an ajax call and clear the update interval.
    PWD.Messenger.prototype.removeCall = function(call, intervalID) {
        call.abort();
        clearInterval(intervalID);
    };

    // Function for updating the data with a specific 
    // time in MS.
    PWD.Messenger.prototype.updateData = function(time) {
        var self = this;
        var intervalID;

        intervalID = setInterval(function() {
            console.log("Uppdaterar!");
            self.getMessages();
        }, time);

        return {
            intervalID: intervalID
        }
    };

    PWD.Messenger.prototype.getMessages = function(time) {
        var self = this;
        var url, jqxhr, param;

        param = {
            history: '2'
        }
        
        url = "http://homepage.lnu.se/staff/tstjo/labbyserver/getMessage.php";

        // Set our status.
        self.setFooterStatus("Läser in meddelanden...");

        jqxhr = $.get(url, param, function(data) {
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

        return {
            jqxhr: jqxhr
        }
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
        var url, jqxhr, param, errorEl, required;

        required = /\S/;

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
            username: 'Jesper',
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