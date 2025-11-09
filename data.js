const cities = [
  {
    title: "エネルギーの使い方をどうする？",
    description: "電力消費が増える中、都市としてのエネルギー方針を決定します。",
    choices: [
      {
        text: "🌞 再生可能エネルギーへの転換を進める（🔸）",
        label: "環境重視",
        sdgs: [7, 13],
        effects: { env: +3, eco: -1, soc: +1 },
        resources: { funds: -5, energy: +2 },
        example: "デンマークの風力発電政策",
        typePoints: { eco: +1, smart: +0.5 }
      },
      {
        text: "⚙️ 火力発電を増設して供給を安定化（🔸）",
        label: "経済重視",
        sdgs: [8, 9],
        effects: { env: -2, eco: +3, soc: 0 },
        resources: { funds: -4, energy: +5 },
        example: "中国の石炭火力発電依存",
        typePoints: { industry: +1, infra: +0.5 }
      },
      {
        text: "💡 省エネキャンペーンを実施（🔹）",
        label: "バランス型",
        sdgs: [11, 12],
        effects: { env: +1, eco: +1, soc: +1 },
        resources: { funds: 0, energy: +1 },
        example: "日本のクールビズ運動",
        typePoints: { social: +0.5, eco: +0.5 }
      },
    ],
  },
  {
    title: "雇用を増やすための第一歩は？",
    description: "地域の失業率が上がっています。まずどの対策を取りますか？",
    choices: [
      {
        text: "🏭 産業団地を整備して企業誘致（🔺）",
        label: "経済重視",
        sdgs: [8, 9],
        effects: { env: -2, eco: +4, soc: +1 },
        resources: { funds: -8, labor: +2 },
        typePoints: { industry: +1, infra: +0.5 }
      },
      {
        text: "👩‍🏫 職業訓練学校を設立（🔸）",
        label: "社会重視",
        sdgs: [4, 8],
        effects: { env: 0, eco: +2, soc: +3 },
        resources: { funds: -6, tech: +1 },
        typePoints: { education: +1, social: +0.5 }
      },
      {
        text: "🤝 既存企業に雇用維持を要請（🔹）",
        label: "バランス型",
        sdgs: [8],
        effects: { env: 0, eco: +1, soc: +1 },
        resources: { funds: -2, labor: +1 },
        typePoints: { social: +0.5, industry: +0.3 }
      },
    ],
  },
  {
    title: "食料自給率を上げるには？",
    description: "食料輸入への依存を減らしたいと考えています。",
    choices: [
      {
        text: "🚜 農地を拡大して国内生産を強化（🔸）",
        label: "農業重視",
        sdgs: [2, 12],
        effects: { env: -1, eco: +2, soc: +2 },
        resources: { funds: -5, food: +6 },
        typePoints: { agriculture: +1, eco: +0.3 }
      },
      {
        text: "🤝 食品ロスを減らすキャンペーン（🔹）",
        label: "環境重視",
        sdgs: [12, 13],
        effects: { env: +3, eco: 0, soc: +1 },
        resources: { funds: 0, food: +2 },
        typePoints: { eco: +1, social: +0.5 }
      },
      {
        text: "📦 海外からの安価な輸入に頼る（🔸）",
        label: "短期経済重視",
        sdgs: [8],
        effects: { env: -2, eco: +3, soc: -1 },
        resources: { funds: -2, food: +3 },
        typePoints: { industry: +1 }
      },
    ],
  },
  {
    title: "交通インフラを改善する？",
    description: "市内交通が渋滞しています。改善の方針を選びます。",
    choices: [
      {
        text: "🚈 公共交通を拡充（🔸）",
        label: "社会重視",
        sdgs: [9, 11],
        effects: { env: +1, eco: +2, soc: +2 },
        resources: { funds: -6, energy: -1 },
        typePoints: { transport: +1, social: +0.5 }
      },
      {
        text: "🚗 高速道路を延伸して流通強化（🔺）",
        label: "経済重視",
        sdgs: [8, 9],
        effects: { env: -2, eco: +3, soc: +1 },
        resources: { funds: -8, energy: -2 },
        typePoints: { industry: +1, infra: +1 }
      },
      {
        text: "🚶 徒歩・自転車通勤を推進（🔹）",
        label: "環境重視",
        sdgs: [3, 11],
        effects: { env: +3, eco: 0, soc: +1 },
        resources: { funds: -1, energy: 0 },
        typePoints: { eco: +1, transport: +0.5 }
      },
    ],
  },
  {
    title: "教育への投資は？",
    description: "教育予算をどう配分するか決めます。",
    choices: [
      {
        text: "👩‍🏫 学校のICT環境を整備（🔸）",
        label: "未来投資型",
        sdgs: [4, 9],
        effects: { env: 0, eco: +2, soc: +3 },
        resources: { funds: -5, tech: +3 },
        typePoints: { education: +1, smart: +0.5 }
      },
      {
        text: "📚 奨学金制度を拡充（🔹）",
        label: "社会重視",
        sdgs: [4, 10],
        effects: { env: 0, eco: 0, soc: +2 },
        resources: { funds: -3, labor: +1 },
        typePoints: { social: +1, education: +0.5 }
      },
      {
        text: "⏸ 教育支出を一時凍結（🔹）",
        label: "短期節約型",
        sdgs: [8],
        effects: { env: 0, eco: +1, soc: -2 },
        resources: { funds: +3 },
        typePoints: { industry: +0.5 }
      },
    ],
  },
  {
    title: "水資源を守るには？",
    description: "渇水が続く地域で水資源の管理方針を決めます。",
    choices: [
      {
        text: "💧 節水キャンペーンを行う（🔹）",
        label: "市民参加型",
        sdgs: [6, 11],
        effects: { env: +2, eco: 0, soc: +1 },
        resources: { funds: -1, water: +2 },
        typePoints: { social: +1, eco: +0.5 }
      },
      {
        text: "🚰 ダムを新設して貯水量確保（🔸）",
        label: "インフラ重視",
        sdgs: [6, 9],
        effects: { env: -1, eco: +2, soc: +1 },
        resources: { funds: -6, water: +4 },
        typePoints: { infra: +1, industry: +0.3 }
      },
      {
        text: "🌦️ 雨水再利用システム導入（🔸）",
        label: "技術重視",
        sdgs: [6, 13],
        effects: { env: +3, eco: +1, soc: 0 },
        resources: { funds: -5, tech: +2 },
        typePoints: { smart: +1, eco: +0.5 }
      },
    ],
  },
  {
    title: "再生素材を活かす？",
    description: "ゴミ処理費が増大しています。新しい循環システムを導入しますか？",
    choices: [
      {
        text: "♻️ リサイクルセンターを設立（🔸）",
        label: "環境重視",
        sdgs: [12, 13],
        effects: { env: +3, eco: +1, soc: +1 },
        resources: { funds: -6, recycled: +4 },
        typePoints: { eco: +1, infra: +0.3 }
      },
      {
        text: "🔥 焼却施設を大型化（🔸）",
        label: "経済重視",
        sdgs: [8, 9],
        effects: { env: -3, eco: +3, soc: 0 },
        resources: { funds: -5, energy: +2 },
        typePoints: { industry: +1, infra: +0.3 }
      },
      {
        text: "🗑️ ごみ削減の啓発を行う（🔹）",
        label: "社会重視",
        sdgs: [11, 12],
        effects: { env: +2, eco: 0, soc: +2 },
        resources: { funds: -1, recycled: +1 },
        typePoints: { social: +1, eco: +0.5 }
      },
    ],
  },
  {
    title: "都市のデジタル化を進める？",
    description: "市民サービスの効率化を目的に、スマートシティ化を検討します。",
    choices: [
      {
        text: "💻 行政手続きを全面オンライン化（🔺）",
        label: "技術重視",
        sdgs: [9, 16],
        effects: { env: +1, eco: +3, soc: +1 },
        resources: { funds: -8, tech: +3 },
        typePoints: { smart: +1, governance: +0.5 }
      },
      {
        text: "📱 一部窓口だけデジタル化（🔸）",
        label: "バランス型",
        sdgs: [9, 11],
        effects: { env: 0, eco: +1, soc: +1 },
        resources: { funds: -4, tech: +1 },
        typePoints: { smart: +0.5, social: +0.3 }
      },
      {
        text: "🧓 高齢者向け講習会を開催（🔹）",
        label: "社会重視",
        sdgs: [10, 11],
        effects: { env: 0, eco: 0, soc: +2 },
        resources: { funds: -2 },
        typePoints: { social: +1, education: +0.3 }
      },
    ],
  },
  {
    title: "観光業をどう育てる？",
    description: "地域経済の柱として観光に力を入れるか検討します。",
    choices: [
      {
        text: "🏯 歴史的街並みを整備（🔸）",
        label: "文化重視",
        sdgs: [8, 11],
        effects: { env: +1, eco: +3, soc: +2 },
        resources: { funds: -6, labor: +1 },
        typePoints: { culture: +1, tourism: +0.5 }
      },
      {
        text: "🎢 大型リゾートを建設（🔺）",
        label: "経済重視",
        sdgs: [8, 9],
        effects: { env: -3, eco: +5, soc: +1 },
        resources: { funds: -10, energy: -3 },
        typePoints: { industry: +1, tourism: +0.5 }
      },
      {
        text: "🚶‍♀️ エコツーリズムを推進（🔹）",
        label: "環境重視",
        sdgs: [13, 15],
        effects: { env: +3, eco: +1, soc: +2 },
        resources: { funds: -3, energy: 0 },
        typePoints: { eco: +1, tourism: +0.5 }
      },
    ],
  },
  {
    title: "AI技術の導入をどうする？",
    description: "行政や産業にAIを活用する方針を考えます。",
    choices: [
      {
        text: "🤖 AI自動化システムを導入（🔺）",
        label: "技術重視",
        sdgs: [9, 11],
        effects: { env: +1, eco: +4, soc: -1 },
        resources: { funds: -8, tech: +4 },
        typePoints: { smart: +1, industry: +0.5 }
      },
      {
        text: "👥 人とAIの共存ガイドライン策定（🔸）",
        label: "社会重視",
        sdgs: [8, 10],
        effects: { env: 0, eco: +2, soc: +2 },
        resources: { funds: -4, tech: +1 },
        typePoints: { social: +1, governance: +0.3 }
      },
      {
        text: "🧑‍🏫 AIリテラシー教育を実施（🔹）",
        label: "教育重視",
        sdgs: [4, 9],
        effects: { env: 0, eco: +1, soc: +2 },
        resources: { funds: -3, tech: +1 },
        typePoints: { education: +1, smart: +0.5 }
      },
    ],
  },
  {
    title: "住宅政策をどうする？",
    description: "都市の人口増加に伴い、住宅政策の方向を決めます。",
    choices: [
      {
        text: "🏢 高層住宅を建設（🔸）",
        label: "経済重視",
        sdgs: [9, 11],
        effects: { env: -2, eco: +3, soc: +2 },
        resources: { funds: -7, labor: +1 },
        typePoints: { industry: +1, infra: +0.5 }
      },
      {
        text: "🌳 郊外にエコ住宅を整備（🔸）",
        label: "環境重視",
        sdgs: [11, 13],
        effects: { env: +2, eco: +1, soc: +1 },
        resources: { funds: -6, energy: -1 },
        typePoints: { eco: +1, social: +0.3 }
      },
      {
        text: "🏠 空き家再利用促進（🔹）",
        label: "社会重視",
        sdgs: [11, 12],
        effects: { env: +2, eco: +1, soc: +2 },
        resources: { funds: -2 },
        typePoints: { social: +1, eco: +0.3 }
      },
    ],
  },
  {
    title: "交通エネルギー改革",
    description: "ガソリン車中心の社会をどう変える？",
    choices: [
      {
        text: "🚙 EV補助金を拡大（🔸）",
        label: "環境重視",
        sdgs: [7, 13],
        effects: { env: +3, eco: +1, soc: +1 },
        resources: { funds: -5, energy: -1 },
        typePoints: { eco: +1, smart: +0.5 }
      },
      {
        text: "⛽ 石油産業を保護して雇用維持（🔹）",
        label: "経済重視",
        sdgs: [8],
        effects: { env: -2, eco: +2, soc: 0 },
        resources: { funds: -3, energy: +2 },
        typePoints: { industry: +1 }
      },
      {
        text: "🚲 自転車専用道路を拡充（🔹）",
        label: "社会重視",
        sdgs: [3, 11],
        effects: { env: +2, eco: +1, soc: +2 },
        resources: { funds: -2, energy: 0 },
        typePoints: { social: +1, eco: +0.5 }
      },
    ],
  },
  {
    title: "気候変動への対応",
    description: "異常気象が多発。市としてどの対策を優先しますか？",
    choices: [
      {
        text: "🌲 森林吸収源の拡大（🔸）",
        label: "環境重視",
        sdgs: [13, 15],
        effects: { env: +4, eco: 0, soc: +1 },
        resources: { funds: -6, labor: -1 },
        typePoints: { eco: +1, agriculture: +0.5 }
      },
      {
        text: "🏗 インフラ耐災害化（🔸）",
        label: "安全重視",
        sdgs: [9, 11],
        effects: { env: +1, eco: +2, soc: +2 },
        resources: { funds: -6 },
        typePoints: { infra: +1, governance: +0.3 }
      },
      {
        text: "🧯 市民防災訓練を強化（🔹）",
        label: "社会重視",
        sdgs: [11, 13],
        effects: { env: +1, eco: 0, soc: +2 },
        resources: { funds: -2 },
        typePoints: { social: +1, governance: +0.3 }
      },
    ],
  },
  {
    title: "技術開発の方向性",
    description: "研究予算をどの分野に配分しますか？",
    choices: [
      {
        text: "🔋 再エネ技術を強化（🔸）",
        label: "環境重視",
        sdgs: [7, 9],
        effects: { env: +3, eco: +2, soc: +1 },
        resources: { funds: -6, tech: +2 },
        typePoints: { eco: +1, smart: +0.5 }
      },
      {
        text: "⚙️ 産業ロボット開発支援（🔸）",
        label: "経済重視",
        sdgs: [8, 9],
        effects: { env: -1, eco: +4, soc: 0 },
        resources: { funds: -6, tech: +3 },
        typePoints: { industry: +1, smart: +0.3 }
      },
      {
        text: "👩‍🔬 教育・基礎研究に投資（🔹）",
        label: "社会重視",
        sdgs: [4, 9],
        effects: { env: +1, eco: +1, soc: +2 },
        resources: { funds: -3, tech: +1 },
        typePoints: { education: +1, social: +0.5 }
      },
    ],
  },
  {
    title: "都市文化をどう守る？",
    description: "急速な近代化の中で、伝統や地域文化が失われつつあります。",
    choices: [
      {
        text: "🎭 伝統祭り・工芸の保存に投資（🔸）",
        label: "文化重視",
        sdgs: [11],
        effects: { env: +1, eco: +1, soc: +3 },
        resources: { funds: -4 },
        typePoints: { culture: +1, social: +0.3 }
      },
      {
        text: "🏙 文化施設を再開発エリアに統合（🔸）",
        label: "経済重視",
        sdgs: [8, 11],
        effects: { env: -1, eco: +3, soc: +1 },
        resources: { funds: -5 },
        typePoints: { industry: +1, culture: +0.3 }
      },
      {
        text: "🎨 市民ボランティアで保存活動（🔹）",
        label: "社会重視",
        sdgs: [10, 11],
        effects: { env: +1, eco: 0, soc: +2 },
        resources: { funds: -1, labor: +1 },
        typePoints: { social: +1, culture: +0.5 }
      },
    ],
  },
  {
    title: "健康と福祉の充実",
    description: "高齢化が進み、医療・福祉サービスが逼迫しています。",
    choices: [
      {
        text: "🏥 公立病院を増設（🔺）",
        label: "社会重視",
        sdgs: [3, 10],
        effects: { env: 0, eco: +1, soc: +4 },
        resources: { funds: -8, labor: -1 },
        typePoints: { social: +1, governance: +0.5 }
      },
      {
        text: "💊 予防医療・健康教育に注力（🔸）",
        label: "持続型",
        sdgs: [3, 4],
        effects: { env: +1, eco: 0, soc: +3 },
        resources: { funds: -5 },
        typePoints: { education: +1, social: +0.3 }
      },
      {
        text: "💸 医療費補助を削減（🔹）",
        label: "短期経済重視",
        sdgs: [8],
        effects: { env: 0, eco: +2, soc: -2 },
        resources: { funds: +3 },
        typePoints: { industry: +1 }
      },
    ],
  },
  {
    title: "地域間格差への対応",
    description: "中心市街地と郊外で格差が拡大しています。どうしますか？",
    choices: [
      {
        text: "🏘 郊外開発に補助金を支給（🔸）",
        label: "社会重視",
        sdgs: [10, 11],
        effects: { env: -1, eco: +2, soc: +3 },
        resources: { funds: -6 },
        typePoints: { social: +1, infra: +0.5 }
      },
      {
        text: "🏢 都心部集中開発で効率化（🔸）",
        label: "経済重視",
        sdgs: [8, 9],
        effects: { env: -2, eco: +4, soc: -1 },
        resources: { funds: -6, energy: -2 },
        typePoints: { industry: +1, infra: +0.5 }
      },
      {
        text: "🤝 コミュニティ再生プログラム（🔹）",
        label: "社会重視",
        sdgs: [11, 16],
        effects: { env: +1, eco: +1, soc: +2 },
        resources: { funds: -2 },
        typePoints: { social: +1, governance: +0.3 }
      },
    ],
  },
  {
    title: "産業構造を転換する？",
    description: "伝統的産業中心の構造を、新しい時代へどう転換する？",
    choices: [
      {
        text: "🔧 グリーン産業支援（🔸）",
        label: "環境×経済型",
        sdgs: [9, 13],
        effects: { env: +3, eco: +3, soc: +1 },
        resources: { funds: -6, tech: +2 },
        typePoints: { eco: +1, industry: +1 }
      },
      {
        text: "🏭 重工業を維持して雇用確保（🔸）",
        label: "短期安定型",
        sdgs: [8, 9],
        effects: { env: -3, eco: +4, soc: +1 },
        resources: { funds: -5, energy: -2 },
        typePoints: { industry: +1, infra: +0.3 }
      },
      {
        text: "🚀 新産業創出プロジェクトを公募（🔹）",
        label: "革新型",
        sdgs: [9],
        effects: { env: +1, eco: +2, soc: +2 },
        resources: { funds: -4, tech: +2 },
        typePoints: { smart: +1, industry: +0.5 }
      },
    ],
  },
  {
    title: "防衛・安全保障への投資",
    description: "国際緊張が高まる中、防衛・安全のバランスを考えます。",
    choices: [
      {
        text: "🛡 防災・防衛研究に資金投下（🔸）",
        label: "安全重視",
        sdgs: [16],
        effects: { env: -1, eco: +2, soc: +2 },
        resources: { funds: -6, tech: +1 },
        typePoints: { governance: +1, smart: +0.3 }
      },
      {
        text: "🕊 平和教育・外交対話に注力（🔹）",
        label: "平和重視",
        sdgs: [16, 17],
        effects: { env: +1, eco: 0, soc: +3 },
        resources: { funds: -2 },
        typePoints: { social: +1, education: +0.3 }
      },
      {
        text: "💰 軍需産業を育成（🔺）",
        label: "経済重視",
        sdgs: [8, 9],
        effects: { env: -3, eco: +4, soc: -1 },
        resources: { funds: -8, energy: -2 },
        typePoints: { industry: +1, infra: +0.3 }
      },
    ],
  },
  {
    title: "持続可能な未来への最終判断",
    description: "20年間の政策の集大成。あなたの都市の未来をどう定義しますか？",
    choices: [
      {
        text: "🌿 人と自然の共存を最優先にする（🔸）",
        label: "環境重視",
        sdgs: [13, 15],
        effects: { env: +5, eco: -1, soc: +2 },
        resources: { funds: -5, energy: -1 },
        typePoints: { eco: +1, social: +0.5 }
      },
      {
        text: "🏭 経済成長を維持し雇用を安定化（🔸）",
        label: "経済重視",
        sdgs: [8, 9],
        effects: { env: -3, eco: +5, soc: +1 },
        resources: { funds: -5, energy: -2 },
        typePoints: { industry: +1, infra: +0.5 }
      },
      {
        text: "🤝 格差をなくし幸福度を重視（🔹）",
        label: "社会重視",
        sdgs: [10, 11, 16],
        effects: { env: +1, eco: +1, soc: +4 },
        resources: { funds: -4 },
        typePoints: { social: +1, governance: +0.5 }
      },
    ],
  },
];

