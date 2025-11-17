'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js'
import toast from 'react-hot-toast'
import BottomNav from '@/components/BottomNav'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  stock: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.product)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const handlePurchase = async () => {
    if (!product) return

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to purchase')
      router.push('/login')
      return
    }

    setPurchasing(true)

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          amount: product.price,
        }),
      })

      const data = await response.json()

      if (data.success && data.url) {
        const stripe = await stripePromise
        if (stripe) {
          window.location.href = data.url
        }
      } else {
        toast.error(data.error || 'Failed to create order')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-96 md:h-[500px] bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-primary-600 mb-6">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <div className="mb-6">
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                product.stock > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
            <button
              onClick={handlePurchase}
              disabled={product.stock === 0 || purchasing}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {purchasing ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

