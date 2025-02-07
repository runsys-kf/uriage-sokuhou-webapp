import Header from "@/components/header"
import { formatNumber } from "@/lib/utils"
import { storeData } from "@/data/sample_data"

export default function BreakingNewsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">自遊空間速報 全国</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">営業開始時刻</th>
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">情報取得時刻</th>
                <th className="px-4 py-3 text-left font-semibold">店舗名</th>
                <th className="px-4 py-3 text-center font-semibold">種別</th>
                <th className="px-4 py-3 text-right font-semibold">容数</th>
                <th className="px-4 py-3 text-right font-semibold">新規数</th>
                <th className="px-4 py-3 text-right font-semibold">新規率</th>
                <th className="px-4 py-3 text-right font-semibold">売上合計</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {storeData.breakingNews.map((store, index) => (
                <tr
                  key={`${store.storeName}-${store.updateTime}`}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                >
                  <td className="px-4 py-3 text-left whitespace-nowrap">{store.openTime}</td>
                  <td className="px-4 py-3 text-left whitespace-nowrap">{store.updateTime}</td>
                  <td className="px-4 py-3 text-left font-bold">{store.storeName}</td>
                  <td className="px-4 py-3 text-center">{store.type}</td>
                  <td className="px-4 py-3 text-right">{store.capacity}</td>
                  <td className="px-4 py-3 text-right">{store.newCustomers}</td>
                  <td className="px-4 py-3 text-right">{store.newCustomerRate}</td>
                  <td className="px-4 py-3 text-right">{formatNumber(store.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

