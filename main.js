// ===========================
// SDGs都市経営ゲーム main.js 改良版（15都市対応）
// ===========================
(function () {
  window.addEventListener("DOMContentLoaded", () => {
    // --- 状態管理 ---
    let currentQuestionIndex = 0;
    let status = { env: 50, eco: 50, soc: 50 };
    let resources = { energy: 0, food: 0, tech: 0, funds: 50 };

    // --- 都市タイプポイント（15都市対応） ---
    let cityTypePoints = {
      eco: 0,            // エコ都市
      industry: 0,       // 産業都市
      social: 0,         // 社会都市
      smart: 0,          // スマート都市
      science: 0,        // 科学都市
      culture: 0,        // 文化都市
      tourism: 0,        // 観光都市
      agriculture: 0,    // 農業都市
      industryHeavy: 0,  // 工業都市
      urban: 0,          // 都市再生都市
      infra: 0,          // インフラ都市
      housing: 0,        // 住宅都市
      welfare: 0,        // 福祉都市
      education: 0,      // 教育都市
      transport: 0       // 交通都市
    };

    // --- DOM取得 ---
    const $ = (id) => document.getElementById(id);
    const startBtn = $("btn-start");
    const questionTitle = $("question-title");
    const questionDesc = $("question-desc");
    const choiceButtons = $("choices");
    const explainBox = $("explainBox");
    const envBar = $("env-bar");
    const ecoBar = $("eco-bar");
    const socBar = $("soc-bar");
    const progressText = $("progress");
    const cityBg = $("city-bg");
    const cityInfoName = $("city-info-name");
    const cityInfoLevel = $("city-info-level");
    const cityInfoDesc = $("city-info-desc");
    const cityInfoResources = $("city-info-resources");

    // --- 都市タイプポイント UI ---
    const cityTypeUI = {
      eco: $("tp-eco"),
      industry: $("tp-industry"),
      social: $("tp-social"),
      smart: $("tp-smart"),
      science: $("tp-science"),
      culture: $("tp-culture"),
      tourism: $("tp-tourism"),
      agriculture: $("tp-agriculture"),
      industryHeavy: $("tp-industryHeavy"),
      urban: $("tp-urban"),
      infra: $("tp-infra"),
      housing: $("tp-housing"),
      welfare: $("tp-welfare"),
      education: $("tp-education"),
      transport: $("tp-transport")
    };

    // --- ゲーム開始 ---
    if (startBtn) startBtn.addEventListener("click", startGame);

    function startGame() {
      currentQuestionIndex = 0;
      status = { env: 50, eco: 50, soc: 50 };
      resources = { energy: 0, food: 0, tech: 0, funds: 50 };
      for (const key in cityTypePoints) cityTypePoints[key] = 0;
      explainBox.style.display = "none";
      updateStatusUI();
      updateCityVisual();
      updateCityTypePointsUI();
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

      q.choices.forEach((choice) => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = choice.text;

        // リソース条件判定
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

      progressText.textContent = `問題 ${currentQuestionIndex + 1}/${cities.length}`;
    }

    // --- 選択肢選択時 ---
    function selectChoice(choice) {
      applyEffects(choice.effects);
      applyTypePoints(choice.typePoints);
      applyResources(choice.resources);
      updateStatusUI();
      updateCityVisual();
      updateCityInfoPanel();
      updateCityTypePointsUI();
      explainBox.style.display = "block";
      explainBox.textContent = choice.explanation || "選択結果が反映されました。";
      currentQuestionIndex++;
      setTimeout(showQuestion, 1200);
    }

    // --- 効果反映 ---
    function applyEffects(effects) {
      if (!effects) return;
      status.env = clamp(status.env + (effects.env || 0), 0, 100);
      status.eco = clamp(status.eco + (effects.eco || 0), 0, 100);
      status.soc = clamp(status.soc + (effects.soc || 0), 0, 100);
    }

    function applyTypePoints(points) {
      if (!points) return;
      for (const k in points) {
        cityTypePoints[k] = (cityTypePoints[k] || 0) + points[k];
      }
    }

    function applyResources(res) {
      if (!res) return;
      for (const k in res) {
        resources[k] = (resources[k] || 0) + res[k];
      }
    }

    // --- UI更新 ---
    function updateStatusUI() {
      envBar.style.width = `${status.env}%`;
      ecoBar.style.width = `${status.eco}%`;
      socBar.style.width = `${status.soc}%`;
    }

    function updateCityTypePointsUI() {
      for (const key in cityTypePoints) {
        if (cityTypeUI[key])
          cityTypeUI[key].textContent = `${key}: ${cityTypePoints[key]}`;
      }
    }

    function updateCityVisual() {
      const city = determineCityType();
      if (cityBg) {
        const imgMap = {
          "荒廃都市": "ruin_city.jpg",
          "未発展都市": "default_city.jpg",
          "エネルギー都市": "energy_city.jpg",
          "食料自給都市": "food_city.jpg",
          "技術都市": "tech_city.jpg",
          "エコ都市": "eco_city.jpg",
          "産業都市": "industry_city.jpg",
          "福祉都市": "social_city.jpg",
          "スマート都市": "smart_city.jpg",
          "科学都市": "science_city.jpg",
          "文化都市": "culture_city.jpg",
          "観光都市": "tourism_city.jpg",
          "農業都市": "agriculture_city.jpg",
          "工業都市": "industryHeavy_city.jpg",
          "都市再生都市": "urban_city.jpg",
          "インフラ都市": "infra_city.jpg",
          "住宅都市": "housing_city.jpg",
          "教育都市": "education_city.jpg",
          "交通都市": "transport_city.jpg",
          "先進都市": "advanced_city.jpg"
        };
        const imgUrl = `images/${imgMap[city.name] || "default_city.jpg"}`;
        cityBg.style.backgroundImage = `url(${imgUrl})`;
      }
    }

    function updateCityInfoPanel() {
      const city = determineCityType();
      if (cityInfoName) cityInfoName.textContent = city.name;
      if (cityInfoLevel) cityInfoLevel.textContent = `Lv.${city.level}`;
      if (cityInfoDesc) {
        let desc = `🌿環境:${status.env} 💰経済:${status.eco} 🤝社会:${status.soc}\n`;
        desc += `⚡:${resources.energy} 🧠:${resources.tech} 🍎:${resources.food} 💰:${resources.funds}\n`;

        const strengths = [];
        if (resources.energy >= 20) strengths.push("エネルギー豊富");
        if (resources.food >= 20) strengths.push("食料自給");
        if (resources.tech >= 10) strengths.push("技術都市");
        if (status.env > status.eco && status.env > status.soc) strengths.push("自然豊か");
        desc += `💡強み: ${strengths.join(",") || "なし"}`;

        const weaknesses = [];
        if (resources.funds < 10) weaknesses.push("資金不足");
        if (status.env < 30) weaknesses.push("環境悪化");
        if (status.eco < 30) weaknesses.push("経済停滞");
        if (status.soc < 30) weaknesses.push("社会問題");
        desc += `\n⚠弱み: ${weaknesses.join(",") || "なし"}`;
        cityInfoDesc.textContent = desc;
      }
      if (cityInfoResources) {
        cityInfoResources.textContent =
          `資源 - ⚡:${resources.energy} 🍎:${resources.food} 🧠:${resources.tech} 💰:${resources.funds}`;
      }
    }

    // --- 結果表示 ---
    function showResult() {
      questionTitle.textContent = "🌆都市の最終結果";
      questionDesc.textContent = "あなたの選択が都市を形作りました。";
      choiceButtons.innerHTML = "";
      const finalType = determineCityType();
      let bonusDesc = "";
      if (resources.energy >= 20) bonusDesc += "⚡エネルギー豊富な都市<br>";
      if (resources.food >= 20) bonusDesc += "🍎食料自給率高い都市<br>";
      if (resources.tech >= 10) bonusDesc += "🧠技術都市<br>";
      if (resources.funds >= 50) bonusDesc += "💰豊富な資金<br>";
      explainBox.innerHTML = `
        🌿${status.env}<br>
        💰${status.eco}<br>
        🤝${status.soc}<br>
        ⚡${resources.energy}<br>
        🧠${resources.tech}<br>
        🍎${resources.food}<br>
        💰${resources.funds}<br><br>
        🏙最終都市タイプ: <b>${finalType.name}</b> (Lv.${finalType.level})<br>
        ${bonusDesc}
      `;
      progressText.textContent = "全問題終了";
      updateCityVisual();
      updateCityInfoPanel();
      updateCityTypePointsUI();
    }

    // --- 都市タイプ判定 ---
    function determineCityType() {
      const sum = status.env + status.eco + status.soc;
      const mainType = Object.entries(cityTypePoints).sort((a, b) => b[1] - a[1])[0][0];
      let name = "未発展都市";

      if (sum < 80 && resources.energy < 5 && resources.food < 5 && resources.tech < 5)
        name = "荒廃都市";
      else if (sum > 240)
        name = "先進都市";
      else if (resources.energy >= 20)
        name = "エネルギー都市";
      else if (resources.food >= 20)
        name = "食料自給都市";
      else if (resources.tech >= 10)
        name = "技術都市";
      else {
        switch (mainType) {
          case "eco": name = "エコ都市"; break;
          case "industry": name = "産業都市"; break;
          case "social": name = "福祉都市"; break;
          case "smart": name = "スマート都市"; break;
          case "science": name = "科学都市"; break;
          case "culture": name = "文化都市"; break;
          case "tourism": name = "観光都市"; break;
          case "agriculture": name = "農業都市"; break;
          case "industryHeavy": name = "工業都市"; break;
          case "urban": name = "都市再生都市"; break;
          case "infra": name = "インフラ都市"; break;
          case "housing": name = "住宅都市"; break;
          case "welfare": name = "福祉都市"; break;
          case "education": name = "教育都市"; break;
          case "transport": name = "交通都市"; break;
          default: name = "未発展都市"; break;
        }
      }

      let level = 1;
      if (sum > 220) level = 3;
      else if (sum > 150) level = 2;

      return { name, level };
    }

    function clamp(v, min, max) {
      return Math.max(min, Math.min(max, v));
    }
  });
})();
