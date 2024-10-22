let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

// Function to play custom audio
function playCustomAudio() {
    let audio = new Audio('path/to/your/custom-audio.mp3');  // Update with the correct path to your audio file
    audio.play();
}

// Function to speak with a specific voice
function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "en-US";

    // Load available voices
    let voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(voice => voice.name.includes("Google") && voice.name.includes("Gemini Nova"));

    if (selectedVoice) {
        text_speak.voice = selectedVoice;
    } else {
        console.log("Google Gemini Nova voice not found. Using default voice.");
    }

    window.speechSynthesis.speak(text_speak);
}

// Load the voices asynchronously
function loadVoices() {
    return new Promise((resolve) => {
        let synth = window.speechSynthesis;
        let id;

        id = setInterval(() => {
            if (synth.getVoices().length !== 0) {
                clearInterval(id);
                resolve(synth.getVoices());
            }
        }, 10);
    });
}

// Greet the user based on time
function wishMe() {
    let day = new Date();
    let hours = day.getHours();

    if (hours >= 0 && hours < 12) {
        speak("Good Morning Sir");
    } else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon Sir");
    } else {
        speak("Good Evening Sir");
    }
}

// Speech recognition setup
let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (speechRecognition) {
    recognition = new speechRecognition();
} else {
    console.error("Speech Recognition is not supported in this browser.");
    alert("Sorry, your browser does not support the Speech Recognition API.");
}

if (recognition) {
    recognition.onresult = (event) => {
        let currentIndex = event.resultIndex;
        let transcript = event.results[currentIndex][0].transcript;
        content.innerText = transcript;
        takeCommand(transcript.toLowerCase());
    };

    // Start recognition on button click
    btn.addEventListener("click", () => {
        recognition.start();
        btn.style.display = "none";
        voice.style.display = "block";
    });
}

// Function to handle voice commands
function takeCommand(message) {
    // Show the button after command is taken
    btn.style.display = "flex";
    voice.style.display = "none";

    // Check for specific commands
    if (message.includes("shock")) {
        playCustomAudio('audios/carryminati-asambhav-128-ytshorts.savetube.me.mp3'); // Play the custom audio when "get shocked" is spoken
        speak("Here is your shock!");
    } else if (message.includes("hello") || message.includes("hey")) {
        speak("Hello Sir, what can I help you with?");
    } else if (message.includes("who are you")) {
        speak("I am Vira, a virtual assistant created by Harshit Mogha Sir.");
    } else if (message.includes("vira open youtube")) {
        speak("I am opening YouTube...");
        window.open("https://youtube.com/", "_blank");
    } else if (message.includes("vira open facebook")) {
        speak("I am opening Facebook...");
        window.open("https://www.facebook.com/", "_blank");
    } else if (message.includes("vira open instagram")) {
        speak("I am opening Instagram...");
        window.open("https://www.instagram.com/", "_blank");
    } else if (message.includes("vira open whatsapp")) {
        speak("I am opening WhatsApp...");
        window.open("https://web.whatsapp.com/", "_blank");
    } else if (message.includes("can i abuse you")) {
        speak("I don't like abuse, so please mind your language.");
    } else if (message.includes("vira what is html")) {
        speak("This is what I found on the internet regarding HTML.");
        window.open("https://www.google.com/search?q=what+is+html", "_blank");
    } else if (message.includes("vira what is css")) {
        speak("This is what I found on the internet regarding CSS.");
        window.open("https://www.google.com/search?q=what+is+css", "_blank");
    } else if (message.includes("vira what is javascript")) {
        speak("This is what I found on the internet regarding JavaScript.");
        window.open("https://www.google.com/search?q=what+is+javascript", "_blank");
    } else if (message.includes("time")) {
        let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak(`The time is ${time}`);
    } else if (message.includes("date")) {
        let date = new Date().toLocaleString(undefined, { day: "numeric", month: "short" });
        speak(`Today's date is ${date}`);
    }
}

// Call wishMe when the page loads
window.addEventListener('load', async () => {
    await loadVoices();
    wishMe();
});