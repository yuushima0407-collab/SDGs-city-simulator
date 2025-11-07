const cities = [
{
  title: "都市のエネルギー政策をどうする？",
  description: "環境と経済のバランスを取りながら、エネルギーの供給方法を決める。",
  choices: [
    {
      text: "再生可能エネルギー中心に切り替える",
      effects: { env: 3, eco: -1, soc: 1 },
      typePoints: { eco: 3, smart: 1 },
      resources: { energy: 5, funds: -2 },
      explanation: "長期的には安定した持続可能エネルギーを実現。デンマーク型モデル。"
    },
    {
      text: "原子力と火力を中心に安定供給",
      effects: { env: -2, eco: 3, soc: 1 },
      typePoints: { industrial: 2, infra: 1 },
      resources: { energy: 10, funds: -4 },
      explanation: "短期的な経済安定を重視。環境リスクあり。"
    },
    {
      text: "分散型小規模発電を導入",
      effects: { env: 2, eco: 1, soc: 2 },
      typePoints: { smart: 2, eco: 1 },
      resources: { energy: 6, funds: -3 },
      explanation: "スマートグリッドと地域発電の両立。"
    }
  ]
},
{
  title: "産業発展の方向性をどう定める？",
  description: "経済成長と環境・社会の調和を考える。",
  choices: [
    {
      text: "ハイテク・研究開発産業を誘致",
      effects: { env: -1, eco: 3, soc: 1 },
      typePoints: { science: 3, smart: 1 },
      resources: { tech: 3, funds: -3 },
      explanation: "経済・技術力を強化。シリコンバレー型都市。"
    },
    {
      text: "製造業・雇用重視の政策",
      effects: { env: -2, eco: 2, soc: 3 },
      typePoints: { industrial: 3, social: 1 },
      resources: { labor: 5, funds: -2 },
      explanation: "地域雇用を確保するが、環境負荷が大きい。"
    },
    {
      text: "環境・福祉産業を支援",
      effects: { env: 2, eco: 1, soc: 2 },
      typePoints: { eco: 2, social: 2 },
      resources: { funds: -2 },
      explanation: "持続可能な経済を目指す。北欧モデル。"
    }
  ]
},
{
  title: "交通インフラの整備方針をどうする？",
  description: "都市の拡大と効率化を両立させる交通計画。",
  choices: [
    {
      text: "公共交通を強化",
      effects: { env: 2, eco: 1, soc: 2 },
      typePoints: { transport: 2, eco: 1 },
      resources: { funds: -3 },
      explanation: "CO2削減と市民の利便性向上。"
    },
    {
      text: "道路整備で自動車中心化",
      effects: { env: -2, eco: 3, soc: 0 },
      typePoints: { industrial: 2, infra: 1 },
      resources: { funds: -2 },
      explanation: "経済効率は上がるが、環境負荷が大きい。"
    },
    {
      text: "AIスマート交通システムを導入",
      effects: { env: 1, eco: 2, soc: 2 },
      typePoints: { smart: 3, transport: 1 },
      resources: { tech: 3, funds: -3 },
      explanation: "渋滞や事故を減らす次世代交通。"
    }
  ]
},
{
  title: "水資源をどう管理する？",
  description: "人口増加に伴う水不足への対策を考える。",
  choices: [
    {
      text: "雨水再利用・節水技術を導入",
      effects: { env: 3, eco: 0, soc: 1 },
      typePoints: { eco: 2, smart: 1 },
      resources: { water: 5, funds: -2 },
      explanation: "持続可能な水循環。シンガポール型モデル。"
    },
    {
      text: "大規模ダムで供給を安定化",
      effects: { env: -2, eco: 2, soc: 1 },
      typePoints: { infra: 2, industrial: 1 },
      resources: { water: 10, funds: -4 },
      explanation: "安定供給だが環境への影響が大きい。"
    },
    {
      text: "地下水の大量利用",
      effects: { env: -3, eco: 1, soc: -1 },
      typePoints: { industrial: 1 },
      resources: { water: 8, funds: -1 },
      explanation: "短期的には有利だが、枯渇リスク高。"
    }
  ]
},
{
  title: "食料供給の方針をどうする？",
  description: "都市と農業の関係を再構築する。",
  choices: [
    {
      text: "地産地消・都市農業を推進",
      effects: { env: 2, eco: 1, soc: 2 },
      typePoints: { agriculture: 3, eco: 1 },
      resources: { food: 5, funds: -2 },
      explanation: "環境にも住民にも優しい。"
    },
    {
      text: "輸入拡大でコスト削減",
      effects: { env: -1, eco: 3, soc: 0 },
      typePoints: { industrial: 2 },
      resources: { food: 8, funds: -1 },
      explanation: "短期経済効果は高いが、持続性に欠ける。"
    },
    {
      text: "AI管理のスマート農業導入",
      effects: { env: 1, eco: 2, soc: 1 },
      typePoints: { smart: 2, agriculture: 2 },
      resources: { tech: 3, food: 6, funds: -2 },
      explanation: "効率的で環境にも配慮。"
    }
  ]
},
{
  title: "都市財政の健全化をどう保つ？",
  description: "公共投資と税制のバランスを取る。",
  choices: [
    {
      text: "福祉・教育への投資を維持",
      effects: { env: 0, eco: 1, soc: 3 },
      typePoints: { social: 2, education: 1 },
      resources: { funds: -3 },
      explanation: "長期的な社会基盤の安定。"
    },
    {
      text: "産業振興への重点投資",
      effects: { env: -1, eco: 3, soc: 1 },
      typePoints: { industrial: 2, infra: 1 },
      resources: { funds: -2 },
      explanation: "短期的な税収アップを狙う。"
    },
    {
      text: "緊縮財政で支出を削減",
      effects: { env: 0, eco: 2, soc: -1 },
      typePoints: { urban: 1 },
      resources: { funds: +1 },
      explanation: "短期安定だが社会不満が高まる。"
    }
  ]
},
{
  title: "インフラ整備の優先度は？",
  description: "都市の発展に必要な基盤投資を選ぶ。",
  choices: [
    {
      text: "道路・橋・鉄道など物理インフラ重視",
      effects: { env: -1, eco: 3, soc: 1 },
      typePoints: { infra: 3, transport: 1 },
      resources: { funds: -3 },
      explanation: "経済を支える基礎整備。"
    },
    {
      text: "通信・エネルギー網など次世代インフラ重視",
      effects: { env: 1, eco: 2, soc: 2 },
      typePoints: { smart: 2, infra: 2 },
      resources: { tech: 3, funds: -2 },
      explanation: "未来志向の都市設計。"
    },
    {
      text: "最低限の修繕でコストを抑制",
      effects: { env: 0, eco: 1, soc: -1 },
      typePoints: { urban: 1 },
      resources: { funds: -1 },
      explanation: "老朽化リスクを放置。"
    }
  ]
},
{
  title: "雇用と働き方をどう支援する？",
  description: "都市の労働政策を見直す。",
  choices: [
    {
      text: "再教育・スキルアップ支援",
      effects: { env: 0, eco: 1, soc: 3 },
      typePoints: { education: 2, social: 1 },
      resources: { labor: 2, funds: -2 },
      explanation: "安定した雇用と社会基盤を作る。"
    },
    {
      text: "企業誘致による雇用創出",
      effects: { env: -1, eco: 3, soc: 2 },
      typePoints: { industry: 2, urban: 1 },
      resources: { funds: -3 },
      explanation: "経済成長の即効性あり。"
    },
    {
      text: "最低賃金を抑制し競争力維持",
      effects: { env: 0, eco: 2, soc: -1 },
      typePoints: { industrial: 1 },
      resources: { funds: -1 },
      explanation: "一部の層に不満が残る。"
    }
  ]
},
{
  title: "エネルギーとAIの融合戦略をどう進める？",
  description: "スマート制御による省エネ・安定化を検討。",
  choices: [
    {
      text: "AIによる電力最適化を導入",
      effects: { env: 2, eco: 2, soc: 1 },
      typePoints: { smart: 3, eco: 1 },
      resources: { tech: 3, funds: -3 },
      explanation: "再エネ効率を最大化。スマートシティ化が進む。"
    },
    {
      text: "人力・既存方式を維持",
      effects: { env: 0, eco: 1, soc: 0 },
      typePoints: { industrial: 1 },
      resources: { funds: -1 },
      explanation: "技術導入を見送り、停滞リスク。"
    },
    {
      text: "外資AI企業に委託",
      effects: { env: 1, eco: 3, soc: -1 },
      typePoints: { industry: 1, smart: 1 },
      resources: { funds: -2 },
      explanation: "短期効率は高いが独自技術が育たない。"
    }
  ]
},
{
  title: "エネルギー多様化の次の一手は？",
  description: "都市の安定供給と持続可能性を両立する。",
  choices: [
    {
      text: "再エネ＋水素＋蓄電の複合戦略",
      effects: { env: 3, eco: 1, soc: 1 },
      typePoints: { eco: 2, smart: 2 },
      resources: { energy: 6, funds: -3 },
      explanation: "多様な電源でリスク分散。"
    },
    {
      text: "原子力依存を強化",
      effects: { env: -2, eco: 3, soc: 0 },
      typePoints: { industry: 2, infra: 1 },
      resources: { energy: 10, funds: -4 },
      explanation: "安定だがリスク高。"
    },
    {
      text: "化石燃料を維持し短期重視",
      effects: { env: -3, eco: 2, soc: -1 },
      typePoints: { industrial: 2 },
      resources: { energy: 8, funds: -1 },
      explanation: "短期成長型。将来の環境負担が懸念。"
    }
  ]
},
,{
  title: "教育の質とアクセスをどう高める？",
  description: "将来の都市競争力を左右する、人材育成への投資を決める。",
  choices: [
    {
      text: "大学・研究機関を拡充し産学連携を促進",
      effects: { env: 0, eco: 2, soc: 2 },
      typePoints: { education: 2, science: 2, smart: 1 },
      resources: { tech: 3, funds: -3 },
      explanation: "研究成果の社会実装で経済・技術が伸びる。"
    },
    {
      text: "リカレント教育と奨学支援を拡大",
      effects: { env: 0, eco: 1, soc: 3 },
      typePoints: { education: 2, social: 1 },
      resources: { labor: 2, funds: -2 },
      explanation: "誰も取り残さない学び直しで雇用の質向上。"
    },
    {
      text: "教育費を抑制し短期の財政健全化を優先",
      effects: { env: 0, eco: 2, soc: -1 },
      typePoints: { industry: 1 },
      resources: { funds: +1 },
      explanation: "短期バランスは良いが長期成長の芽を削る懸念。"
    }
  ]
},
{
  title: "医療・福祉インフラをどう強化する？",
  description: "高齢化や人口動態の変化に備えて健康・福祉を設計する。",
  choices: [
    {
      text: "地域包括ケアと在宅医療を拡張",
      effects: { env: 0, eco: 0, soc: 3 },
      typePoints: { welfare: 2, social: 2 },
      resources: { labor: 2, funds: -2 },
      explanation: "患者中心のケアで満足度・QOLが上がる。"
    },
    {
      text: "AI診療支援と遠隔医療を導入",
      effects: { env: 1, eco: 1, soc: 2 },
      typePoints: { smart: 2, welfare: 1 },
      resources: { tech: 2, funds: -2 },
      explanation: "過疎地域の医療アクセスを補完。"
    },
    {
      text: "民間委託でコスト最適化を狙う",
      effects: { env: 0, eco: 2, soc: -1 },
      typePoints: { industry: 1 },
      resources: { funds: -1 },
      explanation: "効率は上がるが、弱者支援が薄くなる懸念。"
    }
  ]
},
{
  title: "治安・安全のまちづくりをどう進める？",
  description: "犯罪抑止と住民の安心の両立を図る。",
  choices: [
    {
      text: "地域見守り×コミュニティ警察を強化",
      effects: { env: 0, eco: 0, soc: 3 },
      typePoints: { social: 2, welfare: 1 },
      resources: { labor: 2, funds: -1 },
      explanation: "参加型で地域結束が高まる。"
    },
    {
      text: "スマート監視と予測パトロールを導入",
      effects: { env: 0, eco: 1, soc: 2 },
      typePoints: { smart: 2, social: 1 },
      resources: { tech: 2, funds: -2 },
      explanation: "犯罪予兆検知で抑止力を高める。"
    },
    {
      text: "最小限の施策で財政を温存",
      effects: { env: 0, eco: 1, soc: -1 },
      typePoints: { urban: 1 },
      resources: { funds: -1 },
      explanation: "短期負担は少ないが、体感治安は悪化の恐れ。"
    }
  ]
},
{
  title: "住宅政策：住みやすさと多様性をどう両立？",
  description: "住宅の量・質・負担と、コミュニティの多様性を設計する。",
  choices: [
    {
      text: "手頃な家賃の公的住宅を増やす",
      effects: { env: 0, eco: 0, soc: 3 },
      typePoints: { housing: 3, social: 1 },
      resources: { funds: -3 },
      explanation: "若者・子育て・高齢者の住まいを確保。"
    },
    {
      text: "スマートホーム回収（断熱・省エネ）に補助",
      effects: { env: 2, eco: 1, soc: 1 },
      typePoints: { housing: 2, eco: 1, smart: 1 },
      resources: { tech: 2, funds: -2 },
      explanation: "省エネと快適性を両立。"
    },
    {
      text: "規制緩和で民間開発を促進",
      effects: { env: -1, eco: 2, soc: 1 },
      typePoints: { industry: 1, urban: 1, housing: 1 },
      resources: { funds: -1 },
      explanation: "供給増で家賃は安定しやすいが環境面は要配慮。"
    }
  ]
},
{
  title: "文化・芸術をどう育てる？",
  description: "都市のアイデンティティと創造性を磨く戦略を選ぶ。",
  choices: [
    {
      text: "博物館・劇場・図書館の文化クラスター整備",
      effects: { env: 1, eco: 1, soc: 2 },
      typePoints: { culture: 3, education: 1 },
      resources: { funds: -3 },
      explanation: "文化資本が観光や学びを牽引。"
    },
    {
      text: "ストリートアート・市民芸術祭を支援",
      effects: { env: 1, eco: 1, soc: 2 },
      typePoints: { culture: 2, social: 1 },
      resources: { funds: -2 },
      explanation: "市民参加で文化を身近に。"
    },
    {
      text: "民間スポンサー誘致で自立運営",
      effects: { env: 0, eco: 2, soc: 1 },
      typePoints: { culture: 1, industry: 1 },
      resources: { funds: -1 },
      explanation: "財政負担を抑えつつ継続性を狙う。"
    }
  ]
},
{
  title: "観光戦略：何で稼ぐ？何を守る？",
  description: "地域の魅力を活かし、観光の質と持続性を両立する。",
  choices: [
    {
      text: "伝統文化×体験型ツーリズムを推進",
      effects: { env: 1, eco: 2, soc: 2 },
      typePoints: { tourism: 2, culture: 2 },
      resources: { funds: -2 },
      explanation: "京都・奈良型の高付加価値観光。"
    },
    {
      text: "大型リゾート・MICEを誘致",
      effects: { env: -2, eco: 3, soc: 1 },
      typePoints: { tourism: 3, industry: 1 },
      resources: { funds: -3 },
      explanation: "国際会議や展示会で経済波及大。"
    },
    {
      text: "自然保護とエコツーリズムに集中",
      effects: { env: 3, eco: 1, soc: 1 },
      typePoints: { eco: 1, tourism: 2 },
      resources: { funds: -2 },
      explanation: "屋久島・スイス型。環境価値を観光資源に。"
    }
  ]
},
{
  title: "都市再生：空洞化した中心市街地をどうする？",
  description: "老朽化・空き地・空き店舗の再生戦略を選ぶ。",
  choices: [
    {
      text: "複合再開発（住宅・商業・公共空間）を推進",
      effects: { env: 1, eco: 2, soc: 2 },
      typePoints: { urban: 3, housing: 1, culture: 1 },
      resources: { funds: -3 },
      explanation: "歩いて暮らせる回遊性の高い都心へ。"
    },
    {
      text: "歴史景観を保全し用途転用（リノベ）",
      effects: { env: 2, eco: 1, soc: 2 },
      typePoints: { culture: 2, urban: 1 },
      resources: { funds: -2 },
      explanation: "保存と活用を両立、観光や創業の核に。"
    },
    {
      text: "規制緩和で民間主導の開発を加速",
      effects: { env: -1, eco: 3, soc: 1 },
      typePoints: { industry: 1, urban: 2 },
      resources: { funds: -1 },
      explanation: "スピード感は出るが公共性の担保が課題。"
    }
  ]
},
{
  title: "防災・レジリエンス：何に投資する？",
  description: "気候変動・地震水害に備えて都市の粘り強さを高める。",
  choices: [
    {
      text: "耐震補強・浸水対策・避難網を一体整備",
      effects: { env: 1, eco: 0, soc: 3 },
      typePoints: { infra: 2, urban: 1, welfare: 1 },
      resources: { funds: -3 },
      explanation: "命と暮らしを守る都市の必須投資。"
    },
    {
      text: "デジタル双子（Digital Twin）で危険予測",
      effects: { env: 1, eco: 1, soc: 2 },
      typePoints: { smart: 2, infra: 1 },
      resources: { tech: 3, funds: -2 },
      explanation: "被害予測や避難計画を高度化。"
    },
    {
      text: "保険・備蓄中心でソフト対策に限定",
      effects: { env: 0, eco: 1, soc: 1 },
      typePoints: { welfare: 1 },
      resources: { funds: -1 },
      explanation: "即効性はあるが根本対策にはならない。"
    }
  ]
},
{
  title: "循環経済（サーキュラー）へ転換できるか？",
  description: "3Rを超え、資源の設計段階から循環可能にする。",
  choices: [
    {
      text: "製品設計段階からリユース・リサイクルを義務化",
      effects: { env: 3, eco: 1, soc: 1 },
      typePoints: { eco: 2, infra: 1 },
      resources: { recycled: 5, funds: -2 },
      explanation: "資源循環のボトルネックを根本から解消。"
    },
    {
      text: "廃棄物発電・熱回収で効率化",
      effects: { env: 1, eco: 2, soc: 1 },
      typePoints: { smart: 1, industry: 1 },
      resources: { energy: 3, funds: -2 },
      explanation: "最終段階の価値回収で無駄を減らす。"
    },
    {
      text: "回収インフラは民間任せで小規模運用",
      effects: { env: -1, eco: 1, soc: 0 },
      typePoints: { industry: 1 },
      resources: { funds: -1 },
      explanation: "負担は軽いが循環率は伸びづらい。"
    }
  ]
},
{
  title: "モビリティの次世代化：人中心の街にできる？",
  description: "移動の質と安全、都市の魅力を高める交通まちづくり。",
  choices: [
    {
      text: "歩行者・自転車優先のスーパー街路を導入",
      effects: { env: 3, eco: 1, soc: 2 },
      typePoints: { transport: 2, eco: 1, culture: 1 },
      resources: { funds: -2 },
      explanation: "健康・にぎわい・環境が同時に改善。"
    },
    {
      text: "パークアンドライド・BRTで郊外と都心を接続",
      effects: { env: 2, eco: 2, soc: 1 },
      typePoints: { transport: 2, infra: 1 },
      resources: { funds: -2 },
      explanation: "渋滞緩和とCO2削減の実効的な組み合わせ。"
    },
    {
      text: "現状維持でコスト最小化",
      effects: { env: -1, eco: 1, soc: -1 },
      typePoints: { industry: 1 },
      resources: { funds: -1 },
      explanation: "短期出費は少ないが遅れが蓄積。"
    }
  ]
},
{
  title: "多文化共生と国際交流をどう促す？",
  description: "留学生・技能人材・観光客を取り込み、活力と寛容性を高める。",
  choices: [
    {
      text: "多言語行政・生活支援・国際イベントを整備",
      effects: { env: 0, eco: 2, soc: 3 },
      typePoints: { culture: 1, tourism: 1, social: 2 },
      resources: { funds: -2 },
      explanation: "定住・交流の両輪で都市の多様性が進む。"
    },
    {
      text: "高度人材特区とスタートアップビザを創設",
      effects: { env: 0, eco: 3, soc: 1 },
      typePoints: { science: 1, industry: 1, urban: 1 },
      resources: { funds: -2 },
      explanation: "成長分野の人材流入で新産業が芽吹く。"
    },
    {
      text: "観光受け入れを季節・地域で分散",
      effects: { env: 1, eco: 2, soc: 1 },
      typePoints: { tourism: 2, culture: 1 },
      resources: { funds: -1 },
      explanation: "オーバーツーリズム回避で質を高める。"
    }
  ]
}
,{
  title: "科学技術都市をどう発展させる？",
  description: "研究・開発・実証のサイクルをどう都市に組み込むか。",
  choices: [
    {
      text: "産学官連携の研究特区を設立",
      effects: { env: 1, eco: 3, soc: 1 },
      typePoints: { science: 3, smart: 1 },
      resources: { tech: 4, funds: -3 },
      explanation: "新産業・AI・量子など次世代技術が集まる。"
    },
    {
      text: "市民参加型の実証実験都市を推進",
      effects: { env: 2, eco: 1, soc: 2 },
      typePoints: { smart: 2, social: 1 },
      resources: { tech: 2, funds: -2 },
      explanation: "スマート社会実験が共感と革新を生む。"
    },
    {
      text: "基礎研究費を削減し短期収益を優先",
      effects: { env: 0, eco: 3, soc: -1 },
      typePoints: { industry: 2 },
      resources: { funds: +1 },
      explanation: "短期収益は伸びるが技術力は衰退。"
    }
  ]
},
{
  title: "AIガバナンス：自動化と人間性の両立は？",
  description: "効率と倫理のバランスを取る社会設計。",
  choices: [
    {
      text: "AI倫理基準と監査制度を整備",
      effects: { env: 1, eco: 1, soc: 2 },
      typePoints: { smart: 2, social: 1 },
      resources: { tech: 2, funds: -1 },
      explanation: "持続可能なAI社会の枠組み。"
    },
    {
      text: "完全自動化で生産性を最大化",
      effects: { env: 0, eco: 3, soc: -1 },
      typePoints: { industry: 2, smart: 1 },
      resources: { tech: 3, funds: -2 },
      explanation: "効率重視で雇用は減少。"
    },
    {
      text: "AI導入を慎重に進め段階的展開",
      effects: { env: 1, eco: 1, soc: 1 },
      typePoints: { smart: 1 },
      resources: { funds: -1 },
      explanation: "柔軟性と社会受容を確保。"
    }
  ]
},
{
  title: "気候変動対策：都市のカーボンニュートラルを実現できるか？",
  description: "排出ゼロを目指す都市の長期戦略を立てる。",
  choices: [
    {
      text: "再エネ＋植林＋省エネの総合計画を策定",
      effects: { env: 3, eco: 1, soc: 1 },
      typePoints: { eco: 3, infra: 1 },
      resources: { energy: 5, funds: -3 },
      explanation: "環境・健康・持続性すべてで好循環。"
    },
    {
      text: "排出権取引でコスト最小化",
      effects: { env: 1, eco: 2, soc: 0 },
      typePoints: { industry: 1 },
      resources: { funds: -2 },
      explanation: "柔軟だが実質的削減は遅い。"
    },
    {
      text: "対策を先送りして経済優先",
      effects: { env: -3, eco: 3, soc: -1 },
      typePoints: { industry: 2 },
      resources: { funds: -1 },
      explanation: "一時的成長の代償として環境悪化。"
    }
  ]
},
{
  title: "都市文化と自然の共存をどう実現する？",
  description: "芸術・環境・市民生活が融合する都市空間を設計する。",
  choices: [
    {
      text: "都市緑化＋アートプロジェクトを融合",
      effects: { env: 2, eco: 1, soc: 2 },
      typePoints: { culture: 2, eco: 1 },
      resources: { funds: -2 },
      explanation: "環境と文化が共鳴する都市景観を創出。"
    },
    {
      text: "観光開発で商業的文化を育成",
      effects: { env: -1, eco: 3, soc: 1 },
      typePoints: { tourism: 2, culture: 1 },
      resources: { funds: -2 },
      explanation: "観光収入が増えるが本質文化は薄まる。"
    },
    {
      text: "自然保全優先で開発制限",
      effects: { env: 3, eco: -1, soc: 1 },
      typePoints: { eco: 2 },
      resources: { funds: -1 },
      explanation: "環境は守れるが経済停滞の懸念。"
    }
  ]
},
{
  title: "国際競争力：グローバル都市を目指すか？",
  description: "外国企業・人材・文化を受け入れる戦略を立てる。",
  choices: [
    {
      text: "国際金融・ITハブ都市を目指す",
      effects: { env: -1, eco: 3, soc: 2 },
      typePoints: { urban: 2, science: 1 },
      resources: { funds: -3 },
      explanation: "高収益・高密度の国際都市モデル。"
    },
    {
      text: "多文化共生型の開かれた都市を推進",
      effects: { env: 1, eco: 2, soc: 2 },
      typePoints: { culture: 1, social: 2 },
      resources: { funds: -2 },
      explanation: "住民の幸福度が高い持続的成長モデル。"
    },
    {
      text: "地域密着・内需型に限定",
      effects: { env: 1, eco: 1, soc: 1 },
      typePoints: { agriculture: 1, eco: 1 },
      resources: { funds: -1 },
      explanation: "安定的だが世界競争には弱い。"
    }
  ]
},
{
  title: "教育×技術×文化の融合都市をつくれるか？",
  description: "STEAM教育・創造都市の実現。",
  choices: [
    {
      text: "STEAM特区を創設して学校・企業・文化を連携",
      effects: { env: 1, eco: 2, soc: 3 },
      typePoints: { education: 2, culture: 1, smart: 1 },
      resources: { funds: -3 },
      explanation: "創造性と実用性のバランスが高い。"
    },
    {
      text: "AI教育＋オンライン学習で効率化",
      effects: { env: 1, eco: 2, soc: 1 },
      typePoints: { smart: 2, education: 1 },
      resources: { tech: 2, funds: -2 },
      explanation: "デジタル教育が均等な学びを提供。"
    },
    {
      text: "従来教育の維持で安定重視",
      effects: { env: 0, eco: 1, soc: 1 },
      typePoints: { education: 1 },
      resources: { funds: -1 },
      explanation: "変化には対応しにくいがコストは低い。"
    }
  ]
},
{
  title: "都市デザイン：美と機能のどちらを取る？",
  description: "建築・景観・快適性を考慮した都市空間の方向性を決める。",
  choices: [
    {
      text: "人中心の歩行者空間と公共美術を重視",
      effects: { env: 2, eco: 1, soc: 2 },
      typePoints: { culture: 1, social: 1, eco: 1 },
      resources: { funds: -2 },
      explanation: "幸福度・景観価値の両方が上がる。"
    },
    {
      text: "高層化・効率化で経済性を最優先",
      effects: { env: -1, eco: 3, soc: 0 },
      typePoints: { industry: 2, urban: 1 },
      resources: { funds: -2 },
      explanation: "効率的だが圧迫感や格差が増す。"
    },
    {
      text: "緑地と建築を融合したエコデザイン都市",
      effects: { env: 3, eco: 1, soc: 1 },
      typePoints: { eco: 2, urban: 1 },
      resources: { funds: -3 },
      explanation: "住環境の質が極めて高い。"
    }
  ]
},
{
  title: "市民参加と自治の形をどう進化させる？",
  description: "行政依存から共創へ、ガバナンスの再構築を試みる。",
  choices: [
    {
      text: "住民提案型予算・電子投票を導入",
      effects: { env: 0, eco: 1, soc: 3 },
      typePoints: { social: 2, smart: 1 },
      resources: { tech: 1, funds: -2 },
      explanation: "民主主義が深化し、信頼性が高まる。"
    },
    {
      text: "行政主導を維持して安定運営",
      effects: { env: 0, eco: 2, soc: 1 },
      typePoints: { infra: 1 },
      resources: { funds: -1 },
      explanation: "短期的には安定するがイノベーションは鈍化。"
    },
    {
      text: "AIによる政策決定支援に依存",
      effects: { env: 1, eco: 2, soc: 0 },
      typePoints: { smart: 2 },
      resources: { tech: 2, funds: -2 },
      explanation: "効率化されるが透明性の課題が残る。"
    }
  ]
},
{
  title: "人口減少と空き家問題：どう立ち向かう？",
  description: "維持管理・活用・定住促進の戦略を選ぶ。",
  choices: [
    {
      text: "空き家をリノベして地域拠点化",
      effects: { env: 2, eco: 1, soc: 2 },
      typePoints: { urban: 2, housing: 2 },
      resources: { funds: -2 },
      explanation: "地域資源を活かす持続的解決。"
    },
    {
      text: "外国人・学生誘致で人口流入促進",
      effects: { env: 0, eco: 2, soc: 2 },
      typePoints: { social: 1, culture: 1 },
      resources: { funds: -2 },
      explanation: "多様な人々で地域が再生。"
    },
    {
      text: "取り壊し・再開発で新規需要を創出",
      effects: { env: -1, eco: 3, soc: 0 },
      typePoints: { industry: 1, urban: 1 },
      resources: { funds: -3 },
      explanation: "短期的な活性化だが空洞化リスクも。"
    }
  ]
},
{
  title: "環境悪化・資源枯渇の危機が訪れた…どうする？（崩壊ルート）",
  description: "過剰開発・災害・社会崩壊に直面した都市の選択。",
  choices: [
    {
      text: "大規模リセット政策で再建（都市再生）",
      effects: { env: 3, eco: 0, soc: 2 },
      typePoints: { urban: 3, eco: 2 },
      resources: { funds: -4 },
      explanation: "失われた都市を再構築。新たな希望が芽生える。"
    },
    {
      text: "資源を略奪・軍事支配に移行（荒廃都市化）",
      effects: { env: -3, eco: 1, soc: -3 },
      typePoints: { industry: 2 },
      resources: { energy: 3, funds: -2 },
      explanation: "秩序崩壊。都市が荒廃する最悪の結末。"
    },
    {
      text: "自然への回帰・分散型共同体化",
      effects: { env: 2, eco: -1, soc: 2 },
      typePoints: { agriculture: 2, eco: 1 },
      resources: { food: 3, funds: -1 },
      explanation: "人間と自然が再び共存する小規模社会へ。"
    }
  ]
}
];

