// ===========================
// SDGs City Manager - main.js (完全版)
// ===========================

(function() {
  window.addEventListener("DOMContentLoaded", () => {
    try {
      // --- 基本チェック: data.js に cities があるか ---
      if (typeof cities === "undefined" || !Array.isArray(cities) || cities.length === 0) {
        console.error("⚠️ data.js の cities 配列が見つかりません。data.js が正しく読み込まれているか確認してください。");
        return;
      }

      // ----- 初期化 -----
      let currentCity = { name: "田舎町", images: [], questions: cities[0].questions };
      let currentQuestionIndex = 0;
      let status = { env: 50, eco: 50, soc: 50 }; // 基礎パラメータ
      let cityTypePoints = { eco: 0, tech: 0, social: 0, industry: 0, smart: 0 }; // 都市タイプ傾向
      let resources = { energy: 0, food: 0, money: 0 }; // 資源
      let specialEventTriggered = false;

      // ----- DOM取得 -----
      const $ = id => document.getElementById(id);
      const startBtn = $("btn-start");
      const resetBtn = $("btn-reset");
      const cityNameEl = $("city-name");
      const questionTitle = $("question-title");
      const questionDesc = $("question-desc");
      const choiceButtons = $("choices");
      const explainBox = $("explainBox");
      const progressText = $("progress");
      const envBar = $("env-bar");
      const ecoBar = $("eco-bar");
      const socBar = $("soc-bar");
      const cityView = $("city-view");
      const specialEventEl = $("special-event");
      const specialDesc = $("special-desc");
      const specialOkBtn = $("btn-event-ok");

      // 要素確認
      const required = { startBtn, resetBtn, cityNameEl, questionTitle, questionDesc, choiceButtons, explainBox, progressText, envBar, ecoBar, socBar, cityView };
      for (const [k, v] of Object.entries(required)) {
        if (!v) console.warn(`⚠️ DOM 要素が見つかりません: ${k}`);
      }

      // ----- イベント設定 -----
      if (startBtn) startBtn.addEventListener("click", startGame);
      if (resetBtn) resetBtn.addEventListener("click", resetGame);
      if (specialOkBtn) specialOkBtn.addEventListener("click", () => {
        hideSpecialEvent();
        if (typeof specialEvents !== "undefined" && specialEvents[0]) {
          applyEffects(specialEvents[0].effects);
          updateStatusUI();
        }
        showQuestion();
      });

      // ----- main functions -----
      function startGame() {
        currentQuestionIndex = 0;
        status = { env: 50, eco: 50, soc: 50 };
        cityTypePoints = { eco: 0, tech: 0, social: 0, industry: 0, smart: 0 };
        resources = { energy: 0, food: 0, money: 0 };
        specialEventTriggered = false;
        currentCity = { name: "田舎町", images: [], questions: cities[0].questions };
        cityNameEl && (cityNameEl.textContent = currentCity.name || "都市名");
        loadCityImages();
        updateStatusUI();
        updateResourceUI();
        showQuestion();
      }

      function resetGame() {
        startGame();
        explainBox && (explainBox.style.display = "none");
      }

      function loadCityImages() {
        if (!cityView) return;
        cityView.innerHTML = "";
        (currentCity.images || []).forEach((url, index) => {
          const img = document.createElement("img");
          img.src = url;
          img.className = "city-layer";
          img.style.zIndex = index;
          img.alt = `${currentCity.name || "city"} layer ${index}`;
          cityView.appendChild(img);
        });
      }

      function showQuestion() {
        if (!questionTitle || !questionDesc || !choiceButtons) return;

        if (!specialEventTriggered && Math.random() < 0.1 && typeof specialEvents !== "undefined" && specialEvents.length > 0) {
          showSpecialEvent(specialEvents[0]);
          specialEventTriggered = true;
          return;
        }

        explainBox && (explainBox.style.display = "none");
        explainBox && (explainBox.textContent = "");

        if (currentQuestionIndex >= (currentCity.questions || []).length) {
          finalizeCityType();
          showResult();
          return;
        }

        const q = currentCity.questions[currentQuestionIndex];
        questionTitle.textContent = q.title || "無題の質問";
        questionDesc.textContent = q.description || "";
        choiceButtons.innerHTML = "";

        (q.choices || []).forEach((choice, idx) => {
          const btn = document.createElement("button");
          btn.className = "choice-btn";
          btn.type = "button";
          btn.textContent = choice.text || `選択肢 ${idx+1}`;
          btn.addEventListener("click", () => {
            Array.from(choiceButtons.children).forEach(b => b.disabled = true);
            selectChoice(choice);
          });
          choiceButtons.appendChild(btn);
        });

        progressText && (progressText.textContent = `${currentQuestionIndex + 1} / ${currentCity.questions.length}`);
      }

      function selectChoice(choice) {
        if (!choice) return;

        // --- 基礎パラメータ ---
        if (choice.effects) applyEffects(choice.effects);

        // --- 都市タイプポイント ---
        if (choice.typePoints) {
          for (const k in choice.typePoints) {
            cityTypePoints[k] += choice.typePoints[k] || 0;
          }
        }

        // --- 資源の加算 ---
        if (choice.resources) {
          for (const k in choice.resources) {
            resources[k] += choice.resources[k] || 0;
          }
        }

        updateStatusUI();
        updateResourceUI();

        if (explainBox) {
          explainBox.style.display = "block";
          let explanationText = choice.explanation || "";
          if (choice.dataReference) {
            explanationText += `\n\n🔹 データ: ${choice.dataReference}`;
          }
          explainBox.textContent = explanationText;
        }

        currentQuestionIndex++;
        setTimeout(showQuestion, 1200);
      }

      function applyEffects(effects) {
        status.env = clamp(status.env + (effects.env || 0), 0, 100);
        status.eco = clamp(status.eco + (effects.eco || 0), 0, 100);
        status.soc = clamp(status.soc + (effects.soc || 0), 0, 100);
      }

      function updateStatusUI() {
        if (envBar) envBar.style.width = `${status.env}%`;
        if (ecoBar) ecoBar.style.width = `${status.eco}%`;
        if (socBar) socBar.style.width = `${status.soc}%`;
      }

      function updateResourceUI() {
        // 必要ならHTMLに追加して表示できる
        const resourceBox = $("resource-box");
        if (!resourceBox) return;
        resourceBox.innerHTML = `⚡ エネルギー: ${resources.energy} | 🍎 食料: ${resources.food} | 💰 お金: ${resources.money}`;
      }

      function finalizeCityType() {
        // 現在のパラメータとタイプポイントを組み合わせて最終都市タイプを決定
        const types = ["eco", "tech", "social", "industry", "smart"];
        let finalType = { name: "未発展都市", level: 1 };
        let highestScore = -Infinity;

        types.forEach(type => {
          let score = cityTypePoints[type] || 0;
          // パラメータ条件による補正
          if (type === "eco") score *= status.env / 50;
          if (type === "tech") score *= status.eco / 50;
          if (type === "social") score *= status.soc / 50;
          if (type === "industry") score *= status.eco / 50;
          if (type === "smart") score *= (status.env + status.soc) / 100;
          if (score > highestScore) {
            highestScore = score;
            finalType.name = type + "都市";
            if (score > 80) finalType.level = 3;
            else if (score > 50) finalType.level = 2;
            else finalType.level = 1;
          }
        });

        currentCity.finalType = finalType;
      }

      function showResult() {
        if (questionTitle) questionTitle.textContent = "🌆 都市評価結果";
        if (questionDesc) questionDesc.textContent = "あなたの都市の発展状況です！";
        if (choiceButtons) choiceButtons.innerHTML = "";
        if (explainBox) {
          explainBox.style.display = "block";
          explainBox.innerHTML = `
            🌿 環境: ${status.env}<br>
            💰 経済: ${status.eco}<br>
            🤝 社会: ${status.soc}<br>
            ⚡ エネルギー: ${resources.energy}<br>
            🍎 食料: ${resources.food}<br>
            💰 お金: ${resources.money}<br>
            🏙 都市タイプ: ${currentCity.finalType.name} (発展度 ${currentCity.finalType.level})
          `;
        }
        if (progressText) progressText.textContent = "ゲーム終了";
      }

      function showSpecialEvent(eventObj) {
        if (!specialEventEl || !specialDesc) {
          if (eventObj && eventObj.effects) {
            applyEffects(eventObj.effects);
            updateStatusUI();
            showQuestion();
          }
          return;
        }
        specialDesc.textContent = eventObj.description || eventObj.title || "特殊イベント発生！";
        specialEventEl.classList.remove("hidden");
      }

      function hideSpecialEvent() {
        specialEventEl && specialEventEl.classList.add("hidden");
      }

      function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

      // 初期UI
      updateStatusUI();
      updateResourceUI();

    } catch (err) {
      console.error("main.js 実行中に例外が発生しました:", err);
    }
  });
})();
