// ===========================
// SDGs City Manager main.js
// ===========================

// ----- 初期データ -----
// 都市データ（本来は別JSONから読み込む想定）
const cities = [
  {
    city_id: "tokyo_future_metro",
    name: "東京フューチャー・メトロ",
    type: "未来都市",
    images: [
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade",
      "https://images.unsplash.com/photo-1549887534-3db1bd59dcca",
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4"
    ],
    questions: [
      {
        title: "雇用格差が拡大している。どうする？",
        description: "高度なAI導入により一部の職が消えています。",
        choices: [
          { text: "AI再教育プログラムを無料提供", effects: { env: 0, eco: 1, soc: 3 }, explanation: "長期的に雇用の回復と社会的安定を図る。" },
          { text: "外資企業を誘致して雇用を創出", effects: { env: 0, eco: 3, soc: -1 }, explanation: "短期的に雇用が増えるが、格差が広がるリスクも。" }
        ]
      },
      {
        title: "エネルギー政策の見直し",
        description: "再生可能エネルギーの導入コストが課題となっています。",
        choices: [
          { text: "太陽光発電を拡大", effects: { env: 3, eco: -1, soc: 1 }, explanation: "環境に優しいが、初期費用が高い。" },
          { text: "原子力を再稼働", effects: { env: -2, eco: 2, soc: -1 }, explanation: "経済は改善するが安全性の懸念が残る。" }
        ]
      },
      {
        title: "都市緑化プロジェクト",
        description: "ヒートアイランド現象が深刻です。",
        choices: [
          { text: "屋上緑化を推進", effects: { env: 3, eco: 0, soc: 1 }, explanation: "環境改善に効果的で市民満足度も向上。" },
          { text: "都市冷却装置を導入", effects: { env: 1, eco: -2, soc: 0 }, explanation: "技術的に可能だがコストが高い。" }
        ]
      }
    ]
  }
];

// ----- ゲーム状態 -----
let currentCity = null;
let currentQuestionIndex = 0;
let status = { env: 50, eco: 50, soc: 50 };

// ----- DOM取得 -----
const startBtn = document.getElementById("startBtn");
const citySelect = document.getElementById("citySelect");
const citySelectScreen = document.getElementById("citySelectScreen");
const gameScreen = document.getElementById("gameScreen");
const cityNameEl = document.getElementById("cityName");
const questionTitle = document.getElementById("questionTitle");
const questionDesc = document.getElementById("questionDesc");
const choiceButtons = document.getElementById("choiceButtons");
const explainBox = document.getElementById("explainBox");
const progressText = document.getElementById("progressText");
const envBar = document.getElementById("envBar");
const ecoBar = document.getElementById("ecoBar");
const socBar = document.getElementById("socBar");
const cityView = document.getElementById("cityView");

// ----- イベント -----
startBtn.addEventListener("click", startGame);

// ----- ゲーム開始 -----
function startGame() {
  citySelectScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  const selectedId = citySelect.value;
  currentCity = cities.find(c => c.city_id === selectedId);
  if (!currentCity) return;
  cityNameEl.textContent = currentCity.name;
  loadCityImages();
  showQuestion();
  updateStatusUI();
}

// ----- 都市画像読み込み -----
function loadCityImages() {
  cityView.innerHTML = "";
  currentCity.images.forEach((url, index) => {
    const img = document.createElement("img");
    img.src = url;
    img.className = `city-layer layer${index}`;
    cityView.appendChild(img);
  });
}

// ----- 質問表示 -----
function showQuestion() {
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

  progressText.textContent = `進行状況: ${currentQuestionIndex + 1}/${currentCity.questions.length}`;
}

// ----- 選択処理 -----
function selectChoice(choice) {
  // ステータス変動
  status.env += choice.effects.env;
  status.eco += choice.effects.eco;
  status.soc += choice.effects.soc;

  // 範囲制限
  status.env = Math.max(0, Math.min(100, status.env));
  status.eco = Math.max(0, Math.min(100, status.eco));
  status.soc = Math.max(0, Math.min(100, status.soc));

  // UI更新
  updateStatusUI();
  explainBox.textContent = choice.explanation;
  currentQuestionIndex++;
  setTimeout(showQuestion, 2000);
}

// ----- ステータス更新 -----
function updateStatusUI() {
  envBar.style.width = `${status.env}%`;
  ecoBar.style.width = `${status.eco}%`;
  socBar.style.width = `${status.soc}%`;
}

// ----- 結果表示 -----
function showResult() {
  questionTitle.textContent = "都市評価結果";
  questionDesc.textContent = "あなたの都市運営の成果です！";
  choiceButtons.innerHTML = "";
  explainBox.innerHTML = `
    🌱 環境: ${status.env}<br>
    💰 経済: ${status.eco}<br>
    🤝 社会: ${status.soc}
  `;
  progressText.textContent = "ゲーム終了";
}
