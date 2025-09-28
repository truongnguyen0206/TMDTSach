"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("bookstore_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("bookstore_user")
      }
    }
    setIsLoading(false)
  }, [])

   const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    try {
      // URL của API đăng nhập trên backend của bạn
      // Hãy đảm bảo URL này đúng và backend đang chạy
      const response = await fetch("http://localhost:5000/api/auth/login", { // Thay đổi URL nếu cần
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Lấy thông tin user từ response của API
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        }
        setUser(userData)
        // Lưu thông tin user vào localStorage
        localStorage.setItem("bookstore_user", JSON.stringify(userData))
        return { success: true, message: "Đăng nhập thành công!" }
      } else {
        // Lấy thông báo lỗi từ API
        return { success: false, message: data.error || "Email hoặc mật khẩu không đúng!" }
      }
    } catch (error) {
      console.error("Login API call failed:", error)
      return { success: false, message: "Đã có lỗi xảy ra. Vui lòng thử lại." }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      // URL của API đăng ký trên backend của bạn
      const response = await fetch("http://localhost:5000/api/auth/register", { // Thay đổi URL nếu cần
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Tự động đăng nhập sau khi đăng ký thành công
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        };
        setUser(userData);
        localStorage.setItem("bookstore_user", JSON.stringify(userData));
        return { success: true, message: "Đăng ký thành công!" };
      } else {
        // Lấy thông báo lỗi từ API
        return { success: false, message: data.error || "Đăng ký thất bại!" };
      }
    } catch (error) {
      console.error("Register API call failed:", error);
      return { success: false, message: "Đã có lỗi xảy ra. Vui lòng thử lại." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bookstore_user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
