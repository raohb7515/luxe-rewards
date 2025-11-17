'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'
import BottomNav from '@/components/BottomNav'

interface Prize {
  id: string
  name: string
  description: string
  image: string | null
  points: number
  stock: number
}

export default function PrizePage() {
  const router = useRouter()
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [userCashback, setUserCashback] = useState(0)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Fetch user cashback
    fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUserCashback(data.user.cashback)
        }
      })
      .catch(() => {})

    // Fetch prizes
    fetch('/api/prizes/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPrizes(data.prizes)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  const handleClaim = async (prizeId: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to claim prizes')
      router.push('/login')
      return
    }

    setClaiming(prizeId)

    try {
      const response = await fetch('/api/prizes/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prizeId }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Prize claimed successfully!')
        // Refresh data
        window.location.reload()
      } else {
        toast.error(data.error || 'Failed to claim prize')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setClaiming(null)
    }
  }

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 text-center">
          <p className="text-gray-600 mb-2">Your Cashback Balance</p>
          <p className="text-4xl font-bold text-purple-600">
            ${userCashback.toFixed(2)}
          </p>
        </div>

        <h1 className="text-3xl font-bold mb-6">Available Prizes</h1>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : prizes.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No prizes available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prizes.map((prize) => {
              const canAfford = userCashback >= prize.points
              const isOutOfStock = prize.stock <= 0

              return (
                <div
                  key={prize.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative h-48 bg-gray-200">
                    {prize.image ? (
                      <Image
                        src={prize.image}
                        alt={prize.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{prize.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{prize.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-purple-600">
                        {prize.points} points
                      </span>
                      <span className="text-sm text-gray-500">
                        {prize.stock > 0 ? `${prize.stock} left` : 'Out of stock'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleClaim(prize.id)}
                      disabled={!canAfford || isOutOfStock || claiming === prize.id}
                      className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                        canAfford && !isOutOfStock
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {claiming === prize.id
                        ? 'Claiming...'
                        : !canAfford
                        ? 'Insufficient Points'
                        : isOutOfStock
                        ? 'Out of Stock'
                        : 'Claim Prize'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}

