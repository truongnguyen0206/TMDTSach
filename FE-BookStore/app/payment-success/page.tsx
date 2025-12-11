"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { message } from "antd"
import { useCart } from "@/contexts/cart-context"

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()

  useEffect(() => {
    // Lấy toàn bộ query params từ URL trả về của VNPay
    const query = Object.fromEntries(searchParams.entries())

    if (Object.keys(query).length === 0) {
      message.error("Không có thông tin thanh toán!")
      router.push("/")
      return
    }

    // Gửi query params lên server để xác thực
    const verifyPayment = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/vnpay_ipn?${new URLSearchParams(query)}`, {
          method: "GET",
        })

        const result = await response.json()
console.log("Kết quả từ server:", result)
        if (result.RspCode === "00") {
          message.success("Thanh toán thành công!")
          clearCart()
          localStorage.removeItem("checkoutData")
          router.push(`/order-confirmation?orderId=${query.vnp_TxnRef}`)
        } else {
          message.error("Thanh toán thất bại hoặc không hợp lệ!")
          router.push("/cart")
        }
      } catch (error) {
        console.error("Lỗi xác nhận thanh toán:", error)
        message.error("Có lỗi xảy ra khi xác nhận thanh toán!")
        router.push("/cart")
      }
    }

    verifyPayment()
  }, [searchParams, router, clearCart])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-semibold text-gray-800">Đang xác nhận thanh toán...</h2>
      <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát.</p>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold text-gray-800">Đang tải...</h2>
        <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát.</p>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}