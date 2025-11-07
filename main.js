// ===========================
// SDGs City Manager Ver.9
// ===========================

// --- ステータス管理 ---
let env = 50, eco = 50, soc = 50;
let energy = 0, food = 0, tech = 0, funds = 0, water = 0, labor = 0, recycled = 0;
let typePoints = {};
let currentIndex = 0;
let currentCity = { name: "初期都市", level: 1, type: "eco", desc: "" };
const maxQuestions = cities.length - 1; // 最後の1問は崩壊ルート候補

// --- 都市タイプ分類の理想ベクトル ---
const archetypes = {
  eco: [1, 0, 0],
  industry: [0, 1, 0],
  social: [0, 0, 1],
  smart: [0.7, 0.7, 0.7],
  science: [0.6, 0.8, 0.6],
  culture: [0.5, 0.5, 0.8],
  tourism: [0.5, 0.6, 0.5],
  agriculture: [0.7, 0.5, 0.5],
  industryHeavy: [0.3, 0.9, 0.2],
  welfare: [0.4, 0.5, 0.9]
};

// --- 初期化 ---
function initGame() {
  env = eco = soc = 50;
  energy = food = tech = funds = water = labor = recycled = 0;
  typePoints = {};
  currentIndex = 0;
  currentCity = { name: "初期都市", level: 1, type: "eco", desc: "スタート" };
  updateAllUI();
  document.getElementById("question-title").textContent = "SDGs都市経営ゲーム";
  document.getElementById("question-desc").textContent = "スタートボタンを押して開始！";
  document.getElementById("choices").innerHTML = "";
  document.getElementById("explainBox").classList.add("hidden");
  setBackground();
}

// --- 質問表示 ---
function showQuestion() {
  const q = cities[currentIndex];
  document.getElementById("question-title").textContent = q.title;
  document.getElementById("question-desc").textContent = q.description;
  const box = document.getElementById("choices");
  box.innerHTML = "";

  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice.text;
    btn.onclick = () => selectChoice(choice);
    box.appendChild(btn);
  });

  document.getElementById("explainBox").classList.add("hidden");
  document.getElementById("progress").textContent = `第 ${currentIndex + 1} / ${maxQuestions} 問`;
}

// --- 選択時 ---
function selectChoice(choice) {
  env += choice.effects.env;
  eco += choice.effects.eco;
  soc += choice.effects.soc;
  clampScores();

  // 資源変動
  for (let key in choice.resources) {
    if (typeof choice.resources[key] === "number") {
      window[key] += choice.resources[key];
    }
  }

  // タイプポイント加算
  for (let key in choice.typePoints) {
    typePoints[key] = (typePoints[key] || 0) + choice.typePoints[key];
  }

  // 説明表示
  const ex = document.getElementById("explainBox");
  ex.innerHTML = `<b>${choice.label}</b><br>${choice.explanation}<br><small>${choice.example}</small>`;
  ex.classList.remove("hidden");

  // 次へ
  setTimeout(nextQuestion, 1500);
}

// --- 次の問題へ ---
function nextQuestion() {
  currentIndex++;

  // 崩壊ルート判定
  if (currentIndex === cities.length - 1) {
    const collapse = env < 25 || eco < 25 || soc < 25 || funds < -10;
    if (collapse) {
      showQuestion(); // 崩壊ルート出す
    } else {
      endGame();
    }
    return;
  }

  if (currentIndex < cities.length - 1) {
    showQuestion();
  } else {
    endGame();
  }

  updateCityState();
}

// --- スコア範囲制限 ---
function clampScores() {
  env = Math.max(0, Math.min(100, env));
  eco = Math.max(0, Math.min(100, eco));
  soc = Math.max(0, Math.min(100, soc));
}

// --- 都市状態更新 ---
function updateCityState() {
  // 正規化ベクトル
  const vec = normalize([env, eco, soc]);
  let bestType = "eco", bestScore = -1;

  for (let t in archetypes) {
    const s = cosine(vec, archetypes[t]);
    if (s > bestScore) {
      bestScore = s;
      bestType = t;
    }
  }

  // レベル判定
  const avg = (env + eco + soc) / 3;
  let newLevel = 1;
  if (avg > 65) newLevel = 2;
  if (avg > 80) newLevel = 3;

  // 都市変化検出
  if (bestType !== currentCity.type) {
    showCityChange(bestType);
  }
  // レベルアップ検出
  if (newLevel > currentCity.level) {
    showLevelUp();
  }

  currentCity = {
    name: getCityName(bestType),
    level: newLevel,
    type: bestType,
    desc: getCityDesc(bestType, newLevel)
  };

  updateAllUI();
  setBackground();
}

// --- ベクトル処理 ---
function normalize(v) {
  const len = Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2);
  return len === 0 ? [0, 0, 0] : v.map(x => x / len);
}
function cosine(a, b) {
  return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
}

// --- 都市名と説明 ---
function getCityName(type) {
  const names = {
    eco: "エコ都市", industry: "産業都市", social: "共生都市",
    smart: "スマート都市", science: "科学都市", culture: "文化都市",
    tourism: "観光都市", agriculture: "農業都市", industryHeavy: "工業特化都市", welfare: "福祉都市"
  };
  return names[type] || "未知の都市";
}
function getCityDesc(type, lv) {
  return `この都市は${getCityName(type)}として成長しています。（Lv.${lv}）`;
}

// --- 背景更新 ---
function setBackground() {
  const bg = document.getElementById("city-bg");
  const path = `images/${currentCity.type}_lv${currentCity.level}.jpg`;
  bg.classList.remove("fade-in");
  void bg.offsetWidth; // 再描画
  bg.style.backgroundImage = `url('${path}')`;
  bg.classList.add("fade-in");
}

// --- UI更新 ---
function updateAllUI() {
  // ステータスバー
  document.getElementById("res-env").style.width = `${env}%`;
  document.getElementById("res-eco").style.width = `${eco}%`;
  document.getElementById("res-soc").style.width = `${soc}%`;

  // 都市情報
  document.getElementById("city-info-name").textContent = currentCity.name;
  document.getElementById("city-info-level").textContent = "Lv." + currentCity.level;
  document.getElementById("city-info-desc").textContent = currentCity.desc;
}

// --- レベルアップ演出 ---
function showLevelUp() {
  const fx = document.createElement("div");
  fx.className = "level-up";
  fx.textContent = "LEVEL UP!";
  document.body.appendChild(fx);
  setTimeout(() => fx.remove(), 2000);
}

// --- 都市タイプ変化演出 ---
function showCityChange(newType) {
  const fx = document.createElement("div");
  fx.className = "city-change";
  fx.textContent = `都市タイプが ${getCityName(newType)} に変化！`;
  document.body.appendChild(fx);
  setTimeout(() => fx.remove(), 2500);
}

// --- ゲーム終了 ---
function endGame() {
  const msg = `🏁 あなたの都市は ${currentCity.name} Lv.${currentCity.level} に発展しました！`;
  document.getElementById("question-title").textContent = "ゲーム終了";
  document.getElementById("question-desc").textContent = msg;
  document.getElementById("choices").innerHTML = "";
}

// --- イベント登録 ---
document.getElementById("btn-start").onclick = () => showQuestion();
document.getElementById("btn-reset").onclick = () => initGame();

// --- 初期化 ---
initGame();

