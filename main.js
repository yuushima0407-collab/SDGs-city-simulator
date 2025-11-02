// ===========================
// SDGs都市経営ゲーム main.js 完全版（15都市対応）
// ===========================
(function() {
  window.addEventListener("DOMContentLoaded", () => {
    // --- 状態管理 ---
    let currentQuestionIndex = 0;
    let status = { env: 50, eco: 50, soc: 50 };
    let cityTypePoints = { eco:0, industry:0, social:0, smart:0, science:0, culture:0, tourism:0, agriculture:0, industryHeavy:0 };
    let resources = { energy:0, food:0, tech:0, funds:50 };

    // --- DOM取得 ---
    const $ = id => document.getElementById(id);
    const startBtn = $("btn-start");
    const questionTitle = $("question-title");
    const questionDesc = $("question-desc");
    const choiceButtons = $("choices");
    const explainBox = $("explainBox");
    const envBar = $("env-bar");
    const ecoBar = $("eco-bar");
    const socBar = $("soc-bar");
    const progressText = $("progress");
    const cityView = $("city-view");
    const cityInfoName = $("city-info-name");
    const cityInfoLevel = $("city-info-level");
    const cityInfoDesc = $("city-info-desc");
    const cityInfoResources = $("city-info-resources");
    const cityBg = $("city-bg");

    if (startBtn) startBtn.addEventListener("click", startGame);

    function startGame(){
      currentQuestionIndex=0;
      status={env:50,eco:50,soc:50};
      cityTypePoints={eco:0,industry:0,social:0,smart:0,science:0,culture:0,tourism:0,agriculture:0,industryHeavy:0};
      resources={energy:0,food:0,tech:0,funds:50};
      explainBox.style.display="none";
      updateStatusUI();
      updateCityVisual();
      showQuestion();
    }

    function showQuestion(){
      if(currentQuestionIndex>=cities.length){ showResult(); return; }
      const q=cities[currentQuestionIndex];
      questionTitle.textContent=q.title||"無題の質問";
      questionDesc.textContent=q.description||"";
      choiceButtons.innerHTML="";

      q.choices.forEach(choice=>{
        const btn=document.createElement("button");
        btn.className="choice-btn";
        btn.textContent=choice.text;

        // 資源不足チェック
        let canSelect=true;
        let reason="";
        if(choice.resources){
          for(const k in choice.resources){
            const val=choice.resources[k];
            if(val<0 && (resources[k]||0)<Math.abs(val)){
              canSelect=false;
              reason=`${k}不足で選択できません`;
            }
          }
        }

        if(!canSelect){ btn.disabled=true; btn.style.opacity=0.5; btn.title=reason; }
        btn.onclick=()=>selectChoice(choice);
        choiceButtons.appendChild(btn);
      });
      progressText.textContent=`問題 ${currentQuestionIndex+1}/${cities.length}`;
    }

    function selectChoice(choice){
      applyEffects(choice.effects);
      applyTypePoints(choice.typePoints);
      applyResources(choice.resources);

      updateStatusUI();
      updateCityVisual();
      updateCityInfoPanel();

      explainBox.style.display="block";
      explainBox.textContent=choice.explanation||"選択結果が反映されました。";

      currentQuestionIndex++;
      setTimeout(showQuestion,1200);
    }

    function applyEffects(effects){ if(!effects)return; status.env=clamp(status.env+(effects.env||0),0,100); status.eco=clamp(status.eco+(effects.eco||0),0,100); status.soc=clamp(status.soc+(effects.soc||0),0,100); }
    function applyTypePoints(points){ if(!points)return; for(const k in points){ cityTypePoints[k]+=points[k]||0; } }
    function applyResources(res){ if(!res)return; for(const k in res){ resources[k]=(resources[k]||0)+res[k]; } }
    function updateStatusUI(){ envBar.style.width=`${status.env}%`; ecoBar.style.width=`${status.eco}%`; socBar.style.width=`${status.soc}%`; }

    function updateCityVisual(){
      if(!cityView)return;
      const city=determineCityType();
      if(cityBg){
        let imgUrl="";
        switch(city.name){
          case "荒廃都市": imgUrl="images/ruin_city.jpg"; break;
          case "未発展都市": imgUrl="images/default_city.jpg"; break;
          case "エネルギー都市": imgUrl="images/energy_city.jpg"; break;
          case "食料自給都市": imgUrl="images/food_city.jpg"; break;
          case "技術都市": imgUrl="images/tech_city.jpg"; break;
          case "エコ都市": imgUrl="images/eco_city.jpg"; break;
          case "産業都市": imgUrl="images/industry_city.jpg"; break;
          case "福祉都市": imgUrl="images/social_city.jpg"; break;
          case "スマート都市": imgUrl="images/smart_city.jpg"; break;
          case "科学都市": imgUrl="images/science_city.jpg"; break;
          case "文化都市": imgUrl="images/culture_city.jpg"; break;
          case "観光都市": imgUrl="images/tourism_city.jpg"; break;
          case "農業都市": imgUrl="images/agriculture_city.jpg"; break;
          case "工業都市": imgUrl="images/industryHeavy_city.jpg"; break;
          case "先進都市": imgUrl="images/advanced_city.jpg"; break;
          default: imgUrl="images/default_city.jpg"; break;
        }
        cityBg.style.backgroundImage=`url(${imgUrl})`;
        cityBg.style.backgroundSize="cover";
        cityBg.style.backgroundPosition="center";
      }
    }

    function updateCityInfoPanel(){
      const city=determineCityType();
      if(cityInfoName) cityInfoName.textContent=city.name;
      if(cityInfoLevel) cityInfoLevel.textContent=`Lv.${city.level}`;

      if(cityInfoDesc){
        let desc=`🌿環境:${status.env}  💰経済:${status.eco}  🤝社会:${status.soc}\n`;
        desc+=`⚡:${resources.energy}  🧠:${resources.tech}  🍎:${resources.food}  💰:${resources.funds}\n`;

        // 強み
        desc+="💡強み:";
        const strengths=[];
        if(resources.energy>=20) strengths.push("エネルギー豊富");
        if(resources.food>=20) strengths.push("食料自給");
        if(resources.tech>=10) strengths.push("技術都市");
        if(status.env>status.eco && status.env>status.soc) strengths.push("自然豊か");
        desc+=strengths.join(",")||"なし";

        // 弱み
        desc+="\n⚠弱み:";
        const weaknesses=[];
        if(resources.funds<10) weaknesses.push("資金不足");
        if(status.env<30) weaknesses.push("環境悪化");
        if(status.eco<30) weaknesses.push("経済停滞");
        if(status.soc<30) weaknesses.push("社会問題");
        desc+=weaknesses.join(",")||"なし";

        cityInfoDesc.textContent=desc;
      }

      if(cityInfoResources){
        cityInfoResources.textContent=`資源 - ⚡:${resources.energy}  🍎:${resources.food}  🧠:${resources.tech}  💰:${resources.funds}`;
      }
    }

    function showResult(){
      questionTitle.textContent="🌆都市の最終結果";
      questionDesc.textContent="あなたの選択が都市を形作りました。";
      choiceButtons.innerHTML="";
      const finalType=determineCityType();

      let bonusDesc="";
      if(resources.energy>=20) bonusDesc+="⚡エネルギー豊富な都市<br>";
      if(resources.food>=20) bonusDesc+="🍎食料自給率高い都市<br>";
      if(resources.tech>=10) bonusDesc+="🧠技術都市<br>";
      if(resources.funds>=50) bonusDesc+="💰豊富な資金<br>";

      explainBox.innerHTML=`
        🌿${status.env}<br>
        💰${status.eco}<br>
        🤝${status.soc}<br>
        ⚡${resources.energy}<br>
        🧠${resources.tech}<br>
        🍎${resources.food}<br>
        💰${resources.funds}<br><br>
        🏙最終都市タイプ: <b>${finalType.name}</b> (Lv${finalType.level})<br>
        ${bonusDesc}
      `;
      progressText.textContent="全問題終了";
      updateCityVisual();
      updateCityInfoPanel();
    }

    function determineCityType(){
      const sum=status.env+status.eco+status.soc;
      const mainType=Object.entries(cityTypePoints).sort((a,b)=>b[1]-a[1])[0][0];
      let name="未発展都市";

      if(sum<80 && resources.energy<5 && resources.food<5 && resources.tech<5) name="荒廃都市";
      else if(resources.energy>=20) name="エネルギー都市";
      else if(resources.food>=20) name="食料自給都市";
      else if(resources.tech>=10) name="技術都市";
      else if(mainType==="eco") name="エコ都市";
      else if(mainType==="industry") name="産業都市";
      else if(mainType==="social") name="福祉都市";
      else if(mainType==="smart") name="スマート都市";
      else if(mainType==="science") name="科学都市";
      else if(mainType==="culture") name="文化都市";
      else if(mainType==="tourism") name="観光都市";
      else if(mainType==="agriculture") name="農業都市";
      else if(mainType==="industryHeavy") name="工業都市";
      else if(sum>240) name="先進都市";

      let level=1;
      if(sum>220) level=3;
      else if(sum>150) level=2;

      return {name,level};
    }

    function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }
  });
})();
