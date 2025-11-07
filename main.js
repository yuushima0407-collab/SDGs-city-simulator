// ===========================
// SDGs都市経営ゲーム main.js Ver.8
// (AIアーキタイプ判定 + 背景フェード + レイアウト安定版)
// ===========================
(function () {
  window.addEventListener("DOMContentLoaded", () => {

    // ---------- 状態 ----------
    let currentQuestionIndex = 0;
    let status = { env: 50, eco: 50, soc: 50 };
    let resources = { energy: 0, food: 0, tech: 0, funds: 50, labor: 0, water: 0, recycled: 0 };
    let cityTypePoints = {
      eco:0, industry:0, social:0, smart:0, science:0,
      culture:0, tourism:0, agriculture:0, urban:0, infra:0,
      housing:0, education:0, transport:0, welfare:0, industryHeavy:0
    };
    let prevTypeKey = null;
    let prevLevel = 1;

    // ---------- DOM ----------
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

    const statusUI = { env: $("res-env"), eco: $("res-eco"), soc: $("res-soc") };
    const cityTypeUI = {
      eco: $("tp-eco"), industry: $("tp-industry"), social: $("tp-social"), smart: $("tp-smart"),
      science: $("tp-science"), culture: $("tp-culture"), tourism: $("tp-tourism"), agriculture: $("tp-agriculture"),
      industryHeavy: $("tp-industryHeavy"), urban: $("tp-urban"), infra: $("tp-infra"), housing: $("tp-housing"),
      welfare: $("tp-welfare"), education: $("tp-education"), transport: $("tp-transport")
    };

    if (typeof cities === "undefined") {
      alert("data.js が読み込まれていません。");
      return;
    }

    // ---------- 背景フェード ----------
    let currentBg = "";
    function setBackground(url) {
      if (!cityBg || currentBg === url) return;
      cityBg.classList.remove("fade-in");
      cityBg.classList.add("fade-out");
      setTimeout(() => {
        cityBg.style.backgroundImage = `url('${url}')`;
        cityBg.classList.remove("fade-out");
        cityBg.classList.add("fade-in");
        currentBg = url;
      }, 400);
    }

    // ---------- アーキタイプ定義 ----------
    const ARCHETYPES = {
      eco:{v:[0.9,0.35,0.65],resPref:{recycled:1,energy:0.5,water:0.5},disp:"エコ都市"},
      industry:{v:[0.35,0.9,0.45],resPref:{funds:1,labor:0.7,energy:0.5},disp:"産業都市"},
      social:{v:[0.45,0.45,0.95],resPref:{labor:0.6,water:0.4},disp:"社会都市"},
      smart:{v:[0.6,0.8,0.55],resPref:{tech:1,energy:0.6,funds:0.5},disp:"スマート都市"},
      science:{v:[0.55,0.85,0.55],resPref:{tech:1,funds:0.6},disp:"科学都市"},
      culture:{v:[0.65,0.55,0.75],resPref:{funds:0.4},disp:"文化都市"},
      tourism:{v:[0.55,0.75,0.65],resPref:{funds:0.5,water:0.4},disp:"観光都市"},
      agriculture:{v:[0.8,0.55,0.6],resPref:{food:1,water:0.6},disp:"農業都市"},
      urban:{v:[0.55,0.75,0.65],resPref:{funds:0.8},disp:"再生都市"},
      infra:{v:[0.45,0.85,0.55],resPref:{funds:0.9,energy:0.5},disp:"インフラ都市"},
      housing:{v:[0.6,0.55,0.8],resPref:{funds:0.5,labor:0.4},disp:"住宅都市"},
      education:{v:[0.55,0.7,0.75],resPref:{tech:0.7,funds:0.4},disp:"教育都市"},
      welfare:{v:[0.45,0.45,0.9],resPref:{labor:0.5,funds:0.4},disp:"福祉都市"},
      transport:{v:[0.55,0.8,0.6],resPref:{funds:0.6,energy:0.5},disp:"交通都市"}
    };

    // ---------- ゲーム開始 ----------
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
      setBackground("images/eco_lv1.png");
    }

    // ---------- 質問表示 ----------
    function showQuestion() {
      if (currentQuestionIndex >= cities.length) return showResult();
      const q = cities[currentQuestionIndex];
      questionTitle.textContent = q.title;
      questionDesc.textContent = q.description;
      choiceButtons.innerHTML = "";
      q.choices.forEach(choice=>{
        const btn=document.createElement("button");
        btn.className="choice-btn";
        btn.textContent=choice.text;
        btn.onclick=()=>selectChoice(choice);
        choiceButtons.appendChild(btn);
      });
      progressText.textContent=`問題 ${currentQuestionIndex+1}/${cities.length}`;
    }

    // ---------- 選択処理 ----------
    function selectChoice(choice) {
      applyEffects(choice.effects);
      applyTypePoints(choice.typePoints);
      applyResources(choice.resources);
      updateAllUI();
      explainBox.style.display="block";
      explainBox.textContent=choice.explanation;
      currentQuestionIndex++;
      setTimeout(showQuestion,1000);
    }

    // ---------- 効果反映 ----------
    function applyEffects(effects){
      if(!effects)return;
      for(const k in effects){
        if(status[k]!=null) status[k]=clamp(status[k]+effects[k],0,100);
      }
    }
    function applyTypePoints(points){
      if(!points)return;
      for(const k in points){
        if(cityTypePoints[k]!=null) cityTypePoints[k]+=points[k];
      }
    }
    function applyResources(res){
      if(!res)return;
      for(const k in res){
        resources[k]=(resources[k]||0)+res[k];
        if(resources[k]<0)resources[k]=0;
      }
    }

    // ---------- UI ----------
    function updateAllUI(){
      for(const k in statusUI){
        const v=clamp(status[k],0,100);
        statusUI[k].style.width=`${v}%`;
      }
      for(const k in cityTypeUI){
        if(cityTypeUI[k]) cityTypeUI[k].textContent=cityTypePoints[k];
      }
      updateCityInfoPanel();
      updateCityVisual();
    }

    function updateCityInfoPanel(){
      const city=determineCityType();
      cityInfoName.textContent=city.name;
      cityInfoLevel.textContent=`Lv.${city.level}`;
      cityInfoDesc.textContent=`🌿環境:${status.env} 💰経済:${status.eco} 🤝社会:${status.soc}`;
      cityInfoResources.textContent=`⚡:${resources.energy} 🍎:${resources.food} 🧠:${resources.tech} 💰:${resources.funds}`;
    }

    // ---------- 判定 ----------
    function determineCityType(){
      const S=norm3([status.env/100,status.eco/100,status.soc/100]);
      let best={key:"eco",name:"エコ都市",score:-1};
      for(const k in ARCHETYPES){
        const arch=ARCHETYPES[k];
        const cos=cosine(S,norm3(arch.v));
        let resAff=0;
        for(const rk in arch.resPref){
          resAff+=arch.resPref[rk]*(clamp(resources[rk],0,100)/100);
        }
        resAff/=Object.keys(arch.resPref).length;
        const score=cos*0.6+resAff*0.3+(cityTypePoints[k]||0)*0.01;
        if(score>best.score)best={key:k,name:arch.disp,score};
      }
      const avg=(status.env+status.eco+status.soc)/3;
      const rawLevel=avg>75?3:avg>55?2:1;
      const level=prevTypeKey===best.key?Math.min(prevLevel+1,rawLevel):rawLevel;
      prevTypeKey=best.key; prevLevel=level;
      return {key:best.key,name:best.name,level};
    }

    // ---------- 背景更新 ----------
    function updateCityVisual(){
      const city=determineCityType();
      let url=`images/${city.key}_lv${city.level}.png`;
      setBackground(url);
    }

    // ---------- ヘルパ ----------
    function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
    function norm3(v){const n=Math.hypot(...v)||1;return v.map(x=>x/n);}
    function cosine(a,b){return clamp(a[0]*b[0]+a[1]*b[1]+a[2]*b[2],0,1);}
  });
})();
