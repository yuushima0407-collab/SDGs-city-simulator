// data.js v2 — 教育メタ & バランス調整版
// - 各choiceに label / sdgs / example を追加
// - typePoints は現行main.js互換のため残しつつバランス最適化
// - effects / resources の幅を整理（資源での到達性を全タイプに確保）

const cities = [
  {
    title: "都市のエネルギー政策をどうする？",
    description: "環境と経済のバランスを取りながら、電気の作り方を決めます。",
    choices: [
      {
        text: "🌞 再生可能エネルギーを中心に切り替える",
        label: "環境重視",
        sdgs: [7, 11, 13],
        example: "デンマークは風力で電力の多くをまかなう",
        effects: { env: 3, eco: -1, soc: 1 },
        typePoints: { eco: 2, smart: 1 },
        resources: { energy: 5, funds: -2 },
        explanation: "CO₂を減らしやすい。短期コストは上がるが長期で安定。"
      },
      {
        text: "⚛ 安定供給を最優先（原子力＋高効率火力）",
        label: "経済重視",
        sdgs: [7, 8, 9],
        example: "フランスは原子力の比率が高い",
        effects: { env: -2, eco: 3, soc: 1 },
        typePoints: { industry: 1, infra: 1, science: 1 },
        resources: { energy: 10, funds: -4 },
        explanation: "大量に作れる。環境リスクには注意が必要。"
      },
      {
        text: "🏘 分散型・小規模発電（地域の太陽光＋蓄電池）",
        label: "バランス型",
        sdgs: [7, 9, 11, 13],
        example: "小さな発電所を町ごとに作るスマートグリッド",
        effects: { env: 2, eco: 1, soc: 2 },
        typePoints: { smart: 2, eco: 1 },
        resources: { energy: 6, funds: -3 },
        explanation: "停電に強く、地域にお金が回る。"
      }
    ]
  },

  {
    title: "産業の伸ばし方は？",
    description: "働く場所と町の強みを作ります。",
    choices: [
      {
        text: "🧪 研究・ITなどハイテク産業を育てる",
        label: "技術重視",
        sdgs: [8, 9],
        example: "シリコンバレーのように研究と起業を後押し",
        effects: { env: -1, eco: 3, soc: 1 },
        typePoints: { science: 2, smart: 1, urban: 1 },
        resources: { tech: 3, funds: -3 },
        explanation: "給料が高い仕事が増えやすい。"
      },
      {
        text: "🏭 製造業で雇用を増やす",
        label: "雇用重視",
        sdgs: [8, 9, 10],
        example: "工場の集積で働き口を確保",
        effects: { env: -2, eco: 2, soc: 2 },
        typePoints: { industry: 2, social: 1, industryHeavy: 1 },
        resources: { labor: 5, funds: -2 },
        explanation: "働く人は増えるが、環境対策が必要。"
      },
      {
        text: "🌿 環境・福祉サービスを伸ばす",
        label: "生活重視",
        sdgs: [3, 8, 11, 12],
        example: "介護・環境ビジネスで地域が支え合う",
        effects: { env: 2, eco: 1, soc: 2 },
        typePoints: { eco: 1, social: 2 },
        resources: { funds: -2 },
        explanation: "住みやすさが上がり、長く暮らせる町に。"
      }
    ]
  },

  {
    title: "交通はどうする？",
    description: "移動しやすさと環境のどちらも大切です。",
    choices: [
      {
        text: "🚆 電車・バスなど公共交通を強化",
        label: "環境重視",
        sdgs: [11, 13],
        example: "駅前に人が集まり、車が少なくなる",
        effects: { env: 2, eco: 1, soc: 2 },
        typePoints: { transport: 2, eco: 1 },
        resources: { funds: -3 },
        explanation: "渋滞とCO₂が減り、通学・通勤が楽になる。"
      },
      {
        text: "🚗 道路を広げて車中心",
        label: "経済重視",
        sdgs: [8, 9],
        example: "物流は速くなるが交通量は増える",
        effects: { env: -2, eco: 3, soc: 0 },
        typePoints: { industry: 1, infra: 1, transport: 1 },
        resources: { funds: -2 },
        explanation: "短期に経済は伸びるが環境負荷は増える。"
      },
      {
        text: "🤖 AIで信号や流れを最適化",
        label: "技術重視",
        sdgs: [9, 11, 13],
        example: "スマート交通で渋滞・事故を減らす",
        effects: { env: 1, eco: 2, soc: 2 },
        typePoints: { smart: 2, transport: 1 },
        resources: { tech: 3, funds: -3 },
        explanation: "混雑の少ない走りやすい町に。"
      }
    ]
  },

  {
    title: "水をどう守る？",
    description: "水不足・水害の両方に備えます。",
    choices: [
      {
        text: "💧 雨水再利用と節水を広げる",
        label: "環境重視",
        sdgs: [6, 11, 12, 13],
        example: "屋根や公園で雨水を集めて使う",
        effects: { env: 3, eco: 0, soc: 1 },
        typePoints: { eco: 1, smart: 1 },
        resources: { water: 5, funds: -2 },
        explanation: "水を大切に使える町になる。"
      },
      {
        text: "🏞 大きなダムで安定供給",
        label: "安定重視",
        sdgs: [6, 9],
        example: "乾燥時でも水を確保できる",
        effects: { env: -2, eco: 2, soc: 1 },
        typePoints: { infra: 2, industry: 1 },
        resources: { water: 10, funds: -4 },
        explanation: "安定するが自然への影響が大きい。"
      },
      {
        text: "🕳 地下水に頼る",
        label: "短期重視",
        sdgs: [6, 12],
        example: "手軽だが枯渇や地盤沈下の心配",
        effects: { env: -3, eco: 1, soc: -1 },
        typePoints: { industry: 1 },
        resources: { water: 8, funds: -1 },
        explanation: "短期の助けにはなるが、長くは続かない。"
      }
    ]
  },

  {
    title: "食べ物をどう確保する？",
    description: "農業と物流のバランスを考えます。",
    choices: [
      {
        text: "🏡 地産地消・都市農業を推進",
        label: "環境・健康重視",
        sdgs: [2, 11, 12, 13],
        example: "屋上菜園や学校畑で学びにもなる",
        effects: { env: 2, eco: 1, soc: 2 },
        typePoints: { agriculture: 2, eco: 1, social: 1 },
        resources: { food: 5, funds: -2 },
        explanation: "近い場所で作るから運ぶCO₂も少ない。"
      },
      {
        text: "🚢 輸入拡大でコスト削減",
        label: "経済重視",
        sdgs: [8, 9, 12],
        example: "安いが、世界のトラブルに弱い",
        effects: { env: -1, eco: 3, soc: 0 },
        typePoints: { industry: 1, transport: 1 },
        resources: { food: 8, funds: -1 },
        explanation: "値段は安定しやすいが、遠くから運ぶ。"
      },
      {
        text: "🌱 AI・水耕栽培などスマート農業",
        label: "技術重視",
        sdgs: [2, 9, 12],
        example: "室内・縦型農場で効率よく育てる",
        effects: { env: 1, eco: 2, soc: 1 },
        typePoints: { smart: 1, agriculture: 2, science: 1 },
        resources: { tech: 3, food: 6, funds: -2 },
        explanation: "天気に左右されにくい。"
      }
    ]
  },

  {
    title: "都市の予算はどこに使う？",
    description: "福祉・教育・産業など配分を考えます。",
    choices: [
      {
        text: "🏥 福祉・教育へしっかり投資",
        label: "生活重視",
        sdgs: [3, 4, 10, 11],
        example: "安心して暮らせる土台を作る",
        effects: { env: 0, eco: 1, soc: 3 },
        typePoints: { social: 1, education: 2 },
        resources: { funds: -3 },
        explanation: "目先より長く良い町に。"
      },
      {
        text: "🏗 産業・インフラを優先",
        label: "経済重視",
        sdgs: [8, 9],
        example: "仕事と税収が増えやすい",
        effects: { env: -1, eco: 3, soc: 1 },
        typePoints: { industry: 1, infra: 1, urban: 1 },
        resources: { funds: -2 },
        explanation: "成長のエンジンを強くする。"
      },
      {
        text: "💼 緊縮で支出をしぼる",
        label: "財政重視",
        sdgs: [8],
        example: "借金は減るが、サービス低下の心配",
        effects: { env: 0, eco: 2, soc: -1 },
        typePoints: { urban: 1 },
        resources: { funds: 1 },
        explanation: "短期は安定、長期の力は落ちやすい。"
      }
    ]
  },

  {
    title: "インフラの優先度は？",
    description: "町の基礎体力をどこから強くするか。",
    choices: [
      {
        text: "🛣 道路・橋・鉄道を整える",
        label: "物流重視",
        sdgs: [9, 11],
        example: "暮らしと仕事の移動が楽に",
        effects: { env: -1, eco: 3, soc: 1 },
        typePoints: { infra: 2, transport: 1 },
        resources: { funds: -3 },
        explanation: "経済に効くが、工事は時間がかかる。"
      },
      {
        text: "📡 通信・エネルギー網を強化",
        label: "未来重視",
        sdgs: [7, 9, 11],
        example: "ネット・電気が強くなり災害にも強い",
        effects: { env: 1, eco: 2, soc: 2 },
        typePoints: { smart: 2, infra: 1 },
        resources: { tech: 3, funds: -2 },
        explanation: "災害時にもつながりやすい町へ。"
      },
      {
        text: "🔧 最低限の修繕にとどめる",
        label: "節約重視",
        sdgs: [8],
        example: "短期コストは下がるが先送りになる",
        effects: { env: 0, eco: 1, soc: -1 },
        typePoints: { urban: 1 },
        resources: { funds: -1 },
        explanation: "老朽化が進むと後で高くつく。"
      }
    ]
  },

  {
    title: "雇用と働き方を応援するには？",
    description: "スキル・賃金・企業支援の組み合わせ。",
    choices: [
      {
        text: "📘 学び直し・職業訓練を広げる",
        label: "教育重視",
        sdgs: [4, 8, 10],
        example: "IT講座や資格で転職を応援",
        effects: { env: 0, eco: 1, soc: 3 },
        typePoints: { education: 2, social: 1 },
        resources: { labor: 2, funds: -2 },
        explanation: "失業に強い町になる。"
      },
      {
        text: "🏢 企業誘致で雇用を増やす",
        label: "経済重視",
        sdgs: [8, 9, 11],
        example: "新しい事業所が来て人が集まる",
        effects: { env: -1, eco: 3, soc: 2 },
        typePoints: { industry: 1, urban: 1 },
        resources: { funds: -3 },
        explanation: "地元の仕事が増える。"
      },
      {
        text: "💴 最低賃金の上げ幅を抑える",
        label: "コスト重視",
        sdgs: [8],
        example: "会社の負担は軽くなる",
        effects: { env: 0, eco: 2, soc: -1 },
        typePoints: { industry: 1 },
        resources: { funds: -1 },
        explanation: "生活の厳しい人が出る可能性。"
      }
    ]
  },

  {
    title: "エネルギー×AIで省エネできる？",
    description: "かしこく使ってムダを減らします。",
    choices: [
      {
        text: "🧠 需要予測と最適制御を導入",
        label: "技術重視",
        sdgs: [7, 9, 13],
        example: "AIが発電と使い方のバランスを調整",
        effects: { env: 2, eco: 2, soc: 1 },
        typePoints: { smart: 2, eco: 1 },
        resources: { tech: 3, funds: -3 },
        explanation: "電気をムダなく使える。"
      },
      {
        text: "🔌 既存の運用で続ける",
        label: "安定重視",
        sdgs: [7],
        example: "新しい投資は少ない",
        effects: { env: 0, eco: 1, soc: 0 },
        typePoints: { industry: 1 },
        resources: { funds: -1 },
        explanation: "すぐの変化は少ない。"
      },
      {
        text: "🌏 海外企業に委託して導入を急ぐ",
        label: "短期重視",
        sdgs: [7, 9],
        example: "早いが、地元の技術は育ちにくい",
        effects: { env: 1, eco: 3, soc: -1 },
        typePoints: { smart: 1, industry: 1 },
        resources: { funds: -2 },
        explanation: "すぐ便利に、でも将来の自立は課題。"
      }
    ]
  },

  {
    title: "エネルギーの組み合わせは？",
    description: "リスク分散と安定供給をめざします。",
    choices: [
      {
        text: "🔋 再エネ＋水素＋蓄電のミックス",
        label: "バランス重視",
        sdgs: [7, 9, 13],
        example: "足りないときは蓄電で補う",
        effects: { env: 3, eco: 1, soc: 1 },
        typePoints: { eco: 1, smart: 1 },
        resources: { energy: 6, funds: -3 },
        explanation: "停電に強い組み合わせ。"
      },
      {
        text: "⚛ 原子力依存を強める",
        label: "安定重視",
        sdgs: [7, 9],
        example: "ベース電源として安定",
        effects: { env: -2, eco: 3, soc: 0 },
        typePoints: { industry: 1, infra: 1 },
        resources: { energy: 10, funds: -4 },
        explanation: "安定するが安全対策にコスト。"
      },
      {
        text: "⛽ 化石燃料を維持",
        label: "短期重視",
        sdgs: [7, 8],
        example: "今は安いが将来コスト増の可能性",
        effects: { env: -3, eco: 2, soc: -1 },
        typePoints: { industry: 1 },
        resources: { energy: 8, funds: -1 },
        explanation: "価格の変動に弱い。"
      }
    ]
  },

  // --- 教育・医療・安全・住宅・文化・観光・再生・防災・循環 ---
  {
    title: "教育の質とアクセスを上げるには？",
    description: "学びやすさが未来の力になります。",
    choices: [
      {
        text: "🏫 大学・研究を強化し産学連携",
        label: "技術・教育重視",
        sdgs: [4, 8, 9],
        example: "研究成果を社会で使えるように",
        effects: { env: 0, eco: 2, soc: 2 },
        typePoints: { education: 2, science: 1, smart: 1 },
        resources: { tech: 3, funds: -3 },
        explanation: "新しい仕事や会社が生まれやすい。"
      },
      {
        text: "📗 学び直し・奨学支援を拡大",
        label: "生活・教育重視",
        sdgs: [4, 8, 10],
        example: "だれでも学び続けられる",
        effects: { env: 0, eco: 1, soc: 3 },
        typePoints: { education: 2, social: 1 },
        resources: { labor: 2, funds: -2 },
        explanation: "失敗してもやり直せる町。"
      },
      {
        text: "💸 教育費をおさえて財政健全化",
        label: "財政重視",
        sdgs: [8],
        example: "短期は楽だが人材育成は弱くなる",
        effects: { env: 0, eco: 2, soc: -1 },
        typePoints: { industry: 1 },
        resources: { funds: 1 },
        explanation: "将来の力が落ちるおそれ。"
      }
    ]
  },

  {
    title: "医療・福祉をどう強くする？",
    description: "だれも取り残さない町に。",
    choices: [
      {
        text: "🏠 在宅医療と地域ケアを拡張",
        label: "生活重視",
        sdgs: [3, 10, 11],
        example: "家にいても医療や介護が受けられる",
        effects: { env: 0, eco: 0, soc: 3 },
        typePoints: { welfare: 2, social: 1 },
        resources: { labor: 2, funds: -2 },
        explanation: "安心して長く暮らせる。"
      },
      {
        text: "🩺 遠隔診療・AI支援を導入",
        label: "技術重視",
        sdgs: [3, 9, 10],
        example: "離れた場所でもお医者さんにつながる",
        effects: { env: 1, eco: 1, soc: 2 },
        typePoints: { smart: 1, welfare: 1 },
        resources: { tech: 2, funds: -2 },
        explanation: "医師不足の地域も助けられる。"
      },
      {
        text: "🏢 民間委託を増やし効率化",
        label: "経済重視",
        sdgs: [8, 9],
        example: "費用は下がりやすいが弱者支援に注意",
        effects: { env: 0, eco: 2, soc: -1 },
        typePoints: { industry: 1 },
        resources: { funds: -1 },
        explanation: "ルール作りと見守りが大切。"
      }
    ]
  },

  {
    title: "治安と安心をどう守る？",
    description: "安全な暮らしをつくります。",
    choices: [
      {
        text: "👥 見守り活動とコミュニティ警察",
        label: "生活重視",
        sdgs: [11, 16],
        example: "地域が顔見知りになると防犯に強い",
        effects: { env: 0, eco: 0, soc: 3 },
        typePoints: { social: 2, welfare: 1 },
        resources: { labor: 2, funds: -1 },
        explanation: "安心して外に出やすくなる。"
      },
      {
        text: "📷 スマート監視と予測パトロール",
        label: "技術重視",
        sdgs: [9, 16],
        example: "AIが危険を早めに見つける手助け",
        effects: { env: 0, eco: 1, soc: 2 },
        typePoints: { smart: 2, social: 1 },
        resources: { tech: 2, funds: -2 },
        explanation: "プライバシー対策が必要。"
      },
      {
        text: "💤 施策は最小限で節約",
        label: "財政重視",
        sdgs: [8],
        example: "費用は減るが安心感も下がる",
        effects: { env: 0, eco: 1, soc: -1 },
        typePoints: { urban: 1 },
        resources: { funds: -1 },
        explanation: "長期的には逆に費用が増える恐れ。"
      }
    ]
  },

  {
    title: "住みやすい家と町にするには？",
    description: "家賃、快適さ、環境のバランス。",
    choices: [
      {
        text: "🏘 家賃が手ごろな公的住宅を増やす",
        label: "生活重視",
        sdgs: [10, 11],
        example: "若者・子育て・高齢者を支える",
        effects: { env: 0, eco: 0, soc: 3 },
        typePoints: { housing: 2, social: 1 },
        resources: { funds: -3 },
        explanation: "困ったときにも住まいがある。"
      },
      {
        text: "🏠 断熱・省エネの改修を支援",
        label: "環境重視",
        sdgs: [7, 11, 13],
        example: "冬あたたかく夏すずしい家へ",
        effects: { env: 2, eco: 1, soc: 1 },
        typePoints: { housing: 1, eco: 1, smart: 1 },
        resources: { tech: 2, funds: -2 },
        explanation: "電気代も減ってうれしい。"
      },
      {
        text: "🏗 規制をゆるめ民間開発を進める",
        label: "経済重視",
        sdgs: [8, 9, 11],
        example: "供給が増えて家賃が下がりやすい",
        effects: { env: -1, eco: 2, soc: 1 },
        typePoints: { industry: 1, urban: 1, housing: 1 },
        resources: { funds: -1 },
        explanation: "緑や景観の配慮は必要。"
      }
    ]
  },

  {
    title: "文化・芸術をどう育てる？",
    description: "町の個性をつくります。",
    choices: [
      {
        text: "🏛 文化施設（博物館・劇場・図書館）を整備",
        label: "文化重視",
        sdgs: [4, 11],
        example: "学びと観光の核になる",
        effects: { env: 1, eco: 1, soc: 2 },
        typePoints: { culture: 2, education: 1 },
        resources: { funds: -3 },
        explanation: "教養と交流が広がる。"
      },
      {
        text: "🎨 市民アートやお祭りを支援",
        label: "生活重視",
        sdgs: [11],
        example: "参加型でまちが元気になる",
        effects: { env: 1, eco: 1, soc: 2 },
        typePoints: { culture: 1, social: 1 },
        resources: { funds: -2 },
        explanation: "誰もが主役になれる場を作る。"
      },
      {
        text: "🤝 スポンサーを募って自立運営",
        label: "財政重視",
        sdgs: [8, 11],
        example: "お金の面で続けやすい",
        effects: { env: 0, eco: 2, soc: 1 },
        typePoints: { culture: 1, industry: 1 },
        resources: { funds: -1 },
        explanation: "公平さや質の確保は要工夫。"
      }
    ]
  },

  {
    title: "観光で町を盛り上げる？",
    description: "稼ぐ・守るの両立がカギ。",
    choices: [
      {
        text: "🧭 伝統文化×体験型ツアー",
        label: "文化・持続重視",
        sdgs: [8, 11, 12],
        example: "職人体験やまち歩き",
        effects: { env: 1, eco: 2, soc: 2 },
        typePoints: { tourism: 1, culture: 1 },
        resources: { funds: -2 },
        explanation: "質の高い観光でファンが増える。"
      },
      {
        text: "🏨 大型リゾート・国際会議を誘致",
        label: "経済重視",
        sdgs: [8, 9],
        example: "MICEで海外から人を呼ぶ",
        effects: { env: -2, eco: 3, soc: 1 },
        typePoints: { tourism: 2, industry: 1 },
        resources: { funds: -3 },
        explanation: "景気には効くが環境に負担。"
      },
      {
        text: "🌲 自然保護とエコツーリズム",
        label: "環境重視",
        sdgs: [11, 12, 13, 15],
        example: "森や海の価値を守りながら楽しむ",
        effects: { env: 3, eco: 1, soc: 1 },
        typePoints: { eco: 1, tourism: 1 },
        resources: { funds: -2 },
        explanation: "長く愛される観光地へ。"
      }
    ]
  },

  {
    title: "中心市街地の空洞化にどう向き合う？",
    description: "空き地・空き店舗の活用が課題です。",
    choices: [
      {
        text: "🏙 住宅・商業・公共を組み合わせて再開発",
        label: "再生重視",
        sdgs: [8, 9, 11],
        example: "歩いて暮らせるにぎわいの都心",
        effects: { env: 1, eco: 2, soc: 2 },
        typePoints: { urban: 2, housing: 1, culture: 1 },
        resources: { funds: -3 },
        explanation: "暮らす・働く・楽しむが近くにある。"
      },
      {
        text: "🏚 古い建物を直して用途転用",
        label: "文化・持続重視",
        sdgs: [11, 12],
        example: "学校→図書館、工場→カフェなど",
        effects: { env: 2, eco: 1, soc: 2 },
        typePoints: { culture: 1, urban: 1 },
        resources: { funds: -2 },
        explanation: "思い出を残しながら生まれ変わる。"
      },
      {
        text: "📜 規制緩和で民間に任せる",
        label: "スピード重視",
        sdgs: [8, 9],
        example: "開発が早く進む",
        effects: { env: -1, eco: 3, soc: 1 },
        typePoints: { industry: 1, urban: 1 },
        resources: { funds: -1 },
        explanation: "公共性や景観に配慮が必要。"
      }
    ]
  },

  {
    title: "防災・レジリエンスの投資は？",
    description: "災害に強い町にします。",
    choices: [
      {
        text: "🧱 耐震・浸水対策・避難網を一体整備",
        label: "安心重視",
        sdgs: [9, 11, 13],
        example: "地震や水害の被害を減らす",
        effects: { env: 1, eco: 0, soc: 3 },
        typePoints: { infra: 1, urban: 1, welfare: 1 },
        resources: { funds: -3 },
        explanation: "命を守る投資。"
      },
      {
        text: "🛰 デジタルツインで危険を予測",
        label: "技術重視",
        sdgs: [9, 11, 13],
        example: "仮想空間で被害をシミュレーション",
        effects: { env: 1, eco: 1, soc: 2 },
        typePoints: { smart: 2, infra: 1 },
        resources: { tech: 3, funds: -2 },
        explanation: "避難や備蓄を効率よく。"
      },
      {
        text: "📦 保険・備蓄などソフト対策中心",
        label: "コスト重視",
        sdgs: [11],
        example: "被害後の回復を助ける",
        effects: { env: 0, eco: 1, soc: 1 },
        typePoints: { welfare: 1 },
        resources: { funds: -1 },
        explanation: "根本対策も合わせて進めたい。"
      }
    ]
  },

  {
    title: "循環型のまちにできる？",
    description: "ゴミを減らし、資源をくり返し使う。",
    choices: [
      {
        text: "♻ 設計段階からリユース・リサイクル",
        label: "環境重視",
        sdgs: [9, 12, 13],
        example: "分解しやすい製品にして再利用",
        effects: { env: 3, eco: 1, soc: 1 },
        typePoints: { eco: 2, infra: 1 },
        resources: { recycled: 5, funds: -2 },
        explanation: "資源がゴミになりにくい。"
      },
      {
        text: "🔥 廃棄物発電・熱回収でエネルギー化",
        label: "効率重視",
        sdgs: [7, 12, 13],
        example: "燃やす熱をムダなく使う",
        effects: { env: 1, eco: 2, soc: 1 },
        typePoints: { smart: 1, industry: 1 },
        resources: { energy: 3, funds: -2 },
        explanation: "最後まで価値を取り出す。"
      },
      {
        text: "🚛 回収は民間任せで小規模運用",
        label: "コスト重視",
        sdgs: [8, 12],
        example: "お金はかからないが効果も小さい",
        effects: { env: -1, eco: 1, soc: 0 },
        typePoints: { industry: 1 },
        resources: { funds: -1 },
        explanation: "回収率が伸びにくい。"
      }
    ]
  },

  {
    title: "人にやさしい移動へ",
    description: "歩く・自転車・バスの組み合わせ。",
    choices: [
      {
        text: "🚶‍♀️ スーパー街路（歩行者・自転車優先）",
        label: "環境・健康重視",
        sdgs: [3, 11, 13],
        example: "安全でにぎわいが生まれる",
        effects: { env: 3, eco: 1, soc: 2 },
        typePoints: { transport: 1, eco: 1, culture: 1 },
        resources: { funds: -2 },
        explanation: "子どもも安心して歩ける。"
      },
      {
        text: "🅿 パークアンドライド・BRTを整備",
        label: "渋滞対策重視",
        sdgs: [9, 11, 13],
        example: "郊外→都心の移動がスムーズ",
        effects: { env: 2, eco: 2, soc: 1 },
        typePoints: { transport: 2, infra: 1 },
        resources: { funds: -2 },
        explanation: "車とバスの良いとこ取り。"
      },
      {
        text: "⏸ 現状維持でコスト最小化",
        label: "財政重視",
        sdgs: [8],
        example: "すぐの出費は小さい",
        effects: { env: -1, eco: 1, soc: -1 },
        typePoints: { industry: 1 },
        resources: { funds: -1 },
        explanation: "後からの改善がむずかしくなる。"
      }
    ]
  },

  {
    title: "多文化と国際交流を進める？",
    description: "いろいろな人が活躍できる町へ。",
    choices: [
      {
        text: "🗣 多言語案内・生活支援・国際イベント",
        label: "生活・交流重視",
        sdgs: [10, 11, 16, 17],
        example: "留学生や家族が暮らしやすい",
        effects: { env: 0, eco: 2, soc: 3 },
        typePoints: { culture: 1, tourism: 1, social: 1 },
        resources: { funds: -2 },
        explanation: "助け合いが生まれやすい。"
      },
      {
        text: "💼 高度人材特区・スタートアップビザ",
        label: "経済・技術重視",
        sdgs: [8, 9, 17],
        example: "海外の研究者や起業家を呼ぶ",
        effects: { env: 0, eco: 3, soc: 1 },
        typePoints: { science: 1, industry: 1, urban: 1 },
        resources: { funds: -2 },
        explanation: "新しい産業のタネが育つ。"
      },
      {
        text: "🧭 観光の分散（季節・地域）",
        label: "環境・生活重視",
        sdgs: [11, 12, 13],
        example: "混雑やゴミを減らす",
        effects: { env: 1, eco: 2, soc: 1 },
        typePoints: { tourism: 1, culture: 1 },
        resources: { funds: -1 },
        explanation: "住む人にも旅する人にもやさしい。"
      }
    ]
  },

  {
    title: "人口減少と空き家問題に挑む",
    description: "壊す？直す？活用する？",
    choices: [
      {
        text: "🛠 空き家をリノベして地域拠点に",
        label: "再生・生活重視",
        sdgs: [11, 12],
        example: "交流スペースや子ども食堂に",
        effects: { env: 2, eco: 1, soc: 2 },
        typePoints: { urban: 1, housing: 2 },
        resources: { funds: -2 },
        explanation: "地域のつながりが生まれる。"
      },
      {
        text: "🌍 学生・外国人の受け入れを強化",
        label: "交流・活性化重視",
        sdgs: [10, 11, 17],
        example: "空き家の活用と人口の底上げ",
        effects: { env: 0, eco: 2, soc: 2 },
        typePoints: { social: 1, culture: 1 },
        resources: { funds: -2 },
        explanation: "多様なコミュニティができる。"
      },
      {
        text: "🏗 取り壊し・再開発で更新",
        label: "経済・速度重視",
        sdgs: [8, 9, 11],
        example: "新しい需要を作る",
        effects: { env: -1, eco: 3, soc: 0 },
        typePoints: { industry: 1, urban: 1 },
        resources: { funds: -3 },
        explanation: "歴史や景観の配慮が課題。"
      }
    ]
  },

  // --- 崩壊／荒廃 分岐（低スコア・資源欠乏ルートでも到達可能） ---
  {
    title: "環境悪化・資源枯渇の危機…どうする？（崩壊ルート）",
    description: "厳しい状況からの選択です。",
    choices: [
      {
        text: "🔁 大規模に立て直す（再生プラン）",
        label: "再生重視",
        sdgs: [9, 11, 13],
        example: "壊れたインフラを復旧し暮らしを取り戻す",
        effects: { env: 3, eco: 0, soc: 2 },
        typePoints: { urban: 2, eco: 1 },
        resources: { funds: -4 },
        explanation: "時間はかかるが未来につながる。"
      },
      {
        text: "⚠ 資源の奪い合いに傾く（荒廃の道）",
        label: "短期重視",
        sdgs: [],
        example: "秩序が崩れ争いが起きる",
        effects: { env: -3, eco: 1, soc: -3 },
        typePoints: { industryHeavy: 1 },
        resources: { energy: 3, funds: -2 },
        explanation: "最悪の結末に近づく選択。"
      },
      {
        text: "🌱 自然と小さく共存（分散型共同体）",
        label: "生活・環境重視",
        sdgs: [2, 11, 12, 13, 15],
        example: "小さなコミュニティで助け合う",
        effects: { env: 2, eco: -1, soc: 2 },
        typePoints: { agriculture: 1, eco: 1 },
        resources: { food: 3, funds: -1 },
        explanation: "ゆっくりだが安定した暮らしへ。"
      }
    ]
  }
];
