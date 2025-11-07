// ===========================
// SDGs City Manager Ver.11.2
//  - urbanナーフ & バランス再調整
//  - 都市変化/レベルアップ時は自動で最上部へスクロール
//  - 判定関数は状態を更新しない（UI側で演出→最後に状態更新）
//  - 画像は中央カードPNG（start_city.pngから開始）
//  - 崩壊ルートは低スコア時のみ出題
//  - evidenceに内訳表示
// ===========================

(function(){
  // --------- State ----------
  let currentQuestionIndex = 0;

  let status = { env:50, eco:50, soc:50 }; // 0..100
  let resources = { energy:0, food:0, tech:0, funds:50, labor:0, water:0, recycled:0 };
  let cityTypePoints = {
    eco:0, industry:0, social:0, smart:0, science:0,
    culture:0, tourism:0, agriculture:0, urban:0, infra:0,
    housing:0, education:0, transport:0, industryHeavy:0, welfare:0
  };

  // ヒステリシス用（UI側で更新する）
  let prevTypeKey = "start";
  let prevLevel   = 1;

  // DOM helpers
  const $ = id => document.getElementById(id);
  const cityNameEl = $("city-name");
  const cityLevelEl = $("city-level");
  const photoEl = $("city-photo");
  const captionEl = $("city-caption");
  const explainBox = $("explainBox");
  const progressEl = $("progress");
  const choicesEl = $("choices");
  const qTitle = $("question-title");
  const qDesc  = $("question-desc");
  const evidenceEl = $("evidence");

  const bars = { env:$("bar-env"), eco:$("bar-eco"), soc:$("bar-soc") };
  const chips = {
    energy:$("res-energy"), food:$("res-food"), tech:$("res-tech"),
    funds:$("res-funds"), water:$("res-water"), labor:$("res-labor"), recycled:$("res-recycled")
  };

  if (typeof cities === "undefined") {
    alert("data.js が読み込まれていません。");
    return;
  }

  // --------- Archetypes (ナーフ適用) ----------
  const ARCHETYPES = {
    eco:         { v:[0.95,0.25,0.55], resPref:{recycled:1, energy:0.5, water:0.5}, disp:"エコ都市" },
    industry:    { v:[0.25,0.95,0.40], resPref:{funds:1, labor:0.7, energy:0.5},  disp:"産業都市" },
    social:      { v:[0.40,0.35,0.95], resPref:{labor:0.6, water:0.4},           disp:"共生都市" },
    smart:       { v:[0.55,0.85,0.55], resPref:{tech:1, energy:0.6, funds:0.5},   disp:"スマート都市" },
    science:     { v:[0.55,0.90,0.55], resPref:{tech:1, funds:0.6},               disp:"科学都市" },
    culture:     { v:[0.65,0.50,0.80], resPref:{funds:0.4},                       disp:"文化都市" },
    tourism:     { v:[0.55,0.75,0.65], resPref:{funds:0.5, water:0.4},            disp:"観光都市" },
    agriculture: { v:[0.85,0.45,0.50], resPref:{food:1, water:0.6},               disp:"農業都市" },
    urban:       { v:[0.45,0.70,0.55], resPref:{funds:0.5},                        disp:"都市再生都市" }, // ←ナーフ
    infra:       { v:[0.40,0.85,0.55], resPref:{funds:0.9, energy:0.5},           disp:"インフラ都市" },
    housing:     { v:[0.55,0.55,0.85], resPref:{funds:0.5, labor:0.4},            disp:"住宅都市" },
    education:   { v:[0.55,0.65,0.80], resPref:{tech:0.7, funds:0.4},             disp:"教育都市" },
    transport:   { v:[0.55,0.80,0.60], resPref:{funds:0.6, energy:0.5},           disp:"交通都市" }
  };
  const TYPE_ALIAS = { industryHeavy:"industry" };

  // 重み（バランス再調整）
  const W = {
    alpha: 0.50,  // 類似度やや弱め
    beta:  0.35,  // 資源整合を強化
    gamma: 0.15,  // シナジー
    delta: 0.12,  // コンフリクト
    zeta:  0.20,  // リスク
    hysteresisType: 0.07,
    hysteresisLv:   0.05
  };

  // ---------- Init ----------
  $("btn-start").addEventListener("click", startGame);
  $("btn-reset").addEventListener("click", initGame);
  initGame();

  function initGame(){
    currentQuestionIndex = 0;
    status = { env:50, eco:50, soc:50 };
    resources = { energy:0, food:0, tech:0, funds:50, labor:0, water:0, recycled:0 };
    for (const k in cityTypePoints) cityTypePoints[k]=0;
    prevTypeKey="start"; prevLevel=1;

    // ヘッダー
    safeSet(cityNameEl, "スタート都市");
    safeSet(cityLevelEl, "Lv.1");
    document.body.dataset.cityType = "start";

    // 画像（スタート）
    setPhoto("images/start_city.png", "スタート都市");

    safeSet(qTitle, "SDGs都市経営ゲーム");
    safeSet(qDesc, "スタートボタンを押して開始！");
    choicesEl.innerHTML = "";
    explainBox.classList.add("hidden");
    progressEl.textContent = "";

    updateBarsAndChips();
    updateEvidence(null);
  }

  function startGame(){
    showQuestion();
  }

  // ---------- Question ----------
  function showQuestion(){
    if (isCollapseSlot()) {
      // 低スコアでないなら終了
      if (!isLowScoreForCollapse()) return endGame();
    }

    const q = cities[currentQuestionIndex];
    if (!q){ return endGame(); }

    safeSet(qTitle, q.title || "無題");
    safeSet(qDesc,  q.description || "");
    choicesEl.innerHTML = "";

    q.choices.forEach(choice=>{
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.text;

      // コスト要件（負値）チェック：不足ならdisable
      let can = true;
      if (choice.resources){
        for (const rk in choice.resources){
          const val = choice.resources[rk];
          if (val < 0 && (resources[rk]||0) < Math.abs(val)){
            can = false;
            btn.title = `${rk} が不足しています`;
          }
        }
      }
      if (!can){ btn.disabled = true; }

      btn.onclick = ()=>selectChoice(choice);
      choicesEl.appendChild(btn);
    });

    const totalPlayable = cities.length - 1; // 最後は崩壊候補
    progressEl.textContent = isCollapseSlot()
      ? `特別問題（崩壊ルート）`
      : `問題 ${currentQuestionIndex+1}/${totalPlayable}`;
    explainBox.classList.add("hidden");
  }

  function selectChoice(choice){
    // 🔻 過去の偏りを弱める（正則化）
    for (const k in cityTypePoints) cityTypePoints[k] *= 0.98;

    // effects
    if (choice.effects){
      for (const k in choice.effects){
        if (status[k]!==undefined){
          status[k] = clamp(status[k] + choice.effects[k], 0, 100);
        }
      }
    }
    // typePoints
    if (choice.typePoints){
      for (const k in choice.typePoints){
        const key=(TYPE_ALIAS[k]||k).toLowerCase();
        if (cityTypePoints[key]!==undefined){
          cityTypePoints[key] += choice.typePoints[k];
        }
      }
    }
    // resources
    if (choice.resources){
      for (const k in choice.resources){
        resources[k] = (resources[k]||0) + choice.resources[k];
        if (resources[k] < 0) resources[k]=0;
      }
    }
    // bonusResources
    if (choice.bonusResources){
      for (const k in choice.bonusResources){
        const b = choice.bonusResources[k];
        if ((resources[k]||0) >= b.threshold){
          if (b.typePoints){
            for (const t in b.typePoints){
              const key=(TYPE_ALIAS[t]||t).toLowerCase();
              if (cityTypePoints[key]!==undefined) cityTypePoints[key]+=b.typePoints[t];
            }
          }
          if (b.effects){
            for (const e in b.effects){
              if (status[e]!==undefined) status[e]=clamp(status[e]+b.effects[e],0,100);
            }
          }
        }
      }
    }

    // 説明
    explainBox.innerHTML =
      `<b>${choice.label||""}</b><br>${choice.explanation||"選択を反映しました。"}<br><small>${choice.example||""}</small>`;
    explainBox.classList.remove("hidden");

    // 都市状態（※ここでは prev を更新しない）
    const evalResult = determineCityType(); // {key,name,level,metrics}

    // ヘッダー＆写真＆演出（ここで初めて prev と比較→更新）
    applyCityHeader(evalResult);

    // 数値UI
    updateBarsAndChips();
    updateEvidence(evalResult);

    // 次へ
    currentQuestionIndex++;
    setTimeout(()=>{
      if (currentQuestionIndex >= cities.length) endGame();
      else showQuestion();
    }, 900);
  }

  // ---------- Collapse slot helpers ----------
  function isCollapseSlot(){
    return currentQuestionIndex === (cities.length - 1);
  }
  function isLowScoreForCollapse(){
    const avg = (status.env + status.eco + status.soc)/3;
    const lowResCount = [
      resources.energy < 3,
      resources.food   < 3,
      resources.funds  < 10,
      resources.tech   < 2,
      resources.water  < 3
    ].filter(Boolean).length;
    return (avg < 35 && lowResCount >= 2) || (avg < 25 && lowResCount >= 1);
  }

  // ---------- Determine City (AI判定) ----------
  function determineCityType(){
    // 制約（崩壊／荒廃）
    const avgStatus = (status.env + status.eco + status.soc) / 3;
    const criticalRes = [
      resources.energy < 3,
      resources.food   < 3,
      resources.funds  < 5,
      resources.tech   < 2,
      resources.water  < 3
    ].filter(Boolean).length;

    if (avgStatus < 25 && criticalRes >= 3){
      return { key:"collapse", name:"崩壊都市", level:1, metrics:null };
    }
    if (avgStatus < 35 && criticalRes >= 2){
      return { key:"wasteland", name:"荒廃都市", level:1, metrics:null };
    }

    // 類似度計算（S vs 各 archetype.v）
    const S = norm3([status.env/100, status.eco/100, status.soc/100]);

    // 競合/リスク
    const conflict = (() => {
      let c=0;
      if (resources.funds  > 60 && status.env < 30) c += 0.10;
      if (resources.energy > 25 && status.soc < 30) c += 0.08;
      if (resources.tech   > 15 && status.soc < 30) c += 0.08;
      return c;
    })();
    const risk = (() => {
      let r=0;
      const low = [
        resources.energy < 5,
        resources.food   < 5,
        resources.funds  < 10,
        resources.water  < 5
      ].filter(Boolean).length;
      r += low * 0.06;
      if (status.env < 25) r += 0.06;
      if (status.soc < 25) r += 0.06;
      return r;
    })();

    // synergy from points
    const maxTP = Math.max(1, ...Object.keys(ARCHETYPES).map(k => cityTypePoints[k]||0));
    const synergyOf = (key)=> (cityTypePoints[key]||0) / maxTP;

    // 崩壊寄りのときは urban を候補から除外（ナーフ補助）
    const nearCollapse = avgStatus < 40 && (resources.funds < 20 || resources.energy < 5);

    let best = { key:"eco", name:"エコ都市", score:-Infinity, parts:null };
    const ranking = [];

    for (const key of Object.keys(ARCHETYPES)){
      if (nearCollapse && key === "urban") continue;

      const arch = ARCHETYPES[key];
      const A = norm3(arch.v);
      const cos = cosine(S,A); // 0..1

      // 資源嗜好一致
      let resAff = 0;
      const keys = Object.keys(arch.resPref);
      for (const rk of keys){
        const prefW = arch.resPref[rk];
        const val = clamp((resources[rk]||0)/100, 0, 1);
        resAff += prefW * val;
      }
      resAff /= (keys.length || 1);

      const syn = synergyOf(key);
      const hystType = (prevTypeKey && prevTypeKey === key) ? 1 : 0;
      const hystLv   = 0;

      const score =
        cos*W.alpha + resAff*W.beta + syn*W.gamma
        - conflict*W.delta - risk*W.zeta
        + hystType*W.hysteresisType + hystLv*W.hysteresisLv;

      ranking.push({key, name:arch.disp, score, cos, resAff, syn});
      if (score > best.score){
        best = { key, name:arch.disp, score, parts:{ cos, resAff, syn, conflict, risk } };
      }
    }
    ranking.sort((a,b)=>b.score-a.score);

    // レベル決定（総合＋資源）
    const devIdx = clamp((status.env + status.eco + status.soc)/300, 0, 1);
    const resIdx = clamp((
      norm01(resources.energy,   0, 30)*0.25 +
      norm01(resources.tech,     0, 20)*0.20 +
      norm01(resources.funds,    0, 80)*0.30 +
      norm01(resources.food,     0, 30)*0.15 +
      norm01(resources.recycled, 0, 15)*0.10
    ), 0, 1);
    let rawLevel = Math.round(clamp((devIdx*0.65 + resIdx*0.35)*2 + 1, 1, 3));

    // ここでは prev を更新しない（UI側で演出を出すため）
    return {
      key: best.key,
      name: ARCHETYPES[best.key].disp,
      level: rawLevel,
      metrics: { best, ranking }
    };
  }

  // ---------- UI helpers ----------
  function applyCityHeader(city){
    // タイプ／レベルの変化検出（今のprevと比較）
    const typeChanged  = city.key   !== prevTypeKey && prevTypeKey !== "start";
    const levelUpgraded = city.level >  prevLevel;

    // 画像切替（ここで初めて実行）
    setPhotoSafely(city.key, city.level);

    // テキスト更新
    safeSet(cityNameEl, city.name);
    safeSet(cityLevelEl, `Lv.${city.level}`);
    document.body.dataset.cityType = city.key;

    // 演出
    if (typeChanged) showCityChange(city.name);
    if (levelUpgraded) showLevelUp();

    // 変化を見せるために自動スクロール
    scrollToTopSmooth();

    // ⬅️ 最後に prev を更新（ここが重要！）
    prevTypeKey = city.key;
    prevLevel   = city.level;
  }

  function updateBarsAndChips(){
    if (bars.env) bars.env.style.width = `${status.env}%`;
    if (bars.eco) bars.eco.style.width = `${status.eco}%`;
    if (bars.soc) bars.soc.style.width = `${status.soc}%`;

    if (chips.energy)   chips.energy.textContent   = resources.energy;
    if (chips.food)     chips.food.textContent     = resources.food;
    if (chips.tech)     chips.tech.textContent     = resources.tech;
    if (chips.funds)    chips.funds.textContent    = resources.funds;
    if (chips.water)    chips.water.textContent    = resources.water;
    if (chips.labor)    chips.labor.textContent    = resources.labor;
    if (chips.recycled) chips.recycled.textContent = resources.recycled;
  }

  function updateEvidence(result){
    if (!evidenceEl) return;
    if (!result){
      evidenceEl.innerHTML = `<span class="tag">まだ判定はありません</span>`;
      return;
    }
    if (!result.metrics || !result.metrics.best){
      evidenceEl.innerHTML = `<span class="tag">制約により「${result.name}」が選択されています</span>`;
      return;
    }
    const { best, ranking } = result.metrics;
    const top3 = ranking.slice(0,3).map(r=>
      `• ${r.name} … 総合 ${(r.score).toFixed(2)}（類似 ${(r.cos).toFixed(2)} / 資源 ${(r.resAff).toFixed(2)} / シナジー ${(r.syn).toFixed(2)}）`
    ).join("<br>");

    const strengths = [];
    if (resources.energy>=20) strengths.push("エネルギー豊富");
    if (resources.food>=20) strengths.push("食料自給");
    if (resources.tech>=12) strengths.push("高度技術");
    if (resources.funds>=60) strengths.push("資金潤沢");
    if (resources.recycled>=10) strengths.push("循環率高");

    const weaknesses = [];
    if (resources.funds<10) weaknesses.push("資金不足");
    if (status.env<30) weaknesses.push("環境悪化");
    if (status.eco<30) weaknesses.push("経済停滞");
    if (status.soc<30) weaknesses.push("社会不安");
    if (resources.energy<5) weaknesses.push("電力不足");
    if (resources.food<5) weaknesses.push("食料不足");

    evidenceEl.innerHTML = `
      <div class="kv">
        <span class="tag">選択タイプ：<b>${result.name}</b></span>
        <span class="tag">レベル：<b>${result.level}</b></span>
      </div>
      <div style="margin-top:6px">
        <b>根拠（スコア内訳）</b><br>
        ・類似度: ${best.parts.cos.toFixed(2)}　
        ・資源整合: ${best.parts.resAff.toFixed(2)}　
        ・シナジー: ${best.parts.syn.toFixed(2)}　
        ・コンフリクト: ${best.parts.conflict.toFixed(2)}　
        ・リスク: ${best.parts.risk.toFixed(2)}
      </div>
      <div style="margin-top:6px">
        <b>候補ランキング</b><br>${top3}
      </div>
      <div style="margin-top:6px">
        <b>強み</b>：${strengths.join("、")||"なし"}　
        <b>弱み</b>：${weaknesses.join("、")||"なし"}
      </div>
    `;
  }

  // ---------- Image & Scroll helpers ----------
  function setPhoto(src, caption){
    if (!photoEl) return;
    photoEl.onerror = null;
    photoEl.src = src;
    if (captionEl) captionEl.textContent = caption || "";
  }
  function setPhotoSafely(typeOrKey, level){
    // typeOrKey: "collapse" / "wasteland" / "<type>"
    let path = "";
    if (typeOrKey==="collapse") path = "images/collapse.png";
    else if (typeOrKey==="wasteland") path = "images/wasteland.png";
    else path = `images/${typeOrKey}_lv${level}.png`;

    if (photoEl){
      photoEl.onerror = ()=> setPhoto("images/start_city.png","（画像が見つからないためスタート画像を表示）");
    }
    setPhoto(path, "");
  }
  function scrollToTopSmooth(){
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------- Effects ----------
  function showLevelUp(){
    const el = document.createElement("div");
    el.className = "level-up";
    el.textContent = "LEVEL UP!";
    document.body.appendChild(el);
    setTimeout(()=>el.remove(), 1600);
  }
  function showCityChange(name){
    const el = document.createElement("div");
    el.className = "city-change";
    el.textContent = `都市タイプが ${name} に変化！`;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(), 2200);
  }

  // ---------- End ----------
  function endGame(){
    const final = determineCityType(); // 最終確定（ここでもprevを更新しない）
    applyCityHeader(final);            // ここで初めてprev更新
    updateBarsAndChips();
    updateEvidence(final);

    safeSet(qTitle, "🏁 ゲーム終了");
    safeSet(qDesc, `あなたの都市は「${final.name}」Lv.${final.level} に発展しました！`);
    choicesEl.innerHTML = "";
    progressEl.textContent = "おつかれさま！";
  }

  // ---------- Utils ----------
  function safeSet(el, text){
    if (el) el.textContent = text;
  }
  function clamp(v,min,max){ return Math.max(min, Math.min(max,v)); }
  function norm3(v){ const n = Math.hypot(v[0],v[1],v[2])||1; return [v[0]/n, v[1]/n, v[2]/n]; }
  function cosine(a,b){ return clamp(a[0]*b[0]+a[1]*b[1]+a[2]*b[2], 0, 1); }
  function norm01(x,lo,hi){ if (hi<=lo) return 0; return clamp((x-lo)/(hi-lo), 0, 1); }

})();

