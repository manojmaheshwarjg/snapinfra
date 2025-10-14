"use client"

import { useState } from "react"
import { ReactFlowSchemaEditor } from "@/components/reactflow/reactflow-schema-editor"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ArrowLeft, Database, Zap, Plus, Bell, Settings, User, LogOut, Star, GitBranch, Rocket } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/lib/app-context"
import { DeploymentModal } from "@/components/deployment-modal"
import Link from "next/link"

export default function SchemaEditor() {
  const router = useRouter()
  const { state } = useAppContext()
  const { currentProject } = state

  const handleUpdateTable = (updatedTable: any) => {
    // Handle table updates - implement as needed
    console.log("Update table:", updatedTable)
  }

  const handleDeleteTable = (tableId: string) => {
    // Handle table deletion - implement as needed
    console.log("Delete table:", tableId)
  }

  const handleDuplicateTable = (table: any) => {
    // Handle table duplication - implement as needed
    console.log("Duplicate table:", table)
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Custom Header for Schema Editor */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white px-3 sm:px-4 py-2 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Left side - Logo, Back button, Project info */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 px-2 sm:px-3"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              </div>
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <h1 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">Rhinoback</h1>
                <span className="text-gray-400 hidden sm:inline">/</span>
                {currentProject ? (
                  <span className="text-sm sm:text-lg font-semibold text-gray-900 truncate hidden sm:inline">{currentProject.name}</span>
                ) : (
                  <span className="text-sm sm:text-lg text-gray-500 hidden sm:inline">New Project</span>
                )}
                <span className="text-gray-400 hidden md:inline">/</span>
                <div className="flex items-center gap-1 sm:gap-2 hidden md:flex">
                  <Database className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  <span className="font-medium text-gray-900 text-sm">Schema Editor</span>
                </div>
              </div>
            </div>
            
            {/* Project status and stats - hidden on mobile/tablet */}
            <div className="hidden lg:flex items-center gap-2 ml-6">
              {currentProject && (
                <>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      currentProject.status === 'deployed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      currentProject.status === 'building' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                      currentProject.status === 'error' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {currentProject.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <GitBranch className="w-3 h-3" />
                    <span>{currentProject.schema?.length || 0} tables</span>
                  </div>
                </>
              )}
              <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                Beta
              </Badge>
            </div>
          </div>

          {/* Right side - Actions and user menu */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Notifications - hidden on mobile */}
            <Button variant="ghost" size="sm" className="hidden sm:flex h-8 w-8 sm:h-9 sm:w-9 p-0 text-gray-600 hover:bg-gray-100">
              <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Link href="/onboarding">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 sm:h-9 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 px-2 sm:px-3"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">New Project</span>
                </Button>
              </Link>
              
              {currentProject && (
                <DeploymentModal>
                  <Button
                    size="sm"
                    className="h-8 sm:h-9 bg-gray-900 hover:bg-gray-800 text-white px-2 sm:px-3"
                  >
                    <Rocket className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Deploy</span>
                  </Button>
                </DeploymentModal>
              )}
            </div>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-gray-100"
                >
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback className="bg-gray-100 text-gray-700 text-xs sm:text-sm">MM</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-medium">Manoj Maheshwar</p>
                  <p className="text-xs text-gray-500">manoj@rhinoback.com</p>
                </div>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Your profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="mr-2 h-4 w-4" />
                  <span>Your projects</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden pt-12 sm:pt-14">
        {/* Schema Editor - Full Width */}
        <main className="h-full w-full">
          <ReactFlowSchemaEditor 
            onTableEdit={handleUpdateTable}
            onTableDelete={handleDeleteTable}
            onTableDuplicate={handleDuplicateTable}
          />
        </main>
      </div>
    </div>
  )
}
