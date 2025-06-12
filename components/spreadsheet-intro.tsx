import { FileSpreadsheet, Upload, Edit } from "lucide-react"

export function SpreadsheetIntro() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-card">
        <div className="p-3 rounded-full bg-primary/10 mb-4">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">Upload Your CSV</h3>
        <p className="text-sm text-muted-foreground">
          Upload CSV files to convert them into an interactive spreadsheet
        </p>
      </div>

      <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-card">
        <div className="p-3 rounded-full bg-primary/10 mb-4">
          <FileSpreadsheet className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">View as Spreadsheet</h3>
        <p className="text-sm text-muted-foreground">
          Your data is displayed in a familiar spreadsheet format for easy viewing and editing
        </p>
      </div>

      <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-card">
        <div className="p-3 rounded-full bg-primary/10 mb-4">
          <Edit className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">Edit and Export</h3>
        <p className="text-sm text-muted-foreground">Make changes to your data and export it back to CSV format</p>
      </div>
    </div>
  )
}
