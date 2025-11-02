// ===========================
// SDGs都市経営ゲーム main.js（資源ポイント対応完全版）
// ===========================
(function() {
  window.addEventListener("DOMContentLoaded", () => {
    // --- 状態管理 ---
    let currentQuestionIndex = 0;
    let status = { env: 50, eco: 50, soc: 50 }; // 環境・経済・社会スコア
    let cityTypePoints = { eco: 0, industry: 0, social: 0, smart: 0, science: 0 };
    let resources = { energy: 0, food: 0, tech: 0, money: 0, funds: 50 }; // 初期資金50など

    // --- DOM取得 ---
    const $ = id => document.getElementById(id);
    const startBtn = $("btn-start");
    const questionTitle = $("question-title");
    const questionDesc = $("question-desc");
    const choiceButtons = $("choices");
    const explainBox = $("explainBox");
    const envBar = $("env-bar");
    const ecoBar = $("eco-bar");
    const socBar = $("soc-bar");
    const progressText = $("progress");
    const cityView = $("city-view");

    // --- ゲーム開始 ---
    if (startBtn) startBtn.addEventListener("click", startGame);

    function startGame() {
      currentQuestionIndex = 0;
      status = { env: 50, eco: 50, soc: 50 };
      cityTypePoints = { eco: 0, industry: 0, social: 0, smart: 0, science: 0 };
      resources = { energy: 0, food: 0, tech: 0, money: 0, funds: 50 };
      updateStatusUI();
      updateCityVisual();
      showQuestion();
    }

    // --- 質問表示 ---
    function showQuestion() {
      if (currentQuestionIndex >= cities.length) {
        showResult();
        return;
      }

      const q = cities[currentQuestionIndex];
      questionTitle.textContent = q.title || "無題の質問";
      questionDesc.textContent = q.description || "";
      choiceButtons.innerHTML = "";

      q.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = choice.text;

        // 資源不足で選択不可にする
        let canSelect = true;
        if (choice.resources) {
          if ((choice.resources.funds && resources.funds < Math.abs(choice.resources.funds)) ||
              (choice.resources.energy && resources.energy < Math.abs(choice.resources.energy)) ||
              (choice.resources.food && resources.food < Math.abs(choice.resources.food)) ||
              (choice.resources.tech && resources.tech < Math.abs(choice.resources.tech))) {
            canSelect = false;
          }
        }

        if (!canSelect) {
          btn.disabled = true;
          btn.style.opacity = 0.5;
          btn.title = "資源不足で選択できません";
        }

        btn.onclick = () => selectChoice(choice);
        choiceButtons.appendChild(btn);
      });

      progressText.textContent = `問題 ${currentQuestionIndex + 1} / ${cities.length}`;
    }

    // --- 選択肢を選んだときの処理 ---
    function selectChoice(choice) {
      applyEffects(choice.effects);
      applyTypePoints(choice.typePoints);
      applyResources(choice.resources);

      updateStatusUI();
      updateCityVisual();

      explainBox.style.display = "block";
      explainBox.textContent = choice.explanation || "選択結果が反映されました。";

      currentQuestionIndex++;
      setTimeout(showQuestion, 1200);
    }

    // --- 各種反映処理 ---
    function applyEffects(effects) {
      if (!effects) return;
      status.env = clamp(status.env + (effects.env || 0), 0, 100);
      status.eco = clamp(status.eco + (effects.eco || 0), 0, 100);
      status.soc = clamp(status.soc + (effects.soc || 0), 0, 100);
    }

    function applyTypePoints(points) {
      if (!points) return;
      for (const k in points) {
        cityTypePoints[k] += points[k] || 0;
      }
    }

    function applyResources(res) {
      if (!res) return;
      for (const k in res) {
        resources[k] = (resources[k] || 0) + res[k];
      }
    }

    // --- ゲージ更新 ---
    function updateStatusUI() {
      envBar.style.width = `${status.env}%`;
      ecoBar.style.width = `${status.eco}%`;
      socBar.style.width = `${status.soc}%`;
    }

    // --- 都市の見た目を変化（リアルタイム） ---
    function updateCityVisual() {
      if (!cityView) return;

      let brightness = (status.env + status.eco + status.soc) / 3;
      let color;
      if (status.env > status.eco && status.env > status.soc) {
        color = "rgba(80, 200, 120, 0.6)"; // 緑っぽい → エコ都市
      } else if (status.eco > status.env && status.eco > status.soc) {
        color = "rgba(255, 215, 0, 0.6)"; // 金色 → 産業都市
      } else if (status.soc > status.env && status.soc > status.eco) {
        color = "rgba(100, 150, 255, 0.6)"; // 青 → 社会都市
      } else {
        color = "rgba(200, 200, 200, 0.6)";
      }

      cityView.style.background = color;
      cityView.style.filter = `brightness(${0.6 + brightness / 200})`;
    }

    // --- 結果画面 ---
    function showResult() {
      questionTitle.textContent = "🌆 都市の最終結果";
      questionDesc.textContent = "あなたの選択が都市を形作りました。";
      choiceButtons.innerHTML = "";

      const finalType = determineCityType();

      // 資源ボーナス説明
      let bonusDesc = "";
      if (resources.energy >= 20) bonusDesc += "⚡ エネルギー豊富な都市です。<br>";
      if (resources.food >= 20) bonusDesc += "🍎 食料自給率が高い都市です。<br>";
      if (resources.tech >= 10) bonusDesc += "🧠 技術都市として発展しています。<br>";
      if (resources.funds >= 50) bonusDesc += "💰 豊富な資金で将来の発展が有利です。<br>";

      explainBox.innerHTML = `
        🌿 環境: ${status.env}<br>
        💰 経済: ${status.eco}<br>
        🤝 社会: ${status.soc}<br>
        ⚡ エネルギー: ${resources.energy}<br>
        🧠 技術: ${resources.tech}<br>
        🍎 食料: ${resources.food}<br>
        💰 資金: ${resources.funds}<br><br>
        🏙 最終都市タイプ: <b>${finalType.name}</b>（レベル${finalType.level}）<br>
        ${bonusDesc}
      `;
      progressText.textContent = "全問題終了";
      updateCityVisual();
    }

    // --- 都市タイプ判定 ---
    function determineCityType() {
      const sum = status.env + status.eco + status.soc;
      const mainType = Object.entries(cityTypePoints).sort((a,b)=>b[1]-a[1])[0][0];

      let name = "未発展都市";

      // 資源を考慮した都市タイプ優先判定
      if (resources.energy >= 20) name = "エネルギー都市";
      else if (resources.food >= 20) name = "食料自給都市";
      else if (resources.tech >= 10) name = "技術都市";
      else if (mainType === "eco") name = "エコ都市";
      else if (mainType === "industry") name = "産業都市";
      else if (mainType === "social") name = "社会都市";
      else if (mainType === "smart") name = "スマート都市";
      else if (mainType === "science") name = "科学都市";

      let level = 1;
      if (sum > 220) level = 3;
      else if (sum > 150) level = 2;

      return { name, level };
    }

    // --- 補助 ---
    function clamp(v, min, max) {
      return Math.max(min, Math.min(max, v));
    }
  });
})();
