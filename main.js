// ===========================
// SDGs都市経営ゲーム main.js（資源ポイント対応＋都市情報パネル＋リアル街並み版）
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
    const cityNameLabel = $("city-name");
    const cityLevelLabel = $("city-level");
    const cityInfoPanel = $("city-info-panel"); // 右下パネル

    // --- ゲーム開始 ---
    if (startBtn) startBtn.addEventListener("click", startGame);

    function startGame() {
      currentQuestionIndex = 0;
      status = { env: 50, eco: 50, soc: 50 };
      cityTypePoints = { eco: 0, industry: 0, social: 0, smart: 0, science: 0 };
      resources = { energy: 0, food: 0, tech: 0, money: 0, funds: 50 };
      updateStatusUI();
      updateCityVisual();
      updateCityInfoPanel();
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
        let reason = "";
        if (choice.resources) {
          for (const k in choice.resources) {
            if ((resources[k] || 0) < Math.abs(choice.resources[k])) {
              canSelect = false;
              reason = `${k}不足で選択不可`;
            }
          }
        }

        if (!canSelect) {
          btn.disabled = true;
          btn.style.opacity = 0.5;
          btn.title = reason || "資源不足で選択できません";
        } else {
          // 選択前に得られる資源を表示
          let tooltip = [];
          if (choice.resources) {
            for (const k in choice.resources) {
              const val = choice.resources[k];
              if (val !== 0) tooltip.push(`${k} ${val > 0 ? "+" : ""}${val}`);
            }
          }
          btn.title = tooltip.join(" / ");
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
      // 資源変化・都市傾向を詳しく表示
      let desc = [];
      if (choice.effects) {
        for (const k in choice.effects) {
          const val = choice.effects[k];
          if (val !== 0) {
            const emoji = k === "env" ? "🌿" : k === "eco" ? "💰" : "🤝";
            desc.push(`${emoji} ${k} ${val > 0 ? "+" : ""}${val}`);
          }
        }
      }
      if (choice.resources) {
        for (const k in choice.resources) {
          const val = choice.resources[k];
          if (val !== 0) {
            const emoji = k === "energy" ? "⚡" : k === "food" ? "🍎" : k === "tech" ? "🧠" : "💰";
            desc.push(`${emoji} ${k} ${val > 0 ? "+" : ""}${val}`);
          }
        }
      }
      explainBox.innerHTML = desc.join("<br>") + "<br>" + (choice.explanation || "");
      
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

    // --- 都市の見た目を変化（リアル街並み） ---
    function updateCityVisual() {
      if (!cityView) return;

      // 都市タイプ判定
      const mainType = Object.entries(cityTypePoints).sort((a,b)=>b[1]-a[1])[0][0];
      const imgMap = {
        eco: "images/eco_city.jpg",
        industry: "images/industry_city.jpg",
        social: "images/social_city.jpg",
        smart: "images/smart_city.jpg",
        science: "images/science_city.jpg"
      };
      cityView.style.backgroundImage = `url(${imgMap[mainType] || "images/default_city.jpg"})`;
      cityView.style.backgroundSize = "cover";
      cityView.style.backgroundPosition = "center";

      // 明るさで都市の雰囲気
      const brightness = (status.env + status.eco + status.soc) / 3;
      cityView.style.filter = `brightness(${0.6 + brightness / 200})`;
    }

    // --- 右下パネル更新 ---
    function updateCityInfoPanel() {
      if (!cityInfoPanel) return;
      const finalType = determineCityType();
      let strengths = [];
      let weaknesses = [];
      if (status.env > status.eco && status.env > status.soc) strengths.push("環境重視"); else weaknesses.push("環境が弱い");
      if (status.eco > status.env && status.eco > status.soc) strengths.push("経済発展"); else weaknesses.push("経済が弱い");
      if (status.soc > status.env && status.soc > status.eco) strengths.push("社会重視"); else weaknesses.push("社会が弱い");

      cityNameLabel.textContent = finalType.name;
      cityLevelLabel.textContent = `Lv.${finalType.level}`;
      cityInfoPanel.innerHTML = `
        <b>${finalType.name}（Lv.${finalType.level}）</b><br>
        🌿 環境: ${status.env}<br>
        💰 経済: ${status.eco}<br>
        🤝 社会: ${status.soc}<br>
        ⚡ エネルギー: ${resources.energy}<br>
        🧠 技術: ${resources.tech}<br>
        🍎 食料: ${resources.food}<br>
        💰 資金: ${resources.funds}<br>
        <b>強み:</b> ${strengths.join(", ")}<br>
        <b>弱み:</b> ${weaknesses.join(", ")}
      `;
    }

    // --- 結果画面 ---
    function showResult() {
      questionTitle.textContent = "🌆 都市の最終結果";
      questionDesc.textContent = "あなたの選択が都市を形作りました。";
      choiceButtons.innerHTML = "";

      const finalType = determineCityType();

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
