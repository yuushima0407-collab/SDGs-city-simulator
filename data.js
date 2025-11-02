const cities = [
  {
    title: "都市の電力をどうする？",
    description: "環境負荷と経済性のバランスを考えながら発電方法を選ぶ。",
    choices: [
      {
        text: "太陽光・風力中心にする",
        effects: { env: 3, eco: -1, soc: 1 },
        typePoints: { Eco: 3 },
        resources: { energy: 4, funds: -2 },
        explanation: "環境には優しいが発電量は控えめ。デンマークの事例ではCO2削減に成功。"
      },
      {
        text: "原子力で大量発電",
        effects: { env: -3, eco: 3, soc: 1 },
        typePoints: { Industrial: 2, Science: 1 },
        resources: { energy: 10, funds: -4 },
        explanation: "環境にはリスクあるが大量エネルギー確保可能。フランスでは電力の大部分を原子力で賄う。"
      },
      {
        text: "小規模水力で地域限定供給",
        effects: { env: 2, eco: 0, soc: 2 },
        typePoints: { Eco: 2, Smart: 1 },
        resources: { energy: 5, funds: -3 },
        explanation: "環境負荷少なく地域で安定供給。"
      }
    ]
  },
  {
    title: "交通インフラをどうする？",
    description: "都市の拡大に合わせて交通網を整備。",
    choices: [
      {
        text: "公共交通中心（鉄道・バス）",
        effects: { env: 2, eco: 1, soc: 2 },
        typePoints: { Smart: 2 },
        resources: { funds: -3 },
        explanation: "CO2削減と住民利便性向上。オランダ・コペンハーゲンの自転車・公共交通モデルに類似。"
      },
      {
        text: "道路拡張で自動車中心",
        effects: { env: -2, eco: 3, soc: 0 },
        typePoints: { Industrial: 2 },
        resources: { funds: -2 },
        explanation: "経済効率は上がるが環境負荷大。"
      },
      {
        text: "スマート交通システム導入",
        effects: { env: 1, eco: 2, soc: 2 },
        typePoints: { Smart: 3 },
        resources: { funds: -4, tech: 3 },
        explanation: "AIで最適化し効率化。交通渋滞緩和の実例あり。"
      }
    ]
  },
  {
    title: "新しい産業を誘致する",
    description: "経済成長か、環境・社会のバランスか？",
    choices: [
      {
        text: "ハイテク企業中心",
        effects: { env: -1, eco: 3, soc: 1 },
        typePoints: { Science: 3, Smart: 1 },
        resources: { funds: -2, tech: 3 },
        explanation: "高付加価値産業で経済・技術向上。米国シリコンバレーの例。"
      },
      {
        text: "製造業中心で雇用確保",
        effects: { env: -2, eco: 2, soc: 2 },
        typePoints: { Industrial: 3 },
        resources: { funds: -1, labor: 5 },
        explanation: "雇用は増えるが環境悪化。"
      },
      {
        text: "環境・福祉産業中心",
        effects: { env: 2, eco: 0, soc: 3 },
        typePoints: { Eco: 2, Social: 2 },
        resources: { funds: -2, labor: 2 },
        explanation: "持続可能な社会を重視する都市設計。"
      }
    ]
  },
  {
    title: "教育・人材育成に投資",
    description: "未来の都市発展に必要なスキルを育てる。",
    choices: [
      {
        text: "大学・研究機関中心",
        effects: { env: -1, eco: 2, soc: 2 },
        typePoints: { Science: 3, Education: 2 },
        resources: { tech: 3, funds: -3 },
        explanation: "技術力・経済力を同時に強化。"
      },
      {
        text: "学校・職業訓練中心",
        effects: { env: 0, eco: 1, soc: 3 },
        typePoints: { Social: 2, Education: 2 },
        resources: { labor: 3, funds: -2 },
        explanation: "住民の生活満足度と技能向上。"
      },
      {
        text: "教育コスト最小化",
        effects: { env: 0, eco: 3, soc: -1 },
        typePoints: { Industrial: 1 },
        resources: { funds: -1 },
        explanation: "短期経済効率重視だが社会満足度低下。"
      }
    ]
  }
  {
    title: "都市のゴミ処理",
    description: "持続可能性と効率のバランス。",
    choices: [
      {
        text: "リサイクル中心・環境重視",
        effects: { env: 3, eco: -1, soc: 2 },
        typePoints: { Eco: 3 },
        resources: { funds: -2, recycled: 5 },
        explanation: "ドイツの循環型都市モデルを参考。"
      },
      {
        text: "焼却で即効処理",
        effects: { env: -2, eco: 2, soc: 0 },
        typePoints: { Industrial: 2 },
        resources: { funds: -1, energy: 2 },
        explanation: "経済は伸びるが環境悪化。"
      },
      {
        text: "廃棄物発電活用",
        effects: { env: -1, eco: 2, soc: 1 },
        typePoints: { Smart: 2 },
        resources: { energy: 3, funds: -2 },
        explanation: "エネルギーを生むが多少環境負荷。"
      }
    ]
  },
  {
    title: "都市の水資源管理",
    description: "人口増加に伴い、水不足が懸念される。",
    choices: [
      {
        text: "雨水再利用・節水施策中心",
        effects: { env: 3, eco: 0, soc: 1 },
        typePoints: { Eco: 2, Smart: 1 },
        resources: { water: 5, funds: -2 },
        explanation: "シンガポールの雨水利用モデル。"
      },
      {
        text: "大規模ダム建設で安定供給",
        effects: { env: -2, eco: 2, soc: 1 },
        typePoints: { Industrial: 2 },
        resources: { water: 10, funds: -4 },
        explanation: "安定供給だが環境破壊リスク。"
      },
      {
        text: "地下水を無制限に利用",
        effects: { env: -3, eco: 1, soc: -1 },
        typePoints: { Industrial: 1 },
        resources: { water: 8, funds: -1 },
        explanation: "短期的に経済は上がるが持続不可。"
      }
    ]
  },
  {
    title: "都市の緑地・公園整備",
    description: "住民の健康と都市の環境改善を目指す。",
    choices: [
      {
        text: "都市公園・緑地を積極整備",
        effects: { env: 3, eco: -1, soc: 2 },
        typePoints: { Eco: 2, Social: 1 },
        resources: { funds: -3 },
        explanation: "住民満足度とCO2吸収に効果。"
      },
      {
        text: "ビル建設を優先、緑地最小化",
        effects: { env: -2, eco: 2, soc: -1 },
        typePoints: { Industrial: 2 },
        resources: { funds: 2 },
        explanation: "短期経済効率重視。"
      },
      {
        text: "屋上緑化・壁面緑化で効率的に整備",
        effects: { env: 2, eco: 1, soc: 2 },
        typePoints: { Smart: 2 },
        resources: { tech: 2, funds: -2 },
        explanation: "都市空間を有効活用。環境改善と居住快適性向上。"
      }
    ]
  },
  {
    title: "廃棄物・リサイクル政策",
    description: "ゴミの減量・リサイクルをどう進める？",
    choices: [
      {
        text: "徹底したリサイクル制度",
        effects: { env: 3, eco: -1, soc: 2 },
        typePoints: { Eco: 3 },
        resources: { recycled: 5, funds: -2 },
        explanation: "スウェーデンのゼロウェイスト運動のように環境改善。"
      },
      {
        text: "焼却で即処理",
        effects: { env: -2, eco: 2, soc: 0 },
        typePoints: { Industrial: 2 },
        resources: { energy: 2, funds: -1 },
        explanation: "短期効率は高いが環境悪化。"
      },
      {
        text: "廃棄物発電利用",
        effects: { env: -1, eco: 2, soc: 1 },
        typePoints: { Smart: 2 },
        resources: { energy: 3, funds: -2 },
        explanation: "エネルギー生成と循環型施策。"
      }
    ]
  },
  {
    title: "交通渋滞を減らすには？",
    description: "都市効率とCO2削減のバランスを考える。",
    choices: [
      {
        text: "自転車・徒歩優先の街づくり",
        effects: { env: 3, eco: 0, soc: 2 },
        typePoints: { Eco: 2, Smart: 1 },
        resources: { funds: -2 },
        explanation: "コペンハーゲン方式。環境改善と健康促進。"
      },
      {
        text: "道路拡張で車優先",
        effects: { env: -2, eco: 2, soc: 0 },
        typePoints: { Industrial: 2 },
        resources: { funds: -1 },
        explanation: "経済は上がるが環境悪化。"
      },
      {
        text: "AIによるスマート交通制御",
        effects: { env: 1, eco: 2, soc: 2 },
        typePoints: { Smart: 3 },
        resources: { tech: 3, funds: -3 },
        explanation: "IoTで効率化し渋滞緩和。"
      }
    ]
  },
  {
    title: "教育・研究施設への投資",
    description: "将来の技術力と経済成長に影響。",
    choices: [
      {
        text: "大学・研究所を重点整備",
        effects: { env: -1, eco: 3, soc: 2 },
        typePoints: { Science: 3, Smart: 1 },
        resources: { tech: 4, funds: -3 },
        explanation: "科学都市・ハイテク都市への道。"
      },
      {
        text: "職業訓練中心",
        effects: { env: 0, eco: 2, soc: 3 },
        typePoints: { Social: 2, Education: 2 },
        resources: { labor: 3, funds: -2 },
        explanation: "地域社会と生活満足度向上。"
      },
      {
        text: "投資最小化で経費節約",
        effects: { env: 0, eco: 3, soc: -1 },
        typePoints: { Industrial: 1 },
        resources: { funds: -1 },
        explanation: "短期経済効率重視。"
      }
    ]
  },
  {
    title: "防災設備をどう整備する？",
    description: "災害リスクを下げるための投資。",
    choices: [
      {
        text: "耐震・洪水対策を強化",
        effects: { env: 1, eco: -1, soc: 3 },
        typePoints: { Social: 2, Eco: 1 },
        resources: { funds: -3 },
        explanation: "日本の防災都市モデルに近い。"
      },
      {
        text: "災害保険や支援制度に依存",
        effects: { env: 0, eco: 1, soc: 2 },
        typePoints: { Social: 1 },
        resources: { funds: -1 },
        explanation: "直接の建設コストは減るが被害リスク残る。"
      },
      {
        text: "最小コストでインフラ整備",
        effects: { env: 0, eco: 2, soc: -1 },
        typePoints: { Industrial: 1 },
        resources: { funds: -1 },
        explanation: "コスト削減優先、被害リスク増。"
      }
    ]
  },
  {
    title: "医療・福祉への投資",
    description: "住民の健康と幸福度に直結。",
    choices: [
      {
        text: "病院・介護施設を充実",
        effects: { env: 0, eco: -1, soc: 3 },
        typePoints: { Social: 3 },
        resources: { funds: -3, labor: 2 },
        explanation: "福祉都市モデル。住民満足度向上。"
      },
      {
        text: "医療は最低限、経済優先",
        effects: { env: 0, eco: 2, soc: -2 },
        typePoints: { Industrial: 1 },
        resources: { funds: -1 },
        explanation: "短期経済重視だが生活満足度低下。"
      },
      {
        text: "スマート医療で効率化",
        effects: { env: 1, eco: 1, soc: 2 },
        typePoints: { Smart: 2 },
        resources: { tech: 2, funds: -2 },
        explanation: "AIで効率化し健康管理。"
      }
    ]
  },
  {
    title: "都市の食料自給をどうする？",
    description: "農業・物流・食料安全保障のバランス。",
    choices: [
      {
        text: "都市農業・地産地消",
        effects: { env: 2, eco: 0, soc: 2 },
        typePoints: { Eco: 2, Social: 1 },
        resources: { food: 5, funds: -2 },
        explanation: "持続可能な農業と地産地消モデル。"
      },
      {
        text: "大量輸入で経済効率優先",
        effects: { env: -1, eco: 3, soc: 0 },
        typePoints: { Industrial: 2 },
        resources: { funds: -1, food: 8 },
        explanation: "経済効率は高いが輸送コストと環境負荷増。"
      },
      {
        text: "技術農業・水耕栽培導入",
        effects: { env: 1, eco: 2, soc: 1 },
        typePoints: { Smart: 2, Science: 1 },
        resources: { tech: 2, food: 6, funds: -2 },
        explanation: "都市内で効率的な食料生産。"
      }
    ]
  },
  {
    title: "エネルギー多様化戦略",
    description: "将来の都市運営に必要な安定電力。",
    choices: [
      {
        text: "再生可能エネルギー中心",
        effects: { env: 3, eco: -1, soc: 1 },
        typePoints: { Eco: 3 },
        resources: { energy: 4, funds: -2 },
        explanation: "CO2削減と持続可能性向上。"
      },
      {
        text: "原子力で安定供給",
        effects: { env: -2, eco: 3, soc: 1 },
        typePoints: { Industrial: 2 },
        resources: { energy: 10, funds: -4 },
        explanation: "大量エネルギー確保、環境リスクあり。"
      },
      {
        text: "分散型小規模発電",
        effects: { env: 2, eco: 0, soc: 2 },
        typePoints: { Smart: 2 },
        resources: { energy: 5, funds: -3 },
        explanation: "地域で安定供給、環境負荷少。"
      }
    ]
  },
  {
    title: "都市の防犯対策",
    description: "住民の安全確保をどう進める？",
    choices: [
      {
        text: "監視カメラ・警備増強",
        effects: { env: -1, eco: 1, soc: 3 },
        typePoints: { Smart: 2, Social: 1 },
        resources: { tech: 2, funds: -2 },
        explanation: "都市安全度向上だがコスト増。"
      },
      {
        text: "コミュニティ見守り中心",
        effects: { env: 1, eco: 0, soc: 2 },
        typePoints: { Social: 2 },
        resources: { labor: 2, funds: -1 },
        explanation: "住民参加型で安全性向上。"
      },
      {
        text: "防犯投資最小化",
        effects: { env: 0, eco: 2, soc: -1 },
        typePoints: { Industrial: 1 },
        resources: { funds: -1 },
        explanation: "コスト削減優先、安全性低下。"
      }
    ]
  }];
