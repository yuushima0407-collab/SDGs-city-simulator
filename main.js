// ===========================
// SDGs City Manager - main.js (robust & ready)
// ===========================

(function() {
  // DOM が確実に読み込まれてから動かす（script の配置に依存しない）
  window.addEventListener("DOMContentLoaded", () => {
    try {
      // --- 基本チェック: data.js に cities があるか ---
      if (typeof cities === "undefined" || !Array.isArray(cities) || cities.length === 0) {
        console.error("⚠️ data.js の cities 配列が見つかりません。data.js が正しく読み込まれているか確認してください。");
        return;
      }

      // ----- 初期化 -----
      let currentCity = cities[0]; // デフォルトで最初の都市を使用
      let currentQuestionIndex = 0;
      let status = { env: 50, eco: 50, soc: 50 };
      let specialEventTriggered = false;

      // ----- DOM取得（存在確認つき） -----
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

      // 要素が揃ってるか確認（なければ console に出して終了）
      const required = { startBtn, resetBtn, cityNameEl, questionTitle, questionDesc, choiceButtons, explainBox, progressText, envBar, ecoBar, socBar, cityView };
      for (const [k, v] of Object.entries(required)) {
        if (!v) {
          console.error(`⚠️ DOM 要素が見つかりません: ${k}. index.html の id 名を確認してください。`);
          // 続行はするが挙動が限定される
        }
      }

      // ----- イベント設定 -----
      if (startBtn) startBtn.addEventListener("click", startGame);
      if (resetBtn) resetBtn.addEventListener("click", resetGame);
      if (specialOkBtn) specialOkBtn.addEventListener("click", () => {
        hideSpecialEvent();
        // 特殊イベントを適用（例: specialEvents[0] があるなら適用）
        if (typeof specialEvents !== "undefined" && specialEvents[0]) {
          applyEffects(specialEvents[0].effects);
          updateStatusUI();
        }
        // 次の質問を表示
        showQuestion();
      });

      // ----- main functions -----
      function startGame() {
        currentQuestionIndex = 0;
        status = { env: 50, eco: 50, soc: 50 };
        specialEventTriggered = false;
        cityNameEl && (cityNameEl.textContent = currentCity.name || "都市名");
        loadCityImages();
        updateStatusUI();
        showQuestion();
      }

      function resetGame() {
        currentQuestionIndex = 0;
        status = { env: 50, eco: 50, soc: 50 };
        specialEventTriggered = false;
        explainBox && (explainBox.style.display = "none");
        updateStatusUI();
        showQuestion();
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
        // 隠れている特殊イベントがあるなら一旦処理（ここではランダムで1回割り込みを入れる例）
        if (!specialEventTriggered && Math.random() < 0.15 && typeof specialEvents !== "undefined" && specialEvents.length > 0) {
          // 15% の確率で割り込み（デモ）
          showSpecialEvent(specialEvents[0]);
          specialEventTriggered = true;
          return;
        }

        explainBox && (explainBox.style.display = "none");
        explainBox && (explainBox.textContent = "");

        if (currentQuestionIndex >= (currentCity.questions || []).length) {
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
            // disable buttons to avoid double click
            Array.from(choiceButtons.children).forEach(b => b.disabled = true);
            selectChoice(choice);
          });
          choiceButtons.appendChild(btn);
        });

        progressText && (progressText.textContent = `${currentQuestionIndex + 1} / ${currentCity.questions.length}`);
      }

      function selectChoice(choice) {
        if (!choice || !choice.effects) {
          console.warn("選択肢の effects が不正です:", choice);
        } else {
          applyEffects(choice.effects);
        }

        updateStatusUI();

        if (explainBox) {
          explainBox.style.display = "block";
          explainBox.textContent = choice.explanation || "";
        }

        currentQuestionIndex++;
        // 次の質問を少し遅らせて表示（説明を読む時間）
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

      function showResult() {
        if (questionTitle) questionTitle.textContent = "🌆 都市評価結果";
        if (questionDesc) questionDesc.textContent = "あなたの都市運営の成果です！";
        if (choiceButtons) choiceButtons.innerHTML = "";
        if (explainBox) {
          explainBox.style.display = "block";
          explainBox.innerHTML = `🌿 環境: ${status.env}<br>💰 経済: ${status.eco}<br>🤝 社会: ${status.soc}`;
        }
        if (progressText) progressText.textContent = "ゲーム終了";
      }

      function showSpecialEvent(eventObj) {
        if (!specialEventEl || !specialDesc) {
          console.warn("特殊イベント表示エリアがありません。");
          // 直接 effects を適用して次の質問へ
          if (eventObj && eventObj.effects) {
            applyEffects(eventObj.effects);
            updateStatusUI();
            // continue
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

      // 最初は UI を初期化
      updateStatusUI();
      // （任意）自動で start しないで、ユーザーがボタン押すまで待つ
      // startGame();
    } catch (err) {
      console.error("main.js 実行中に例外が発生しました:", err);
    }
  });
})();
