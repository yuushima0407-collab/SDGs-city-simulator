// ===========================
// SDGs都市経営ゲーム main.js 改良版（資源フル活用15都市対応）
// ===========================
(function () {
  window.addEventListener("DOMContentLoaded", () => {

    // --------------------
    // 状態管理
    // --------------------
    let currentQuestionIndex = 0;
    let status = { env: 50, eco: 50, soc: 50 };
    let resources = { 
      energy: 0, food: 0, tech: 0, funds: 50, labor: 0, water: 0, recycled: 0 
    };
    let cityTypePoints = {
      eco:0, industry:0, social:0, smart:0, science:0,
      culture:0, tourism:0, agriculture:0, industryHeavy:0,
      urban:0, infra:0, housing:0, welfare:0, education:0, transport:0
    };

    // --------------------
    // DOM取得
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
      env: $("res-env"),
      eco: $("res-eco"),
      soc: $("res-soc"),
      energy: $("res-energy"),
      food: $("res-food")
    };

    const cityTypeUI = {
      eco: $("tp-eco"), industry: $("tp-industry"), social: $("tp-social"), smart: $("tp-smart"),
      science: $("tp-science"), culture: $("tp-culture"), tourism: $("tp-tourism"), agriculture: $("tp-agriculture"),
      industryHeavy: $("tp-industryHeavy"), urban: $("tp-urban"), infra: $("tp-infra"), housing: $("tp-housing"),
      welfare: $("tp-welfare"), education: $("tp-education"), transport: $("tp-transport")
    };

    // --------------------
    // cities は data.js で定義
    // --------------------
    if (typeof cities === "undefined") {
      alert("data.js が読み込まれていません。");
      return;
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
      explainBox.style.display = "none";
      updateAllUI();
      showQuestion();
    }

    // --------------------
    // 問題表示
    // --------------------
    function showQuestion() {
      if (currentQuestionIndex >= cities.length) return showResult();

      const q = cities[currentQuestionIndex];
      questionTitle.textContent = q.title || "無題の質問";
      questionDesc.textContent = q.description || "";
      choiceButtons.innerHTML = "";

      q.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = choice.text;

        // --------------------
        // 選択条件判定（資源）
        // --------------------
        let canSelect = true;
        if (choice.resources) {
          for (const k in choice.resources) {
            // 負の値 = 必要資源
            if (choice.resources[k] < 0 && (resources[k] || 0) < Math.abs(choice.resources[k])) {
              canSelect = false;
              btn.title = `${k}不足で選択できません`;
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
      checkBonusResources(choice.bonusResources);
      updateAllUI();

      explainBox.style.display = "block";
      explainBox.textContent = choice.explanation || "選択結果が反映されました。";

      currentQuestionIndex++;
      setTimeout(showQuestion, 1200);
    }

    // --------------------
    // ステータス・資源・タイプポイント更新
    // --------------------
    function applyEffects(effects) {
      if (!effects) return;
      for (const k in effects) {
        if (status[k] !== undefined) status[k] = clamp(status[k]+effects[k],0,100);
      }
    }

    function applyTypePoints(points) {
      if (!points) return;
      for (const k in points) cityTypePoints[k.toLowerCase()] = (cityTypePoints[k.toLowerCase()]||0)+points[k];
    }

    function applyResources(res) {
      if (!res) return;
      for (const k in res) {
        resources[k] = (resources[k]||0)+res[k];
        if (resources[k]<0) resources[k]=0;
      }
    }

    function checkBonusResources(bonus) {
      // tech>=10で追加ボーナス例
      if (!bonus) return;
      for (const k in bonus) {
        if ((resources[k] || 0) >= bonus[k].threshold) {
          applyTypePoints(bonus[k].typePoints);
          applyEffects(bonus[k].effects);
        }
      }
    }

    function updateAllUI() {
      // ステータスバー
      for (const k in statusUI) {
        if (statusUI[k]) {
          let value = status[k]!==undefined ? status[k] : resources[k];
          statusUI[k].style.width = `${value}%`;
        }
      }

      // 都市タイプポイント
      for (const k in cityTypePoints) {
        if (cityTypeUI[k]) cityTypeUI[k].textContent = cityTypePoints[k];
      }

      updateCityInfoPanel();
      updateCityVisual();
    }

    // --------------------
    // 都市情報パネル
    // --------------------
    function updateCityInfoPanel() {
      if (!cityInfoDesc || !cityInfoResources || !cityInfoName || !cityInfoLevel) return;

      const city = determineCityType();
      cityInfoName.textContent = city.name;
      cityInfoLevel.textContent = `Lv.${city.level}`;

      // 詳細
      let desc = `🌿環境:${status.env} 💰経済:${status.eco} 🤝社会:${status.soc}\n`;
      desc += `⚡:${resources.energy} 🧠:${resources.tech} 🍎:${resources.food} 💰:${resources.funds} 💧:${resources.water} 👷:${resources.labor} ♻:${resources.recycled}\n`;

      // 強み
      const strengths = [];
      if (resources.energy>=20) strengths.push("エネルギー豊富");
      if (resources.food>=20) strengths.push("食料自給");
      if (resources.tech>=10) strengths.push("技術都市");
      if (resources.funds>=50) strengths.push("資金潤沢");
      desc += `💡強み: ${strengths.join(",")||"なし"}`;

      // 弱み
      const weaknesses = [];
      if (resources.funds<10) weaknesses.push("資金不足");
      if (status.env<30) weaknesses.push("環境悪化");
      if (status.eco<30) weaknesses.push("経済停滞");
      if (status.soc<30) weaknesses.push("社会問題");
      if (resources.energy<5) weaknesses.push("電力不足");
      if (resources.food<5) weaknesses.push("食料不足");
      desc += `\n⚠弱み: ${weaknesses.join(",")||"なし"}`;

      cityInfoDesc.textContent = desc;
      cityInfoResources.textContent = `資源 - ⚡:${resources.energy} 🍎:${resources.food} 🧠:${resources.tech} 💰:${resources.funds} 💧:${resources.water} 👷:${resources.labor} ♻:${resources.recycled}`;
    }

    // --------------------
    // 最終結果
    // --------------------
    function showResult() {
      questionTitle.textContent = "🌆都市の最終結果";
      questionDesc.textContent = "あなたの選択が都市を形作りました。";
      choiceButtons.innerHTML = "";

      const finalCity = determineCityType();
      explainBox.innerHTML = `
        🌿${status.env}<br>
        💰${status.eco}<br>
        🤝${status.soc}<br>
        ⚡${resources.energy}<br>
        🧠${resources.tech}<br>
        🍎${resources.food}<br>
        💰${resources.funds}<br>
        💧${resources.water}<br>
        👷${resources.labor}<br>
        ♻${resources.recycled}<br><br>
        🏙最終都市タイプ: <b>${finalCity.name}</b> (Lv.${finalCity.level})
      `;

      updateAllUI();
      progressText.textContent = "全問題終了";
    }

    // --------------------
    // 都市タイプ判定（資源も考慮）
    // --------------------
    function determineCityType() {
      const sum = status.env + status.eco + status.soc;
      const mainType = Object.entries(cityTypePoints).sort((a,b)=>b[1]-a[1])[0][0];
      let name = "未発展都市";

      // 基本判定
      if (sum<80 && resources.energy<5 && resources.food<5 && resources.tech<5) name="荒廃都市";
      else if (sum>240) name="先進都市";
      else if (resources.energy>=20) name="エネルギー都市";
      else if (resources.food>=20) name="食料自給都市";
      else if (resources.tech>=10) name="技術都市";
      else if (resources.funds>=50 && resources.labor>=20) name="スマート都市";
      else if (resources.water>=30 && resources.recycled>=10) name="環境都市";
      else {
        switch(mainType){
          case "eco": name="エコ都市"; break;
          case "industry": name="産業都市"; break;
          case "social": name="福祉都市"; break;
          case "smart": name="スマート都市"; break;
          case "science": name="科学都市"; break;
          case "culture": name="文化都市"; break;
          case "tourism": name="観光都市"; break;
          case "agriculture": name="農業都市"; break;
          case "industryheavy": name="工業都市"; break;
          case "urban": name="都市再生都市"; break;
          case "infra": name="インフラ都市"; break;
          case "housing": name="住宅都市"; break;
          case "welfare": name="福祉都市"; break;
          case "education": name="教育都市"; break;
          case "transport": name="交通都市"; break;
        }
      }

      const level = clamp(Math.floor(sum/50)+1, 1, 5);
      return { name, level };
    }

    // --------------------
    // 都市画像更新
    // --------------------
    function updateCityVisual() {
      const city = determineCityType();
      if (!cityBg) return;

      const imgMap = {
        "荒廃都市":"img/wasteland.png",
        "先進都市":"img/advanced.png",
        "エネルギー都市":"img/energy.png",
        "食料自給都市":"img/food.png",
        "技術都市":"img/tech.png",
        "スマート都市":"img/smart.png",
        "環境都市":"img/env.png",
        "エコ都市":"img/eco.png",
        "産業都市":"img/industry.png",
        "福祉都市":"img/welfare.png",
        "科学都市":"img/science.png",
        "文化都市":"img/culture.png",
        "観光都市":"img/tourism.png",
        "農業都市":"img/agriculture.png",
        "工業都市":"img/industryHeavy.png",
        "都市再生都市":"img/urban.png",
        "インフラ都市":"img/infra.png",
        "住宅都市":"img/housing.png",
        "教育都市":"img/education.png",
        "交通都市":"img/transport.png"
      };
      cityBg.style.backgroundImage = `url('${imgMap[city.name] || "img/default.png"}')`;
    }

    // --------------------
    // ヘルパー
    // --------------------
    function clamp(v,min,max){return Math.max(min,Math.min(max,v));}

  });
})();

