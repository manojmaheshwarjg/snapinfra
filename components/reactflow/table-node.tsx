"use client"

import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Database,
  Key,
  Link,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  Zap
} from "lucide-react"

export interface TableNodeData {
  id: string
  name: string
  description: string
  fields: Array<{
    id: string
    name: string
    type: string
    isPrimary?: boolean
    isForeignKey?: boolean
    isRequired?: boolean
    isUnique?: boolean
    hasIndex?: boolean
    description?: string
  }>
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
}

const getFieldTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'uuid':
    case 'text':
      return 'bg-blue-100 text-blue-700'
    case 'number':
    case 'decimal':
      return 'bg-blue-100 text-blue-700'
    case 'boolean':
      return 'bg-purple-100 text-purple-700'
    case 'date':
    case 'datetime':
      return 'bg-orange-100 text-orange-700'
    case 'json':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

const getFieldIcon = (field: TableNodeData['fields'][0]) => {
  if (field.isPrimary) return <Key className="w-3 h-3 text-yellow-600" />
  if (field.isForeignKey) return <Link className="w-3 h-3 text-blue-600" />
  if (field.hasIndex) return <Zap className="w-3 h-3 text-blue-600" />
  return null
}

function TableNode({ data, selected }: NodeProps<TableNodeData>) {
  const handleMenuAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation()
    switch (action) {
      case 'edit':
        data.onEdit?.()
        break
      case 'duplicate':
        data.onDuplicate?.()
        break
      case 'delete':
        data.onDelete?.()
        break
    }
  }

  return (
    <Card
      className={`w-64 sm:w-72 shadow-lg transition-all duration-200 bg-white ${
        selected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {/* Connection handles for foreign key relationships */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500 border-2 border-white"
        style={{ top: '50%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-500 border-2 border-white"
        style={{ top: '50%' }}
      />

      <CardHeader className="pb-3 bg-white rounded-t-lg border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
              <Database className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">{data.name}</h4>
              <p className="text-xs text-gray-500">{data.description}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => handleMenuAction('edit', e)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Table
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => handleMenuAction('duplicate', e)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => handleMenuAction('delete', e)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-48 overflow-y-auto">
          {data.fields.map((field, index) => (
            <div
              key={field.id}
              className={`flex items-center justify-between px-3 py-2 text-xs border-b border-gray-100 last:border-b-0 ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getFieldIcon(field)}
                <span className="font-medium text-gray-900 truncate">
                  {field.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={`text-xs px-1 py-0 ${getFieldTypeColor(field.type)}`}
                >
                  {field.type}
                </Badge>

                {field.isRequired && (
                  <span className="text-red-500 font-bold">*</span>
                )}
              </div>

              {/* Field-specific connection handles */}
              {field.isForeignKey && (
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${data.id}-${field.id}-source`}
                  className="w-2 h-2 !bg-blue-400 border border-white"
                  style={{ top: `${((index + 1) / data.fields.length) * 100}%` }}
                />
              )}
              {field.isPrimary && (
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`${data.id}-${field.id}-target`}
                  className="w-2 h-2 !bg-yellow-400 border border-white"
                  style={{ top: `${((index + 1) / data.fields.length) * 100}%` }}
                />
              )}
            </div>
          ))}
        </div>

        {data.fields.length === 0 && (
          <div className="p-4 text-center text-gray-500 text-xs">
            No fields defined
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default memo(TableNode)