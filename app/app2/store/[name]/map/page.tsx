import Header from "@/components/header"
import StoreMap from "@/components/store-map"
import { storeData } from "@/data/sample_data"

export default function StoreMapPage({ params }: { params: { name: string } }) {
  const storeName = decodeURIComponent(params.name)
  const storeDetail = storeData.storeDetails[storeName]

  if (!storeDetail) {
    return <div>Store not found</div>
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">自遊空間 {storeName}店 座席利用状況</h1>
        <div className="flex justify-end space-x-2 mb-4">
          <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">更新</button>
          <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">店舗一覧</button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4 text-sm">
            <span>座席数：{storeDetail.stats.totalSeats}</span>
            <span>稼働数：{storeDetail.stats.activeSeats}</span>
            <span>稼働率：{storeDetail.stats.activeRate}</span>
            <span>（停止数：{storeDetail.stats.stoppedSeats}</span>
            <span>停止率：{storeDetail.stats.stoppedRate}）</span>
            <span>※18未満：{storeDetail.stats.under18}</span>
          </div>
        </div>
        <StoreMap seatUsage={storeDetail.seatUsage} />
      </div>
    </main>
  )
}

