export const convertToCSV = (data) => {
  const headers = [
    "店舗名",
    "店番",
    "対象期間売上",
    "比較期間売上",
    "売上差異",
    "売上比率",
    "対象期間利用者",
    "比較期間利用者",
    "利用者差異",
    "利用者比率",
    "対象期間客単価",
    "比較期間客単価",
    "客単価差異",
    "客単価比率",
    "対象期間新規",
    "比較期間新規",
    "新規差異",
    "新規比率",
    "対象期間新規率",
    "比較期間新規率",
    "対象期間その他売上",
    "比較期間その他売上",
    "その他売上差異",
    "その他売上比率",
  ];

  const rows = data.map((store) => [
    store.storeName,
    store.storeNumber,
    store.netSalesA,
    store.netSalesB,
    store.netSalesChange,
    store.netSalesRatio,
    store.usersA,
    store.usersB,
    store.usersChange,
    store.usersRatio,
    store.avgPriceA,
    store.avgPriceB,
    store.avgPriceChange,
    store.avgPriceRatio,
    store.newUsersA,
    store.newUsersB,
    store.newUsersChange,
    store.newUsersRatio,
    store.newUsersRateA,
    store.newUsersRateB,
    store.otherSalesA,
    store.otherSalesB,
    store.otherSalesChange,
    store.otherSalesRatio,
  ]);

  const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\r\n");
  return csvContent;
};
export const downloadCSV = (csvContent, filename) => {
  const bom = "\uFEFF"; // BOMを追加　\uFEFF
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};