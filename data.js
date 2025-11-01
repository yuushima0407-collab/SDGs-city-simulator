// ===========================
// SDGs City Manager - data.js (完成版)
// ===========================

// 🌍 都市データ一覧
const cities = [
  // 1. 宇宙港都市
  {
    city_id: "spaceport_city",
    name: "スターゲート・ハーバー",
    type: "宇宙港都市",
    level: 1,
    images: [
      "https://images.unsplash.com/photo-1531934710580-3fcde0b65d48?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523430410472-2197e6d0b23f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533227268428-3b1de42a5c2c?auto=format&fit=crop&w=1200&q=80"
    ],
    questions: [
      {
        title: "宇宙港拡張による騒音と環境負荷への対応は？",
        description: "発着数増加で周辺環境への影響が懸念されています。",
        choices: [
          { text: "防音・環境対策を徹底", effects: { env: 2, eco: -1, soc: 1 }, explanation: "住民と環境に優しい拡張。" },
          { text: "制限なしで拡張", effects: { env: -2, eco: 3, soc: -1 }, explanation: "経済は伸びるが環境悪化。" },
          { text: "発着時間帯を制限", effects: { env: 1, eco: 1, soc: 2 }, explanation: "バランス型の管理策。" }
        ]
      }
    ]
  },

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
  },

  // 6. 田舎都市
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
          { text: "統合校を作り教育の質を確保", effects: { env: 0, eco: 0, soc: 3 }, explanation: "教育と社会安定を両立。" },
          { text: "移住者を積極的に受け入れる", effects: { env: 1, eco: 1, soc: 2 }, explanation: "人口増で地域活性化。" },
          { text: "閉校しオンライン学習に切替", effects: { env: 1, eco: -1, soc: 1 }, explanation: "効率化するが地域結束は弱まる。" }
        ]
      }
    ]
  }
]; // ← 配列の最後はカンマなしで閉じる


// 🌪 特殊イベント（全都市共通）
const specialEvents = [
  {
    id: "global_storm",
    title: "世界的な異常気象！",
    description: "強烈な台風や熱波が各地で発生。都市機能が試されます。",
    effects: { env: -2, eco: -1, soc: -1 }
  }
];
