// ===========================
// SDGs都市経営ゲーム main.js（資源ポイント対応＋都市情報パネル＋リアル背景版）
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

    // --- 右下都市情報パネル DOM ---
    const cityInfoName = $("city-info-name");
    const cityInfoLevel = $("city-info-level");
    const cityInfoDesc = $("city-info-desc");
    const cityInfoResources = $("city-info-resources");

    // --- 背景画像レイヤー ---
    const cityBg = $("city-bg");

    // --- ゲーム開始 ---
    if (startBtn) startBtn.addEventListener("click", startGame);

    function startGame() {
      currentQuestionIndex = 0;
      status = { env: 50, eco: 50, soc: 50 };
      cityTypePoints = { eco: 0, industry: 0, social: 0, smart: 0, science: 0 };
      resources = { energy: 0, food: 0, tech: 0, money: 0, funds: 50 };
      explainBox.style.display = "none";
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

        // 資源不足で選択不可にする（消費がある場合のみ）
        let canSelect = true;
        let reason = "";
        if (choice.resources) {
          for (const k in choice.resources) {
            const val = choice.resources[k];
            if (val < 0 && (resources[k] || 0) < Math.abs(val)) {
              canSelect = false;
              reason = `${k}不足で選択できません`;
            }
          }
        }

        if (!canSelect) {
          btn.disabled = true;
          btn.style.opacity = 0.5;
          btn.title = reason;
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
      updateCityInfoPanel();

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

      const city = determineCityType();
      // 背景画像を都市タイプに応じて差し替え
      if (cityBg) {
        let imgUrl = "";
        switch(city.name){
          case "エネルギー都市": imgUrl = "images/energy_city.jpg"; break;
          case "食料自給都市": imgUrl = "images/food_city.jpg"; break;
          case "技術都市": imgUrl = "images/tech_city.jpg"; break;
          case "エコ都市": imgUrl = "images/eco_city.jpg"; break;
          case "産業都市": imgUrl = "images/industry_city.jpg"; break;
          case "社会都市": imgUrl = "images/social_city.jpg"; break;
          case "スマート都市": imgUrl = "images/smart_city.jpg"; break;
          case "科学都市": imgUrl = "images/science_city.jpg"; break;
          default: imgUrl = "images/default_city.jpg"; break;
        }
        cityBg.style.backgroundImage = `url(${imgUrl})`;
        cityBg.style.backgroundSize = "cover";
        cityBg.style.backgroundPosition = "center";
      }
    }

    // --- 都市情報パネル更新 ---
    function updateCityInfoPanel() {
      const city = determineCityType();
      if (cityInfoName) cityInfoName.textContent = city.name;
      if (cityInfoLevel) cityInfoLevel.textContent = `Lv.${city.level}`;

      if (cityInfoDesc) {
        let desc = "";
        desc += `🌿 環境: ${status.env}  💰 経済: ${status.eco}  🤝 社会: ${status.soc}\n`;
        desc += `⚡ エネルギー: ${resources.energy}  🧠 技術: ${resources.tech}  🍎 食料: ${resources.food}  💰 資金: ${resources.funds}\n`;

        // 強み・弱み
        desc += "💡 強み: ";
        const strengths = [];
        if (resources.energy >= 20) strengths.push("エネルギー豊富");
        if (resources.food >= 20) strengths.push("食料自給");
        if (resources.tech >= 10) strengths.push("技術都市");
        if (status.env > status.eco && status.env > status.soc) strengths.push("自然豊か");
        desc += strengths.join(", ") || "なし";

        desc += "\n⚠ 弱み: ";
        const weaknesses = [];
        if (resources.funds < 10) weaknesses.push("資金不足");
        if (status.env < 30) weaknesses.push("環境悪化");
        if (status.eco < 30) weaknesses.push("経済停滞");
        if (status.soc < 30) weaknesses.push("社会問題");
        desc += weaknesses.join(", ") || "なし";

        cityInfoDesc.textContent = desc;
      }

      if (cityInfoResources) {
        cityInfoResources.textContent = `資源 - ⚡:${resources.energy}  🍎:${resources.food}  🧠:${resources.tech}  💰:${resources.funds}`;
      }
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
      updateCityInfoPanel();
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
