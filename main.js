// ===========================
// SDGs City Manager Ver.14.3
//  - 20問対応（data.js Ver.14.3）
//  - 教育コメント（褒め＋課題＋物語）追加
//  - 自然崩壊・再生ルート統合
//  - 出現率バランス＆グレー選択肢説明強化
//  - Scroll挙動：都市orLv変化時のみ
// ===========================

(function () {
  // --------- State ----------
  let currentQuestionIndex = 0;
  let status = { env: 50, eco: 50, soc: 50 };
  let resources = { energy: 0, food: 0, tech: 0, funds: 50, labor: 0, water: 0, recycled: 0 };

  const cityTypePoints = {
    eco: 0, industry: 0, social: 0, smart: 0, science: 0,
    culture: 0, tourism: 0, agriculture: 0, urban: 0, infra: 0,
    housing: 0, education: 0, transport: 0, industryHeavy: 0,
    welfare: 0, governance: 0
  };

  let prevTypeKey = "start";
  let prevLevel = 1;
  let history = []; // 選択履歴格納（後で褒め・課題生成に使用）

  // DOM取得
  const $ = id => document.getElementById(id);
  const cityNameEl = $("city-name");
  const cityLevelEl = $("city-level");
  const photoEl = $("city-photo");
  const captionEl = $("city-caption");
  const explainBox = $("explainBox");
  const progressEl = $("progress");
  const choicesEl = $("choices");
  const qTitle = $("question-title");
  const qDesc = $("question-desc");
  const evidenceEl = $("evidence");
  const bars = { env: $("bar-env"), eco: $("bar-eco"), soc: $("bar-soc") };
  const chips = {
    energy: $("res-energy"), food: $("res-food"), tech: $("res-tech"),
    funds: $("res-funds"), water: $("res-water"),
    labor: $("res-labor"), recycled: $("res-recycled")
  };

  if (typeof cities === "undefined") {
    alert("data.js が読み込まれていません。");
    return;
  }

  // -------- Archetype定義 --------
  const ARCHETYPES = {
    eco:         { v:[0.95,0.25,0.55], resPref:{recycled:1, energy:0.5, water:0.5}, disp:"エコ都市" },
    industry:    { v:[0.25,0.95,0.40], resPref:{funds:1, labor:0.7, energy:0.5},  disp:"産業都市" },
    social:      { v:[0.40,0.35,0.95], resPref:{labor:0.6, water:0.4},           disp:"共生都市" },
    smart:       { v:[0.55,0.85,0.55], resPref:{tech:1, energy:0.6, funds:0.5},   disp:"スマート都市" },
    science:     { v:[0.55,0.90,0.55], resPref:{tech:1, funds:0.6},               disp:"科学都市" },
    culture:     { v:[0.65,0.50,0.80], resPref:{funds:0.4},                       disp:"文化都市" },
    tourism:     { v:[0.55,0.75,0.65], resPref:{funds:0.5, water:0.4},            disp:"観光都市" },
    agriculture: { v:[0.85,0.45,0.50], resPref:{food:1, water:0.6},               disp:"農業都市" },
    urban:       { v:[0.45,0.70,0.55], resPref:{funds:0.5},                       disp:"都市再生都市" },
    infra:       { v:[0.40,0.85,0.55], resPref:{funds:0.9, energy:0.5},           disp:"インフラ都市" },
    housing:     { v:[0.55,0.55,0.85], resPref:{funds:0.5, labor:0.4},            disp:"住宅都市" },
    education:   { v:[0.55,0.65,0.80], resPref:{tech:0.7, funds:0.4},             disp:"教育都市" },
    transport:   { v:[0.55,0.80,0.60], resPref:{funds:0.6, energy:0.5},           disp:"交通都市" },
    governance:  { v:[0.60,0.70,0.70], resPref:{tech:0.4, funds:0.4},             disp:"統治都市" }
  };
  const TYPE_ALIAS = { industryHeavy: "industry" };
  const W = { alpha: 0.5, beta: 0.35, gamma: 0.15, delta: 0.12, zeta: 0.2, hysteresisType: 0.07 };

  // -------- 初期設定 --------
  $("btn-start").addEventListener("click", startGame);
  $("btn-reset").addEventListener("click", initGame);
  document.addEventListener("keydown", e=>{
    if (e.shiftKey && (e.key==='d' || e.key==='D')) runAutoSim100();
  });

  initGame();

  function initGame() {
    currentQuestionIndex = 0;
    status = { env: 50, eco: 50, soc: 50 };
    resources = { energy: 0, food: 0, tech: 0, funds: 50, labor: 0, water: 0, recycled: 0 };
    for (const k in cityTypePoints) cityTypePoints[k] = 0;
    prevTypeKey = "start"; prevLevel = 1; history = [];

    safeSet(cityNameEl, "スタート都市");
    safeSet(cityLevelEl, "Lv.1");
    setPhoto("images/start_city.png", "スタート都市");
    safeSet(qTitle, "SDGs都市経営ゲーム");
    safeSet(qDesc, "スタートボタンを押して開始！");
    choicesEl.innerHTML = "";
    explainBox.classList.add("hidden");
    progressEl.textContent = "";
    updateBarsAndChips();
    updateEvidence(null);
    scrollToTopInstant();
  }

  function startGame() { showQuestion(); }

  // -------- 出題処理 --------
  function showQuestion() {
    const q = cities[currentQuestionIndex];
    if (!q) return endGame();

    safeSet(qTitle, q.title || "無題");
    safeSet(qDesc, q.description || "");
    choicesEl.innerHTML = "";

    q.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.text;

      // ⚙️ 資源不足判定
      let can = true;
      let lacks = [];
      if (choice.resources) {
        for (const rk in choice.resources) {
          const val = choice.resources[rk];
          if (val < 0 && (resources[rk] || 0) < Math.abs(val)) {
            can = false;
            lacks.push(rk);
          }
        }
      }

      if (!can) {
        btn.disabled = true;
        btn.title = lacks.map(k => resourceLabel(k) + "が不足").join("・");
        btn.innerHTML = `${choice.text} <span class="lock-hint">🔒 資源不足</span>`;
      } else {
        btn.onclick = () => selectChoice(choice);
      }
      choicesEl.appendChild(btn);
    });

    progressEl.textContent = `問題 ${currentQuestionIndex + 1}/${cities.length}`;
    explainBox.classList.add("hidden");
  }

  function resourceLabel(k) {
    const map = {
      funds:"💰資金", energy:"⚡エネルギー", food:"🍎食料",
      tech:"🧠技術", water:"💧水", labor:"👷労働力", recycled:"♻️再資源"
    };
    return map[k] || k;
  }
  // -------- 選択処理 --------
  function selectChoice(choice) {
    // 直近の影響を少し重視（指数減衰）
    for (const k in cityTypePoints) cityTypePoints[k] *= 0.985;

    // ステータス反映
    if (choice.effects) {
      for (const k in choice.effects)
        if (status[k] !== undefined)
          status[k] = clamp(status[k] + choice.effects[k], 0, 100);
    }

    // タイプポイント
    if (choice.typePoints) {
      for (const k in choice.typePoints) {
        const key = (TYPE_ALIAS[k] || k).toLowerCase();
        if (cityTypePoints[key] !== undefined)
          cityTypePoints[key] += choice.typePoints[k];
      }
    }

    // 資源
    if (choice.resources) {
      for (const k in choice.resources) {
        resources[k] = (resources[k] || 0) + choice.resources[k];
        if (resources[k] < 0) resources[k] = 0;
      }
    }

    // 履歴追加
    history.push({
      qIndex: currentQuestionIndex + 1,
      choice: choice.text,
      effects: choice.effects,
      resources: { ...resources },
      time: Date.now()
    });

    // 説明＋教育コメント
    explainBox.innerHTML =
      `<b>${choice.label || ""}</b><br>${choice.explanation || "選択を反映しました。"}<br><small>${choice.example || ""}</small>`;
    explainBox.classList.remove("hidden");

    const fb = makeFeedback(status, resources);
    const fbEl = document.createElement("div");
    fbEl.className = "feedback";
    fbEl.innerHTML = fb;
    explainBox.appendChild(fbEl);

    // 都市タイプ更新
    const evalResult = determineCityType();
    applyCityHeader(evalResult);
    updateBarsAndChips();
    updateEvidence(evalResult);

    currentQuestionIndex++;
    setTimeout(() => {
      if (currentQuestionIndex >= cities.length) endGame();
      else showQuestion();
    }, 1000);
  }

  // -------- 教育コメント --------
  function makeFeedback(status, resources) {
    const good = [], bad = [];
    if (status.env > 70) good.push("🌿環境への配慮が行き届いています");
    if (status.eco > 70) good.push("💰経済の成長が安定しています");
    if (status.soc > 70) good.push("🤝社会のつながりが強い都市です");
    if (resources.tech > 10) good.push("🧠技術革新が進んでいます");
    if (resources.recycled > 5) good.push("♻️循環型社会に近づいています");

    if (status.env < 30) bad.push("環境が悪化しています");
    if (status.eco < 30) bad.push("経済が停滞しています");
    if (status.soc < 30) bad.push("社会のつながりが弱まっています");
    if (resources.funds < 10) bad.push("資金が不足しています");
    if (resources.energy < 5) bad.push("エネルギーが不足しています");
    if (resources.food < 5) bad.push("食料供給が不安定です");

    const praise = good.length ? `✨${good.join("、")}。` : "";
    const issue = bad.length ? `⚠️${bad.join("、")}。` : "";
    return `${praise}${issue || "バランスの取れた発展です！"}`;
  }

  // -------- 都市タイプ判定 --------
  function determineCityType() {
    const avgStatus = (status.env + status.eco + status.soc) / 3;
    const lowRes = [
      resources.energy < 3,
      resources.food < 3,
      resources.funds < 10,
      resources.tech < 2,
      resources.water < 3
    ].filter(Boolean).length;

    // 💀 崩壊・荒廃ルート（14.3では自然統合）
    if (avgStatus < 25 && lowRes >= 3) {
      return { key: "collapse", name: "崩壊都市", level: 1, metrics: null };
    }
    if (avgStatus < 35 && lowRes >= 2) {
      return { key: "wasteland", name: "荒廃都市", level: 1, metrics: null };
    }

    // 🌿 再生優遇ルート
    if (status.env > 70 && resources.food > 15) {
      cityTypePoints.agriculture += 1.2;
      cityTypePoints.eco += 1.0;
    }

    const S = norm3([status.env / 100, status.eco / 100, status.soc / 100]);

    const conflict = (() => {
      let c = 0;
      if (resources.funds > 60 && status.env < 30) c += 0.1;
      if (resources.energy > 25 && status.soc < 30) c += 0.08;
      if (resources.tech > 15 && status.soc < 30) c += 0.08;
      return c;
    })();

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

    const maxTP = Math.max(1, ...Object.values(cityTypePoints));
    const synergyOf = (key) => (cityTypePoints[key] || 0) / maxTP;

    let best = { key: "eco", name: "エコ都市", score: -Infinity, parts: null };
    const ranking = [];

    for (const key in ARCHETYPES) {
      const arch = ARCHETYPES[key];
      const A = norm3(arch.v);
      const cos = cosine(S, A);

      // 資源整合度
      let resAff = 0;
      const keys = Object.keys(arch.resPref);
      for (const rk of keys) {
        const prefW = arch.resPref[rk];
        const val = clamp((resources[rk] || 0) / 100, 0, 1);
        resAff += prefW * val;
      }
      resAff /= (keys.length || 1);

      const syn = synergyOf(key);
      const hystType = prevTypeKey === key ? 1 : 0;

      const score =
        cos * W.alpha + resAff * W.beta + syn * W.gamma
        - conflict * W.delta - risk * W.zeta
        + hystType * W.hysteresisType;

      ranking.push({ key, name: arch.disp, score, cos, resAff, syn });
      if (score > best.score)
        best = { key, name: arch.disp, score, parts: { cos, resAff, syn, conflict, risk } };
    }

    ranking.sort((a, b) => b.score - a.score);
    // -------- レベル計算 --------
    const devIdx = clamp((status.env + status.eco + status.soc) / 300, 0, 1);
    const resIdx = clamp((
      norm01(resources.energy, 0, 30) * 0.25 +
      norm01(resources.tech, 0, 20) * 0.20 +
      norm01(resources.funds, 0, 80) * 0.30 +
      norm01(resources.food, 0, 30) * 0.15 +
      norm01(resources.recycled, 0, 15) * 0.10
    ), 0, 1);

    const scoreForLv = devIdx * 0.6 + resIdx * 0.4;
    let rawLevel = 1;
    if (scoreForLv >= 0.75) rawLevel = 3;
    else if (scoreForLv >= 0.45) rawLevel = 2;

    return {
      key: best.key,
      name: best.name,
      level: rawLevel,
      metrics: { best, ranking, devIdx, resIdx, scoreForLv }
    };
  }

  // -------- UI更新 --------
  function applyCityHeader(city) {
    const typeChanged = city.key !== prevTypeKey && prevTypeKey !== "start";
    const levelUp = city.level > prevLevel;

    setPhotoSafely(city.key, city.level);
    safeSet(cityNameEl, city.name);
    safeSet(cityLevelEl, `Lv.${city.level}`);
    document.body.dataset.cityType = city.key;

    // ✅ 14.3: 都市 or Lv変化時のみスクロール
    if (typeChanged || levelUp) scrollToTopSmooth();

    if (typeChanged) showCityChange(city.name);
    if (levelUp) {
      showLevelUp();
      showNarrativeToast(city.key, city.level);
    }

    prevTypeKey = city.key;
    prevLevel = city.level;
  }

  function updateBarsAndChips() {
    bars.env.style.width = `${status.env}%`;
    bars.eco.style.width = `${status.eco}%`;
    bars.soc.style.width = `${status.soc}%`;
    for (const k in chips)
      if (chips[k]) chips[k].textContent = resources[k];
  }

  // -------- 評価内訳＋AIコメント --------
  function updateEvidence(result) {
    if (!evidenceEl) return;
    if (!result) {
      evidenceEl.innerHTML = `<span class="tag">まだ判定はありません</span>`;
      return;
    }
    if (!result.metrics) {
      evidenceEl.innerHTML = `<span class="tag">特別ルート：「${result.name}」</span>`;
      return;
    }

    const { best, ranking } = result.metrics;
    const top3 = ranking.slice(0, 3).map(r =>
      `• ${r.name} … ${(r.score).toFixed(2)}`
    ).join("<br>");

    const feedback = makeFeedback(status, resources);
    evidenceEl.innerHTML = `
      <div class="kv">
        <b>選択タイプ：</b>${result.name}　<b>Lv.${result.level}</b>
      </div>
      <div style="margin-top:6px">
        類似度:${best.parts.cos.toFixed(2)}　
        資源整合:${best.parts.resAff.toFixed(2)}　
        シナジー:${best.parts.syn.toFixed(2)}　
        リスク:${best.parts.risk.toFixed(2)}
      </div>
      <div style="margin-top:6px"><b>上位候補</b><br>${top3}</div>
      <div class="ai-feedback" style="margin-top:10px">${feedback}</div>
    `;
  }

  // -------- 画像・演出 --------
  function setPhoto(src, caption) {
    photoEl.src = src;
    captionEl.textContent = caption || "";
  }

  function setPhotoSafely(type, lv) {
    const path =
      type === "collapse" ? "images/collapse.png" :
      type === "wasteland" ? "images/wasteland.png" :
      `images/${type}_lv${lv}.png`;
    setPhoto(path, ARCHETYPES[type]?.disp || "");
  }

  function scrollToTopSmooth() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function scrollToTopInstant() { window.scrollTo(0, 0); }

  function showLevelUp() {
    const el = document.createElement("div");
    el.className = "level-up";
    el.textContent = "LEVEL UP!";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }

  function showCityChange(name) {
    const el = document.createElement("div");
    el.className = "city-change";
    el.textContent = `都市タイプが ${name} に変化！`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  function showNarrativeToast(typeKey, lv) {
    const el = document.createElement("div");
    el.className = "city-change";
    el.style.borderColor = "#2196f3";
    el.textContent = `${ARCHETYPES[typeKey]?.disp || ""} Lv.${lv} に到達`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }
  // -------- ゲーム終了 --------
  function endGame() {
    const final = determineCityType();
    applyCityHeader(final);
    updateBarsAndChips();
    updateEvidence(final);

    safeSet(qTitle, "🏁 ゲーム終了");
    safeSet(qDesc, `あなたの都市は「${final.name}」Lv.${final.level} に発展しました！`);
    choicesEl.innerHTML = "";

    // 🌈 エンディングコメント（褒め＋課題＋物語＋データ振り返り）
    const fb = makeFeedback(status, resources);
    const summary = document.createElement("div");
    summary.className = "ending-feedback";
    summary.innerHTML = `
      <h3>🌆 都市の振り返り</h3>
      <p>${fb}</p>
      <p>あなたの選択履歴をもとに分析した結果：</p>
      <ul style="text-align:left;margin:8px auto;width:90%;">
        <li>🌿 環境スコア平均：${status.env.toFixed(1)}</li>
        <li>💰 経済スコア平均：${status.eco.toFixed(1)}</li>
        <li>🤝 社会スコア平均：${status.soc.toFixed(1)}</li>
        <li>⚡ エネルギー：${resources.energy}　🍎 食料：${resources.food}　💰 資金：${resources.funds}</li>
      </ul>
      <p>💬 <b>物語</b><br>
      あなたの都市は、${final.name} としてひとつの形に到達しました。<br>
      ${final.key === "collapse"
        ? "資源とバランスを失い、都市は崩壊しました。しかし次に挑戦すれば、再生の道が開けるでしょう。"
        : final.key === "wasteland"
          ? "資源不足と政策の不均衡により、都市は荒廃しました。<br>失敗もまた学びです。次はより良い選択を。"
          : "市民と自然、経済が共に発展する街を築きました。"}
      </p>
      <p>✨ 次はどんな未来を目指しますか？</p>
      <button id="btn-retry" style="margin-top:12px;padding:8px 14px;">もう一度挑戦する</button>
    `;
    choicesEl.appendChild(summary);

    const retry = document.getElementById("btn-retry");
    if (retry) retry.onclick = initGame;

    progressEl.textContent = "おつかれさま！";
  }

  // -------- Utils --------
  function safeSet(el, text) { if (el) el.textContent = text; }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function norm3(v) { const n = Math.hypot(...v) || 1; return v.map(x => x / n); }
  function cosine(a, b) { return clamp(a[0]*b[0]+a[1]*b[1]+a[2]*b[2],0,1); }
  function norm01(x, lo, hi) { if (hi <= lo) return 0; return clamp((x - lo)/(hi - lo), 0, 1); }

  // -------- デバッグ自動シミュ --------
  function runAutoSim100() {
    const N = 100;
    const lvCount = { 1: 0, 2: 0, 3: 0 };
    const typeCount = {};
    for (let i = 0; i < N; i++) {
      const st = { ...status }, rs = { ...resources }, tp = { ...cityTypePoints };
      for (let r = 0; r < 20; r++) {
        const q = cities[r];
        const ch = q.choices[Math.floor(Math.random() * q.choices.length)];
        if (ch.effects) for (const k in ch.effects)
          if (st[k] !== undefined) st[k] = clamp(st[k] + ch.effects[k], 0, 100);
        if (ch.resources) for (const k in ch.resources)
          rs[k] = Math.max(0, (rs[k] || 0) + ch.resources[k]);
        if (ch.typePoints) for (const k in ch.typePoints)
          tp[k] = (tp[k] || 0) + ch.typePoints[k];
      }
      status = st; resources = rs; cityTypePoints = tp;
      const res = determineCityType();
      lvCount[res.level] = (lvCount[res.level] || 0) + 1;
      typeCount[res.name] = (typeCount[res.name] || 0) + 1;
    }
    console.log("=== AutoSim100 ===");
    console.log(`Lv1:${(lvCount[1]/N*100).toFixed(1)}% Lv2:${(lvCount[2]/N*100).toFixed(1)}% Lv3:${(lvCount[3]/N*100).toFixed(1)}%`);
    const top = Object.entries(typeCount).sort((a,b)=>b[1]-a[1]).slice(0,5);
    console.log("Top:", top.map(([k,v])=>`${k}:${v}`).join(", "));
  }

})();
