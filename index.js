//get words from string
const wordsArray = words.split("\n");
var currentWord;

var repeat;

//game statistics
var totalTries = 0;
var correctTries = 0;
var streak = 0;

try {
    const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
}
  catch(e) {
    console.error(e);
}

//use browser text to speech to speak the letters
function spell(word) {
    document.getElementById("game-content").style.display = "none";
    console.log(recognition);
    
    //add space between the letters
    var letters = word.split("").join(" ");
    var msg = new SpeechSynthesisUtterance();
    msg.text = letters;
    msg.rate = document.getElementById("spelling-speed").value;

    var speechInput = document.getElementById("response-type").checked;
    console.log

    //show input after speaking
    msg.onend = function() {
        if (speechInput) {
            document.getElementById("speech-input-bar").style.display = "block";
            document.getElementById("text-input-bar").style.display = "none";
            recognition.start();
            repeat = setTimeout(function() {
                recognition.stop();
                spell(word);
            },8000);
        } else {
            document.getElementById("speech-input-bar").style.display = "none";
            document.getElementById("text-input-bar").style.display = "block";
        }

        document.getElementById("game-content").style.display = "block";
    };
    window.speechSynthesis.speak(msg);
}

function getNewWord() {    
    //update statistics display
    document.getElementById("total-tries").textContent = "Total Tries: " + totalTries;
    document.getElementById("correct-tries").textContent = "Correct Tries: " + correctTries;
    document.getElementById("streak").textContent = "Streak: " + streak;

    //clear inputs
    document.getElementById("word-guess").value = "";
    document.getElementById("word-display").textContent = " ";

    //pick random word
    currentWord = wordsArray[Math.floor(Math.random() * wordsArray.length)];
    spell(currentWord);
}

function validateTextGuess() {    
    totalTries++;

    var display = document.getElementById("word-display");
    var guess = document.getElementById("word-guess").value;

    if (guess.trim().toLowerCase() == currentWord) {
        correctTries++;
        streak++;
        display.textContent = "CORRECT: " + currentWord;
    } else {
        streak = 0;
        display.textContent = "INCORRECT: " + currentWord;
    }

    //wait 1.5 seconds then replay
    setTimeout(getNewWord, 1500);
}

function startGame() {
    document.getElementById("start-screen").style.display = "none";

    getNewWord();
}

function endSpeechGuess() {
    recognition.stop();

    var display = document.getElementById("word-display");
    totalTries++;

    streak = 0;
    display.textContent = "NO RESPONSE: " + currentWord;

    //wait 1.5 seconds then replay
    setTimeout(getNewWord, 1500);
}

recognition.onresult = function(event) {
    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far. 
    // We only need the current one.
    var current = event.resultIndex;
  
    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;

    console.log(transcript);
    recognition.stop();
    clearTimeout(repeat);

    var display = document.getElementById("word-display");
    totalTries++;

    if (transcript.trim().toLowerCase() == currentWord) {
        correctTries++;
        streak++;
        display.textContent = "CORRECT: " + currentWord;
    } else {
        streak = 0;
        display.textContent = "INCORRECT: " + currentWord;
    }

    //wait 1.5 seconds then replay
    setTimeout(getNewWord, 1500);
  }



