// ---------- Elements ----------
const passwordInput = document.getElementById("password");
const toggleBtn     = document.getElementById("toggle");
const meter         = document.getElementById("meter");
const meterFill     = document.getElementById("meterFill");
const verdictEl     = document.getElementById("verdict");
const hintEl        = document.getElementById("hint");
const resultBox     = document.querySelector(".result");
const ruleItems     = document.querySelectorAll("#rules li");

// ---------- Settings ----------
// A short list of passwords that are always weak, however they score.
const COMMON_PASSWORDS = [
  "password", "password1", "passw0rd", "p@ssw0rd", "123456", "1234567",
  "12345678", "123456789", "1234567890", "qwerty", "qwerty123", "abc123",
  "111111", "123123", "admin", "letmein", "welcome", "iloveyou", "monkey",
  "dragon", "football", "login", "princess", "sunshine"
];

// Each rule is worth 1 point. Maximum score = 6.
const RULES = [
  { id: "len8",    test: p => p.length >= 8,           hint: "Use at least 8 characters." },
  { id: "len12",   test: p => p.length >= 12,          hint: "Make it 12 characters or longer." },
  { id: "lower",   test: p => /[a-z]/.test(p),         hint: "Add a lowercase letter." },
  { id: "upper",   test: p => /[A-Z]/.test(p),         hint: "Add an uppercase letter." },
  { id: "digit",   test: p => /[0-9]/.test(p),         hint: "Add a number." },
  { id: "special", test: p => /[^A-Za-z0-9]/.test(p),  hint: "Add a special character, like ! or #." }
];

const MAX_SCORE = RULES.length;

// ---------- Core logic ----------
function checkPassword(password) {
  const results = RULES.map(rule => ({ ...rule, met: rule.test(password) }));
  let score = results.filter(r => r.met).length;

  let note = "";

  // Penalty: three or more of the same character in a row (e.g. "aaa")
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 1);
    note = "Avoid repeating the same character.";
  }

  // Override: very common passwords are always weak
  const isCommon = COMMON_PASSWORDS.includes(password.toLowerCase());
  if (isCommon) {
    score = Math.min(score, 1);
    note = "This is one of the most commonly used passwords.";
  }

  let level;
  if (isCommon || score <= 3) level = "weak";
  else if (score <= 5)        level = "medium";
  else                        level = "strong";

  return { results, score, level, note };
}

// ---------- Display ----------
function render(password) {
  // Empty state
  if (password.length === 0) {
    meter.dataset.level = "empty";
    resultBox.dataset.level = "empty";
    meterFill.style.width = "0%";
    verdictEl.textContent = "Waiting for a password";
    hintEl.textContent = "Your result will appear as you type.";
    ruleItems.forEach(li => li.classList.remove("met"));
    return;
  }

  const { results, score, level, note } = checkPassword(password);

  // Meter + verdict
  meter.dataset.level = level;
  resultBox.dataset.level = level;
  meterFill.style.width = Math.max(8, (score / MAX_SCORE) * 100) + "%";
  verdictEl.textContent = level.charAt(0).toUpperCase() + level.slice(1);

  // Checklist
  results.forEach(r => {
    const li = document.querySelector(`#rules li[data-rule="${r.id}"]`);
    li.classList.toggle("met", r.met);
  });

  // Hint: show the note first, then the first missing rule, else a success message
  const firstMissing = results.find(r => !r.met);
  if (note) {
    hintEl.textContent = note;
  } else if (firstMissing) {
    hintEl.textContent = firstMissing.hint;
  } else {
    hintEl.textContent = "Nice. This password meets every check.";
  }
}

// ---------- Events ----------
passwordInput.addEventListener("input", () => render(passwordInput.value));

toggleBtn.addEventListener("click", () => {
  const showing = passwordInput.type === "text";
  passwordInput.type = showing ? "password" : "text";
  toggleBtn.textContent = showing ? "Show" : "Hide";
  toggleBtn.setAttribute("aria-pressed", String(!showing));
  passwordInput.focus();
});

render("");
