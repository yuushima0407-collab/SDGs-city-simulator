// ===========================
// SDGs都市経営ゲーム main.js Ver.7（安定 + 背景フェード）
// ===========================
(function () {
  window.addEventListener("DOMContentLoaded", () => {

    // --------------------
    // 状態管理
    // --------------------
    let currentQuestionIndex = 0;
    let status = { env: 50, eco: 50, soc: 50 }; // 0-100
    let resources = {
      energy: 0, food: 0, tech: 0, funds: 50,
      labor: 0, water: 0, recycled: 0
    };
    let cityTypePoints = {
      eco:0, industry:0, social:0, smart:0, science:0,
      culture:0, tourism:0, agriculture:0, urban:0, infra:0,
      housing:0, education:0, transport:0, welfare:0, industryHeavy:0
    };

    let prevTypeKey = null;
    let prevLevel = 1;

    // --------------------
    // DOM
    // --------------------
    const $ = (id) => document.getElementById(id);
    const startBtn = $("btn-start");
    const resetBtn = $("btn-reset");
    const questionTitle = $("question-title");
    const questionDesc = $("question-desc");
    const choiceButtons = $("choices");
    const explainBox = $("explainBox");
    const progressText = $("progress");
    const cityBg = $("city-bg");
    const cityInfoName = $("city-info-name");
    const cityInfoLevel = $("city-info-level");
    const cityInfoDesc = $("city-info-desc");
    const cityInfoResources = $("city-info-resources");

    const statusUI = {
      env: $("res-env"), eco: $("res-eco"), soc: $("res-soc"),
    };
    const cityTypeUI = {
      eco: $("tp-eco"), industry: $("tp-industry"), social: $("tp-social"), smart: $("tp-smart"),
      science: $("tp-science"), culture: $("tp-culture"), tourism: $("tp-tourism"), agriculture: $("tp-agriculture"),
      industryHeavy: $("tp-industryHeavy"), urban: $("tp-urban"), infra: $("tp-infra"), housing: $("tp-housing"),
      welfare: $("tp-welfare"), education: $("tp-education"), transport: $("tp-transport")
    };

    // --------------------
    // cities (data.js)
    // --------------------
    if (typeof cities === "undefined") {
      alert("data.js が読み込まれていません。");
      return;
    }

    // --------------------
    // 背景画像フェード関数
    // --------------------
    let currentBg = "";
    function setBackground(url) {
      if (!cityBg) return;
      if (currentBg === url) return; // 同じならスキップ
      cityBg.classList.remove("fade-in");
      cityBg.classList.add("fade-out");
      setTimeout(() => {
        cityBg.style.backgroundImage = `url('${url}')`;
        cityBg.classList.remove("fade-out");
        cityBg.classList.add("fade-in");
        currentBg = url;
      }, 400);
    }

    // --------------------
    // ゲーム開始 / リセット
    // --------------------
    if (startBtn) startBtn.addEventListener("click", startGame);
    if (resetBtn) resetBtn.addEventListener("click", startGame);

    function startGame() {
      currentQuestionIndex = 0;
      status = { env: 50, eco: 50, soc: 50 };
      resources = { energy: 0, food: 0, tech: 0, funds: 50, labor: 0, water: 0, recycled: 0 };
      for (const k in cityTypePoints) cityTypePoints[k] = 0;
      prevTypeKey = null;
      prevLevel = 1;
      explainBox.style.display = "none";
      updateAllUI();
      showQuestion();
      setBackground("images/eco_lv1.png"); // 初期背景
    }

    // --------------------
    // 問題表示
    // --------------------
    function showQuestion() {
      if (currentQuestionIndex >= cities.length) return showResult();
      const q = cities[currentQuestionIndex];
      questionTitle.textContent = q.title || "無題の質問";
      questionDesc.textContent  = q.description || "";
      choiceButtons.innerHTML   = "";

      q.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = choice.text;

        // 必要資源チェック
        let canSelect = true;
        if (choice.resources) {
          for (const k in choice.resources) {
            if (choice.resources[k] < 0 && (resources[k] || 0) < Math.abs(choice.resources[k])) {
              canSelect = false;
              btn.title = `${k}が不足しています`;
            }
          }
        }
        if (!canSelect) {
          btn.disabled = true;
          btn.style.opacity = 0.5;
        }
        btn.onclick = () => selectChoice(choice);
        choiceButtons.appendChild(btn);
      });

      progressText.textContent = `問題 ${currentQuestionIndex + 1}/${cities.length}`;
    }

    // --------------------
    // 選択肢選択
    // --------------------
    function selectChoice(choice) {
      applyEffects(choice.effects);
      applyTypePoints(choice.typePoints);
      applyResources(choice.resources);
      updateAllUI();

      explainBox.style.display = "block";
      explainBox.textContent = choice.explanation || "選択結果が反映されました。";

      currentQuestionIndex++;
      setTimeout(showQuestion, 900);
    }

    // --------------------
    // 効果適用
    // --------------------
    function applyEffects(effects) {
      if (!effects) return;
      for (const k in effects) {
        if (status[k] !== undefined) status[k] = clamp(status[k] + effects[k], 0, 100);
      }
    }
    function applyTypePoints(points) {
      if (!points) return;
      for (const k in points) {
        if (cityTypePoints[k] === undefined) continue;
        cityTypePoints[k] += points[k];
      }
    }
    function applyResources(res) {
      if (!res) return;
      for (const k in res) {
        resources[k] = (resources[k] || 0) + res[k];
        if (resources[k] < 0) resources[k] = 0;
      }
    }

    // --------------------
    // UI更新
    // --------------------
    function updateAllUI() {
      for (const k in statusUI) {
        if (statusUI[k]) {
          const v = clamp(status[k], 0, 100);
          statusUI[k].style.width = `${v}%`;
        }
      }
      for (const k in cityTypePoints) {
        if (cityTypeUI[k]) cityTypeUI[k].textContent = cityTypePoints[k];
      }
      updateCityInfoPanel();
      updateCityVisual();
    }

    // --------------------
    // 都市情報更新
    // --------------------
    function updateCityInfoPanel() {
      if (!cityInfoName) return;
      const city = determineCityType();
      cityInfoName.textContent = city.name;
      cityInfoLevel.textContent = `Lv.${city.level}`;
      cityInfoDesc.textContent = `🌿環境:${status.env} 💰経済:${status.eco} 🤝社会:${status.soc}`;
      cityInfoResources.textContent = `⚡:${resources.energy} 🧠:${resources.tech} 🍎:${resources.food} 💰:${resources.funds}`;
    }

    // --------------------
    // 結果
    // --------------------
    function showResult() {
      questionTitle.textContent = "🌆 都市の最終結果";
      questionDesc.textContent = "あなたの選択が都市を形作りました。";
      choiceButtons.innerHTML = "";
      const finalCity = determineCityType();
      explainBox.innerHTML = `🏙最終都市タイプ: <b>${finalCity.name}</b> (Lv.${finalCity.level})`;
      updateAllUI();
      progressText.textContent = "全問題終了";
    }

    // --------------------
    // 都市タイプ判定（簡略＋安定）
    // --------------------
    function determineCityType() {
      const avg = (status.env + status.eco + status.soc) / 3;
      const key = avg > 66 ? "smart" : avg > 45 ? "eco" : "industry";
      const level = avg > 80 ? 3 : avg > 60 ? 2 : 1;
      return { key, name: typeName(key), level };
    }

    function typeName(k) {
      const map = {
        eco: "エコ都市", industry: "産業都市", social: "社会都市",
        smart: "スマート都市", science: "科学都市", culture: "文化都市",
        tourism: "観光都市", agriculture: "農業都市", urban: "再生都市",
        infra: "インフラ都市", housing: "住宅都市", education: "教育都市",
        welfare: "福祉都市", transport: "交通都市", industryHeavy: "重工業都市"
      };
      return map[k] || "都市";
    }

    // --------------------
    // 背景更新（フェード付き）
    // --------------------
    function updateCityVisual() {
      const city = determineCityType();
      let url = "";
      if (city.key === "collapse") url = "images/collapse.png";
      else if (city.key === "wasteland") url = "images/wasteland.png";
      else url = `images/${city.key}_lv${city.level}.png`;
      setBackground(url);
    }

    // --------------------
    // ヘルパー
    // --------------------
    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  });
})();
