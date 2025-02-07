import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import { parse } from "csv-parse/sync"

export async function GET() {
  try {
    const csvFile = await fs.readFile(process.cwd() + "/data/stores.csv", "utf-8")
    const records = parse(csvFile, {
      columns: true,
      skip_empty_lines: true,
    })
    return NextResponse.json(records)
  } catch (error) {
    console.error("Error reading CSV:", error)
    return NextResponse.json({ error: "Failed to load store data" }, { status: 500 })
  }
}

