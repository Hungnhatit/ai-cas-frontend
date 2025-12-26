"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { api } from "@/lib/axios"
import toast from "react-hot-toast"
import { authService } from "@/services/authService"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true);

    try {
      const res = await authService.forgotPassword(email);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.res?.data?.message || "Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <Card className="border-border text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Check your email</h2>
              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Link href="/auth/login">
                <Button className="w-full">Back to Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-2xl">AI-CAS</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">Bạn quên mật khẩu?</h1>
            <p className="">Đừng lo, chúng tôi sẽ gửi cho bạn hướng dẫn thiết lập lại</p>
          </div>

        </div>

        <Card className="rounded-xl">
          <CardHeader className="">
            <CardTitle className="text-center text-lg">Đặt lại mật khẩu</CardTitle>
            <CardDescription>
              Nhập email của bạn và chúng tôi sẽ gửi cho bạn liên kết khôi phục
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập địa chỉ email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-muted/50 h-10 rounded-sm border-gray-300"
                />
              </div>

              <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gửi liên kết khôi phục
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="inline-flex text-blue-600 font-bold items-center text-sm hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại trang đăng nhập
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ForgotPassword;