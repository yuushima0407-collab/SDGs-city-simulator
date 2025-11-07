// ===========================
// SDGs City Manager Ver.10
// ===========================

let env = 50, eco = 50, soc = 50;
let funds = 50, tech = 0, energy = 0, food = 0, water = 0, labor = 0, recycled = 0;
let currentIndex = 0;
let currentCity = { type: "eco", level: 1, name: "スタート都市" };

function clamp(v, min, max){return Math.max(min, Math.min(max, v));}

function initGame(){
  env=eco=soc=50; funds=50; tech=energy=food=water=labor=recycled=0;
  currentIndex=0;
  currentCity={type:"start",level:1,name:"スタート都市"};
  document.getElementById("city-photo").src="images/start_city.jpg";
  document.getElementById("city-name").textContent=currentCity.name;
  document.getElementById("city-level").textContent="Lv."+currentCity.level;
  updateBars();
  document.getElementById("question-title").textContent="SDGs都市経営ゲーム";
  document.getElementById("question-desc").textContent="スタートボタンを押して開始！";
  document.getElementById("choices").innerHTML="";
  document.getElementById("explainBox").classList.add("hidden");
}

function showQuestion(){
  const q=cities[currentIndex];
  document.getElementById("question-title").textContent=q.title;
  document.getElementById("question-desc").textContent=q.description;
  const c=document.getElementById("choices");
  c.innerHTML="";
  q.choices.forEach(ch=>{
    const b=document.createElement("button");
    b.className="choice-btn";
    b.textContent=ch.text;
    b.onclick=()=>selectChoice(ch);
    c.appendChild(b);
  });
  document.getElementById("progress").textContent=`${currentIndex+1}/${cities.length-1} 問`;
}

function selectChoice(choice){
  env+=choice.effects.env;
  eco+=choice.effects.eco;
  soc+=choice.effects.soc;
  for(const k in choice.resources){window[k]+=choice.resources[k];}
  clampAll();

  const ex=document.getElementById("explainBox");
  ex.innerHTML=`<b>${choice.label}</b><br>${choice.explanation}`;
  ex.classList.remove("hidden");

  updateCityState();
  setTimeout(nextQuestion,1200);
}

function clampAll(){
  env=clamp(env,0,100);
  eco=clamp(eco,0,100);
  soc=clamp(soc,0,100);
}

function nextQuestion(){
  currentIndex++;
  // 崩壊条件：スコア低い時のみ最後の崩壊問題出す
  if(currentIndex===cities.length-1){
    const low=(env<25||eco<25||soc<25||funds<15);
    if(!low){endGame();return;}
  }
  if(currentIndex>=cities.length){endGame();return;}
  showQuestion();
}

function updateCityState(){
  const avg=(env+eco+soc)/3;
  let level=1;if(avg>65)level=2;if(avg>80)level=3;
  const type=determineType();
  if(level>currentCity.level) showLevelUp();
  if(type!==currentCity.type && currentCity.type!=="start") showCityChange(type);
  currentCity={type,level,name:getCityName(type)};
  document.getElementById("city-name").textContent=currentCity.name;
  document.getElementById("city-level").textContent="Lv."+currentCity.level;
  document.getElementById("city-photo").src=`images/${type}_lv${level}.jpg`;
  updateBars();
}

function determineType(){
  if(env>eco&&env>soc)return"eco";
  if(eco>env&&eco>soc)return"industry";
  if(soc>env&&soc>eco)return"social";
  if(tech>10)return"smart";
  return"eco";
}

function getCityName(t){
  const n={eco:"エコ都市",industry:"産業都市",social:"共生都市",smart:"スマート都市",start:"スタート都市"};
  return n[t]||"都市";
}

function updateBars(){
  document.getElementById("bar-env").style.width=env+"%";
  document.getElementById("bar-eco").style.width=eco+"%";
  document.getElementById("bar-soc").style.width=soc+"%";
}

function showLevelUp(){
  const d=document.createElement("div");
  d.className="level-up";
  d.textContent="LEVEL UP!";
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),2000);
}

function showCityChange(t){
  const d=document.createElement("div");
  d.className="city-change";
  d.textContent="都市タイプが "+getCityName(t)+" に変化！";
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),2500);
}

function endGame(){
  document.getElementById("question-title").textContent="🏁 ゲーム終了";
  document.getElementById("question-desc").textContent=`あなたの都市は ${currentCity.name} Lv.${currentCity.level} に発展しました！`;
  document.getElementById("choices").innerHTML="";
}

document.getElementById("btn-start").onclick=()=>showQuestion();
document.getElementById("btn-reset").onclick=()=>initGame();
initGame();
