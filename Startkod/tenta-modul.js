"use strict";

//Exportera för import i annan fil.
module.exports = {
    
    // Vektor för att spara spelplan i
    gameArea: [],

    playerOneNick: null, // Variabel för att spara nickname på spelare 1
    playerOneColor: null, // Variabel för att spara färg till spelare 1
    playerOneSocketId: null, // Variabel för att spara socket.id för spelare 1
    playerTwoNick: null, // Variabel för att spara nickname på spelare 2
    playerTwoColor: null, // Variabel för att spara färg till spelare 1
    playerTwoSocketId: null, // Variabel för att spara socket.id för spelare 2
    currentPlayer: null, // Variabel för att hålla reda på vems drag det är, sätts till antingen 1 eller 2
    timerId : null, // Variabel för att hålla timerId för VG-lösning
    
    /*  Funktion för validering av postad formulärdata.
        Tar emot req.body som indata
        Har följande returvärden:
        true - alla skickade data ok
        false - data saknas / är felaktiga
    */
   validateForm: function(formData) {
       try {
           let nick = formData.nick_1;
           let color = formData.color_1;

           if (nick === undefined) throw 'Nickname saknas';
           if (color === undefined) throw 'Färg ej vald';

           if (color === '#ffffff' || color === '#000000') throw 'Ogiltig färg';
           if (nick.length < 3) throw 'Minst 3 tecken i namn';
        
           return true;
       }
       catch (ex) {
           return false;
       }
   },
    
    /* Funktion för att nollaställa spelplan.
    Tar inga invärden och returnerar inget 
    */
   resetGameArea: function() {
       this.gameArea = [0, 0, 0, 0, 0, 0, 0, 0, 0];
   },
    
    /*  Funktion utan invärden som kontrollerar om spelet är slut
        Funktionen har följande returvärden:
            0 - Spelet ej slut
            1 - Spelare 1 har vunnit
            2 - Spelare 2 har vunnit
            3 - Spelet blev oavgjort
    */
    checkForWinner: function () {
        let winner = 3;
        let gameArray = this.gameArea;

        //Kontrollera om spelplanen är full
        for (let i = 0; i < 9; i++) {
            if (gameArray[i] === 0) winner = 0;
        }

        //Kontrollera horisontellt
        if (gameArray[0] === gameArray[1] && gameArray[0] === gameArray[2] && gameArray[0] !== 0) {
            winner = gameArray[0];
        }
        else if (gameArray[3] === gameArray[4] && gameArray[3] === gameArray[5] && gameArray[3] !== 0) {
            winner = gameArray[3];
        }
        else if (gameArray[6] === gameArray[7] && gameArray[6] === gameArray[8] && gameArray[6] !== 0) {
            winner = gameArray[6];
        }

        //Kontrollera vertikalt
        if (gameArray[0] === gameArray[3] && gameArray[0] === gameArray[6] && gameArray[0] !== 0) {
            winner = gameArray[0];
        }
        else if (gameArray[2] === gameArray[5] && gameArray[2] === gameArray[8] && gameArray[2] !== 0) {
            winner = gameArray[2];
        }
        else if (gameArray[1] === gameArray[4] && gameArray[1] === gameArray[7] && gameArray[1] !== 0) {
            winner = gameArray[1];
        }

        //Kontrollera diagonalt
        if (gameArray[0] === gameArray[4] && gameArray[0] === gameArray[8] && gameArray[0] !== 0) {
            winner = gameArray[0];
        }
        else if (gameArray[6] === gameArray[4] && gameArray[6] === gameArray[2] && gameArray[6] !== 0) {
            winner = gameArray[6];
        }
        console.log('winner: ' + winner);
        return winner;

    },

    /* Funktion för att plocka ut kakor är strängen som returneras ifrån request.headers.cookie
       Tar emot strängen som ska parsas som invärde. (socket.handshake.headers.cookie)
       returnerar ett JS-objekt med nyckel-värde par innehållande de kakor som fanns i strängen  
    */
    parseCookies: function (rc) {

        let list = {};
        //*************************************************************************************** */
        //Funktion för att parsa cookie-sträng  
        rc && rc.split(';').forEach(function (cookie) {
            var parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
        //Hämtad ifrån: https://stackoverflow.com/questions/45473574/node-js-cookies-not-working
        //*************************************************************************************** */
        return list;
    }
}
  

