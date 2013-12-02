"use strict";

var MessageBoard = {

    messages: [],

    init: function() {
        // Get some element as well as create the div for the count.
        var messageWrap = document.querySelector(".message-wrap"),
            textarea = document.querySelector("#id_bodytext"),
            submitButton = document.querySelector("#submit"),
            messageCount = document.createElement("div");

        // Add an id to the message count.
        // Set the innerHTML to what the messages array length is. 
        messageCount.setAttribute("id", "message-count");
        messageCount.innerHTML = "Antal meddelanden: " + MessageBoard.messages.length;

        messageWrap.appendChild(messageCount);

        // Set focus on the textarea when the page is done rendering.
        textarea.focus();
    }
};
window.onload = MessageBoard.init;
