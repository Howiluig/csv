"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Download, Save, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Spreadsheet } from "@/components/spreadsheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BulkRowActions } from "@/components/bulk-row-actions"

export default function SpreadsheetPage() {
  const params = useParams()
  const fileId = decodeURIComponent(params.fileId as string)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[][]>([])

  useEffect(() => {
    // Simulate loading data from API
    const loadData = async () => {
      setLoading(true)

      // Generate mock data based on file name
      const mockData = generateMockData(fileId)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      setData(mockData)
      setLoading(false)
    }

    loadData()
  }, [fileId])

  const handleDataChange = (newData: any[][]) => {
    setData(newData)
  }

  const handleSave = () => {
    // Simulate saving data
    alert("Changes saved successfully!")
  }

  const handleExport = (format: string) => {
    // Simulate exporting data
    alert(`Exporting data as ${format}...`)
  }

  const handleAddRows = (count: number) => {
    const newData = [...data]
    for (let i = 0; i < count; i++) {
      const newRow = Array(data[0]?.length || 0).fill("")
      if (newRow.length > 0) {
        newRow[0] = `Row ${data.length + i}`
      }
      newData.push(newRow)
    }
    setData(newData)
  }

  const handleDeleteLastRows = (count: number) => {
    if (data.length <= 1) return // Don't delete the header row
    const newData = [...data]
    const rowsToDelete = Math.min(count, newData.length - 1) // Keep at least the header row
    newData.splice(newData.length - rowsToDelete, rowsToDelete)
    setData(newData)
  }

  const handleDuplicateLastRow = () => {
    if (data.length <= 1) return // Need at least one data row to duplicate
    const newData = [...data]
    const lastRow = [...newData[newData.length - 1]]
    if (lastRow[0] && typeof lastRow[0] === "string" && lastRow[0].startsWith("Row ")) {
      lastRow[0] = `Row ${data.length}`
    }
    newData.push(lastRow)
    setData(newData)
  }

  // Generate mock data based on file name
  const generateMockData = (fileName: string) => {
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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{fileId}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={() => handleAddRows(1)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
          <BulkRowActions
            onAddRows={handleAddRows}
            onDeleteLastRows={handleDeleteLastRows}
            onDuplicateLastRow={handleDuplicateLastRow}
          />
          <div className="relative">
            <Tabs defaultValue="csv">
              <TabsList className="grid w-[180px] grid-cols-2">
                <TabsTrigger value="csv">CSV</TabsTrigger>
                <TabsTrigger value="excel">Excel</TabsTrigger>
              </TabsList>
              <TabsContent value="csv">
                <Button onClick={() => handleExport("CSV")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </TabsContent>
              <TabsContent value="excel">
                <Button onClick={() => handleExport("Excel")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[600px] border rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading spreadsheet data...</p>
          </div>
        </div>
      ) : (
        <Spreadsheet data={data} onChange={handleDataChange} />
      )}
    </div>
  )
}
