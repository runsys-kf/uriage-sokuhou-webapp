import type { SeatUsage } from "@/lib/types"

interface StoreMapProps {
  seatUsage: SeatUsage[]
}

export default function StoreMap({ seatUsage }: StoreMapProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="aspect-[4/3] relative bg-[#8B4513] text-white">
        <div className="absolute inset-0 p-8">
          <div className="border-2 border-white p-4">
            <h3 className="text-2xl font-bold mb-4">店内マップ</h3>
            <div className="grid grid-cols-5 gap-2">
              {seatUsage.map((seat) => (
                <div
                  key={seat.seatNumber}
                  className={`p-2 text-center border ${
                    seat.status === "清掃中"
                      ? "bg-cyan-100 text-black"
                      : seat.status === "その他の理由で停止中"
                        ? "bg-yellow-100 text-black"
                        : seat.startTime
                          ? "bg-red-500"
                          : "bg-green-500"
                  }`}
                >
                  {seat.seatNumber}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500"></div>
          <span>空席</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500"></div>
          <span>使用中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-cyan-100"></div>
          <span>清掃中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100"></div>
          <span>停止中</span>
        </div>
      </div>
    </div>
  )
}

