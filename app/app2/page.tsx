import StoreTable from "@/components/store-table"
import Header from "@/components/header"
import { storeData } from "@/data/sample_data"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <StoreTable stores={storeData.allStores} />
      </div>
    </main>
  )
}

