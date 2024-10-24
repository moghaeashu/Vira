// Check browser compatibility for Web Speech API
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = false; // Stop listening after the command is completed
let listening = false;

const startBtn = document.getElementById('start-btn');

// Audio elements for different commands
const listeningSound = document.getElementById('listening-sound');
const helloSound = document.getElementById('hello-sound');
const timeSound = document.getElementById('time-sound');
const dateSound = document.getElementById('date-sound');

// Function to handle the AI response
function respondToCommand(command) {
    let response = '';
    command = command.toLowerCase();

    // Map different commands to play specific audio
    if (command.includes('hello')) {
        response = 'Hello! How can I help you today?';
        helloSound.play();  // Play custom audio for "hello" command
    } else if (command.includes('time')) {
        const time = new Date().toLocaleTimeString();
        response = `The current time is ${time}.`;
        timeSound.play();  // Play custom audio for "time" command
    } else if (command.includes('date')) {
        const date = new Date().toLocaleDateString();
        response = `Today is ${date}.`;
        dateSound.play();  // Play custom audio for "date" command
    } else {
        response = 'I did not understand that. Please try again.';
        listeningSound.play();  // Play default sound when command is unclear
    }

    // Speak the response after stopping the custom audio
    speak(response);
}

// Function to speak the response
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Use a realistic male voice if available
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(voice => voice.name.includes('Male')) || voices[0];
    utterance.voice = maleVoice;

    window.speechSynthesis.speak(utterance);
}

// Start listening to the user's voice
startBtn.addEventListener('click', () => {
    if (!listening) {
        recognition.start();
        listening = true;
        listeningSound.play();
        startBtn.classList.add('typing');
        startBtn.textContent = 'Listening...';
    }
});

// Handle the speech recognition results
recognition.addEventListener('result', (event) => {
    const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

    // Show the command on the start button in typing style
    startBtn.textContent = transcript;
    
    // Only handle the final result
    if (event.results[0].isFinal) {
        listeningSound.pause();  // Stop the custom audio
        respondToCommand(transcript);
        listening = false;
        startBtn.textContent = 'Start Listening'; // Reset button text
        startBtn.classList.remove('typing');
    }
});

// When recognition ends, reset the state
recognition.addEventListener('end', () => {
    if (listening) {
        recognition.start(); // In case it was cut off prematurely
    } else {
        startBtn.classList.remove('typing');
        startBtn.textContent = 'Start Listening';
    }
});
