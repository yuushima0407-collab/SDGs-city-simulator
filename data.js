// ===========================
// SDGs City Manager - data.js
// ===========================

// 🌍 都市データ一覧
const cities = [
  {
    city_id: "tokyo_future_metro",
    name: "東京フューチャー・メトロ",
    type: "未来都市",
    images: [
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500336624523-d727130c3328?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1473654729523-203e25dfda10?auto=format&fit=crop&w=1200&q=80"
    ],
    questions: [
      {
        title: "雇用格差が拡大している。どうする？",
        description: "高度なAI導入により一部の職が消えています。",
        choices: [
          { text: "AI再教育プログラムを無料提供", effects: { env: 0, eco: 1, soc: 3 }, explanation: "長期的に雇用の回復と社会的安定を図る。" },
          { text: "外資企業を誘致して雇用を創出", effects: { env: 0, eco: 3, soc: -1 }, explanation: "短期的な経済回復につながるが、格差拡大のリスクもある。" },
          { text: "市民に副業支援金を配布", effects: { env: 0, eco: 1, soc: 1 }, explanation: "柔軟な働き方を支援し、社会的満足度を維持する。" }
        ]
      },
      {
        title: "エネルギー需要が急増。どう対応する？",
        description: "デジタル産業の成長により電力需要が高まっています。",
        choices: [
          { text: "再生可能エネルギーを拡大", effects: { env: 3, eco: -1, soc: 1 }, explanation: "環境負荷を減らし、長期的な安定を目指す。" },
          { text: "原子力発電を再稼働", effects: { env: -2, eco: 2, soc: -1 }, explanation: "短期的には安定供給が可能だが、リスク管理が必要。" },
          { text: "節電キャンペーンを実施", effects: { env: 1, eco: 0, soc: 0 }, explanation: "市民意識を高める効果がある。" }
        ]
      },
      {
        title: "都市インフラの老朽化が進行中。",
        description: "メトロや道路などの維持費が膨らんでいます。",
        choices: [
          { text: "民間資本を活用して改修を進める", effects: { env: 0, eco: 2, soc: -1 }, explanation: "効率的な再開発が可能だが、市民負担増の懸念。" },
          { text: "公的資金で段階的に修繕", effects: { env: 1, eco: -1, soc: 2 }, explanation: "社会的安定を重視し、雇用も維持できる。" },
          { text: "新技術による低コスト維持管理", effects: { env: 2, eco: 2, soc: 1 }, explanation: "革新的な解決策で持続可能な都市運営を目指す。" }
        ]
      }
    ]
  },
  {
    city_id: "aqua_marina",
    name: "アクア・マリーナ",
    type: "海上都市",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80"
    ],
    questions: [
      {
        title: "海面上昇で一部施設が浸水。どう対処？",
        description: "気候変動の影響が都市に直接及んでいます。",
        choices: [
          { text: "防波堤を強化する", effects: { env: 0, eco: -1, soc: 2 }, explanation: "物理的な安全を確保できるが、コストが高い。" },
          { text: "住民を高台に移住させる", effects: { env: 1, eco: -2, soc: 1 }, explanation: "環境面に配慮しつつ、社会的安定も目指す。" },
          { text: "浮体式建築を導入", effects: { env: 2, eco: 2, soc: 0 }, explanation: "革新的な技術で新たな都市モデルを構築できる。" }
        ]
      },
      {
        title: "海洋ゴミが増加。対策は？",
        description: "観光客増加に伴い廃棄物問題が深刻化しています。",
        choices: [
          { text: "清掃活動を強化", effects: { env: 3, eco: -1, soc: 1 }, explanation: "環境改善と地域コミュニティの形成に寄与する。" },
          { text: "ゴミ処理税を導入", effects: { env: 2, eco: -2, soc: 0 }, explanation: "経済負担はあるが、長期的な改善に効果的。" },
          { text: "リサイクル事業を支援", effects: { env: 2, eco: 1, soc: 1 }, explanation: "経済と環境の両立を目指す。" }
        ]
      }
    ]
  }
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
