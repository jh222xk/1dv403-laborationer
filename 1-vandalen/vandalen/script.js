"use strict";

var makePerson = function(persArr) {
    var nameArr = [],
        ageArr = [];

    // Append the name and age once per array element.
    persArr.forEach(function (persArr) {
        nameArr.push(persArr.name);
        ageArr.push(persArr.age);
    });

    // Sort the nameArr and join all elements 
    // of the array into a string with a comma and a space.
    nameArr = nameArr.sort(function(a, b) {
        return a.localeCompare(b);
    }).join(', ');

    // Reduce each value of array to a single value and divide it
    // with the lenght of the ageArr (3).
    var result = {
        minAge: Math.min.apply(null, ageArr),
        maxAge: Math.max.apply(null, ageArr),
        averageAge: Math.round((ageArr.reduce(function(a, b) {
            return a + b;
        }, 0)) / ageArr.length),
        names: nameArr
    };

    return result;
};

var data = [{name: "John Häggerud", age: 37}, {name: "Johan Leitet", age: 36}, {name: "Mats Loock", age: 46}];

var result = makePerson(data);

console.log(result);
