"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, Save, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spreadsheet } from "@/components/spreadsheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function SpreadsheetPage() {
  const params = useParams()
  const router = useRouter()
  const fileId = decodeURIComponent(params.fileId as string)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[][]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load data from sessionStorage
    const loadData = () => {
      setLoading(true)
      try {
        const storedData = sessionStorage.getItem("spreadsheetData")

        if (!storedData) {
          setError("No data found. Please upload a CSV file.")
          setLoading(false)
          return
        }

        const parsedData = JSON.parse(storedData)
        setData(parsedData)
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Failed to load spreadsheet data.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleDataChange = (newData: any[][]) => {
    setData(newData)
    // Update sessionStorage with the new data
    sessionStorage.setItem("spreadsheetData", JSON.stringify(newData))
  }

  const handleSave = () => {
    // Create a CSV string from the data
    const csvContent = data
      .map((row) =>
        row
          .map((cell) => {
            // Handle cells with commas by wrapping in quotes
            const cellStr = String(cell)
            return cellStr.includes(",") ? `"${cellStr}"` : cellStr
          })
          .join(","),
      )
      .join("\n")

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", fileId)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    alert("File saved successfully!")
  }

  const handleExport = (format: string) => {
    if (format === "CSV") {
      handleSave()
    } else {
      alert(`Exporting as ${format} is not implemented yet.`)
    }
  }

  const handleAddRow = () => {
    if (data.length === 0) {
      setError("Cannot add rows to empty spreadsheet.")
      return
    }

    const newData = [...data]
    const newRow = Array(data[0]?.length || 0).fill("")
    newData.push(newRow)
    setData([...newData])
  }

  const handleGoBack = () => {
    // Clear the session storage when going back
    sessionStorage.removeItem("spreadsheetData")
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{fileId}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={handleAddRow} disabled={data.length === 0}>
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
          <div className="relative">
            <Tabs defaultValue="csv">
              <TabsList className="grid w-[180px] grid-cols-2">
                <TabsTrigger value="csv">CSV</TabsTrigger>
                <TabsTrigger value="excel" disabled>
                  Excel
                </TabsTrigger>
              </TabsList>
              <TabsContent value="csv">
                <Button onClick={() => handleExport("CSV")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-[600px] border rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading spreadsheet data...</p>
          </div>
        </div>
      ) : data.length > 0 ? (
        <Spreadsheet data={data} onChange={handleDataChange} />
      ) : !error ? (
        <div className="flex items-center justify-center h-[600px] border rounded-lg">
          <div className="text-center">
            <p className="text-muted-foreground">No data available. Please upload a CSV file.</p>
            <Button className="mt-4" onClick={handleGoBack}>
              Go Back to Upload
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
