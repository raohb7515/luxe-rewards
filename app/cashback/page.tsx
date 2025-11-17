'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import BottomNav from '@/components/BottomNav'

interface Transaction {
  id: string
  amount: number
  type: string
  description: string
  createdAt: string
}

export default function CashbackPage() {
  const router = useRouter()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Fetch user balance
    fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBalance(data.user.cashback)
        }
      })
      .catch(() => {})

    // Fetch transactions
    fetch('/api/cashback/transactions', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTransactions(data.transactions)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Cashback Rewards</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Your Cashback Balance</p>
            <p className="text-5xl font-bold text-primary-600">
              ${balance.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Earn 5% cashback on every purchase
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-16 rounded"></div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No transactions yet. Start shopping to earn cashback!
            </p>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center p-4 border-b border-gray-200 last:border-0"
                >
                  <div>
                    <p className="font-semibold">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p
                    className={`font-bold ${
                      transaction.amount > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.amount > 0 ? '+' : ''}
                    ${transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

