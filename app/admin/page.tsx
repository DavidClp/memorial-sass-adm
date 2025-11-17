"use client"

import { LoginForm } from "@/components/login-form"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authUtils } from "@/lib/auth"

export default function AdminLoginPage() {
  const router = useRouter()

  useEffect(() => {
    if (authUtils.isAuthenticated()) {
      router.push("/admin/dashboard/")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full">
        <LoginForm />
      </div>
    </div>
  )
}
