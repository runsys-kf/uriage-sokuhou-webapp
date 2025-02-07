import Header from "@/components/header"
import { storeData } from "@/data/sample_data"

export default function StoreDetailsPage({ params }: { params: { name: string } }) {
  const storeName = decodeURIComponent(params.name)
  const storeDetail = storeData.storeDetails[storeName]

  if (!storeDetail) {
    return <div>Store not found</div>
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">{storeName}</h1>
        <div className="text-sm mb-4">{new Date().toLocaleString("ja-JP")} の利用状況</div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left font-semibold">選択</th>
                <th className="px-4 py-3 text-left font-semibold">座席番号</th>
                <th className="px-4 py-3 text-left font-semibold">利用開始時刻</th>
                <th className="px-4 py-3 text-left font-semibold">利用時間</th>
                <th className="px-4 py-3 text-left font-semibold">状態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {storeDetail.seatUsage.map((usage) => (
                <tr
                  key={usage.seatNumber}
                  className={
                    usage.status === "清掃中"
                      ? "bg-cyan-100"
                      : usage.status === "その他の理由で停止中"
                        ? "bg-yellow-100"
                        : "bg-white"
                  }
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-4 py-3">{usage.seatNumber}</td>
                  <td className="px-4 py-3">{usage.startTime}</td>
                  <td className="px-4 py-3">{usage.duration}</td>
                  <td className="px-4 py-3">{usage.status || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

