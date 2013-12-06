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
    }
};

window.onload = Memory.init;
