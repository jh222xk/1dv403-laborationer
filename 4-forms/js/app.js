"use strict";

var Validator = {
    init: function () {
        var form = document.querySelector("#formVal");
        Validator.validate(form);
    },

    // Our regex
    filters: {
        required: /./,
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
            console.log("Error required");
        }
        else {
            console.log("Valid required");
        }
    },

    // Function for checking if the e-mail is valid.
    checkEmail: function () {
        if (!this.value.match(Validator.filters.email)) {
            console.log("Error email");
        }
        else {
            console.log("Valid email");
        }
    },

    // Function for checking if a swedish zipcode is valid.
    checkZipcode: function () {
        if (!this.value.match(Validator.filters.zipcode)) {
            console.log("Error zipcode");
        }
        else {
            // Replace the value to XXXXX.
            this.value = this.value.replace(/[(SE) \(\)-]/g, "");
            console.log(this.value);
            console.log("Valid zipcode");
        }
    }

};

window.onload = Validator.init;
