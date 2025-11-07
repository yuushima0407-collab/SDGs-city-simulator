// ===========================
// SDGs City Manager Ver.6 main.js（完全整合版）
// Archetype + Constraint + Hysteresis 判定安定版
// ===========================
(function () {
  window.addEventListener("DOMContentLoaded", () => {

    // --------------------
    // 状態管理
    // --------------------
    let currentQuestionIndex = 0;
    let status = { env: 50, eco: 50, soc: 50 };
    let resources = { energy: 0, food: 0, tech: 0, funds: 50, labor: 0, water: 0, recycled: 0 };
    let cityTypePoints = {
      eco:0, industry:0, social:0, smart:0, science:0,
      culture:0, tourism:0, agriculture:0, urban:0, infra:0,
      housing:0, education:0, transport:0, industryHeavy:0,
      welfare:0 // ← 追加
    };
    let prevTypeKey = null;
    let prevLevel = 1;

    // --------------------
    // DOM取得
    // --------------------
    const $ = id => document.getElementById(id);
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
      food: $("res-food"),
      tech: $("res-tech"),
      funds: $("res-funds"),
      water: $("res-water"),
      labor: $("res-labor"),
      recycled: $("res-recycled")
    };

    const cityTypeUI = {
      eco: $("tp-eco"), industry: $("tp-industry"), social: $("tp-social"), smart: $("tp-smart"),
      science: $("tp-science"), culture: $("tp-culture"), tourism: $("tp-tourism"), agriculture: $("tp-agriculture"),
      industryHeavy: $("tp-industryHeavy"), urban: $("tp-urban"), infra: $("tp-infra"), housing: $("tp-housing"),
      welfare: $("tp-welfare"), education: $("tp-education"), transport: $("tp-transport")
    };

    // --------------------
    // cities 定義チェック
    // --------------------
    if (typeof cities === "undefined") {
      alert("data.js が読み込まれていません。");
      return;
    }

    // --------------------
    // アーキタイプ定義
    // --------------------
    const ARCHETYPES = {
      eco:         { v:[0.9,0.35,0.65], resPref:{recycled:1, energy:0.5, water:0.5}, disp:"エコ都市" },
      industry:    { v:[0.35,0.9,0.45], resPref:{funds:1, labor:0.7, energy:0.5},  disp:"産業都市" },
      social:      { v:[0.45,0.45,0.95], resPref:{labor:0.6, water:0.4},           disp:"社会都市" },
      smart:       { v:[0.6,0.8,0.55],  resPref:{tech:1, energy:0.6, funds:0.5},   disp:"スマート都市" },
      science:     { v:[0.55,0.85,0.55], resPref:{tech:1, funds:0.6},              disp:"科学都市" },
      culture:     { v:[0.65,0.55,0.75], resPref:{funds:0.4},                      disp:"文化都市" },
      tourism:     { v:[0.55,0.75,0.65], resPref:{funds:0.5, water:0.4},           disp:"観光都市" },
      agriculture: { v:[0.8,0.55,0.6],  resPref:{food:1, water:0.6},              disp:"農業都市" },
      urban:       { v:[0.55,0.75,0.65], resPref:{funds:0.8},                      disp:"都市再生都市" },
      infra:       { v:[0.45,0.85,0.55], resPref:{funds:0.9, energy:0.5},          disp:"インフラ都市" },
      housing:     { v:[0.6,0.55,0.8],  resPref:{funds:0.5, labor:0.4},           disp:"住宅都市" },
      education:   { v:[0.55,0.7,0.75], resPref:{tech:0.7, funds:0.4},            disp:"教育都市" },
      transport:   { v:[0.55,0.8,0.6],  resPref:{funds:0.6, energy:0.5},          disp:"交通都市" },
      welfare:     { v:[0.55,0.55,0.9], resPref:{labor:0.6, funds:0.4},           disp:"福祉都市" }
    };
    const TYPE_ALIAS = { industryHeavy: "industry" };

    const W = {
      alpha: 0.62, beta: 0.28, gamma: 0.10, delta: 0.12, zeta: 0.20,
      hysteresisType: 0.08, hysteresisLv: 0.06
    };

    // --------------------
    // ゲーム開始
    // --------------------
    startBtn.addEventListener("click", startGame);
    resetBtn.addEventListener("click", startGame);

    function startGame() {
      currentQuestionIndex = 0;
      status = { env: 50, eco: 50, soc: 50 };
      resources = { energy: 0, food: 0, tech: 0, funds: 50, labor: 0, water: 0, recycled: 0 };
      for (const k in cityTypePoints) cityTypePoints[k] = 0;
      prevTypeKey = null;
      prevLevel = 1;
      explainBox.classList.add("hidden");
      updateAllUI();
      showQuestion();
    }

    // --------------------
    // 問題表示
    // --------------------
    function showQuestion() {
      if (currentQuestionIndex >= cities.length) return showResult();
      const q = cities[currentQuestionIndex];

      questionTitle.textContent = q.title;
      questionDesc.textContent = q.description;
      choiceButtons.innerHTML = "";

      q.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = choice.text;
        // 資源条件チェック
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
          btn.style.opacity = "0.5";
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

      explainBox.classList.remove("hidden");
      explainBox.textContent = choice.explanation || "選択結果が反映されました。";

      currentQuestionIndex++;
      setTimeout(showQuestion, 900);
    }

    // --------------------
    // 更新処理
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
        const key = (TYPE_ALIAS[k] || k).toLowerCase();
        if (cityTypePoints[key] === undefined) continue;
        cityTypePoints[key] += points[k];
      }
    }
    function applyResources(res) {
      if (!res) return;
      for (const k in res) {
        resources[k] = (resources[k] || 0) + res[k];
        // マイナスも許可（崩壊判定用）
      }
    }

    // --------------------
    // 全UI更新
    // --------------------
    function updateAllUI() {
      for (const k in statusUI) {
        const el = statusUI[k];
        if (!el) continue;
        const val = clamp(status[k] !== undefined ? status[k] : resources[k], -100, 100);
        // ゲージ or 数値判定
        if (el.tagName === "DIV") el.style.width = `${clamp(val, 0, 100)}%`;
        else el.textContent = val.toFixed(0);
      }
      for (const k in cityTypePoints) {
        if (cityTypeUI[k]) cityTypeUI[k].textContent = cityTypePoints[k];
      }
      const city = determineCityType();
      updateCityInfoPanel(city);
      updateCityVisual(city);
    }

    // --------------------
    // 情報パネル
    // --------------------
    function updateCityInfoPanel(city) {
      cityInfoName.textContent = city.name;
      cityInfoLevel.textContent = `Lv.${city.level}`;
      let desc = `🌿環境:${status.env} 💰経済:${status.eco} 🤝社会:${status.soc}\n`;
      desc += `⚡:${resources.energy} 🧠:${resources.tech} 🍎:${resources.food} 💰:${resources.funds} 💧:${resources.water} 👷:${resources.labor} ♻:${resources.recycled}\n`;

      const strong = [];
      if (resources.energy >= 20) strong.push("エネルギー豊富");
      if (resources.food >= 20) strong.push("食料自給");
      if (resources.tech >= 12) strong.push("高度技術");
      if (resources.funds >= 60) strong.push("資金潤沢");
      if (resources.recycled >= 10) strong.push("循環率高");
      const weak = [];
      if (resources.funds < 10) weak.push("資金不足");
      if (status.env < 30) weak.push("環境悪化");
      if (status.eco < 30) weak.push("経済停滞");
      if (status.soc < 30) weak.push("社会不安");
      if (resources.energy < 5) weak.push("電力不足");
      if (resources.food < 5) weak.push("食料不足");

      desc += `💡強み:${strong.join("、") || "なし"}\n⚠弱み:${weak.join("、") || "なし"}`;
      cityInfoDesc.textContent = desc;
      cityInfoResources.textContent =
        `資源 - ⚡:${resources.energy} 🍎:${resources.food} 🧠:${resources.tech} 💰:${resources.funds} 💧:${resources.water} 👷:${resources.labor} ♻:${resources.recycled}`;
    }

    // --------------------
    // 結果
    // --------------------
    function showResult() {
      questionTitle.textContent = "🌆 都市の最終結果";
      questionDesc.textContent = "あなたの選択が都市を形作りました。";
      choiceButtons.innerHTML = "";
      const city = determineCityType();
      explainBox.classList.remove("hidden");
      explainBox.innerHTML =
        `🌿${status.env}<br>💰${status.eco}<br>🤝${status.soc}<br>` +
        `⚡${resources.energy}<br>🧠${resources.tech}<br>🍎${resources.food}<br>` +
        `💰${resources.funds}<br>💧${resources.water}<br>👷${resources.labor}<br>♻${resources.recycled}<br><br>` +
        `🏙最終都市タイプ: <b>${city.name}</b> (Lv.${city.level})`;
      progressText.textContent = "全問題終了";
      updateCityVisual(city);
      updateCityInfoPanel(city);
    }

    // --------------------
    // 判定（Archetype + Constraint + Hysteresis）
    // --------------------
    function determineCityType() {
      const avg = (status.env + status.eco + status.soc) / 3;
      const critical = countTruthy([
        resources.energy < 3,
        resources.food < 3,
        resources.funds < 5,
        resources.tech < 2,
        resources.water < 3
      ]);
      if (avg < 25 && critical >= 3)
        return { key:"collapse", name:"崩壊都市", level:1 };
      if (avg < 35 && critical >= 2)
        return { key:"wasteland", name:"荒廃都市", level:1 };

      const S = norm3([status.env/100, status.eco/100, status.soc/100]);
      let best = { key:"eco", name:"エコ都市", score:-1 };
      const conflict = (() => {
        let c=0;
        if (resources.funds > 60 && status.env < 30) c += 0.1;
        if (resources.energy > 25 && status.soc < 30) c += 0.08;
        if (resources.tech > 15 && status.soc < 30) c += 0.08;
        return c;
      })();
      const risk = (() => {
        let r=0;
        const low = [resources.energy<5,resources.food<5,resources.funds<10,resources.water<5].filter(Boolean).length;
        r += low*0.06;
        if (status.env<25) r += 0.06;
        if (status.soc<25) r += 0.06;
        return r;
      })();
      const maxTP = Math.max(...Object.values(cityTypePoints));
      const synergy = k => (cityTypePoints[k]||0)/(maxTP||1);
      for (const key of Object.keys(ARCHETYPES)) {
        const arch = ARCHETYPES[key];
        const cos = cosine(S, norm3(arch.v));
        let resAff = 0;
        for (const rk in arch.resPref) resAff += arch.resPref[rk]*(clamp(resources[rk],0,100)/100);
        resAff /= Object.keys(arch.resPref).length;
        const score = cos*W.alpha + resAff*W.beta + synergy(key)*W.gamma - conflict*W.delta - risk*W.zeta + (prevTypeKey===key?W.hysteresisType:0);
        if (score > best.score) best = { key, name:arch.disp, score };
      }
      const devIdx = clamp((status.env+status.eco+status.soc)/300,0,1);
      const resIdx = clamp((norm01(resources.energy,0,30)*0.25+norm01(resources.tech,0,20)*0.2+norm01(resources.funds,0,80)*0.3+norm01(resources.food,0,30)*0.15+norm01(resources.recycled,0,15)*0.1),0,1);
      let lv = Math.round(clamp((devIdx*0.65+resIdx*0.35)*2+1,1,3));
      if (prevTypeKey===best.key) {
        if (lv>prevLevel+1) lv=prevLevel+1;
        if (lv<prevLevel-1) lv=prevLevel-1;
      }
      prevTypeKey=best.key; prevLevel=lv;
      return {key:best.key,name:best.name,level:lv};
    }

    // --------------------
    // 背景画像更新
    // --------------------
    function updateCityVisual(city) {
      if (!cityBg) return;
      let url = "";
      if (city.key==="collapse") url="images/collapse.png";
      else if (city.key==="wasteland") url="images/wasteland.png";
      else url=`images/${city.key}_lv${city.level}.png`;
      cityBg.style.backgroundImage=`url('${url}')`;
    }

    // --------------------
    // ヘルパー
    // --------------------
    function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
    function countTruthy(a){return a.filter(Boolean).length;}
    function norm3(v){const n=Math.hypot(...v)||1;return v.map(x=>x/n);}
    function cosine(a,b){return clamp(a[0]*b[0]+a[1]*b[1]+a[2]*b[2],0,1);}
    function norm01(x,lo,hi){return clamp((x-lo)/(hi-lo),0,1);}
  });
})();
