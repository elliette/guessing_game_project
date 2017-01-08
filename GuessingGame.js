var generateWinningNumber = function() {
    return Math.floor(Math.random() * 100) + 1;
};

function newGame() {
    return new Game();
}

var shuffle = function(array) {
    var last = array.length;
    var random;
    var temporary;

    while (last) {
        random = Math.floor(Math.random() * last--);

        temporary = array[last];
        array[last] = array[random];
        array[random] = temporary;
    }

    return array;
};

var Game = function() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
};

Game.prototype = {

    difference: function() {
        return Math.max(this.playersGuess, this.winningNumber) - Math.min(this.playersGuess, this.winningNumber);
    },

    isLower: function() {
        return (this.playersGuess < this.winningNumber || false);
    },

    checkGuess: function(num) {
        if (typeof num !== "number" || num < 1 || num > 100 || isNaN(num)) {
            return "Invalid guess.";
        }  else if (this.pastGuesses.slice(0, this.pastGuesses.length).indexOf(num) > -1) {
            $('#subtitle').text("You've already guessed that number.");
            return "Hey!";
        } else {
            this.pastGuesses.push(num); 
            $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
            if (num === this.winningNumber) {
                $('#hint, #submit, #players-input').prop("disabled", true);
                $('#headers').css({
                    'color': '#091830'
                });

                $('#subtitle').text("You correctly guessed " + this.winningNumber + "! Press reset to play again.");
                $('body').css("background", "url(clouds.jpg)");

                $("#app").css({
                    'background': '#ffcc00',
                    'border': '20px dotted #06B6FF',
                    'border-top': 'none'
                });

                return "You Win!";
            } else if (this.pastGuesses.length === 5) {
                $('#hint, #submit, #players-input').prop("disabled", true);
                $('#subtitle').text("The winning number was " + this.winningNumber + ". Press reset to play again.");
                $("body").css({
                    "background": '#091830'
                });
                return "You Lose.";
            } else {
                if (this.isLower()) {
                    $('#subtitle').text("Guess a higher number.");
                } else if (!this.isLower()) {
                    $('#subtitle').text("Guess a lower number.");
                }

                if (this.difference() < 10) {
                    return "You're burning up!";
                } else if (this.difference() < 25) {
                    return "You're lukewarm.";
                } else if (this.difference() < 50) {
                    return "You're a bit chilly.";
                } else {
                    return "You're ice cold!";
                }
            }
        }
    },


    playersGuessSubmission: function(num) {
        this.playersGuess = num;
        return this.checkGuess(num);
    },

    provideHint: function() {
        return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
    }
}

var submitGuess = function(game) {
    var guess = parseInt($('#players-input').val());
    $('#players-input').val('');
    var response = game.playersGuessSubmission(guess);
    $('#title').text(response);

}

$(document).ready(function() {
    var game = newGame();
    $('#submit').click(function(e) {
        submitGuess(game);
    })

    $('#players-input').keypress(function(e) {
        if (e.which == 13) {
            submitGuess(game);
        }
    });

    $('#hint').click(function() {
        var hintArr = game.provideHint();
        $('#title').text('Hint:');
        $('#subtitle').text("The winning number is either " + hintArr[0] + ", " + hintArr[1] + " or " + hintArr[2] + ".")
    })

});