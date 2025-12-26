'use client'
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle, Lock, Loader2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { api } from '@/lib/axios';

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [errors, setErrors] = useState({
    password: '',
    confirm_password: '',
    general: ''
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token không hợp lệ.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        new_password: password
      });

      if (res.data.success) {
        toast.success("Đổi mật khẩu thành công! Đang chuyển hướng...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Token đã hết hạn hoặc không hợp lệ.");
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm border-green-100 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-green-700">Password Reset!</CardTitle>
            <CardDescription className="pt-2">
              Your password has been successfully updated. You can now log in with your new credentials.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center pb-8">
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => window.location.reload()}>
              Go to Login <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">

      {/* Brand / Logo Area */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white mb-3">
          <Lock className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">AI Competency Assessment System</h2>
      </div>

      <Card className="w-full max-w-sm shadow-xl border-gray-100">
        <CardHeader>
          <CardTitle className='text-center text-lg'>Đặt lại mật khẩu</CardTitle>
          <CardDescription>
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <CardContent className="space-y-4">
            {errors.general && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.general}
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`h-10 rounded-sm shadow-none border-gray-300 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  disabled={status === 'loading'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={status === 'loading'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm font-medium text-red-500 flex items-center gap-1">
                  {errors.password}
                </p>
              )}
              {!errors.password && (
                <p className="text-sm text-gray-500">
                  Độ dài mật khẩu ít nhất 8 ký tự
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Xác nhận mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`h-10 rounded-sm border-gray-300 shadow-none ${errors.confirm_password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  disabled={status === 'loading'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={status === 'loading'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
              {errors.confirm_password && (
                <p className="text-sm font-medium text-red-500">
                  {errors.confirm_password}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex-col space-y-2">
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đặt lại mật khẩu...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>

            <Button
              type="button"
              variant="link"
              className="text-sm text-gray-500 cursor-pointer"
              disabled={status === 'loading'}
              onClick={() => router.push('/auth/login')}
            >
              Quay lại trang đăng nhập
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-8 text-center text-xs text-gray-400">
        &copy; 2025 AI Competency Assessment System. All rights reserved.
      </div>
    </div>
  );
}

export default ResetPassword