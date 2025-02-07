import Header from "@/components/header"
import Link from "next/link"
import { areas } from "@/data/sample_data"

export default function AreaSelectionPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-bold mb-6">エリア選択</h1>
        <nav className="space-y-2">
          {areas.map((area) => (
            <div key={area.id}>
              <Link href={area.path} className="text-blue-600 hover:underline">
                {area.name}
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </main>
  )
}

