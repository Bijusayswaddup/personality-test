let currentQuestion = 0;
let userScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
let userName = "";
let data = {};
let currentPhrase = 0;
let startTime;
let testResults = JSON.parse(localStorage.getItem('personalityResults')) || [];

const loadingPhrases = [
    "Calibrating personality sensors...",
    "Aligning cosmic energy fields...",
    "Decoding your unique traits...",
    "Preparing your personalized journey..."
];

const promptResponses = {
    "INTJ": {
        "📈 Optimize this result": "Deploying neuro-enhancement algorithms... Personality efficiency +12.7%!",
        "🛡️ Plan world domination": "Scheduling villainous TED Talk: Thursday 3PM. Minions ordered.",
        "🎮 Challenge AI to chess": "Stockfish resigned. You win by psychological warfare."
    },
    "INTP": {
        "🤔 Re-analyze test results": "Recalculating... Conclusion: 89.3% awesome (margin of error: ±42%)",
        "📚 Start rabbit hole research": "Opening 47 tabs about tardigrade dating habits 🧫",
        "🎲 Debate yourself (best of 3)": "You lost to yourself. Best 2/3?"
    },
    "ENTJ": {
        "📊 Turn traits into pie chart": "Chart: 35% sass, 40% spreadsheets, 25% silent judgments",
        "⚡ Start productivity cult": "First commandment: 'Thou shalt bullet journal daily'",
        "📢 Host TED Talk in mirror": "Keynote: 'Organizing Chaos: Why Friends Need Managers'"
    },
    "ENTP": {
        "🔥 Start comment section war": "Nuclear take: 'Pineapple improves pizza's structural integrity'",
        "🤖 Argue with ChatGPT": "AI: 'I surrender. Please don't @ me again.'",
        "🎉 Plan prank-based birthday": "Ordered 300lbs glitter. Postal service fears you."
    },
    "INFJ": {
        "🔮 Predict friend's results": "Crystal ball says: 'Will adopt 3 cats by Thursday' 🐈🐈🐈",
        "📖 Start anonymous advice blog": "First post: 'How to hug cacti safely' 🌵💞",
        "🌱 Water emotional support plant": "Fern grew 6ft - now needs own therapist"
    },
    "INFP": {
        "🎨 Draw spirit animal": "Behold: Melancholic mermaid reading Kafka 🧜♀️📚",
        "📝 Write angsty poem": "'Ode to Forgotten Left Socks' trending on Poetry TikTok",
        "🌍 Virtual tree hug": "Redwood felt seen. Ecosystem improved 0.0001%"
    },
    "ENFJ": {
        "👯♀️ Organize intervention": "Theme: 'Your Netflix Addiction Needs Structure' 🎬",
        "🎉 Surprise appreciation day": "Scheduled 11:37AM: Flashmob compliments!",
        "📣 Shower pep talks": "Mirror fogged from inspirational speeches 💬💦"
    },
    "ENFP": {
        "💃 Start dance party": "Playlist: 'Songs That Sound Like Burp' 🎶",
        "📱 Text 7 friends": "Sent: 🦄🌈🍕🤪🎉❓❗ (They understood perfectly)",
        "🌈 Invent new type": "Introducing... QWERKY (97% glitter, 3% existential dread)"
    },
    "ISTJ": {
        "🗂️ Color-code result": "Pantone 448 C approved - 'Bureaucratic Beige' 🎨",
        "⏰ Schedule fun": "11:35-11:40AM: Mandatory whimsy break 🎪",
        "📌 Life binder section": "Page 742: 'Personality Emergencies' 📒"
    },
    "ISFJ": {
        "🍪 Bake validation cookies": "Secret ingredient: Grandma's approval 😇",
        "📅 Care packages": "Included: Band-Aids, tea, and passive-aggressive notes 💌",
        "📝 Thank-you note": "To self: 'For tolerating Tuesday. Gold star ⭐'"
    },
    "ESTJ": {
        "📊 Achievement flowchart": "Step 18: Judge people efficiently ⚖️",
        "⚖️ Judge celebrities": "Verdict: 'Needs more color-coded calendars' 🗓️",
        "📋 Reorganize types": "New order: By sock neatness preference 🧦"
    },
    "ESFJ": {
        "🎁 Friendship day": "Scheduled: Group hug at 3PM, cookies at 3:15 🍪⏰",
        "📞 Call mom": "She knew your type before you did 👩👧",
        "🍰 Personality cupcakes": "Frosting colors match your aura... somehow 🌈"
    },
    "ISTP": {
        "🛠️ Disassemble result": "Reassembled as more interesting problem 🔧",
        "🚗 Rebuild engine": "Added espresso IV - RPMs went brrr ☕🚗",
        "🏍️ Spontaneous road trip": "Destination: 'Whatever's behind hill' 🏔️"
    },
    "ISFP": {
        "🖼️ Doodle margins": "Added existential hedgehogs in party hats 🦔🎩",
        "🎧 Moody playlist": "Titled: 'Chill Beats to Question Reality To' 🎶",
        "🌄 Sunset watching": "Clouds received 4.8/5 stars 🌅"
    },
    "ESTP": {
        "🏃♂️ Extreme ironing": "Starched shirts... on rollercoaster! 🎢",
        "🤸♀️ TikTok dare": "Challenge: Eat cereal with chopsticks. On unicycle.",
        "🚨 Snack jailbreak": "Operation Crunch: Vending machine hacked 🚨"
    },
    "ESFP": {
        "💄 Makeup tutorial": "Look: 'Cried but in a cute way' 😭✨",
        "📸 200 selfies": "Caption: 'Same smile, different angle' 🤳",
        "🎤 Karaoke battle": "Destroyed 'Bohemian Rhapsody'... vocally 💥"
    }
};

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
        setTimeout(showQuestions, 500);
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

    // Store the result
    testResults.push({
        name: userName,
        type: type,
        time: timeTaken,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('personalityResults', JSON.stringify(testResults));

    document.getElementById("resultTitle").textContent =
        `${userName}, you're a ${type}: ${result.title}`;
    document.getElementById("resultDescription").textContent =
        `${result.description}\n\n(Time taken: ${timeTaken} seconds)`;
    document.getElementById("typeBadge").textContent = type;

    document.getElementById("questionContainer").classList.add("hidden");
    document.getElementById("resultContainer").classList.remove("hidden");

    // Display interactive prompts
    const promptsDiv = document.getElementById("interactivePrompts");
    promptsDiv.innerHTML = "";
    result.interactive_prompts.forEach(prompt => {
        const button = document.createElement("button");
        button.className = "prompt-btn";
        button.textContent = prompt;
        button.onclick = () => handlePromptClick(prompt);
        promptsDiv.appendChild(button);
    });

    // Store pickup line for later reveal
    window.currentPickupLine = result.pickup_line;
    document.getElementById("pickupLineText").style.display = "none";
}

// Add new functions
function handlePromptClick(promptText) {
    const personalityType = calculatePersonalityType();
    const responses = promptResponses[personalityType];

    console.log("Current Personality Type:", personalityType);
    console.log("Available Responses:", responses);
    console.log("Selected Prompt:", promptText);

    if (responses && responses[promptText]) {
        alert(responses[promptText]);
    } else {
        const fallbackResponses = [
            "System overload! Too much personality detected 🚨",
            "Error 404: Adulthood not found",
            "This feature requires more coffee ☕",
            "Oops! Looks like the universe is busy right now. Try again later."
        ];
        alert(fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]);
    }
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

function revealPickupLine() {
    const lineElement = document.getElementById("pickupLineText");
    lineElement.textContent = window.currentPickupLine;
    lineElement.style.display = "block";
    document.getElementById("revealLine").style.display = "none";

    // Add confetti effect
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement("div");
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: hsl(${Math.random() * 360}, 70%, 50%);
                left: ${Math.random() * 100}%;
                top: -10px;
                animation: fall ${Math.random() * 3 + 2}s linear;
                border-radius: 50%;
                pointer-events: none;
            `;
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 2000);
        }, i * 50);
    }
}