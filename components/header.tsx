import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/login" className="text-blue-600 hover:underline">
            ログアウト
          </Link>
        </div>
        <div className="pb-4">
          <h1 className="text-2xl font-bold text-center mb-4">自遊空間店舗一覧 全国</h1>
          <div className="flex justify-center gap-8">
            <Link href="/app2/" className="text-blue-600 hover:underline">
              一覧
            </Link>
            <Link href="/app2/breaking-news" className="text-blue-600 hover:underline">
              速報
            </Link>
            <Link href="/app2/area" className="text-blue-600 hover:underline">
              エリア
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

