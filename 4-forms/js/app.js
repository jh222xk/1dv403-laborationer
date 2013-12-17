"use strict";

var Validator = {
    init: function () {
        var form = document.querySelector("#formVal");

        Validator.validate(form);
    },

    // Our regex
    filters: {
        required: /\S/,
        email: /^(?!\.)(\w|-|\.){1,64}(?!\.)@(?!\.)[-.a-zåäö0-9]{4,253}$/,
        zipcode: /^(SE)? ?(\d\d\d)( |\-)?(\d\d)$/,
    },

    // Function for validating the form inputs onblur.
    // Everything is self-explaining.
    validate: function (form) {
        var className, input, typeName, i;

        for (i = form.elements.length - 1; i >= 0; i--) {
            input = form.elements[i];
            className = input.getAttribute("class");
            typeName = input.getAttribute("type");

            if (className === "required") {
                input.onblur = this.checkRequired;
            }
            else if (className === "email") {
                input.onblur = this.checkEmail;
            }
            else if (className === "zipcode") {
                input.onblur = this.checkZipcode;
            }
            else if (typeName === "submit") {
                input.onclick = function (event) {
                    event.preventDefault();
                    Validator.checkIfValid();
                };
            }
        }
    },

    // Function for checking if all the inputs are valid,
    // if they are valid call the showPopup function.
    checkIfValid: function () {
        var form, input, i;

        form = document.querySelector("#formVal");
        for (i = 0; i < form.elements.length; i++) {
            input = form.elements[i];
            if (input.classList.contains("error") || input.classList.contains("required")) {
                return false;
            }
        }
        Validator.showPopup();
    },

    // Function for checking if the required field is valid.
    checkRequired: function () {
        if (!this.value.match(Validator.filters.required)) {
            Validator.presentError(this, "Detta fält måste fyllas i.");
        }
        else {
            Validator.removeError(this);
        }
    },

    // Function for checking if the e-mail is valid.
    checkEmail: function () {
        if (!this.value.match(Validator.filters.email)) {
            Validator.presentError(this, "Fyll i en giltig e-postadress.");
        }
        else {
            Validator.removeError(this);
        }
    },

    // Function for checking if a swedish zipcode is valid.
    checkZipcode: function () {
        if (!this.value.match(Validator.filters.zipcode)) {
            Validator.presentError(this, "Fyll i ett giltigt postnummer.");
        }
        else {
            // Replace the value to XXXXX.
            this.value = this.value.replace(/[(SE) \(\)-]/g, "");
            Validator.removeError(this);
        }
    },

    // Function for presenting an error.
    presentError: function (input, msg) {
        var errorEl, errorMsg, label;

        if(!input.nextElementSibling) {
            label = input.previousElementSibling;
            label.setAttribute("class", "error");
            input.setAttribute("class", "error");
            errorEl = document.createElement("small");
            input.parentNode.appendChild(errorEl);
            errorMsg = document.createTextNode(msg);
            errorEl.setAttribute("class", "error");
            errorEl.appendChild(errorMsg);
        }
    },

    // Function to remove the error divs, i.e add the class valid instead.
    removeError: function (input) {
        var label;

        label = input.previousElementSibling;
        label.setAttribute("class", "valid");
        input.setAttribute("class", "valid");
        if (input.nextElementSibling) {
            input.parentNode.removeChild(input.nextElementSibling);
        }
    },

    // Function for show the popup window.
    showPopup: function () {
        var inputValue, inputName, popup, popupInfo,
            cancelLink, proceedLink, form, inputInfo, i;

        popup = document.querySelector("#popup");
        popupInfo = document.querySelector("#popup .info");
        cancelLink = popupInfo.querySelector("#cancel");
        proceedLink = popupInfo.querySelector("#proceed");
        form = document.querySelector('#formVal');
        inputInfo = document.querySelector("#popup .info .input-info");

        // While the input-info div has child nodes remove them.
        while (inputInfo.hasChildNodes()) {
            inputInfo.removeChild(inputInfo.firstChild);
        }

        // Show the popup.
        popup.setAttribute("class", "show");

        for (i = 0; i < form.elements.length; i++) {
            // Get the value from the form element.
            inputValue = form.elements[i].value;
            // If the element type is'nt submit, push some data.
            if (form.elements[i].type !== "submit") {
                // Get the name within the label.
                inputName = form.querySelector('label[for="' + form.elements[i].id + '"]');
                // Call the addData function with our values.
                Validator.addData(inputName.childNodes[0].nodeValue, inputValue);
            }
        }

        // If the proceed link is clicked, send the form AWAY!
        proceedLink.onclick = function (event) {
            event.preventDefault();
            form.submit();
        };

        // If ESC is pressed, hide the popup!
        document.onkeydown = function(e) {
            if (e.keyCode === 27) {
                Validator.hidePopup();
            }
        };

        // If the cancel link is clicked, hide the popup!
        cancelLink.onclick = Validator.hidePopup;
        return false;
    },

    // Function to add the data to the popup window.
    addData: function (inputName, inputValue) {
        var row, inputInfo, inputNameEl, inputValueEl,
            inputNameText, inputValueText;

        // Create some elements.
        row = document.createElement("div");
        inputInfo = document.querySelector("#popup .info .input-info");
        inputNameEl = document.createElement("span");
        inputValueEl = document.createElement("span");
        inputNameText = document.createTextNode(inputName + ": ");
        inputValueText = document.createTextNode(inputValue);

        // Set some attributes.
        inputValueEl.setAttribute("class", "right");
        inputNameEl.setAttribute("class", "bold");
        row.setAttribute("class", "input-info-row");

        // Append it.
        inputInfo.appendChild(row);
        row.appendChild(inputNameEl);
        row.appendChild(inputValueEl);
        inputNameEl.appendChild(inputNameText);
        inputValueEl.appendChild(inputValueText);
    },

    // Function for hiding the popup window.
    hidePopup: function () {
        var popup;

        popup = document.querySelector("#popup");
        popup.setAttribute("class", "hide");
        return false;
    }

};

window.onload = Validator.init;
