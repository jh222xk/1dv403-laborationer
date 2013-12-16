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
                };
            }
        }
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
    }

};

window.onload = Validator.init;
