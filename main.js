// ===========================
// SDGs City Manager main.js（修正版）
// ===========================

// ----- 初期化 -----
let currentCity = cities[0]; // data.js の最初の都市を使用
let currentQuestionIndex = 0;
let status = { env: 50, eco: 50, soc: 50 };

// ----- DOM取得 -----
const startBtn = document.getElementById("btn-start");
const cityNameEl = document.getElementById("city-name");
const questionTitle = document.getElementById("question-title");
const questionDesc = document.getElementById("question-desc");
const choiceButtons = document.getElementById("choices");
const explainBox = document.getElementById("explainBox");
const progressText = document.getElementById("progress");
const envBar = document.getElementById("env-bar");
const ecoBar = document.getElementById("eco-bar");
const socBar = document.getElementById("soc-bar");
const cityView = document.getElementById("city-view");

// ----- イベント設定 -----
startBtn.addEventListener("click", startGame);

// ----- ゲーム開始 -----
function startGame() {
  currentQuestionIndex = 0;
  status = { env: 50, eco: 50, soc: 50 };
  cityNameEl.textContent = currentCity.name;
  loadCityImages();
  updateStatusUI();
  showQuestion();
}

// ----- 都市画像読み込み -----
function loadCityImages() {
  cityView.innerHTML = "";
  currentCity.images.forEach((url, index) => {
    const img = document.createElement("img");
    img.src = url;
    img.className = `city-layer layer${index}`;
    img.style.zIndex = index;
    cityView.appendChild(img);
  });
}

// ----- 質問表示 -----
function showQuestion() {
  explainBox.style.display = "none";
  explainBox.textContent = "";

  if (currentQuestionIndex >= currentCity.questions.length) {
    showResult();
    return;
  }

  const q = currentCity.questions[currentQuestionIndex];
  questionTitle.textContent = q.title;
  questionDesc.textContent = q.description;
  choiceButtons.innerHTML = "";

  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice.text;
    btn.addEventListener("click", () => selectChoice(choice));
    choiceButtons.appendChild(btn);
  });

  progressText.textContent = `${currentQuestionIndex + 1} / ${currentCity.questions.length}`;
}

// ----- 選択肢クリック -----
function selectChoice(choice) {
  // ステータス変動
  status.env += choice.effects.env;
  status.eco += choice.effects.eco;
  status.soc += choice.effects.soc;

  // 範囲制限
  status.env = Math.max(0, Math.min(100, status.env));
  status.eco = Math.max(0, Math.min(100, status.eco));
  status.soc = Math.max(0, Math.min(100, status.soc));

  updateStatusUI();
  explainBox.style.display = "block";
  explainBox.textContent = choice.explanation;

  currentQuestionIndex++;
  setTimeout(showQuestion, 1500);
}

// ----- ステータス更新 -----
function updateStatusUI() {
  envBar.style.width = `${status.env}%`;
  ecoBar.style.width = `${status.eco}%`;
  socBar.style.width = `${status.soc}%`;
}

// ----- 結果表示 -----
function showResult() {
  questionTitle.textContent = "🌆 都市評価結果";
  questionDesc.textContent = "あなたの都市運営の成果はこちらです！";
  choiceButtons.innerHTML = "";
  explainBox.style.display = "block";
  explainBox.innerHTML = `
    🌿 環境: ${status.env}<br>
    💰 経済: ${status.eco}<br>
    🤝 社会: ${status.soc}
  `;
  progressText.textContent = "ゲーム終了";
}
