"use strict";

function Message(message, date) {

    this.getText = function() {
        return message;
    };

    this.setText = function(_text) {
        message = _text;
    };

    this.getDate = function() {
        return date;
    };

    this.setDate = function(_date) {
        date = _date;
    };
}

Message.prototype.toString = function() {
    return this.getText()+" ("+this.getDate()+")";
};

Message.prototype.getHTMLText = function() {
    return this.getText().replace(/[\n\r]/g, "<br/>");
};

Message.prototype.getDateText = function(time) {
    var formattedString;
    if (time) {
        formattedString = this.getDate().getHours() + ":" + this.getDate().getMinutes() + ":" + this.getDate().getSeconds();
        return formattedString;
    }
    formattedString = "Inlägget skapades den " + this.getDate().getDate() + " " + this.getDate().getMonthName() + " " + this.getDate().getFullYear() +
                        "\nKlockan " + this.getDate().getHours() + ":" + this.getDate().getMinutes() + ":" + this.getDate().getSeconds();
    return formattedString;
};

Date.prototype.getMonthName = function() {
    var monthNames = ["Januari", "Februari", "Mars", "April", "Maj", "Juni",
                    "Juli", "Augusti", "September", "Oktober", "November", "December"];
    return monthNames[this.getMonth()];
};
