// ----- Data: questions here -----
const questions = [
  {
    text: "What does HTML stand for?",
    options: [
      "Hyperlinks and Text Markup Language",
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyper Tool Multi Language"
    ],
    answerIndex: 1
  },
  {
    text: "Which company created JavaScript?",
    options: ["Netscape", "Microsoft", "Sun Microsystems", "Apple"],
    answerIndex: 0
  },
  {
    text: "Which tag is used for the largest heading in HTML?",
    options: ["<heading>", "<h6>", "<h1>", "<header>"],
    answerIndex: 2
  },
  {
    text: "CSS is used for…",
    options: [
      "Structuring the page",
      "Styling the page",
      "Storing data",
      "Running the server"
    ],
    answerIndex: 1
  }
];

// ----- State -----
let current = 0;
let score = 0;
let selected = null;
let locked = false; // after choosing, lock until Next

// ----- DOM -----
const questionNumberEl = document.getElementById("question-number");
const scoreDisplayEl = document.getElementById("score-display");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

// ----- Helpers -----
function renderQuestion() {
  const q = questions[current];
  questionNumberEl.textContent = `Question ${current + 1} of ${questions.length}`;
  scoreDisplayEl.textContent = `Score: ${score}`;
  questionEl.textContent = q.text;

  optionsEl.innerHTML = "";
  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.setAttribute("type", "button");
    btn.setAttribute("data-index", idx);
    btn.addEventListener("click", onSelectOption);
    optionsEl.appendChild(btn);
  });

  selected = null;
  locked = false;
  nextBtn.disabled = true;
  nextBtn.textContent = current === questions.length - 1 ? "Finish" : "Next";
}

function onSelectOption(e) {
  if (locked) return;

  const choiceIndex = Number(e.currentTarget.getAttribute("data-index"));
  selected = choiceIndex;

  // clear previous selection style
  [...optionsEl.children].forEach(btn => btn.classList.remove("selected"));

  // mark current selected
  e.currentTarget.classList.add("selected");
  nextBtn.disabled = false;
}

function gradeCurrent() {
  const correctIndex = questions[current].answerIndex;
  const buttons = [...optionsEl.children];

  // mark correct/wrong for feedback
  buttons.forEach((btn) => {
    const idx = Number(btn.getAttribute("data-index"));
    if (idx === correctIndex) btn.classList.add("correct");
    if (selected !== null && idx === selected && selected !== correctIndex) {
      btn.classList.add("wrong");
    }
    btn.disabled = true; // prevent changes after grading
  });

  if (selected === correctIndex) score++;
  locked = true;
}

function showResults() {
  questionNumberEl.textContent = "Quiz Complete";
  questionEl.textContent = `Your score is ${score} out of ${questions.length}.`;
  optionsEl.innerHTML = "";
  nextBtn.hidden = true;
  restartBtn.hidden = false;
  scoreDisplayEl.textContent = `Score: ${score}`;
}

function onNext() {
  // If not graded yet, grade now
  if (!locked) {
    gradeCurrent();
    // After a short delay, move on (feels natural)
    setTimeout(() => {
      current++;
      if (current < questions.length) {
        renderQuestion();
      } else {
        showResults();
      }
    }, 400);
  } else {
    // Already graded (shouldn’t happen with current flow)
    current++;
    if (current < questions.length) renderQuestion();
    else showResults();
  }
}

function restartQuiz() {
  current = 0;
  score = 0;
  selected = null;
  locked = false;
  nextBtn.hidden = false;
  restartBtn.hidden = true;
  renderQuestion();
}

// ----- Events -----
nextBtn.addEventListener("click", onNext);
restartBtn.addEventListener("click", restartQuiz);

// Keyboard support: Enter to confirm, Arrow keys to move
document.addEventListener("keydown", (e) => {
  const buttons = [...optionsEl.children];
  if (!buttons.length) return;

  const selectedIdx = buttons.findIndex(b => b.classList.contains("selected"));

  if (e.key === "ArrowDown" || e.key === "ArrowRight") {
    const next = selectedIdx < 0 ? 0 : Math.min(selectedIdx + 1, buttons.length - 1);
    buttons.forEach(b => b.classList.remove("selected"));
    buttons[next].classList.add("selected");
    selected = Number(buttons[next].getAttribute("data-index"));
    nextBtn.disabled = false;
  }

  if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
    const prev = selectedIdx < 0 ? buttons.length - 1 : Math.max(selectedIdx - 1, 0);
    buttons.forEach(b => b.classList.remove("selected"));
    buttons[prev].classList.add("selected");
    selected = Number(buttons[prev].getAttribute("data-index"));
    nextBtn.disabled = false;
  }

  if (e.key === "Enter" && !nextBtn.disabled) {
    onNext();
  }
});

// Start
renderQuestion();
