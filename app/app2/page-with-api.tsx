// import Header from "@/Header"
// import StoreTable from "./StoreTable"
import StoreTable from "@/components/store-table"
import Header from "@/components/header"


async function getStores() {
  const res = await fetch("http://localhost:3000/api/stores")
  if (!res.ok) throw new Error("Failed to fetch stores")
  return res.json()
}

export default async function Page() {
  const stores = await getStores()

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <StoreTable stores={stores} />
      </div>
    </main>
  )
}

