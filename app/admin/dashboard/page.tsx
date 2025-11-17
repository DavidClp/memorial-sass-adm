"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { AdminHeader } from "@/components/admin-header"
import { MemorialForm } from "@/components/memorial-form"
import { MemorialList } from "@/components/memorial-list"
import { Button } from "@/components/ui/button"
import type { Memorial } from "@/lib/api"
import { Plus } from "lucide-react"

export default function AdminDashboard() {
  const [showForm, setShowForm] = useState(false)
  const [editingMemorial, setEditingMemorial] = useState<Memorial | undefined>()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSuccess = () => {
    setShowForm(false)
    setEditingMemorial(undefined)
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleEdit = (memorial: Memorial) => {
    setEditingMemorial(memorial)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingMemorial(undefined)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AdminHeader />

        <main className="max-w-6xl mx-auto px-4 py-12">
          {showForm ? (
            <div className="space-y-6">
              <MemorialForm onSuccess={handleSuccess} onCancel={handleCancel} initialData={editingMemorial} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-serif font-bold text-foreground">Meus Memoriais</h2>
                <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Memorial
                </Button>
              </div>

              <MemorialList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
