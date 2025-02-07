export interface StoreData {
  timestamp: string
  storeName: string
  type: string
  seats: number
  active: number
  activeRate: string
  stopped: number
  stopRate: string
  under18: number
  mapLink: string
  detailsLink: string
}

export interface BreakingNewsData {
  openTime: string
  updateTime: string
  storeName: string
  type: string
  capacity: number
  newCustomers: number
  newCustomerRate: string
  totalAmount: number
}

export interface Area {
  id: string
  name: string
  path: string
}

export interface SeatUsage {
  seatNumber: number
  startTime: string
  duration: string
  status?: string
}

export interface StoreDetails {
  stats: {
    totalSeats: number
    activeSeats: number
    activeRate: string
    stoppedSeats: number
    stoppedRate: string
    under18: number
  }
  seatUsage: SeatUsage[]
}

