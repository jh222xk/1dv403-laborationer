(function ($) {
    "use strict";
    PWD.Memory = function (rows, cols) {
        PWD.Window.call(this, "Memory", "memory-16", 400, 400);

        this.rows = rows = typeof rows !== 'undefined' ? rows : 4;
        this.cols = cols = typeof cols !== 'undefined' ? cols : 4;

        this.random = this.getPictureArray(rows, cols);
        this.brickOne = null;
        this.brickTwo = null;
        this.activeCardSum = 0;
        this.completedCards = 0;
        this.numOfTries = 0;
        this.gameInfoEl = document.createElement("div");
        this.completedCardsEl = document.createElement("div");
        this.gameInfoEl.setAttribute("id", "game-info");

        this.startGame(rows, cols);
    };

    // Inherit all the Window functions.
    inheritPrototype(PWD.Memory, PWD.Window);

    PWD.Memory.prototype.getPictureArray = function(rows, cols) {
        var numberOfImages = rows*cols;
        var maxImageNumber = numberOfImages/2;
    
        var imgPlace = [];
    
       //Utplacering av bilder i Array
       for(var i=0; i<numberOfImages; i++)
          imgPlace[i] = 0;
    
        for(var currentImageNumber=1; currentImageNumber<=maxImageNumber; currentImageNumber++)
        {       
            var imageOneOK = false;
            var imageTwoOK = false;
            
            do
            {
                if(imageOneOK == false)
                {
                    var randomOne = Math.floor( (Math.random() * (rows*cols-0) + 0) );              
                    
                    if( imgPlace[randomOne] == 0 )
                    {
                        imgPlace[randomOne] = currentImageNumber;
                        imageOneOK = true;
                    }
                }
                
                if(imageTwoOK == false)
                {
                    var randomTwo = Math.floor( (Math.random() * (rows*cols-0) + 0) );              
                                
                    if( imgPlace[randomTwo] == 0 )
                    {
                        imgPlace[randomTwo] = currentImageNumber;
                        imageTwoOK = true;
                    }
                }           
            }
            while(imageOneOK == false || imageTwoOK == false);      
        }
        
        return imgPlace;
    };

    PWD.Memory.prototype.startGame = function(rows, cols) {
        
        var self = this;
        var currentImg = 0;
        var asd = document.createElement("div");
        asd.setAttribute("class", "memory-wrap");
        var wrapperElement = asd;

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
                a.setAttribute("class", "memory-pic");
                img.setAttribute("id", currentImg);
                img.setAttribute("src", "img/memory/"+ 0 + ".png");

                rowElement.appendChild(colElement);
                colElement.appendChild(a);
                a.appendChild(img);

                currentImg += 1;
            }
        }



        // Add the number of completed cards to the document.
        this.completedCardsEl.innerHTML = 'Antal rätt: ' + this.completedCards;
        wrapperElement.appendChild(this.gameInfoEl);
        this.gameInfoEl.appendChild(this.completedCardsEl);

        this.setWindowContent(wrapperElement);

        var imageLink = wrapperElement.querySelectorAll("a.memory-pic");

        // Iterate through all the anchortags on the page
        // and when the user clicks on an image call the
        // turnBrick function.
        for (var i = 0; i < imageLink.length; i++) {
            imageLink[i].onclick = function() {
                self.turnBrick(this);
                return false;
            };
        }
    };

    PWD.Memory.prototype.turnBrick = function (card) {
        // If brickOne and brickTwo isn't null just return so 
        // the user can't turn more bricks
        if (this.brickOne !== null && this.brickTwo !== null) {
            return;
        }

        var activeCard;
        var img = card.querySelector("img");

        // Set the source of the image to what the card id is.
        img.setAttribute("src", "img/memory/"+ this.random[card.id] + ".png");

        if (!this.brickOne && !img.classList.contains("completed")) {
            img.classList.toggle("active-card");
            this.brickOne = img;
        }
        else if (!this.brickTwo && !img.classList.contains("completed")) {
            img.classList.toggle("active-card");
            if (this.brickOne.id !== img.id) {
                this.brickTwo = img;
                this.checkCards();
            }
        }
       
    };

    PWD.Memory.prototype.checkCards = function () {
        var self = this;
        var brickOneId = this.brickOne.getAttribute("id");
        var brickTwoId = this.brickTwo.getAttribute("id");

        // Increase number of tries by one.
        this.numOfTries += 1;

        // Check the sources is the same.
        if (this.brickOne.getAttribute("src") === this.brickTwo.getAttribute("src") && brickOneId !== brickTwoId) {
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
                self.brickOne.setAttribute("src", "img/memory/"+ 0 + ".png");
                self.brickTwo.setAttribute("src", "img/memory/"+ 0 + ".png");

                // Set both bricks to null so we can turn some other bricks.
                self.brickOne = null;
                self.brickTwo = null;
            }, 1000);
        }

        // Update the number of completed cards.
        this.completedCardsEl.innerHTML = 'Antal rätt: ' + this.completedCards;

        // Check if the number of completed cards is the same as the number of cards
        // Divided by two because there are two of the same card.
        if (this.completedCards === (this.random.length / 2)) {
            var completedGameEl = document.createElement("p");
            completedGameEl.innerHTML = "Grattis! Du klarade det på " + this.numOfTries + " försök.";
            this.gameInfoEl.appendChild(completedGameEl);
        }
    };

})(jQuery);