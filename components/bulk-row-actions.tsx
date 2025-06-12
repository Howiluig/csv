"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Trash2, Copy, ChevronsUpDown } from "lucide-react"

interface BulkRowActionsProps {
  onAddRows: (count: number) => void
  onDeleteLastRows: (count: number) => void
  onDuplicateLastRow: () => void
}

export function BulkRowActions({ onAddRows, onDeleteLastRows, onDuplicateLastRow }: BulkRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ChevronsUpDown className="h-4 w-4 mr-2" />
          Row Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Bulk Row Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAddRows(1)}>
          <Plus className="h-4 w-4 mr-2" />
          Add 1 row
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAddRows(5)}>
          <Plus className="h-4 w-4 mr-2" />
          Add 5 rows
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAddRows(10)}>
          <Plus className="h-4 w-4 mr-2" />
          Add 10 rows
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDuplicateLastRow}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate last row
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDeleteLastRows(1)} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete last row
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDeleteLastRows(5)} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete last 5 rows
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
