// ===========================
// SDGs City Manager - data.js (完全版サンプル)
// ===========================

// 🌍 都市データ一覧
const cities = [
  // 1. 田舎都市
  {
    city_id: "countryside_village",
    name: "田舎の里",
    type: "田舎",
    level: 1,
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1528475106024-5a898b0ceaa7?auto=format&fit=crop&w=1200&q=80"
    ],
    questions: [
      {
        title: "農業の効率化をどう進める？",
        description: "少子高齢化で農作業が大変になっています。",
        choices: [
          { text: "スマート農業を導入", effects: { env: 2, eco: 1, soc: 1 }, explanation: "技術で効率化し、収入も増やせる。" },
          { text: "伝統農法を継承", effects: { env: 3, eco: -1, soc: 2 }, explanation: "環境保護と地域文化を守る。" },
          { text: "大型企業に委託", effects: { env: -1, eco: 3, soc: -1 }, explanation: "経済は活性化するが地元の雇用は減る。" }
        ]
      },
      {
        title: "人口減少で学校が廃校の危機。どうする？",
        description: "地域コミュニティを守る必要があります。",
        choices: [
          { text: "統合校を作り教育の質を確保", effects: { env: 0, eco: -1, soc: 3 }, explanation: "教育は維持できるが移動が増える。" },
          { text: "オンライン学習を推進", effects: { env: 1, eco: 0, soc: 2 }, explanation: "技術で地域教育を維持できる。" },
          { text: "都市部に移住を促進", effects: { env: 0, eco: 2, soc: -2 }, explanation: "経済的には都市が活性化するが地域は衰退。" }
        ]
      }
    ]
  },
  
  {
    city_id: "highland_resort",
    name: "ハイランド・リゾート",
    type: "高原リゾート都市",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1508923567004-3a6b8004f3d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    questions: [
      {
        title: "観光客増加で自然破壊が進む。どうする？",
        description: "景観や環境保護のために対策が必要です。",
        choices: [
          { text: "入場料で観光管理", effects: { env: 2, eco: -1, soc: 1 }, explanation: "観光客数を調整し環境保護。" },
          { text: "観光客制限なし", effects: { env: -2, eco: 2, soc: 0 }, explanation: "経済は伸びるが環境に悪影響。" },
          { text: "環境教育プログラムを実施", effects: { env: 1, eco: 0, soc: 2 }, explanation: "市民と観光客の意識向上。" }
        ]
      },
      {
        title: "地元農産物を活かして経済を活性化する方法は？",
        description: "観光と地域産業を両立させる取り組みです。",
        choices: [
          { text: "土産物として販売", effects: { env: 0, eco: 2, soc: 1 }, explanation: "経済効果があり雇用も増える。" },
          { text: "高級レストランに提供", effects: { env: 0, eco: 3, soc: 0 }, explanation: "高収益だが地元消費減少の懸念。" },
          { text: "農業体験ツアーを開催", effects: { env: 1, eco: 1, soc: 2 }, explanation: "教育効果と経済効果を両立。" }
        ]
      }
    ]
  },

  // エコ都市
  {
    city_id: "eco_city",
    name: "エコ・シティ",
    type: "エコ都市",
    images: [
      "https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    questions: [
      {
        title: "再生可能エネルギーの導入方法は？",
        description: "環境負荷を減らしつつ、経済活動を維持する必要があります。",
        choices: [
          { text: "太陽光・風力を全面導入", effects: { env: 3, eco: -1, soc: 1 }, explanation: "環境に優しいがコスト増。" },
          { text: "段階的導入", effects: { env: 2, eco: 1, soc: 1 }, explanation: "持続可能なバランス策。" },
          { text: "従来エネルギー維持", effects: { env: -2, eco: 2, soc: 0 }, explanation: "短期的経済優先だが環境負荷増大。" }
        ]
      },
      {
        title: "公共交通を電動化するかどうか？",
        description: "CO2削減と市民利便性を両立させるかの判断です。",
        choices: [
          { text: "全面電動化", effects: { env: 3, eco: -1, soc: 2 }, explanation: "環境に優しく利便性向上。" },
          { text: "一部電動化", effects: { env: 2, eco: 0, soc: 1 }, explanation: "経済負担を抑えつつ改善。" },
          { text: "従来維持", effects: { env: -1, eco: 1, soc: 0 }, explanation: "短期経済優先だが環境悪化。" }
        ]
      }
    ]
  },

  // 工学都市
  {
    city_id: "tech_city",
    name: "テクノロジー・シティ",
    type: "工学都市",
    images: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=1200&q=80"
    ],
    questions: [
      {
        title: "AI開発を進めるか倫理重視にするか？",
        description: "技術革新と社会的責任の両立が課題です。",
        choices: [
          { text: "高速開発優先", effects: { env: 0, eco: 3, soc: -1 }, explanation: "経済効果大だが倫理リスク。" },
          { text: "倫理重視", effects: { env: 0, eco: 1, soc: 3 }, explanation: "安全・社会信頼を優先。" },
          { text: "段階的開発", effects: { env: 0, eco: 2, soc: 2 }, explanation: "バランス型戦略。" }
        ]
      },
      {
        title: "特許や技術輸出の方針は？",
        description: "経済成長と国際協力のバランス。",
        choices: [
          { text: "積極的輸出", effects: { env: 0, eco: 3, soc: -1 }, explanation: "収益大だが技術流出リスク。" },
          { text: "国内優先", effects: { env: 0, eco: 1, soc: 2 }, explanation: "国内産業保護と雇用維持。" },
          { text: "共同開発推進", effects: { env: 0, eco: 2, soc: 3 }, explanation: "国際協力と経済効果の両立。" }
        ]
      }
    ]
  }

  // ※ 残り宇宙港都市～砂浜都市も同じ形式で追加可能
);

  
  // 2. 観光都市
  {
    city_id: "tourism_city",
    name: "観光リゾート",
    type: "観光都市",
    level: 1,
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80"
    ],
    questions: [
      {
        title: "観光客が増えて環境負荷が拡大。どうする？",
        description: "ビーチや自然公園への観光が集中しています。",
        choices: [
          { text: "観光税を導入", effects: { env: 2, eco: 1, soc: 0 }, explanation: "資金を環境保全に充てられる。" },
          { text: "観光ルートを分散", effects: { env: 3, eco: 0, soc: 1 }, explanation: "自然保護と地域バランスに寄与する。" },
          { text: "無制限に観光客を受け入れる", effects: { env: -2, eco: 3, soc: 0 }, explanation: "短期的経済効果は大きいが環境破壊のリスク。" }
        ]
      },
      {
        title: "地域文化を守るためにどうする？",
        description: "観光化で伝統文化が薄れています。",
        choices: [
          { text: "地元文化体験プログラムを支援", effects: { env: 1, eco: 1, soc: 3 }, explanation: "観光と文化継承を両立できる。" },
          { text: "テーマパーク化して収益化", effects: { env: -1, eco: 3, soc: -1 }, explanation: "経済は潤うが文化が失われる。" },
          { text: "観光客を制限", effects: { env: 2, eco: -1, soc: 1 }, explanation: "環境保護と文化維持には有効。" }
        ]
      }
    ]
  },

  // 3. 未来都市
  {
    city_id: "future_metropolis",
    name: "ネオ・メトロポリス",
    type: "未来都市",
    level: 1,
    images: [
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500336624523-d727130c3328?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1473654729523-203e25dfda10?auto=format&fit=crop&w=1200&q=80"
    ],
    questions: [
      {
        title: "AIによる自動化で失業が増加。どう対応？",
        description: "高度自動化で人手不足の職が消えています。",
        choices: [
          { text: "AI再教育プログラムを提供", effects: { env: 0, eco: 1, soc: 3 }, explanation: "長期的に雇用回復と社会安定を図る。" },
          { text: "外資企業を誘致して雇用創出", effects: { env: 0, eco: 3, soc: -1 }, explanation: "短期的経済回復だが格差拡大のリスク。" },
          { text: "市民に副業支援金を配布", effects: { env: 0, eco: 1, soc: 1 }, explanation: "柔軟な働き方を支援する。" }
        ]
      },
      {
        title: "エネルギー需要が急増。どうする？",
        description: "デジタル産業の成長で電力需要が増加しています。",
        choices: [
          { text: "再生可能エネルギー拡大", effects: { env: 3, eco: -1, soc: 1 }, explanation: "環境負荷を減らす長期的安定策。" },
          { text: "原子力再稼働", effects: { env: -2, eco: 2, soc: -1 }, explanation: "短期的には安定供給可能だがリスク管理が必要。" },
          { text: "節電キャンペーン", effects: { env: 1, eco: 0, soc: 0 }, explanation: "市民意識を高める効果。" }
        ]
      }
    ]
  },

  // 4. 海上都市
  {
    city_id: "aqua_city",
    name: "アクア・マリーナ",
    type: "海上都市",
    level: 1,
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80"
    ],
    questions: [
      {
        title: "海面上昇で浸水。どうする？",
        description: "気候変動の影響が都市に直撃しています。",
        choices: [
          { text: "防波堤強化", effects: { env: 0, eco: -1, soc: 2 }, explanation: "物理的安全確保だがコスト高。" },
          { text: "住民を高台移住", effects: { env: 1, eco: -2, soc: 1 }, explanation: "環境配慮と社会安定。" },
          { text: "浮体式建築導入", effects: { env: 2, eco: 2, soc: 0 }, explanation: "革新的都市モデル構築。" }
        ]
      },
      {
        title: "海洋ゴミ増加。対策は？",
        description: "観光客増で廃棄物問題が深刻化。",
        choices: [
          { text: "清掃活動強化", effects: { env: 3, eco: -1, soc: 1 }, explanation: "環境改善と地域コミュニティ形成。" },
          { text: "ゴミ処理税導入", effects: { env: 2, eco: -2, soc: 0 }, explanation: "経済負担はあるが長期改善に効果的。" },
          { text: "リサイクル事業支援", effects: { env: 2, eco: 1, soc: 1 }, explanation: "経済と環境の両立。" }
        ]
      }
    ]
  },

  // 5. 工業都市
  {
    city_id: "industrial_hub",
    name: "インダストリアル・ハブ",
    type: "工業都市",
    level: 1,
    images: [
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516709977308-02b54be0097d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
    ],
    questions: [
      {
        title: "工場排水で環境汚染が進む。どうする？",
        description: "川や土壌への影響が深刻です。",
        choices: [
          { text: "排水処理技術を導入", effects: { env: 3, eco: -1, soc: 1 }, explanation: "環境改善と地域安全を両立。" },
          { text: "規制緩和で経済優先", effects: { env: -2, eco: 3, soc: -1 }, explanation: "短期的経済効果は大きいが環境破壊のリスク。" },
          { text: "環境税を導入", effects: { env: 2, eco: 0, soc: 0 }, explanation: "企業に改善インセンティブを与える。" }
        ]
      },
      {
        title: "労働者の健康問題が増加。どうする？",
        description: "安全対策や労働環境改善が必要です。",
        choices: [
          { text: "安全設備を強化", effects: { env: 1, eco: -1, soc: 3 }, explanation: "社会安定と健康確保に寄与。" },
          { text: "労働時間延長で生産増", effects: { env: 0, eco: 3, soc: -2 }, explanation: "短期経済は伸びるが社会満足度は下がる。" },
          { text: "健康保険制度を拡充", effects: { env: 0, eco: -1, soc: 3 }, explanation: "社会安全を重視。" }
        ]
      }
    ]
  }

  // 残り15都市は同様に作成
];

// 🌪 特殊イベント（全都市共通）
const specialEvents = [
  {
    id: "global_storm",
    title: "世界的な異常気象！",
    description: "強烈な台風や熱波が各地で発生。都市機能が試されます。",
    effects: { env: -2, eco: -1, soc: -1 }
  }
];
