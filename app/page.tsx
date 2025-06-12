import { FileUpload } from "@/components/file-upload"
import { SpreadsheetIntro } from "@/components/spreadsheet-intro"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Data Spreadsheet</h1>
      <div className="grid gap-8">
        <FileUpload />
        <SpreadsheetIntro />
      </div>
    </div>
  )
}
