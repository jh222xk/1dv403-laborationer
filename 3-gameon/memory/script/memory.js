"use strict";

var Memory = {
    init: function () {
        var rows = 4;
        var cols = 4;
        Memory.startGame(rows, cols);
    },

    startGame: function (rows, cols) {
        this.brickOne = null;
        this.brickTwo = null;
        this.activeCardSum = 0;
        this.completedCards = 0;
        this.numOfTries = 0;
        var self = this;
        var currentImg = 0;
        this.random = RandomGenerator.getPictureArray(rows, cols);
        var wrapperElement = document.querySelector(".memory-wrap");
        var imageLink = document.getElementsByTagName("a");

        // Iterate through the number of rows, create it and append it.
        for (var row = rows - 1; row >= 0; row--) {
            var rowElement = document.createElement("div");
            rowElement.setAttribute("class", "mem-row");
            wrapperElement.appendChild(rowElement);

            // Iterate through the number of cols, create it and append it
            // to the row.
            for (var col = cols - 1; col >= 0; col--) {
                var colElement = document.createElement("div"),
                    img = document.createElement("img"),
                    a = document.createElement("a");

                colElement.setAttribute("class", "mem-col");
                a.setAttribute("href", "#");
                a.setAttribute("id", currentImg);
                img.setAttribute("id", currentImg);
                img.setAttribute("src", "pics/"+ 0 + ".png");

                rowElement.appendChild(colElement);
                colElement.appendChild(a);
                a.appendChild(img);

                currentImg += 1;
            }
        }

        // Iterate through all the anchortags on the page
        // and when the user clicks on an image call the
        // turnBrick function.
        for (var i = 0; i < imageLink.length; i++) {
            imageLink[i].onclick = function() {
                self.turnBrick(this);
                return false;
            };
        }
    },

    turnBrick: function (card) {
        // If brickOne and brickTwo isn't null just return so 
        // the user can't turn more bricks
        if (this.brickOne !== null && this.brickTwo !== null) {
            return;
        }
        console.log(this);
        var activeCard;
        var img = card.querySelector("img");

        // Set the source of the image to what the card id is.
        img.setAttribute("src", "pics/"+ this.random[card.id] + ".png");

        if (!this.brickOne) {
            img.classList.toggle("active-card");
            this.brickOne = img;
        }
        else if (!this.brickTwo) {
            img.classList.toggle("active-card");
            this.brickTwo = img;
            this.checkCards();
        }
    },

    checkCards: function () {
        var self = this;

        this.numOfTries += 1;

        // Check the sources is the same.
        if (this.brickOne.getAttribute("src") === this.brickTwo.getAttribute("src")) {
            // Add the class completed to those bricks.
            this.brickOne.setAttribute("class", "completed");
            this.brickTwo.setAttribute("class", "completed");

            // Set both bricks to null so we can turn some other bricks.
            this.brickOne = null;
            this.brickTwo = null;
            this.completedCards += 1;
        }
        else {
            // Set a timeout to 1000 ms.
            setTimeout(function() {
                self.brickOne.classList.toggle("active-card");
                self.brickTwo.classList.toggle("active-card");

                // "Flip the brick back".
                self.brickOne.setAttribute("src", "pics/"+ 0 + ".png");
                self.brickTwo.setAttribute("src", "pics/"+ 0 + ".png");

                // Set both bricks to null so we can turn some other bricks.
                self.brickOne = null;
                self.brickTwo = null;
            }, 1000);
        }
    },
};

window.onload = Memory.init;
