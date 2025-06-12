"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Plus, Trash2, MoveVertical, ChevronUp, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface SpreadsheetProps {
  data: any[][]
  onChange: (data: any[][]) => void
}

export function Spreadsheet({ data, onChange }: SpreadsheetProps) {
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [gridData, setGridData] = useState<any[][]>([])
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize grid data from props
  useEffect(() => {
    setGridData(data)
  }, [data])

  const handleCellClick = (row: number, col: number) => {
    setActiveCell({ row, col })
    setEditValue(String(gridData[row][col] || ""))

    // Focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }, 10)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
  }

  const handleInputBlur = () => {
    if (activeCell) {
      const { row, col } = activeCell
      const newData = [...gridData]
      newData[row][col] = editValue
      setGridData(newData)
      onChange(newData)
      setActiveCell(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!activeCell) return

    const { row, col } = activeCell
    const rowCount = gridData.length
    const colCount = gridData[0]?.length || 0

    switch (e.key) {
      case "Enter":
        handleInputBlur()
        // Move to the cell below if possible
        if (row < rowCount - 1) {
          handleCellClick(row + 1, col)
        }
        break
      case "Tab":
        e.preventDefault()
        handleInputBlur()
        // Move to the next cell or wrap to the next row
        if (col < colCount - 1) {
          handleCellClick(row, col + 1)
        } else if (row < rowCount - 1) {
          handleCellClick(row + 1, 0)
        }
        break
      case "ArrowUp":
        if (row > 0) {
          handleInputBlur()
          handleCellClick(row - 1, col)
        }
        break
      case "ArrowDown":
        if (row < rowCount - 1) {
          handleInputBlur()
          handleCellClick(row + 1, col)
        }
        break
      case "ArrowLeft":
        if (col > 0) {
          handleInputBlur()
          handleCellClick(row, col - 1)
        }
        break
      case "ArrowRight":
        if (col < colCount - 1) {
          handleInputBlur()
          handleCellClick(row, col + 1)
        }
        break
      case "Escape":
        setActiveCell(null)
        break
    }
  }

  // Add new row functions
  const addRow = (index: number) => {
    // Create a new empty row with the same number of columns
    const newRow = Array(gridData[0]?.length || 0).fill("")

    // If it's not the header row (index 0), set the first cell to a row label
    if (index > 0) {
      newRow[0] = `Row ${gridData.length}`
    }

    const newData = [...gridData.slice(0, index + 1), newRow, ...gridData.slice(index + 1)]

    setGridData(newData)
    onChange(newData)
  }

  const deleteRow = (index: number) => {
    // Don't allow deleting the header row
    if (index === 0) return

    const newData = [...gridData.slice(0, index), ...gridData.slice(index + 1)]

    setGridData(newData)
    onChange(newData)
  }

  const moveRowUp = (index: number) => {
    // Don't allow moving the header row or moving a row above the header
    if (index <= 1) return

    const newData = [...gridData]
    const temp = newData[index]
    newData[index] = newData[index - 1]
    newData[index - 1] = temp

    setGridData(newData)
    onChange(newData)
  }

  const moveRowDown = (index: number) => {
    // Don't allow moving the last row down
    if (index === 0 || index >= gridData.length - 1) return

    const newData = [...gridData]
    const temp = newData[index]
    newData[index] = newData[index + 1]
    newData[index + 1] = temp

    setGridData(newData)
    onChange(newData)
  }

  // Generate column labels (A, B, C, ...)
  const columnLabels = Array.from({ length: gridData[0]?.length || 0 }, (_, i) => String.fromCharCode(65 + i))

  return (
    <div className="overflow-auto border rounded-lg">
      <div className="min-w-max">
        <div className="grid grid-cols-[40px_40px_repeat(auto-fill,minmax(100px,1fr))] sticky top-0 z-10 bg-muted">
          {/* Top-left corner cell */}
          <div className="h-10 border-b border-r flex items-center justify-center bg-muted font-medium text-muted-foreground">
            #
          </div>

          {/* Row actions header */}
          <div className="h-10 border-b border-r flex items-center justify-center bg-muted font-medium text-muted-foreground">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => addRow(0)}
              title="Add row below header"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Column headers */}
          {columnLabels.map((label, index) => (
            <div
              key={`col-${index}`}
              className="h-10 border-b border-r flex items-center justify-center bg-muted font-medium"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {gridData.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="grid grid-cols-[40px_40px_repeat(auto-fill,minmax(100px,1fr))]"
            onMouseEnter={() => setHoveredRow(rowIndex)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            {/* Row header */}
            <div className="h-10 border-b border-r flex items-center justify-center bg-muted font-medium text-muted-foreground sticky left-0">
              {rowIndex + 1}
            </div>

            {/* Row actions */}
            <div className="h-10 border-b border-r flex items-center justify-center bg-muted">
              {hoveredRow === rowIndex && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoveVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => addRow(rowIndex)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Insert row below
                    </DropdownMenuItem>
                    {rowIndex > 0 && (
                      <DropdownMenuItem onClick={() => deleteRow(rowIndex)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete row
                      </DropdownMenuItem>
                    )}
                    {rowIndex > 1 && (
                      <DropdownMenuItem onClick={() => moveRowUp(rowIndex)}>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Move up
                      </DropdownMenuItem>
                    )}
                    {rowIndex > 0 && rowIndex < gridData.length - 1 && (
                      <DropdownMenuItem onClick={() => moveRowDown(rowIndex)}>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Move down
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Row cells */}
            {row.map((cell, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={cn(
                  "h-10 border-b border-r relative",
                  rowIndex === 0 && "font-medium bg-muted/50",
                  activeCell?.row === rowIndex && activeCell?.col === colIndex && "bg-primary/10",
                )}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {activeCell?.row === rowIndex && activeCell?.col === colIndex ? (
                  <Input
                    ref={inputRef}
                    className="absolute inset-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                    value={editValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                  />
                ) : (
                  <div className="px-2 py-2 h-full overflow-hidden text-ellipsis whitespace-nowrap">{cell}</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
