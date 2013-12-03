"use strict";

var MessageBoard = {

    messages: [],

    init: function() {
        // Get some element as well as create the div for the count.
        var messageWrap = document.querySelector(".message-wrap"),
            textarea = document.querySelector("#id_bodytext"),
            submitButton = document.querySelector("#submit"),
            messageCount = document.createElement("div");

        // When user clicks on the submit button call the addMessage function.
        submitButton.addEventListener("click", MessageBoard.addMessage, false);

        // Add an id to the message count.
        // Set the innerHTML to what the messages array length is. 
        messageCount.setAttribute("id", "message-count");
        messageCount.innerHTML = "Antal meddelanden: " + MessageBoard.messages.length;

        messageWrap.appendChild(messageCount);

        // Set focus on the textarea when the page is done rendering.
        textarea.focus();
    },

    // Function to add a message to the messages array.
    addMessage: function() {
        var messageObject = null,
            div = document.querySelector("#messages"),
            textarea = document.querySelector("#id_bodytext");

        if (!textarea.value) {
            alert("Vänligen fyll i textrutan!");
            textarea.focus();
        }
        else {
            // Create a new message object with the value from the textarea
            // and the current date.
            messageObject = new Message(textarea.value, new Date());

            // Add the new object to the messages array.
            MessageBoard.messages.push(messageObject);

            // Render all the messages.
            MessageBoard.renderMessages();

            // Clear the textarea.
            textarea.value = "";
        }
        return false;
    },

    // Function to render all the messages in the messages array.
    renderMessages: function() {
        var i = null,
            div = document.querySelector("#messages"),
            messageCount = document.querySelector("#message-count");

        div.innerHTML = "";
        // Update the messages count.
        messageCount.innerHTML = "Antal meddelanden: " + this.messages.length;

        // Iterate through the messages array and then call the renderMessage
        // function with the parameter of "where" the 
        for (i = this.messages.length - 1; i >= 0; i--) {
            this.renderMessage([i]);
        }
    },

    // Function to render A message with the particular id.
    renderMessage: function(messageID) {
        // Some creation of elements.
        var self = this;
        var div = document.querySelector("#messages"),
            textarea = document.querySelector("#id_bodytext"),
            text = document.createElement("p"),
            messageDiv = document.createElement("div"),
            timeSent = document.createElement("span"),
            deleteButton = document.createElement("a"),
            timeButton = document.createElement("a");

        // Set some attritubutes to those elements.
        messageDiv.setAttribute("class", "message");
        timeSent.setAttribute("class", "time-sent");
        timeButton.setAttribute("href", "#");
        timeButton.setAttribute("class", "time-icon");
        deleteButton.setAttribute("href", "#");
        deleteButton.setAttribute("class", "delete-icon");

        // Get the html text from that particular array element 
        // and add it inside the text element.
        text.innerHTML = this.messages[messageID].getHTMLText();
        timeSent.innerHTML = this.messages[messageID].getDateText(true);

        // Append all the elements.
        div.appendChild(messageDiv);
        messageDiv.appendChild(deleteButton);
        messageDiv.appendChild(timeButton);
        messageDiv.appendChild(text);
        messageDiv.appendChild(timeSent);

        // When user clicks on the delete button remove that 
        // particular element from the array and then re-render
        // all the messages.
        deleteButton.onclick = function() {
            if (window.confirm("Vill du verkligen radera meddelandet?")) {

                self.messages.splice(messageID, 1);

                div.innerHTML = "";

                self.renderMessages();

                textarea.focus();
            }
            return false;
        };

        // When user click on the time button alert the date and time
        // and then focus the textarea once again.
        timeButton.onclick = function() {

            alert(self.messages[messageID].getDateText());

            textarea.focus();

            return false;
        };
    }
};

window.onload = MessageBoard.init;
