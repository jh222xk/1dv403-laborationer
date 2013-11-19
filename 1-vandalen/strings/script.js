"use strict";

window.onload = function(){

	// I denna funktion ska du skriva koden för att hantera "spelet"
	var convertString = function(str){
		
		// Check if the string doesn't have a value or if it isn't a number. 
		if (!str || !isNaN(str)) {
			throw new Error("Du måste skriva in en sträng...");
		}
			// Splits the string into an array of strings.
			var strings = str.split('');
			for (var i = 0; i < strings.length; i+=1) {
				if (strings[i] === strings[i].toUpperCase()) {
					strings[i] = strings[i].toLowerCase();
				}
				else if(strings[i] === strings[i].toLowerCase()) {
					strings[i] = strings[i].toUpperCase();
				}
				if (strings[i] === 'a' || strings[i] === 'A') {
					strings[i] = '#';
				}
			}

		// Joins all elements of the array into a string.
		str = strings.join('');

		// Return the converted string.
		return str;
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
			var answer = convertString(input.value); // Läser in texten från textrutan och skickar till funktionen "convertString"
			p.innerHTML = answer;		// Skriver ut texten från arrayen som skapats i funktionen.	
		} catch (error){
			p.classList.add( "error"); // Växla CSS-klass, IE10+
			p.innerHTML = error.message;
		}
	
	});



};
