import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { fileId: string } }) {
  try {
    const fileId = params.fileId

    // In a real application, you would:
    // 1. Retrieve the data for the given fileId from your database
    // 2. Format it appropriately for the client

    // For this example, we'll generate mock data
    const data = generateMockData(fileId)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, message: "Failed to retrieve spreadsheet data" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { fileId: string } }) {
  try {
    const fileId = params.fileId
    const { data } = await request.json()

    // In a real application, you would:
    // 1. Validate the data
    // 2. Save the updated data to your database

    return NextResponse.json({
      success: true,
      message: "Spreadsheet data updated successfully",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, message: "Failed to update spreadsheet data" }, { status: 500 })
  }
}

function generateMockData(fileId: string) {
  const rows = 20
  const cols = 10
  const result = []

  // Generate header row
  const header = []
  for (let i = 0; i < cols; i++) {
    header.push(`Column ${String.fromCharCode(65 + i)}`)
  }
  result.push(header)

  // Generate data rows
  for (let i = 1; i < rows; i++) {
    const row = []
    for (let j = 0; j < cols; j++) {
      if (j === 0) {
        row.push(`Row ${i}`)
      } else {
        // Generate different types of data
        if (j % 3 === 0) {
          row.push(Math.floor(Math.random() * 1000))
        } else if (j % 3 === 1) {
          row.push((Math.random() * 100).toFixed(2))
        } else {
          row.push(`Value ${i}-${j}`)
        }
      }
    }
    result.push(row)
  }

  return result
}
