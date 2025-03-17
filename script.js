let currentQuestion = 0;
let userScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
let userName = "";
let data = {}; // Will store questions/personality data

// Start loading screen on page load
window.onload = function () {
    simulateLoading();
};

// Simulate loading progress
function simulateLoading() {
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += 1;
        document.getElementById("progressBar").style.width = `${progress}%`;
        document.getElementById("progressPercent").textContent = `${progress}%`;

        // Pause at 75% for name input
        if (progress === 75) {
            clearInterval(loadingInterval);
            document.getElementById("nameInput").classList.remove("hidden");
            document.getElementById("loadingScreen").classList.add("hidden");
        }
    }, 100);
}

// Submit name and finish loading
async function submitName() {
    userName = document.getElementById("userName").value.trim();
    if (!userName) userName = "Anonymous";
    localStorage.setItem("userName", userName);

    // Hide name input immediately
    document.getElementById("nameInput").classList.add("hidden"); // 🚨 ADD THIS LINE
    
    // Complete progress to 100%
    document.getElementById("progressBar").style.width = "100%";
    document.getElementById("progressPercent").textContent = "100%";
    
    // Fetch data and proceed
    const response = await fetch("data.json");
    data = await response.json();
    
    setTimeout(showQuestions, 1000);
}

// Show first question
function showQuestions() {
    document.getElementById("loadingScreen").classList.add("hidden");
    document.getElementById("questionContainer").classList.remove("hidden");
    loadQuestion(data.questions[currentQuestion]);
}

// Load question and options
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

// Handle answer selection
function handleAnswer(dimension, value) {
    userScores[dimension] += parseInt(value);

    if (currentQuestion < data.questions.length - 1) {
        currentQuestion++;
        loadQuestion(data.questions[currentQuestion]);
    } else {
        showResult();
    }
}

// Calculate and display result
function showResult() {
    // Determine personality type
    const type = [
        userScores.E >= userScores.I ? "E" : "I",
        userScores.S >= userScores.N ? "S" : "N",
        userScores.T >= userScores.F ? "T" : "F",
        userScores.J >= userScores.P ? "J" : "P",
    ].join("");

    // Get result details
    const result = data.personalityTypes[type];

    // Display result
    document.getElementById("resultTitle").textContent =
        `${userName}, you're a ${type}: ${result.title}`;
    document.getElementById("resultDescription").textContent = result.description;

    // Hide questions, show result
    document.getElementById("questionContainer").classList.add("hidden");
    document.getElementById("resultContainer").classList.remove("hidden");
}