// Particles.js configuration
particlesJS('particles-js', {
    particles: {
        number: { value: 100, density: { enable: true, value_area: 800 } },
        color: { value: '#00FF88' },
        shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
        opacity: { value: 0.6, random: true },
        size: { value: 4, random: true },
        line_linked: { enable: true, distance: 120, color: '#00FF88', opacity: 0.5, width: 1 },
        move: { enable: true, speed: 4, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
    },
    retina_detect: true
});

const quizData = [
    {
        question: "What is Symbiotic’s core functionality?",
        options: [
            "Enabling shared security and restaking for decentralized networks",
            "Mining new tokens for blockchain networks",
            "Creating centralized smart contracts",
            "Storing data on a single blockchain"
        ],
        answer: "Enabling shared security and restaking for decentralized networks",
        explanation: "Symbiotic allows staked assets to secure multiple protocols, enhancing efficiency."
    },
    {
        question: "What is restaking in the context of Symbiotic?",
        options: [
            "Reusing staked assets to secure multiple protocols",
            "Burning staked tokens to reduce supply",
            "Centralizing staked assets for governance",
            "Minting new tokens for staking"
        ],
        answer: "Reusing staked assets to secure multiple protocols",
        explanation: "Restaking lets assets like ETH secure multiple networks simultaneously."
    },
    {
        question: "What type of protocol is Symbiotic?",
        options: [
            "Permissionless restaking protocol",
            "Permissioned staking protocol",
            "Centralized exchange protocol",
            "NFT minting protocol"
        ],
        answer: "Permissionless restaking protocol",
        explanation: "Symbiotic is open for anyone to build and integrate without restrictions."
    },
    {
        question: "What does Symbiotic’s shared security model reduce?",
        options: [
            "The need for protocol-specific staking",
            "Network interoperability",
            "Capital efficiency",
            "Decentralized governance"
        ],
        answer: "The need for protocol-specific staking",
        explanation: "Shared security pools resources, reducing individual protocol costs."
    },
    {
        question: "What does Symbiotic’s modular architecture enable?",
        options: [
            "Customizable rewards and slashing mechanisms",
            "Fixed reward structures",
            "Centralized network control",
            "Limited protocol access"
        ],
        answer: "Customizable rewards and slashing mechanisms",
        explanation: "Modular design allows networks to tailor rewards and penalties."
    }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timer;
let selectedAnswer = null;
let answerLocked = false;

function loadQuestion() {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const currentQuestionElement = document.getElementById("current-question");
    const totalQuestionsElement = document.getElementById("total-questions");
    const progressBar = document.querySelector(".progress-bar");
    const nextButton = document.getElementById("next-btn");
    const currentQuiz = quizData[currentQuestion];

    if (questionElement && optionsElement && currentQuestionElement && totalQuestionsElement && progressBar && nextButton) {
        questionElement.innerText = currentQuiz.question;
        currentQuestionElement.innerText = currentQuestion + 1;
        totalQuestionsElement.innerText = quizData.length;
        progressBar.style.width = `${((currentQuestion + 1) / quizData.length) * 100}%`;
        optionsElement.innerHTML = "";
        selectedAnswer = null;
        answerLocked = false;
        nextButton.disabled = true;
        nextButton.style.display = "block";

        currentQuiz.options.forEach(option => {
            const button = document.createElement("button");
            button.innerText = option;
            button.classList.add("option");
            button.addEventListener("click", () => {
                if (!answerLocked) {
                    selectedAnswer = option;
                    document.querySelectorAll(".option").forEach(btn => btn.classList.remove("selected"));
                    button.classList.add("selected");
                    answerLocked = true;
                    nextButton.disabled = false;
                    gsap.to(button, { scale: 1.02, duration: 0.2, boxShadow: "0 0 20px rgba(0, 255, 136, 0.7)" });
                }
            });
            optionsElement.appendChild(button);
        });

        gsap.from(".option", { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 });

        timeLeft = 30;
        const timerDisplay = document.getElementById("timer");
        if (timerDisplay) {
            timerDisplay.innerText = `${timeLeft}s`;
            clearInterval(timer);
            timer = setInterval(() => {
                if (timeLeft > 0 && !answerLocked) {
                    timeLeft--;
                    timerDisplay.innerText = `${timeLeft}s`;
                } else if (timeLeft <= 0 && !answerLocked) {
                    clearInterval(timer);
                    checkAnswer("");
                }
            }, 1000);
        }
    }
}

function checkAnswer(selected) {
    const currentQuiz = quizData[currentQuestion];
    const resultElement = document.getElementById("result");

    clearInterval(timer);
    if (resultElement) {
        if (selected === currentQuiz.answer) {
            score++;
            resultElement.innerText = "Correct!";
            resultElement.style.color = "#00FF88";
        } else {
            resultElement.innerText = selected ? 
                `Wrong! The correct answer is: ${currentQuiz.answer}. ${currentQuiz.explanation}` : 
                `Time's up! The correct answer is: ${currentQuiz.answer}. ${currentQuiz.explanation}`;
            resultElement.style.color = "#FF4D4D";
        }
        gsap.from("#result", { opacity: 0, y: 10, duration: 0.5 });
    }
}

function nextQuestion() {
    checkAnswer(selectedAnswer);
    currentQuestion++;
    const resultElement = document.getElementById("result");
    const nextButton = document.getElementById("next-btn");

    setTimeout(() => {
        if (currentQuestion < quizData.length) {
            loadQuestion();
            if (resultElement) resultElement.innerText = "";
            if (nextButton) nextButton.disabled = true;
        } else {
            const quizContainer = document.getElementById("quiz-container");
            const scoreCanvas = document.getElementById("score-canvas");
            if (quizContainer && scoreCanvas) {
                quizContainer.innerHTML = `
                    <h3>Quiz Completed!</h3>
                    <p>Your score: ${score}/${quizData.length}</p>
                    <p>${score >= 4 ? "Great job! Dive deeper at <a href='https://symbiotic.fi/' class='symbiotic-link'>Symbiotic.fi</a>." : score >= 2 ? "Nice effort! Review the Learn section to improve." : "Try again! Check out the Learn section for more details."}</p>
                    <button onclick="location.reload()">Restart Quiz</button>
                `;
                scoreCanvas.style.display = "block";
                drawScoreCircle(score, quizData.length);
                gsap.from("#quiz-container", { opacity: 0, scale: 0.9, duration: 0.7 });
            }
        }
    }, 1000);
}

function drawScoreCircle(score, total) {
    const canvas = document.getElementById("score-canvas");
    const ctx = canvas.getContext("2d");
    const percent = (score / total) * 100;
    const endAngle = (percent / 100) * 2 * Math.PI;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(50, 50, 40, 0, 2 * Math.PI);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(50, 50, 40, -Math.PI / 2, endAngle - Math.PI / 2);
    ctx.strokeStyle = "#00FF88";
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.font = "20px Orbitron";
    ctx.fillStyle = "#00FF88";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${Math.round(percent)}%`, 50, 50);
}

document.querySelectorAll('.nav-link, .cta-button').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
});

window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

window.onload = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') document.body.classList.add('light-theme');

    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }

    loadQuestion();
    gsap.from(".animated-title", { opacity: 0, y: 50, duration: 1 });
    gsap.from(".subtitle", { opacity: 0, y: 30, duration: 1, delay: 0.2 });
    gsap.from(".cta-button", { opacity: 0, scale: 0.8, duration: 0.7, delay: 0.4 });
    gsap.from(".feature-card, .use-case-card, .roadmap-item, .faq-item, .stat-item, .about-content, .learn-content, .community-content, .faq-content, .stats-content", {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.7,
        scrollTrigger: { trigger: "#learn, #use-cases, #roadmap, #about, #stats, #faq, #quiz, #community", start: "top 80%" }
    });
    gsap.to("#hero", {
        backgroundPosition: "50% 100%",
        scrollTrigger: { trigger: "#hero", scrub: true }
    });

    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                gsap.to(i.querySelector('p'), { height: 0, duration: 0.3 });
            });
            if (!isActive) {
                item.classList.add('active');
                gsap.to(item.querySelector('p'), { height: 'auto', duration: 0.3 });
            }
        });
    });

    document.querySelectorAll('.stat-number').forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let current = 0;
        const increment = target / 100;
        const interval = setInterval(() => {
            current += increment;
            stat.innerText = Math.round(current);
            if (current >= target) {
                stat.innerText = target;
                clearInterval(interval);
            }
        }, 20);
    });
};