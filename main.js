// main.js（都市経営ゲーム Ver.3：資源・タイプポイント・パラメータ完全対応）

// 各種スコアと資源・タイプポイントの初期値
let index = 0;
let env = 0, eco = 0, soc = 0; // 環境・経済・社会パラメータ
let resources = { funds: 10, energy: 0, tech: 0, labor: 0, water: 0, recycled: 0, food: 0 }; // 資源
let typePoints = { Eco: 0, Industrial: 0, Smart: 0, Social: 0, Science: 0, Education: 0 }; // 都市タイプポイント

const questionContainer = document.getElementById("question-container");
const resultContainer = document.getElementById("result-container");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");

// ゲーム開始
function startGame() {
  index = 0;
  env = eco = soc = 0;
  for (let k in resources) resources[k] = 0;
  resources.funds = 10; // 初期資金
  for (let k in typePoints) typePoints[k] = 0;
  resultContainer.style.display = "none";
  questionContainer.style.display = "block";
  showQuestion();
}

// 問題を表示
function showQuestion() {
  const city = cities[index];
  const html = `
    <h2>${index + 1}. ${city.title}</h2>
    <p>${city.description}</p>
    ${city.choices.map((c, i) => `
      <button class="choice" onclick="choose(${i})">${c.text}</button>
    `).join("")}
  `;
  questionContainer.innerHTML = html;
}

// 選択肢を選んだときの処理
function choose(choiceIndex) {
  const city = cities[index];
  const choice = city.choices[choiceIndex];

  // パラメータ加算
  env += choice.effects.env;
  eco += choice.effects.eco;
  soc += choice.effects.soc;

  // 資源変動
  for (let key in choice.resources) {
    if (!resources[key]) resources[key] = 0;
    resources[key] += choice.resources[key];
  }

  // タイプポイント加算
  for (let key in choice.typePoints) {
    if (!typePoints[key]) typePoints[key] = 0;
    typePoints[key] += choice.typePoints[key];
  }

  // 選択説明を表示
  questionContainer.innerHTML = `
    <h2>${city.title}</h2>
    <p>あなたの選択：<b>${choice.text}</b></p>
    <p>${choice.explanation}</p>
    <button id="next-btn">次へ</button>
  `;
  document.getElementById("next-btn").onclick = nextQuestion;
}

// 次の質問へ
function nextQuestion() {
  index++;
  if (index < cities.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// 結果発表
function showResult() {
  questionContainer.style.display = "none";
  resultContainer.style.display = "block";

  // 都市タイプ決定
  const topType = Object.entries(typePoints).sort((a, b) => b[1] - a[1])[0][0];

  const summary = `
    <h2>🌆 あなたの都市の最終結果</h2>
    <p>環境：${env}　経済：${eco}　社会：${soc}</p>
    <h3>📊 資源</h3>
    <ul>
      ${Object.entries(resources).map(([k, v]) => `<li>${k}: ${v}</li>`).join("")}
    </ul>
    <h3>🏙 都市タイプ</h3>
    <p>${topType}都市（${typePoints[topType]}pt）</p>
    <h3>詳細ポイント</h3>
    <ul>
      ${Object.entries(typePoints).map(([k, v]) => `<li>${k}: ${v}</li>`).join("")}
    </ul>
    <button id="restart-btn">もう一度プレイ</button>
  `;
  resultContainer.innerHTML = summary;

  // 再スタートボタン
  document.getElementById("restart-btn").onclick = startGame;
}

// 起動時にゲーム開始
window.onload = startGame;
