// ===========================
// SDGs都市経営ゲーム main.js（Archetype + Constraint + Hysteresis 判定版）
// 画像は images/<type>_lv<1|2|3>.png を自動採用
// collapse/wasteland は images/collapse.png / images/wasteland.png を採用
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
    // 13系統 + 互換（industryHeavy → industry）
    let cityTypePoints = {
      eco:0, industry:0, social:0, smart:0, science:0,
      culture:0, tourism:0, agriculture:0, urban:0, infra:0,
      housing:0, education:0, transport:0, industryHeavy:0
    };

    // 直前の判定（ヒステリシス用）
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
      energy: $("res-energy"), food: $("res-food")
    };
    const cityTypeUI = {
      eco: $("tp-eco"), industry: $("tp-industry"), social: $("tp-social"), smart: $("tp-smart"),
      science: $("tp-science"), culture: $("tp-culture"), tourism: $("tp-tourism"), agriculture: $("tp-agriculture"),
      industryHeavy: $("tp-industryHeavy"), urban: $("tp-urban"), infra: $("tp-infra"), housing: $("tp-housing"),
      welfare: $("tp-welfare"), education: $("tp-education"), transport: $("tp-transport")
    };

    // --------------------
    // cities は data.js で提供
    // --------------------
    if (typeof cities === "undefined") {
      alert("data.js が読み込まれていません。");
      return;
    }

    // --------------------
    // アーキタイプ定義
    // S = [env, eco, soc] 正規化ベクトルに対する理想ベクトル
    // resPref: 資源の“好み”（スコアに加点）
    // disp: 表示名
    // --------------------
    const ARCHETYPES = {
      eco:         { v:[0.90,0.35,0.65], resPref:{recycled:1, energy:0.5, water:0.5}, disp:"エコ都市" },
      industry:    { v:[0.35,0.90,0.45], resPref:{funds:1, labor:0.7, energy:0.5},  disp:"産業都市" },
      social:      { v:[0.45,0.45,0.95], resPref:{labor:0.6, water:0.4},           disp:"社会都市" },
      smart:       { v:[0.60,0.80,0.55], resPref:{tech:1, energy:0.6, funds:0.5},   disp:"スマート都市" },
      science:     { v:[0.55,0.85,0.55], resPref:{tech:1, funds:0.6},               disp:"科学都市" },
      culture:     { v:[0.65,0.55,0.75], resPref:{funds:0.4, tourism:0.0},          disp:"文化都市" }, // tourismキーはダミー
      tourism:     { v:[0.55,0.75,0.65], resPref:{funds:0.5, water:0.4},            disp:"観光都市" },
      agriculture: { v:[0.80,0.55,0.60], resPref:{food:1, water:0.6},               disp:"農業都市" },
      urban:       { v:[0.55,0.75,0.65], resPref:{funds:0.8},                        disp:"都市再生都市" },
      infra:       { v:[0.45,0.85,0.55], resPref:{funds:0.9, energy:0.5},           disp:"インフラ都市" },
      housing:     { v:[0.60,0.55,0.80], resPref:{funds:0.5, labor:0.4},            disp:"住宅都市" },
      education:   { v:[0.55,0.70,0.75], resPref:{tech:0.7, funds:0.4},             disp:"教育都市" },
      transport:   { v:[0.55,0.80,0.60], resPref:{funds:0.6, energy:0.5},           disp:"交通都市" }
    };
    const TYPE_ALIAS = { industryHeavy: "industry" }; // 互換

    // 重み
    const W = {
      alpha: 0.62,    // 類似度
      beta:  0.28,    // 資源嗜好
      gamma: 0.10,    // シナジー（typePoints）
      delta: 0.12,    // コンフリクトペナルティ
      zeta:  0.20,    // リスク（崩壊方向）
      hysteresisType: 0.08, // 直前タイプ補正
      hysteresisLv:   0.06  // 直前レベル補正
    };

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

        // 必要資源チェック（resources の負値を必要条件として解釈）
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
      checkBonus(choice.bonusResources);
      updateAllUI();

      explainBox.style.display = "block";
      explainBox.textContent = choice.explanation || "選択結果が反映されました。";

      currentQuestionIndex++;
      setTimeout(showQuestion, 1000);
    }

    // --------------------
    // 更新系
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
        if (resources[k] < 0) resources[k] = 0;
      }
    }
    function checkBonus(bonus) {
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
          let value = status[k] !== undefined ? status[k] : resources[k];
          value = clamp(value, 0, 100);
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
    // 情報パネル
    // --------------------
    function updateCityInfoPanel() {
      if (!cityInfoDesc || !cityInfoResources || !cityInfoName || !cityInfoLevel) return;
      const city = determineCityType(); // {key, name, level}
      cityInfoName.textContent  = city.name;
      cityInfoLevel.textContent = `Lv.${city.level}`;

      let desc = `🌿環境:${status.env}  💰経済:${status.eco}  🤝社会:${status.soc}\n`;
      desc    += `⚡:${resources.energy}  🧠:${resources.tech}  🍎:${resources.food}  💰:${resources.funds}  💧:${resources.water}  👷:${resources.labor}  ♻:${resources.recycled}\n`;

      const strengths = [];
      if (resources.energy >= 20) strengths.push("エネルギー豊富");
      if (resources.food   >= 20) strengths.push("食料自給");
      if (resources.tech   >= 12) strengths.push("高度技術");
      if (resources.funds  >= 60) strengths.push("資金潤沢");
      if (resources.recycled >= 10) strengths.push("循環率高");
      const weaknesses = [];
      if (resources.funds < 10) weaknesses.push("資金不足");
      if (status.env  < 30) weaknesses.push("環境悪化");
      if (status.eco  < 30) weaknesses.push("経済停滞");
      if (status.soc  < 30) weaknesses.push("社会不安");
      if (resources.energy < 5) weaknesses.push("電力不足");
      if (resources.food   < 5) weaknesses.push("食料不足");

      desc += `💡強み: ${strengths.join("、") || "なし"}\n`;
      desc += `⚠弱み: ${weaknesses.join("、") || "なし"}`;

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

      const finalCity = determineCityType();
      explainBox.innerHTML =
        `🌿${status.env}<br>💰${status.eco}<br>🤝${status.soc}<br>` +
        `⚡${resources.energy}<br>🧠${resources.tech}<br>🍎${resources.food}<br>` +
        `💰${resources.funds}<br>💧${resources.water}<br>👷${resources.labor}<br>♻${resources.recycled}<br><br>` +
        `🏙最終都市タイプ: <b>${finalCity.name}</b> (Lv.${finalCity.level})`;
      updateAllUI();
      progressText.textContent = "全問題終了";
    }

    // --------------------
    // 都市タイプ判定（Archetype + Constraint + Hysteresis）
    // --------------------
    function determineCityType() {
      // 1) 制約チェック（崩壊・荒廃優先）
      const avgStatus = (status.env + status.eco + status.soc) / 3;
      const criticalRes = countTruthy([
        resources.energy < 3,
        resources.food < 3,
        resources.funds < 5,
        resources.tech < 2,
        resources.water < 3
      ]);
      if (avgStatus < 25 && criticalRes >= 3) {
        prevTypeKey = "collapse";
        prevLevel = 1;
        return { key:"collapse", name:"崩壊都市", level:1 };
      }
      if (avgStatus < 35 && criticalRes >= 2) {
        prevTypeKey = "wasteland";
        prevLevel = 1;
        return { key:"wasteland", name:"荒廃都市", level:1 };
      }

      // 2) 類似度 + 資源嗜好 + シナジー − コンフリクト − リスク + ヒステリシス
      const S = norm3([status.env/100, status.eco/100, status.soc/100]);
      let best = { key:"eco", name:"エコ都市", score: -1 };

      // コンフリクト例：資源は潤沢だが env が極端に低い/ soc が極端に低い など
      const conflict = (() => {
        let c = 0;
        if (resources.funds > 60 && status.env < 30) c += 0.10;
        if (resources.energy > 25 && status.soc < 30) c += 0.08;
        if (resources.tech > 15 && status.soc < 30) c += 0.08;
        return c; // 大きいほどマイナス
      })();

      // 崩壊リスク（資源の複合的不足）
      const risk = (() => {
        let r = 0;
        const low = [
          resources.energy < 5,
          resources.food < 5,
          resources.funds < 10,
          resources.water < 5
        ].filter(Boolean).length;
        r += low * 0.06;
        if (status.env < 25) r += 0.06;
        if (status.soc < 25) r += 0.06;
        return r;
      })();

      // typePoints のシナジー（得点が高い方向に微加点）
      const maxTP = Math.max(...Object.keys(ARCHETYPES).map(k => cityTypePoints[k] || 0), 1);
      const synergyOf = (key) => (cityTypePoints[key] || 0) / maxTP; // 0-1

      for (const key of Object.keys(ARCHETYPES)) {
        const arch = ARCHETYPES[key];
        const A = norm3(arch.v);
        const cos = cosine(S, A); // 0-1 近似

        // 資源嗜好
        let resAff = 0;
        for (const rk in arch.resPref) {
          const prefW = arch.resPref[rk]; // 0-1
          const val = clamp(resources[rk] || 0, 0, 100) / 100;
          resAff += prefW * val;
        }
        resAff /= (Object.keys(arch.resPref).length || 1); // 0-1

        // シナジー
        const syn = synergyOf(key); // 0-1

        // ヒステリシス（前タイプに近いなら微加点）
        const hystType = (prevTypeKey && prevTypeKey === key) ? 1 : 0;
        const hystLv   = 0; // レベルは最後に別ロジックで補正

        const score =
          cos * W.alpha +
          resAff * W.beta +
          syn * W.gamma -
          conflict * W.delta -
          risk * W.zeta +
          hystType * W.hysteresisType +
          hystLv * W.hysteresisLv;

        if (score > best.score) best = { key, name: arch.disp, score };
      }

      // 3) レベル決定（総合指数 + 資源指数 + ヒステリシス）
      const devIdx = clamp((status.env + status.eco + status.soc) / 300, 0, 1);
      const resIdx = clamp((
        norm01(resources.energy, 0, 30) * 0.25 +
        norm01(resources.tech,   0, 20) * 0.20 +
        norm01(resources.funds,  0, 80) * 0.30 +
        norm01(resources.food,   0, 30) * 0.15 +
        norm01(resources.recycled,0,15) * 0.10
      ), 0, 1);
      let rawLevel = Math.round(clamp((devIdx * 0.65 + resIdx * 0.35) * 2 + 1, 1, 3)); // 1..3

      // ヒステリシス：急降下/急上昇を抑制
      if (prevTypeKey === best.key) {
        if (rawLevel > prevLevel) rawLevel = prevLevel + ((rawLevel - prevLevel) >= 2 ? 1 : 1);
        if (rawLevel < prevLevel) rawLevel = prevLevel - 1;
      }

      prevTypeKey = best.key;
      prevLevel   = rawLevel;
      return { key: best.key, name: ARCHETYPES[best.key].disp, level: rawLevel };
    }

    // --------------------
    // 都市画像更新
    // --------------------
    function updateCityVisual() {
      const city = determineCityType(); // {key, name, level}
      if (!cityBg) return;

      let url = "";
      if (city.key === "collapse") {
        url = "images/collapse.png";
      } else if (city.key === "wasteland") {
        url = "images/wasteland.png";
      } else {
        // 通常13タイプ：images/<key>_lv<1|2|3>.png
        url = `images/${city.key}_lv${city.level}.png`;
      }
      cityBg.style.backgroundImage = `url('${url}')`;
    }

    // --------------------
    // ヘルパー
    // --------------------
    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
    function countTruthy(arr) { return arr.filter(Boolean).length; }
    function norm3(v) {
      const n = Math.hypot(v[0], v[1], v[2]) || 1;
      return [v[0]/n, v[1]/n, v[2]/n];
    }
    function cosine(a, b) { return clamp((a[0]*b[0] + a[1]*b[1] + a[2]*b[2]), 0, 1); }
    function norm01(x, lo, hi) { if (hi<=lo) return 0; return clamp((x - lo) / (hi - lo), 0, 1); }

  });
})();
