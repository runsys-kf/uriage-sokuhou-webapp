import Link from "next/link"
import Header from "@/components/header"
import StoreTable from "@/components/store-table"
import { storeData, areas } from "@/data/sample_data"

export default function AreaPage({ params }: { params: { area: string } }) {
  const areaName = areas.find((a) => a.id === params.area)?.name || params.area
  const stores = storeData.areaStores[params.area] || []

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">自遊空間店舗一覧 {areaName}</h1>
        <div className="flex gap-4 mb-4">
          <Link href="/" className="text-blue-600 hover:underline">
            一覧
          </Link>
          <Link href="/breaking-news" className="text-blue-600 hover:underline">
            速報
          </Link>
          <Link href="/area" className="text-blue-600 hover:underline">
            エリア
          </Link>
        </div>
        <StoreTable stores={stores} />
      </div>
    </main>
  )
}

