// ===========================
// SDGs City Manager Ver.14.5（安定版）
//  - data.jsはそのまま使用
//  - 資源不足でも実行可（柔軟実行）
//  - 不足に応じた自動ペナルティ（環境悪化・赤字拡大など）
//  - 📘ヘルプ説明を起動時に表示
//  - Scroll: 都市タイプ or Lv変化時のみスクロール
// ===========================

(function () {
  // --------- State ----------
  let currentQuestionIndex = 0;
  let status = { env: 50, eco: 50, soc: 50 };
  let resources = { energy: 0, food: 0, tech: 0, funds: 100, labor: 0, water: 0, recycled: 0 };

  const cityTypePoints = {
    eco: 0, industry: 0, social: 0, smart: 0, science: 0,
    culture: 0, tourism: 0, agriculture: 0, urban: 0, infra: 0,
    housing: 0, education: 0, transport: 0, industryHeavy: 0,
    welfare: 0, governance: 0
  };

  let prevTypeKey = "start";
  let prevLevel = 1;
  let history = [];

  // --------- DOM ----------
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

  // -------- Archetype --------
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

  // -------- リスク定義 --------
  const RISK_RULES = {
    funds:     { env: -0.0, eco: -0.4, soc: -0.6, fundsDebtFactor: 1.0 },
    energy:    { env: -0.3, eco: -0.4, soc: -0.2 },
    food:      { env: -0.1, eco: -0.2, soc: -0.6 },
    tech:      { env: -0.0, eco: -0.5, soc: -0.2 },
    water:     { env: -0.4, eco: -0.1, soc: -0.6 },
    labor:     { env: -0.0, eco: -0.6, soc: -0.2 },
    recycled:  { env: -0.5, eco: -0.1, soc: -0.1 }
  };
  const RISK_CAP = { env: -12, eco: -12, soc: -12 };

  // -------- 初期化 --------
  $("btn-start").addEventListener("click", startGame);
  $("btn-reset").addEventListener("click", initGame);

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
    showHelpNoteOnce();
  }

  function startGame() { showQuestion(); }

  // -------- 出題 --------
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
      const lacks = listLacks(choice);
      if (lacks.length) btn.title = lacks.map(k => resourceLabel(k) + "が不足").join("・");
      btn.onclick = () => selectChoice(choice);
      choicesEl.appendChild(btn);
    });

    progressEl.textContent = `問題 ${currentQuestionIndex + 1}/${cities.length}`;
    explainBox.classList.add("hidden");
  }

  function listLacks(choice) {
    const lacks = [];
    if (choice.resources) {
      for (const rk in choice.resources) {
        const v = choice.resources[rk];
        if (v < 0 && (resources[rk] || 0) < Math.abs(v)) lacks.push(rk);
      }
    }
    return lacks;
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
    const beforeRes = { ...resources };
    for (const k in cityTypePoints) cityTypePoints[k] *= 0.985;

    if (choice.effects)
      for (const k in choice.effects)
        if (status[k] !== undefined)
          status[k] = clamp(status[k] + choice.effects[k], 0, 100);

    if (choice.typePoints)
      for (const k in choice.typePoints) {
        const key = (TYPE_ALIAS[k] || k).toLowerCase();
        if (cityTypePoints[key] !== undefined)
          cityTypePoints[key] += choice.typePoints[k];
      }

    if (choice.resources)
      for (const k in choice.resources) {
        const delta = choice.resources[k];
        if (k === "funds") resources[k] = (resources[k] || 0) + delta;
        else resources[k] = Math.max(0, (resources[k] || 0) + delta);
      }

    const lacksDetail = computeLacksDetailUsingSnapshot(choice, beforeRes);
    let riskReport = [];
    if (lacksDetail.totalShort > 0) {
      const applied = applyRiskPenalties(lacksDetail);
      if (applied.any) riskReport = buildRiskReport(applied);
    }

    history.push({
      qIndex: currentQuestionIndex + 1,
      choice: choice.text,
      effects: choice.effects || {},
      resources: { ...resources },
      riskNote: riskReport.join(" / "),
      time: Date.now()
    });

    explainBox.innerHTML = `<b>${choice.label || ""}</b><br>${choice.explanation || "選択を反映しました。"}<br><small>${choice.example || ""}</small>`;
    explainBox.classList.remove("hidden");

    if (riskReport.length) {
      const warn = document.createElement("div");
      warn.style.marginTop = "8px";
      warn.style.padding = "8px 10px";
      warn.style.borderLeft = "4px solid #e53935";
      warn.style.background = "#fff3f2";
      warn.innerHTML = `⚠️ <b>リスク発生</b>：<br>${riskReport.join("<br>")}`;
      explainBox.appendChild(warn);
    }

    const fbEl = document.createElement("div");
    fbEl.className = "feedback";
    fbEl.innerHTML = makeFeedback(status, resources);
    explainBox.appendChild(fbEl);

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

  function computeLacksDetailUsingSnapshot(choice, beforeRes) {
    const lacks = [];
    let totalShort = 0;
    if (!choice.resources) return { lacks, totalShort };
    for (const rk in choice.resources) {
      const delta = choice.resources[rk];
      if (delta < 0) {
        const req = Math.abs(delta);
        const have = Math.max(0, beforeRes[rk] || 0);
        const short = Math.max(0, req - have);
        if (short > 0) {
          lacks.push({ key: rk, short });
          totalShort += short;
        }
      }
    }
    return { lacks, totalShort };
  }

  function applyRiskPenalties(lacksDetail) {
    let dEnv = 0, dEco = 0, dSoc = 0, debtAdded = 0;
    for (const item of lacksDetail.lacks) {
      const rule = RISK_RULES[item.key];
      if (!rule) continue;
      const s = item.short;
      dEnv += (rule.env || 0) * s;
      dEco += (rule.eco || 0) * s;
      dSoc += (rule.soc || 0) * s;
      if (rule.fundsDebtFactor) debtAdded += rule.fundsDebtFactor * s;
    }
    dEnv = Math.max(RISK_CAP.env, dEnv);
    dEco = Math.max(RISK_CAP.eco, dEco);
    dSoc = Math.max(RISK_CAP.soc, dSoc);
    status.env = clamp(status.env + dEnv, 0, 100);
    status.eco = clamp(status.eco + dEco, 0, 100);
    status.soc = clamp(status.soc + dSoc, 0, 100);
    if (debtAdded > 0) resources.funds -= Math.round(debtAdded);
    return { any:(dEnv||dEco||dSoc||debtAdded), dEnv,dEco,dSoc,debtAdded,lacks:lacksDetail.lacks };
  }

  function buildRiskReport(applied) {
    const lines = [];
    if (applied.lacks.length)
      lines.push("不足：" + applied.lacks.map(x => `${resourceLabel(x.key)}(${x.short})`).join("・"));
    const parts = [];
    if (applied.dEnv) parts.push(`🌿環境${applied.dEnv}`);
    if (applied.dEco) parts.push(`💰経済${applied.dEco}`);
    if (applied.dSoc) parts.push(`🤝社会${applied.dSoc}`);
    if (parts.length) lines.push("指標悪化：" + parts.join(" / "));
    if (applied.debtAdded) lines.push(`赤字拡大：💰${-applied.debtAdded}`);
    return lines;
  }

  // -------- フィードバック --------
  function makeFeedback(status, resources) {
    const good = [], bad = [];
    if (status.env > 70) good.push("🌿環境への配慮が行き届いています");
    if (status.eco > 70) good.push("💰経済の成長が安定しています");
    if (status.soc > 70) good.push("🤝社会のつながりが強い都市です");
    if (resources.tech > 10) good.push("🧠技術革新が進んでいます");
    if (resources.recycled > 5) good.push("♻️循環型社会に近づいています");
    if (status.env < 30) bad.push("環境が悪化しています");
    if (status.eco < 30) bad.push("経済が停滞しています");
    if (status.soc < 30) bad.push("社会が不安定です");
    if (resources.funds < 10) bad.push("資金が不足しています");
    const praise = good.length ? `✨${good.join("、")}。` : "";
    const issue = bad.length ? `⚠️${bad.join("、")}。` : "";
    return `${praise}${issue || "バランスの取れた発展です！"}`;
  }

  // -------- 都市タイプ判定 --------
  function determineCityType() {
    const avgStatus = (status.env + status.eco + status.soc) / 3;
    const lowRes = [resources.energy<3,resources.food<3,resources.funds<10,resources.tech<2,resources.water<3].filter(Boolean).length;
    if (avgStatus<25 && lowRes>=3) return { key:"collapse", name:"崩壊都市", level:1, metrics:null };
    if (avgStatus<35 && lowRes>=2) return { key:"wasteland", name:"荒廃都市", level:1, metrics:null };

    if (status.env>70 && resources.food>15) { cityTypePoints.agriculture+=1.2; cityTypePoints.eco+=1.0; }

    const S = norm3([status.env/100,status.eco/100,status.soc/100]);
    const conflict = (()=>{let c=0;if(resources.funds>60&&status.env<30)c+=0.1;if(resources.energy>25&&status.soc<30)c+=0.08;return c;})();
    const risk = (()=>{let r=0;const low=[resources.energy<5,resources.food<5,resources.funds<10,resources.water<5].filter(Boolean).length;r+=low*0.06;if(status.env<25)r+=0.06;if(status.soc<25)r+=0.06;return r;})();
    const maxTP=Math.max(1,...Object.values(cityTypePoints));const synergyOf=(k)=>(cityTypePoints[k]||0)/maxTP;

    let best={key:"eco",name:"エコ都市",score:-Infinity,parts:null};const ranking=[];
    for(const key in ARCHETYPES){const arch=ARCHETYPES[key];const A=norm3(arch.v);const cos=cosine(S,A);
      let resAff=0;const keys=Object.keys(arch.resPref);
      for(const rk of keys){const prefW=arch.resPref[rk];const val=clamp((resources[rk]||0)/100,0,1);resAff+=prefW*val;}
      resAff/=(keys.length||1);
      const syn=synergyOf(key);const hystType=prevTypeKey===key?1:0;
      const score=cos*W.alpha+resAff*W.beta+syn*W.gamma-conflict*W.delta-risk*W.zeta+hystType*W.hysteresisType;
      ranking.push({key,name:arch.disp,score,cos,resAff,syn});if(score>best.score)best={key,name:arch.disp,score,parts:{cos,resAff,syn,conflict,risk}};}
    ranking.sort((a,b)=>b.score-a.score);
    const devIdx=clamp((status.env+status.eco+status.soc)/300,0,1);
    const resIdx=clamp((norm01(resources.energy,0,30)*0.25+norm01(resources.tech,0,20)*0.2+norm01(resources.funds,-40,80)*0.3+norm01(resources.food,0,30)*0.15+norm01(resources.recycled,0,15)*0.1),0,1);
    const scoreForLv=devIdx*0.6+resIdx*0.4;
    let rawLevel=1;if(scoreForLv>=0.75)rawLevel=3;else if(scoreForLv>=0.45)rawLevel=2;
    return{key:best.key,name:best.name,level:rawLevel,metrics:{best,ranking,devIdx,resIdx,scoreForLv}};
  }

  // -------- UI --------
  function applyCityHeader(city){
    const changed=city.key!==prevTypeKey&&prevTypeKey!=="start";const lvUp=city.level>prevLevel;
    setPhotoSafely(city.key,city.level);
    safeSet(cityNameEl,city.name);safeSet(cityLevelEl,`Lv.${city.level}`);document.body.dataset.cityType=city.key;
    if(changed||lvUp)scrollToTopSmooth();if(changed)showCityChange(city.name);if(lvUp)showLevelUp();
    prevTypeKey=city.key;prevLevel=city.level;
  }

  function updateBarsAndChips(){
    bars.env.style.width=`${status.env}%`;bars.eco.style.width=`${status.eco}%`;bars.soc.style.width=`${status.soc}%`;
    for(const k in chips)if(chips[k])chips[k].textContent=resources[k];
    chips.funds.style.color=resources.funds<0?"#d32f2f":"";
  }

  function updateEvidence(result){
    if(!evidenceEl)return;
    if(!result){evidenceEl.innerHTML=`<span class="tag">まだ判定はありません</span>`;return;}
    if(!result.metrics){evidenceEl.innerHTML=`<span class="tag">特別ルート：「${result.name}」</span>`;return;}
    const {best,ranking}=result.metrics;const top3=ranking.slice(0,3).map(r=>`• ${r.name} … ${(r.score).toFixed(2)}`).join("<br>");
    evidenceEl.innerHTML=`
      <div class="kv"><b>選択タイプ：</b>${result.name}　<b>Lv.${result.level}</b></div>
      <div style="margin-top:6px">類似度:${best.parts.cos.toFixed(2)}　資源整合:${best.parts.resAff.toFixed(2)}　シナジー:${best.parts.syn.toFixed(2)}　リスク:${best.parts.risk.toFixed(2)}</div>
      <div style="margin-top:6px"><b>上位候補</b><br>${top3}</div>
      <div class="ai-feedback" style="margin-top:10px">${makeFeedback(status,resources)}</div>`;
  }

  // -------- 画像・演出 --------
  function setPhoto(src, caption){photoEl.src=src;captionEl.textContent=caption||"";}
  function setPhotoSafely(type,lv){
    const path=type==="collapse"?"images/collapse.png":type==="wasteland"?"images/wasteland.png":`images/${type}_lv${lv}.png`;
    setPhoto(path,ARCHETYPES[type]?.disp||"");
  }

  function scrollToTopSmooth(){window.scrollTo({top:0,behavior:"smooth"});}
  function scrollToTopInstant(){window.scrollTo(0,0);}
  function showLevelUp(){const el=document.createElement("div");el.className="level-up";el.textContent="LEVEL UP!";document.body.appendChild(el);setTimeout(()=>el.remove(),1600);}
  function showCityChange(name){const el=document.createElement("div");el.className="city-change";el.textContent=`都市タイプが ${name} に変化！`;document.body.appendChild(el);setTimeout(()=>el.remove(),2200);}

  // -------- 終了 --------
  function endGame(){
    const final=determineCityType();applyCityHeader(final);updateBarsAndChips();updateEvidence(final);
    safeSet(qTitle,"🏁 ゲーム終了");safeSet(qDesc,`あなたの都市は「${final.name}」Lv.${final.level} に発展しました！`);
    choicesEl.innerHTML="";
    const fb=makeFeedback(status,resources);
    const summary=document.createElement("div");summary.className="ending-feedback";
    summary.innerHTML=`
      <h3>🌆 都市の振り返り</h3><p>${fb}</p>
      <ul style="text-align:left;margin:8px auto;width:90%;">
        <li>🌿 環境：${status.env.toFixed(1)}</li>
        <li>💰 経済：${status.eco.toFixed(1)}</li>
        <li>🤝 社会：${status.soc.toFixed(1)}</li>
        <li>⚡ エネルギー：${resources.energy}　🍎 食料：${resources.food}　💰 資金：${resources.funds}</li>
      </ul>
      <p>💬 ${final.key==="collapse"?"資源とバランスを失い都市は崩壊しました。しかし次の挑戦で再生できるかもしれません。":final.key==="wasteland"?"資源不足で都市は荒廃しました。失敗も学びです。":"市民と自然、経済が共に発展する街を築きました。"}</p>
      <button id="btn-retry" style="margin-top:12px;">もう一度挑戦する</button>`;
    choicesEl.appendChild(summary);
    $("btn-retry").onclick=initGame;
    progressEl.textContent="おつかれさま！";
  }

  // -------- ヘルプ --------
  function showHelpNoteOnce(){
    const box=document.createElement("div");
    box.style.margin="12px auto";box.style.width="min(900px,95%)";
    box.style.background="#fff";box.style.border="1px solid #cfe8e6";
    box.style.borderLeft="4px solid #2b7a78";box.style.borderRadius="8px";
    box.style.padding="10px 12px";box.style.textAlign="left";
    box.innerHTML=`<b>📘 ルール説明</b><br>
    ・資源（💰資金/⚡エネルギー/🍎食料/🧠技術/💧水/👷労働/♻️再資源）を使って政策を実行します。<br>
    ・資源が足りなくても<strong>実行可能</strong>です。その場合、不足分に応じた<strong>リスク</strong>（環境悪化・赤字拡大など）が自動発生します。<br>
    ・実行後にリスク警告が表示されます。トレードオフを体験し、持続可能な都市を目指してください。`;
    const host=$("question");if(host)host.parentNode.insertBefore(box,host);
  }

  // -------- Utils --------
  function safeSet(el,txt){if(el)el.textContent=txt;}
  function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
  function norm3(v){const n=Math.hypot(...v)||1;return v.map(x=>x/n);}
  function cosine(a,b){return clamp(a[0]*b[0]+a[1]*b[1]+a[2]*b[2],0,1);}
  function norm01(x,lo,hi){if(hi<=lo)return 0;return clamp((x-lo)/(hi-lo),0,1);}
})();
