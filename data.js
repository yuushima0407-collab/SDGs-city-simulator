// =====================================================
// data.js v3 — Ver.14.2完全対応版（教育×バランス版）
// =====================================================

const cities = [

  // ---------- 序盤（資源獲得・基盤整備） ----------

  {
    title: "都市のエネルギー政策をどうする？",
    description: "環境と経済のバランスを取りながら、電気の作り方を決めます。",
    choices: [
      {
        text: "🌞 再生可能エネルギーを中心に切り替える",
        label: "環境重視",
        sdgs: [7, 11, 13],
        example: "デンマークは風力発電で電力の多くをまかなう",
        effects: { env: 3, eco: -1, soc: 1 },
        typePoints: { eco: 2, smart: 1 },
        resources: { energy: 2, funds: -2 },
        explanation: "短期コストは高いが、長期的な安定と持続可能性が得られる。"
      },
      {
        text: "⚛ 安定供給を最優先（原子力＋火力）",
        label: "経済重視",
        sdgs: [7, 8, 9],
        example: "フランスは原子力で安定した電力供給を確保",
        effects: { env: -2, eco: 3, soc: 1 },
        typePoints: { industry: 2, infra: 1 },
        resources: { energy: 3, funds: -3 },
        explanation: "大量供給が可能だが、廃棄物やリスクが残る。"
      },
      {
        text: "🏘 地域ごとの小型発電所で分散化",
        label: "分散型・持続重視",
        sdgs: [7, 9, 11],
        example: "スマートグリッドで町ごとに電力を自給",
        effects: { env: 2, eco: 1, soc: 2 },
        typePoints: { smart: 2, eco: 1 },
        resources: { energy: 2, funds: -2 },
        explanation: "災害に強く、地域経済にも良い影響を与える。"
      }
    ]
  },

  {
    title: "産業の伸ばし方は？",
    description: "どんな働き方と産業を中心に育てるかを選びます。",
    choices: [
      {
        text: "🧪 IT・研究・先端技術産業を育成",
        label: "技術重視",
        sdgs: [8, 9],
        example: "研究拠点やスタートアップ支援を整備",
        effects: { env: 0, eco: 3, soc: 1 },
        typePoints: { science: 2, smart: 1 },
        resources: { tech: 2, funds: -3 },
        explanation: "高収入の職が増えるが、初期投資が重い。"
      },
      {
        text: "🏭 製造業・工場を増やす",
        label: "雇用重視",
        sdgs: [8, 9],
        example: "工業団地を整備して雇用を確保",
        effects: { env: -2, eco: 2, soc: 2 },
        typePoints: { industry: 2, social: 1 },
        resources: { labor: 3, funds: -2 },
        explanation: "働く場所が増えるが、環境負荷が高まる。"
      },
      {
        text: "🌿 環境・福祉サービスを中心にする",
        label: "生活重視",
        sdgs: [3, 8, 11],
        example: "福祉・リサイクルなど人を支える産業",
        effects: { env: 2, eco: 1, soc: 2 },
        typePoints: { eco: 1, social: 2 },
        resources: { funds: -2 },
        explanation: "地域に安定をもたらすが、利益は小さい。"
      }
    ]
  },

  {
    title: "交通をどう整える？",
    description: "人と物の流れを支える交通の形を決めます。",
    choices: [
      {
        text: "🚆 公共交通を拡充",
        label: "環境・利便重視",
        sdgs: [9, 11, 13],
        example: "バスや電車の利用促進でCO₂削減",
        effects: { env: 3, eco: 1, soc: 2 },
        typePoints: { transport: 2, eco: 1 },
        resources: { funds: -3 },
        explanation: "渋滞が減るが、運営費用がかかる。"
      },
      {
        text: "🚗 道路整備で物流強化",
        label: "経済重視",
        sdgs: [8, 9],
        example: "車の通行量を増やし物流効率を向上",
        effects: { env: -2, eco: 3, soc: 0 },
        typePoints: { industry: 2, infra: 1 },
        resources: { funds: -2 },
        explanation: "経済効果は高いが、環境負荷が増す。"
      },
      {
        text: "🤖 AI交通制御を導入",
        label: "技術重視",
        sdgs: [9, 11],
        example: "信号・交通量をAIで最適化",
        effects: { env: 1, eco: 2, soc: 2 },
        typePoints: { smart: 2, transport: 1 },
        resources: { tech: 3, funds: -2 },
        explanation: "事故や混雑を減らすが、導入コストが必要。"
      }
    ]
  },

  {
    title: "水の確保と管理をどうする？",
    description: "水不足や洪水への対策を考えます。",
    choices: [
      {
        text: "💧 節水・雨水再利用システムを整備",
        label: "環境重視",
        sdgs: [6, 12, 13],
        example: "建物に雨水タンクを設置",
        effects: { env: 3, eco: 1, soc: 1 },
        typePoints: { eco: 2, smart: 1 },
        resources: { water: 3, funds: -2 },
        explanation: "水を守れるが整備コストがかかる。"
      },
      {
        text: "🏞 ダム建設で安定供給",
        label: "経済・安定重視",
        sdgs: [6, 9],
        example: "大規模ダムで渇水を防ぐ",
        effects: { env: -2, eco: 3, soc: 1 },
        typePoints: { infra: 2, industry: 1 },
        resources: { water: 4, funds: -4 },
        explanation: "安定するが、自然破壊のリスクがある。"
      },
      {
        text: "🕳 地下水に頼る",
        label: "短期重視",
        sdgs: [6, 12],
        example: "安く使えるが枯渇の心配",
        effects: { env: -3, eco: 1, soc: -1 },
        typePoints: { industry: 1 },
        resources: { water: 2, funds: -1 },
        explanation: "短期的には助かるが長期的に危険。"
      }
    ]
  },

  {
    title: "食料をどう確保する？",
    description: "農業・流通・輸入のバランスを考えます。",
    choices: [
      {
        text: "🏡 地産地消・都市農業を推進",
        label: "環境・健康重視",
        sdgs: [2, 11, 12],
        example: "学校屋上で野菜を育て地域で販売",
        effects: { env: 2, eco: 1, soc: 2 },
        typePoints: { agriculture: 2, eco: 1 },
        resources: { food: 3, funds: -2 },
        explanation: "CO₂削減に効果的だが、生産量は限られる。"
      },
      {
        text: "🚢 輸入拡大でコスト削減",
        label: "経済重視",
        sdgs: [8, 9],
        example: "海外からの食料供給を増やす",
        effects: { env: -1, eco: 3, soc: 0 },
        typePoints: { industry: 1, transport: 1 },
        resources: { food: 3, funds: -1 },
        explanation: "安定供給しやすいが、外部依存が高い。"
      },
      {
        text: "🌱 AI・水耕栽培のスマート農業",
        label: "技術重視",
        sdgs: [2, 9, 12],
        example: "自動制御で省エネ栽培",
        effects: { env: 1, eco: 2, soc: 1 },
        typePoints: { smart: 2, agriculture: 1 },
        resources: { tech: 2, funds: -2 },
        explanation: "効率的だが導入コストが必要。"
      }
    ]
  },

  {
    title: "予算をどこに使う？",
    description: "限られた資金の配分を考えます。",
    choices: [
      {
        text: "🏥 福祉・教育に重点投資",
        label: "生活重視",
        sdgs: [3, 4, 10, 11],
        example: "子育て・学び支援・医療充実",
        effects: { env: 0, eco: 1, soc: 3 },
        typePoints: { social: 1, education: 2 },
        resources: { funds: -3 },
        explanation: "将来の安心が増すが、短期経済は鈍化する。"
      },
      {
        text: "🏗 産業・インフラ整備を優先",
        label: "経済重視",
        sdgs: [8, 9],
        example: "工業団地や道路建設",
        effects: { env: -1, eco: 3, soc: 1 },
        typePoints: { industry: 2, infra: 1 },
        resources: { funds: -2 },
        explanation: "成長は早いが格差が広がる可能性。"
      },
      {
        text: "💼 支出を削減して財政健全化",
        label: "財政重視",
        sdgs: [8],
        example: "公共事業を減らして赤字削減",
        effects: { env: 0, eco: 2, soc: -1 },
        typePoints: { urban: 1 },
        resources: { funds: +1 },
        explanation: "短期安定だが生活基盤が弱まる。"
      }
    ]
  },

// （続きは次メッセージ：中盤〜終盤＋崩壊ルート）
  // ---------- 中盤（発展・投資・使うフェーズ） ----------

  {
    title: "インフラの優先投資は？",
    description: "都市の骨格となる基盤整備をどこから進めるか。",
    choices: [
      {
        text: "🛣 道路・橋・鉄道などを整える",
        label: "物流重視",
        sdgs: [9, 11],
        example: "移動コストを下げて経済を活性化",
        effects: { env: -1, eco: 3, soc: 1 },
        typePoints: { infra: 2, transport: 1 },
        resources: { funds: -3 },
        explanation: "経済効果は高いが、環境負荷も増す。"
      },
      {
        text: "📡 通信・エネルギー網を強化",
        label: "未来重視",
        sdgs: [7, 9, 11],
        example: "インターネットや電力網を災害に強く",
        effects: { env: 1, eco: 2, soc: 2 },
        typePoints: { smart: 2, infra: 1 },
        resources: { tech: 3, funds: -2 },
        explanation: "デジタル社会の基盤を作るが、維持コストがある。"
      },
      {
        text: "🔧 最低限の補修にとどめる",
        label: "節約重視",
        sdgs: [8],
        example: "古い道路などの補修を優先",
        effects: { env: 0, eco: 1, soc: -1 },
        typePoints: { urban: 1 },
        resources: { funds: -1 },
        explanation: "出費は抑えられるが老朽化リスクが残る。"
      }
    ]
  },

  {
    title: "雇用と働き方をどう支える？",
    description: "企業・人材・賃金のバランスを考えます。",
    choices: [
      {
        text: "📘 学び直し・スキル教育に投資",
        label: "教育重視",
        sdgs: [4, 8, 10],
        example: "職業訓練やITスキル講座を充実",
        effects: { env: 0, eco: 1, soc: 3 },
        typePoints: { education: 2, social: 1 },
        resources: { funds: -2 },
        explanation: "長期的な雇用安定につながる。"
      },
      {
        text: "🏢 企業誘致・起業支援を強化",
        label: "経済重視",
        sdgs: [8, 9],
        example: "新企業の進出で雇用を創出",
        effects: { env: -1, eco: 3, soc: 1 },
        typePoints: { industry: 2, urban: 1 },
        resources: { funds: -3 },
        explanation: "短期で景気を押し上げるが格差リスクも。"
      },
      {
        text: "💴 賃金上昇を抑制して企業を守る",
        label: "財政・雇用重視",
        sdgs: [8],
        example: "企業コストは減るが生活は苦しくなる",
        effects: { env: 0, eco: 2, soc: -2 },
        typePoints: { industry: 1 },
        resources: { funds: -1 },
        explanation: "企業側は助かるが、購買力が落ちる。"
      }
    ]
  },

  {
    title: "エネルギーの組み合わせをどうする？",
    description: "リスク分散と供給安定をめざします。",
    choices: [
      {
        text: "🔋 再エネ＋水素＋蓄電を組み合わせる",
        label: "バランス重視",
        sdgs: [7, 9, 13],
        example: "不足分を蓄電池で補うミックス電源",
        effects: { env: 3, eco: 1, soc: 1 },
        typePoints: { eco: 1, smart: 1 },
        resources: { energy: 3, funds: -3 },
        explanation: "長期安定と安全性が高い。"
      },
      {
        text: "⚛ 原子力・火力に依存する",
        label: "安定重視",
        sdgs: [7, 9],
        example: "ベース電源を強化し大規模供給",
        effects: { env: -2, eco: 3, soc: 0 },
        typePoints: { industry: 2, infra: 1 },
        resources: { energy: 4, funds: -4 },
        explanation: "即効性はあるが環境リスクが残る。"
      },
      {
        text: "⛽ 化石燃料中心を維持",
        label: "短期重視",
        sdgs: [7, 8],
        example: "コスト安だが将来負担が増す",
        effects: { env: -3, eco: 2, soc: -1 },
        typePoints: { industryHeavy: 1 },
        resources: { energy: 3, funds: -1 },
        explanation: "短期安定だが価格変動に弱い。"
      }
    ]
  },

  {
    title: "教育の質を上げるには？",
    description: "学びが人と町を成長させます。",
    choices: [
      {
        text: "🏫 大学・研究との連携を強化",
        label: "技術・教育重視",
        sdgs: [4, 8, 9],
        example: "研究成果を地域に還元",
        effects: { env: 0, eco: 2, soc: 2 },
        typePoints: { education: 2, science: 1 },
        resources: { tech: 2, funds: -3 },
        explanation: "新産業を生む土壌が育つ。"
      },
      {
        text: "📗 奨学金・再教育支援を拡大",
        label: "生活・教育重視",
        sdgs: [4, 8, 10],
        example: "学び直しでキャリア再構築を支援",
        effects: { env: 0, eco: 1, soc: 3 },
        typePoints: { education: 2, social: 1 },
        resources: { labor: 2, funds: -2 },
        explanation: "チャンスが広がるが予算を圧迫。"
      },
      {
        text: "💸 教育費を削減し財政改善",
        label: "財政重視",
        sdgs: [8],
        example: "教育支出を削って他分野へ回す",
        effects: { env: 0, eco: 2, soc: -2 },
        typePoints: { industry: 1 },
        resources: { funds: +1 },
        explanation: "短期財政は改善するが将来の人材が減る。"
      }
    ]
  },

  {
    title: "医療と福祉をどう強くする？",
    description: "誰も取り残さない町をめざす。",
    choices: [
      {
        text: "🏠 在宅医療・地域ケアを拡張",
        label: "生活重視",
        sdgs: [3, 10, 11],
        example: "家でも医療・介護が受けられる体制",
        effects: { env: 0, eco: 1, soc: 3 },
        typePoints: { welfare: 2, social: 1 },
        resources: { labor: 2, funds: -2 },
        explanation: "安心して暮らせる社会を作る。"
      },
      {
        text: "🩺 遠隔診療・AI医療を導入",
        label: "技術重視",
        sdgs: [3, 9],
        example: "AIと通信で診療効率を上げる",
        effects: { env: 1, eco: 2, soc: 2 },
        typePoints: { smart: 1, welfare: 1 },
        resources: { tech: 3, funds: -2 },
        explanation: "利便性が上がるが導入コストあり。"
      },
      {
        text: "🏢 民間委託で効率化",
        label: "経済重視",
        sdgs: [8, 9],
        example: "医療事業を民間と連携",
        effects: { env: 0, eco: 3, soc: -1 },
        typePoints: { industry: 1 },
        resources: { funds: -1 },
        explanation: "費用は下がるが公共性の維持が課題。"
      }
    ]
  },

  {
    title: "住みやすい家と町をどう作る？",
    description: "家賃・環境・利便性のバランスを考えます。",
    choices: [
      {
        text: "🏘 公的住宅を増やし家賃を抑える",
        label: "生活重視",
        sdgs: [10, 11],
        example: "低所得者や若者を支援する住宅政策",
        effects: { env: 0, eco: 1, soc: 3 },
        typePoints: { housing: 2, social: 1 },
        resources: { funds: -3 },
        explanation: "暮らしやすさは増すが財政圧迫。"
      },
      {
        text: "🏠 断熱改修などエコ住宅支援",
        label: "環境重視",
        sdgs: [7, 11, 13],
        example: "省エネ化リフォームを助成",
        effects: { env: 3, eco: 1, soc: 1 },
        typePoints: { eco: 1, housing: 1 },
        resources: { tech: 2, funds: -2 },
        explanation: "環境と快適さを両立。"
      },
      {
        text: "🏗 規制緩和で民間開発促進",
        label: "経済重視",
        sdgs: [8, 9],
        example: "建築規制を緩めて供給拡大",
        effects: { env: -1, eco: 3, soc: 1 },
        typePoints: { industry: 2, urban: 1 },
        resources: { funds: -1 },
        explanation: "成長は早いが景観維持が課題。"
      }
    ]
  },

  {
    title: "文化と観光で町を元気にする？",
    description: "経済と地域の魅力の両立を目指します。",
    choices: [
      {
        text: "🏛 文化施設を整備",
        label: "文化重視",
        sdgs: [4, 11],
        example: "図書館・博物館・劇場などを整備",
        effects: { env: 1, eco: 1, soc: 3 },
        typePoints: { culture: 2, education: 1 },
        resources: { funds: -3 },
        explanation: "交流が増えるが維持費がかかる。"
      },
      {
        text: "🎨 市民参加型アートや祭りを支援",
        label: "生活重視",
        sdgs: [11],
        example: "地域が主役のイベント",
        effects: { env: 1, eco: 2, soc: 2 },
        typePoints: { culture: 1, social: 1 },
        resources: { funds: -2 },
        explanation: "人のつながりが強くなる。"
      },
      {
        text: "🏨 国際会議・大型リゾートを誘致",
        label: "経済重視",
        sdgs: [8, 9],
        example: "観光と外貨獲得を強化",
        effects: { env: -2, eco: 3, soc: 1 },
        typePoints: { tourism: 2, industry: 1 },
        resources: { funds: -3 },
        explanation: "景気には効くが環境に負荷。"
      }
    ]
  },

  {
    title: "自然環境と生物多様性を守るには？",
    description: "人と自然が共に生きる町づくりを考えます。",
    choices: [
      {
        text: "🌲 緑地や公園を拡大",
        label: "環境重視",
        sdgs: [13, 15],
        example: "都市の中に森や池を残す",
        effects: { env: 3, eco: 1, soc: 2 },
        typePoints: { eco: 2, culture: 1 },
        resources: { funds: -3 },
        explanation: "住みやすさと観光にも貢献。"
      },
      {
        text: "🏭 経済優先で開発を進める",
        label: "経済重視",
        sdgs: [8, 9],
        example: "自然より雇用を重視した開発",
        effects: { env: -3, eco: 3, soc: 0 },
        typePoints: { industryHeavy: 1 },
        resources: { funds: -2 },
        explanation: "短期利益は大きいが環境劣化のリスク。"
      },
      {
        text: "🤝 自然保全ボランティアを推進",
        label: "社会・教育重視",
        sdgs: [13, 15],
        example: "住民と企業が協力して清掃・保全",
        effects: { env: 2, eco: 1, soc: 3 },
        typePoints: { social: 1, eco: 1 },
        resources: { funds: -1 },
        explanation: "意識が高まり、持続的な町づくりへ。"
      }
    ]
  },

  {
    title: "防災・レジリエンスを高めるには？",
    description: "災害に強い町を作ります。",
    choices: [
      {
        text: "🧱 耐震・避難網を強化",
        label: "安全重視",
        sdgs: [9, 11, 13],
        example: "地震や水害対策を一体整備",
        effects: { env: 1, eco: 1, soc: 3 },
        typePoints: { infra: 1, welfare: 1 },
        resources: { funds: -3 },
        explanation: "命を守るための長期投資。"
      },
      {
        text: "🛰 デジタルツインで被害予測",
        label: "技術重視",
        sdgs: [9, 11, 13],
        example: "仮想空間で避難経路を最適化",
        effects: { env: 1, eco: 2, soc: 2 },
        typePoints: { smart: 2, infra: 1 },
        resources: { tech: 3, funds: -2 },
        explanation: "災害前の備えを効率化できる。"
      },
      {
        text: "📦 保険・備蓄で最小限対策",
        label: "コスト重視",
        sdgs: [11],
        example: "復旧を早めるための備え中心",
        effects: { env: 0, eco: 1, soc: 1 },
        typePoints: { welfare: 1 },
        resources: { funds: -1 },
        explanation: "安価だが被害を防ぐ力は弱い。"
      }
    ]
  },

  // ---------- 終盤・崩壊・再生フェーズ ----------

  {
    title: "資源枯渇・環境悪化の危機…どう動く？",
    description: "これまでの選択の結果、都市が試される時です。",
    choices: [
      {
        text: "🔁 インフラ再生・再エネ復旧計画を進める",
        label: "再生重視",
        sdgs: [9, 11, 13],
        example: "壊れた設備を修復し持続性を再構築",
        effects: { env: 3, eco: 1, soc: 2 },
        typePoints: { urban: 2, eco: 1 },
        resources: { funds: -4 },
        explanation: "大変だが希望ある再建ルート。"
      },
      {
        text: "⚠ 資源を奪い合う混乱（荒廃ルート）",
        label: "短期重視",
        sdgs: [],
        example: "秩序が崩れ格差と対立が激化",
        effects: { env: -3, eco: 1, soc: -3 },
        typePoints: { industryHeavy: 1 },
        resources: { energy: 2, funds: -2 },
        explanation: "すぐの延命だが、長期の対立・荒廃を招きやすい。"
      },
      {
        text: "🌱 小さなコミュニティで自給自足を進める",
        label: "生活・環境重視",
        sdgs: [2, 11, 12, 13, 15],
        example: "分散型の菜園・共同発電・助け合い",
        effects: { env: 2, eco: -1, soc: 2 },
        typePoints: { agriculture: 1, eco: 1 },
        resources: { food: 2, funds: -1 },
        explanation: "回復はゆっくりだが安定感がある。"
      }
    ]
  },

  // ---------- エンディング前の調整（データ・プライバシー・統治） ----------

  {
    title: "データの活用とプライバシーをどう両立？",
    description: "スマートシティ化で集まるデータの扱いが問われます。",
    choices: [
      {
        text: "🔐 住民中心のデータ信託（オプトイン）",
        label: "権利・透明性重視",
        sdgs: [9, 11, 16],
        example: "目的限定・開示・削除請求を保証",
        effects: { env: 0, eco: 1, soc: 3 },
        typePoints: { smart: 1, social: 1, governance: 1 },
        resources: { tech: 2, funds: -2 },
        explanation: "信頼を得やすく、長期の協力を生む。"
      },
      {
        text: "📊 産官学で匿名化データを共同利用",
        label: "イノベーション重視",
        sdgs: [8, 9, 11],
        example: "渋滞・エネルギー最適化に応用",
        effects: { env: 1, eco: 2, soc: 1 },
        typePoints: { smart: 2, infra: 1 },
        resources: { tech: 2, funds: -2 },
        explanation: "成果は出やすいが、ガバナンス設計が鍵。"
      },
      {
        text: "🚫 収集最小・紙中心で慎重運用",
        label: "リスク回避重視",
        sdgs: [16],
        example: "漏えいリスクは低いが効率も低い",
        effects: { env: 0, eco: -1, soc: 1 },
        typePoints: { governance: 1 },
        resources: { funds: -1 },
        explanation: "短期安心だが、改善スピードは落ちる。"
      }
    ]
  },

  {
    title: "気候適応：猛暑・豪雨にどう備える？",
    description: "緩和（Mitigation）だけでなく適応（Adaptation）も必要です。",
    choices: [
      {
        text: "🌳 ヒートアイランド対策（遮熱舗装・街路樹）",
        label: "環境・健康重視",
        sdgs: [3, 11, 13, 15],
        example: "木陰・クールルーフ・ミスト散布",
        effects: { env: 3, eco: 1, soc: 2 },
        typePoints: { eco: 2, culture: 1 },
        resources: { funds: -3 },
        explanation: "体感温度を下げ熱中症リスクを減らす。"
      },
      {
        text: "🏘 浸水想定に合わせた立地誘導・移住支援",
        label: "安全・都市計画重視",
        sdgs: [9, 11, 13],
        example: "居住誘導区域と移転補助で回復力を高める",
        effects: { env: 1, eco: 1, soc: 2 },
        typePoints: { urban: 2, welfare: 1 },
        resources: { funds: -2 },
        explanation: "長期の被害と保険コストを減らせる。"
      },
      {
        text: "🛑 既存対策の維持にとどめる",
        label: "コスト重視",
        sdgs: [8],
        example: "新規投資は抑制、既存施設の補修中心",
        effects: { env: 0, eco: 1, soc: -1 },
        typePoints: { industry: 1 },
        resources: { funds: -1 },
        explanation: "当面の出費は少ないが被害拡大の懸念。"
      }
    ]
  },

  {
    title: "サーキュラー経済を加速できる？",
    description: "廃棄物を資源に戻し、地元で循環させます。",
    choices: [
      {
        text: "♻ 産業共生（熱・素材の相互利用）を推進",
        label: "環境・産業重視",
        sdgs: [7, 9, 12, 13],
        example: "工場Aの廃熱→工場Bのプロセスに再利用",
        effects: { env: 3, eco: 2, soc: 1 },
        typePoints: { eco: 2, industry: 1, infra: 1 },
        resources: { energy: 2, funds: -3 },
        explanation: "CO₂とコストを同時に削減できる。"
      },
      {
        text: "🧩 拡大生産者責任（EPR）と修理権を導入",
        label: "制度・市民重視",
        sdgs: [12, 13],
        example: "長持ち設計・パーツ供給・修理市場の活性化",
        effects: { env: 2, eco: 1, soc: 2 },
        typePoints: { governance: 1, eco: 1, social: 1 },
        resources: { funds: -1 },
        explanation: "廃棄量が減り、地域の仕事が増える。"
      },
      {
        text: "🚛 既存の回収スキームを維持",
        label: "コスト重視",
        sdgs: [8, 12],
        example: "分別・回収は現状維持",
        effects: { env: -1, eco: 1, soc: 0 },
        typePoints: { industry: 1 },
        resources: { funds: -1 },
        explanation: "費用は抑えられるが効果は限定的。"
      }
    ]
  }

  // --- ここまで（後半）。このファイルの前半と結合して cities[] を閉じてください ---
];

// エクスポート（必要に応じて）
// export default cities;
