import Link from "next/link"
import type { StoreData } from "@/lib/types"

interface StoreTableProps {
  stores: StoreData[]
}

export default function StoreTable({ stores }: StoreTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-3 text-left font-semibold">情報取得時刻</th>
            <th className="px-4 py-3 text-left font-semibold">店舗名</th>
            <th className="px-4 py-3 text-center font-semibold">種別</th>
            <th className="px-4 py-3 text-right font-semibold">座席数</th>
            <th className="px-4 py-3 text-right font-semibold">稼働数</th>
            <th className="px-4 py-3 text-right font-semibold">稼働率</th>
            <th className="px-4 py-3 text-right font-semibold">停止数</th>
            <th className="px-4 py-3 text-right font-semibold">停止率</th>
            <th className="px-4 py-3 text-right font-semibold">未18</th>
            <th className="px-4 py-3 text-center font-semibold">店内マップ</th>
            <th className="px-4 py-3 text-center font-semibold">詳細表示</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {stores.map((store, index) => (
            <tr key={`${store.storeName}-${store.timestamp}`} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
              <td className="px-4 py-3 text-left">{store.timestamp}</td>
              <td className="px-4 py-3 text-left font-bold">{store.storeName}</td>
              <td className="px-4 py-3 text-center">{store.type}</td>
              <td className="px-4 py-3 text-right">{store.seats}</td>
              <td className="px-4 py-3 text-right">{store.active}</td>
              <td className="px-4 py-3 text-right">{store.activeRate}</td>
              <td className="px-4 py-3 text-right">{store.stopped}</td>
              <td className="px-4 py-3 text-right">{store.stopRate}</td>
              <td className="px-4 py-3 text-right">{store.under18}</td>
              <td className="px-4 py-3 text-center">
                <Link
                  href={`/store/${encodeURIComponent(store.storeName)}/map`}
                  className="text-blue-600 hover:underline"
                >
                  マップ表示
                </Link>
              </td>
              <td className="px-4 py-3 text-center">
                <Link
                  href={`/store/${encodeURIComponent(store.storeName)}/details`}
                  className="text-blue-600 hover:underline"
                >
                  テキスト表示
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

