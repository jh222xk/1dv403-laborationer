"use strict";

window.onload = function(){

	
	var birthday = function(date){
		// Check if date is formatted as; YYYY-MM-DD.
		if (!date.match(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/)) {
			throw new Error("Felformaterat datum! Ange datum enligt: YYYY-MM-DD ");
		}

		// Create a date object from the current date.
		var dateNow = new Date(),
			year = dateNow.getFullYear();

		// Create a new date object from the date parameter.
		date = new Date(date);
		date.setDate(date.getDate() + 1);

		// Set the year to the current year (2013).
		date.setFullYear(year);

		// The diffrence in ms.
		var difference = date.getTime() - dateNow.getTime();

		// Divide the diffrence with one day in ms.
		var days = Math.round((difference)/(1000 * 60 * 60 * 24));

		return days;
	};
	// ------------------------------------------------------------------------------


	// Kod för att hantera utskrift och inmatning. Denna ska du inte behöva förändra
	var p = document.querySelector("#value"); // Referens till DOM-noden med id="#value"
	var input = document.querySelector("#string");
	var submit = document.querySelector("#send");

	// Vi kopplar en eventhanterare till formulärets skickaknapp som kör en anonym funktion.
	submit.addEventListener("click", function(e){
		e.preventDefault(); // Hindra formuläret från att skickas till servern. Vi hanterar allt på klienten.

		p.classList.remove( "error");

		try {
			var answer = birthday(input.value); // Läser in texten från textrutan och skickar till funktionen "convertString"
			var message;
			switch (answer){
				case 0: message = "Grattis på födelsedagen!";
					break;
				case 1: message = "Du fyller år imorgon!";
					break;
				default: message = "Du fyller år om " + answer + " dagar";
					break;
			}

			p.innerHTML = message;
		} catch (error){
			p.classList.add( "error"); // Växla CSS-klass, IE10+
			p.innerHTML = error.message;
		}
	
	});



};