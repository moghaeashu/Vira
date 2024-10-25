// Three.js setup (previous code remains same)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const container = document.getElementById('scene-container');
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();

// Custom Audio Commands Setup
const customAudioCommands = {
    'hello': 'path/to/hello.mp3',
    'good morning': 'path/to/good-morning.mp3',
    'play song': 'songs/Desi-Hood-(Slowed-Reverb)---Krish-Rao-BARATO-NATION.mp3',
    // Add more commands and audio paths here
};

// Audio Player Setup
let currentAudio = null;

function playCustomAudio(audioPath) {
    // Stop any currently playing audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    // Create and play new audio
    currentAudio = new Audio(audioPath);
    setTimeout(() => {
        currentAudio.play()
            .catch(error => console.log('Audio playback error:', error));
    }, 1000); // 1 second delay as requested
}

// Voice Assistant Implementation
const micButton = document.getElementById('mic-button');
const animationContainer = document.getElementById('animation-container');
const transcript = document.getElementById('transcript');
let recognition;
let speaking = false;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
        micButton.classList.add('hidden');
        animationContainer.style.display = 'block';
    };

    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript.toLowerCase();
        transcript.textContent = result;
        
        if (event.results[0].isFinal) {
            setTimeout(() => processCommand(result), 1000);
        }
    };

    recognition.onend = () => {
        if (!speaking) {
            animationContainer.style.display = 'none';
            micButton.classList.remove('hidden');
        }
    };
}

// Enhanced Process Command Function
function processCommand(command) {
    // Check for custom audio commands first
    for (const [trigger, audioPath] of Object.entries(customAudioCommands)) {
        if (command.includes(trigger)) {
            playCustomAudio(audioPath);
            return;
        }
    }

    // Regular commands
    let response = "";

    if (command.includes('time')) {
        response = `The current time is ${new Date().toLocaleTimeString()}`;
    }
    else if (command.includes('date')) {
        response = `Today's date is ${new Date().toLocaleDateString()}`;
    }
    else if (command.includes('open facebook')) {
        window.open('https://facebook.com', '_blank');
        response = "Opening Facebook";
    }
    else if (command.includes('open twitter')) {
        window.open('https://twitter.com', '_blank');
        response = "Opening Twitter";
    }
    else if (command.includes('open youtube')) {
        window.open('https://youtube.com', '_blank');
        response = "Opening YouTube";
    }
    else {
        response = "I heard you say: " + command;
    }

    speakResponse(response);
}

function speakResponse(text) {
    speaking = true;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = speechSynthesis.getVoices().find(voice => voice.gender === 'male') || speechSynthesis.getVoices()[0];
    
    utterance.onend = () => {
        speaking = false;
        animationContainer.style.display = 'none';
        micButton.classList.remove('hidden');
    };
    
    speechSynthesis.speak(utterance);
}

micButton.addEventListener('click', () => {
    if (recognition) {
        recognition.start();
    } else {
        alert('Speech recognition is not supported in this browser.');
    }
});

window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});