export const storeData = {
  // 全店舗データ
  allStores: [
    {
      timestamp: "2025/2/4 15:55:33",
      storeName: "池袋西口ROSA",
      type: "直営",
      seats: 119,
      active: 29,
      activeRate: "24 %",
      stopped: 5,
      stopRate: "4 %",
      under18: 0,
      mapLink: "#",
      detailsLink: "#",
    },
    {
      timestamp: "2025/2/4 15:55:42",
      storeName: "NEXT蒲田西口",
      type: "直営",
      seats: 108,
      active: 37,
      activeRate: "34 %",
      stopped: 10,
      stopRate: "9 %",
      under18: 1,
      mapLink: "#",
      detailsLink: "#",
    },
    // ... その他の店舗データ
  ],

  // 速報データ
  breakingNews: [
    {
      openTime: "2025/02/03 20:10:07",
      updateTime: "2025/02/04 16:00:30",
      storeName: "池袋西口ROSA",
      type: "直営",
      capacity: 98,
      newCustomers: 11,
      newCustomerRate: "11%",
      totalAmount: 142980,
    },
    {
      openTime: "2025/02/03 20:05:44",
      updateTime: "2025/02/04 16:00:30",
      storeName: "NEXT蒲田西口",
      type: "直営",
      capacity: 114,
      newCustomers: 6,
      newCustomerRate: "5%",
      totalAmount: 228680,
    },
    // ... その他の速報データ
  ],

  // エリアごとの店舗データ
  areaStores: {
    "hokkaido-tohoku": [
      {
        timestamp: "2025/2/4 16:10:2",
        storeName: "室蘭中島サンプラ",
        type: "FC",
        seats: 90,
        active: 6,
        activeRate: "6 %",
        stopped: 4,
        stopRate: "4 %",
        under18: 0,
        mapLink: "#",
        detailsLink: "#",
      },
      {
        timestamp: "2025/2/4 16:10:37",
        storeName: "苫小牧店",
        type: "直営",
        seats: 151,
        active: 15,
        activeRate: "9 %",
        stopped: 1,
        stopRate: "0 %",
        under18: 0,
        mapLink: "#",
        detailsLink: "#",
      },
    ],
    kanto: [
      // 関東エリアの店舗データ
    ],
    // ... その他のエリアデータ
  },

  // 店舗詳細データ
  storeDetails: {
    池袋西口ROSA: {
      stats: {
        totalSeats: 119,
        activeSeats: 26,
        activeRate: "21%",
        stoppedSeats: 8,
        stoppedRate: "6%",
        under18: 0,
      },
      seatUsage: [
        {
          seatNumber: 11,
          startTime: "2025/02/04 15:51:39",
          duration: "00時間 08分",
          status: "清掃中",
        },
        {
          seatNumber: 19,
          startTime: "2025/02/04 15:17:18",
          duration: "00時間 43分",
          status: "その他の理由で停止中",
        },
      ],
    },
  },
}

export const areas = [
  { id: "all", name: "全国", path: "/" },
  { id: "hokkaido-tohoku", name: "北海道・東北", path: "/area/hokkaido-tohoku" },
  { id: "kanto", name: "関東", path: "/area/kanto" },
  { id: "chubu", name: "中部", path: "/area/chubu" },
  { id: "kinki", name: "近畿", path: "/area/kinki" },
  { id: "chugoku-shikoku", name: "中国・四国", path: "/area/chugoku-shikoku" },
  { id: "kyushu-okinawa", name: "九州・沖縄", path: "/area/kyushu-okinawa" },
]

