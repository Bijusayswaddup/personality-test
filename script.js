let currentQuestion = 0;
let userScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
let userName = "";
let data = {};
let currentPhrase = 0;
let startTime;

const loadingPhrases = [
    "Calibrating personality sensors...",
    "Aligning cosmic energy fields...",
    "Decoding your unique traits...",
    "Preparing your personalized journey..."
];

// Start loading screen on page load
window.onload = function () {
    startTimer();
    simulateLoading();
    setInterval(updateLoadingText, 1000);
};

function startTimer() {
    startTime = new Date();
}

function updateLoadingText() {
    document.getElementById("dynamicText").textContent = loadingPhrases[currentPhrase];
    currentPhrase = (currentPhrase + 1) % loadingPhrases.length;
}

function simulateLoading() {
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += 1;
        document.getElementById("progressBar").style.width = `${progress}%`;
        document.getElementById("progressPercent").textContent = `${progress}%`;

        if (progress === 75) {
            clearInterval(loadingInterval);
            document.getElementById("nameInput").classList.remove("hidden");
            document.getElementById("loadingScreen").classList.add("hidden");
        }
    }, 100);
}

async function submitName() {
    userName = document.getElementById("userName").value.trim();
    if (!userName || !/^[a-zA-Z\s]+$/.test(userName)) {
        alert("Please enter a valid name (letters and spaces only).");
        return;
    }
    localStorage.setItem("userName", userName);
    document.getElementById("displayName").textContent = userName;

    document.getElementById("nameInput").classList.add("hidden");
    document.getElementById("progressBar").style.width = "100%";
    document.getElementById("progressPercent").textContent = "100%";

    try {
        const response = await fetch("data.json");
        if (!response.ok) throw new Error("Failed to load data");
        data = await response.json();
        setTimeout(showQuestions, 1000);
    } catch (error) {
        console.error("Error loading data:", error);
        alert("An error occurred while loading the test. Please try again later.");
    }
}

function showQuestions() {
    document.getElementById("loadingScreen").classList.add("hidden");
    document.getElementById("questionContainer").classList.remove("hidden");
    loadQuestion(data.questions[currentQuestion]);
}

function loadQuestion(question) {
    document.getElementById("questionText").textContent = question.text;
    document.getElementById("currentQ").textContent = currentQuestion + 1;
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    question.options.forEach((option) => {
        const button = document.createElement("button");
        button.className = "option-btn";
        button.textContent = option.text;
        button.onclick = () => handleAnswer(question.dimension, option.value);
        optionsDiv.appendChild(button);
    });
}

function handleAnswer(dimension, value) {
    userScores[dimension] += parseInt(value);
    currentQuestion < data.questions.length - 1 ? nextQuestion() : showResult();
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion(data.questions[currentQuestion]);
    document.getElementById("backButton").classList.remove("hidden");
}

function goBack() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion(data.questions[currentQuestion]);
        document.getElementById("backButton").classList.toggle("hidden", currentQuestion === 0);
    }
}

function showResult() {
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const type = calculatePersonalityType();
    const result = data.personalityTypes[type];

    document.getElementById("resultTitle").textContent = 
        `${userName}, you're a ${type}: ${result.title}`;
    document.getElementById("resultDescription").textContent = 
        `${result.description}\n\n(Time taken: ${timeTaken} seconds)`;
    document.getElementById("typeBadge").textContent = type;

    document.getElementById("questionContainer").classList.add("hidden");
    document.getElementById("resultContainer").classList.remove("hidden");
}

function calculatePersonalityType() {
    return [
        userScores.E >= userScores.I ? "E" : "I",
        userScores.S >= userScores.N ? "S" : "N",
        userScores.T >= userScores.F ? "T" : "F",
        userScores.J >= userScores.P ? "J" : "P",
    ].join("");
}

async function shareResult() {
    try {
        const screenshot = await captureScreenshot();
        const result = data.personalityTypes[calculatePersonalityType()];
        const shareUrl = window.location.href;
        const resultText = `${userName}, my personality type is ${calculatePersonalityType()}: ${result.title}. ${result.description}`;

        if (navigator.share) {
            const blob = await (await fetch(screenshot)).blob();
            const file = new File([blob], 'personality-result.png', { type: 'image/png' });
            
            await navigator.share({
                title: "My Personality Test Result",
                text: resultText,
                files: [file],
                url: shareUrl
            });
        } else {
            const link = document.createElement('a');
            link.download = 'personality-result.png';
            link.href = screenshot;
            link.click();
            
            // Fallback social sharing
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(resultText)}&url=${encodeURIComponent(shareUrl)}`;
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            window.open(twitterUrl, '_blank');
            window.open(facebookUrl, '_blank');
        }
    } catch (error) {
        console.error('Sharing failed:', error);
        alert('Sharing failed. Please try again or use the download option.');
    }
}

function captureScreenshot() {
    return new Promise((resolve, reject) => {
        html2canvas(document.getElementById("resultContainer"), {
            scale: 2,
            useCORS: true,
            allowTaint: true
        }).then(canvas => resolve(canvas.toDataURL('image/png')))
          .catch(reject);
    });
}