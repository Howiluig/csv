"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export function FileUpload() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null)

    if (!selectedFile) return

    // Check file type
    const validTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ]
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please select a CSV or Excel file")
      return
    }

    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadProgress(0)

    try {
      // Read the file content
      const fileContent = await readFileContent(file)

      // Parse the CSV data
      const parsedData = parseCSV(fileContent)

      // Store the parsed data in sessionStorage for the spreadsheet page to access
      sessionStorage.setItem("spreadsheetData", JSON.stringify(parsedData))

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return prev
          }
          return prev + 5
        })
      }, 100)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      clearInterval(interval)
      setUploadProgress(100)

      // Redirect to spreadsheet view with file ID
      setTimeout(() => {
        router.push(`/spreadsheet/${encodeURIComponent(file.name)}`)
      }, 500)
    } catch (err) {
      console.error("Error processing file:", err)
      setError("Failed to process file. Please check the file format and try again.")
      setUploading(false)
    }
  }

  // Function to read file content
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string)
        } else {
          reject(new Error("Failed to read file"))
        }
      }

      reader.onerror = () => {
        reject(new Error("Error reading file"))
      }

      reader.readAsText(file)
    })
  }

  // Function to parse CSV content
  const parseCSV = (content: string): string[][] => {
    // Split by lines
    const lines = content.split(/\r\n|\n/)

    // Remove empty lines
    const nonEmptyLines = lines.filter((line) => line.trim() !== "")

    // Parse each line
    return nonEmptyLines.map((line) => {
      // Handle quoted values with commas inside them
      const result = []
      let inQuotes = false
      let currentValue = ""

      for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          result.push(currentValue)
          currentValue = ""
        } else {
          currentValue += char
        }
      }

      // Add the last value
      result.push(currentValue)

      // Remove quotes from values
      return result.map((value) => {
        if (value.startsWith('"') && value.endsWith('"')) {
          return value.substring(1, value.length - 1)
        }
        return value
      })
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Data</CardTitle>
        <CardDescription>Upload your CSV file to view and edit as a spreadsheet</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Upload className="h-8 w-8 mb-4 text-gray-500" />
          <div className="space-y-2">
            <p className="text-sm font-medium">Drag and drop your file here or click to browse</p>
            <p className="text-xs text-gray-500">Supports CSV files (up to 10MB)</p>
          </div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".csv"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <Button
              variant="outline"
              className="mt-4"
              disabled={uploading}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              Select File
            </Button>
          </label>
        </div>

        {file && (
          <div className="mt-4 flex items-center gap-2 p-2 bg-muted rounded">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium truncate">{file.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">{(file.size / 1024).toFixed(1)} KB</span>
          </div>
        )}

        {uploading && (
          <div className="mt-4 space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              {uploadProgress < 100 ? "Processing file..." : "Ready to view..."}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!file || uploading} onClick={handleUpload}>
          {uploading ? "Processing..." : "Upload and View as Spreadsheet"}
        </Button>
      </CardFooter>
    </Card>
  )
}
