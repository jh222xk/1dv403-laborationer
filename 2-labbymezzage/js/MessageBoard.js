"use strict";

var MessageBoard = {

   messages: [],

    init: function() {
        var mess = new Message("Hello World!", new Date());
        alert(mess);
        alert(mess.getText());
        mess.setText("Foo bar");
        alert(mess);
        mess.setDate(new Date(111111111111111));
        alert(mess);


    }
    
};

window.onload = MessageBoard.init;

