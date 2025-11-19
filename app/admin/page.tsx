'use client'

// app/admin/page.tsx
import Link from "next/link";
import { useEffect, useState } from "react";

type AdminStats = {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
}

const defaultStats: AdminStats = {
  totalUsers: 0,
  totalProducts: 0,
  totalOrders: 0,
  totalRevenue: 0,
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>(defaultStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats", {
          cache: "no-store",
          credentials: "include", // include cookies for auth
        })

        if (!res.ok) {
          throw new Error("Failed to fetch stats")
        }

        const data = await res.json()
        if (isMounted) {
          setStats({
            totalUsers: data?.stats?.totalUsers ?? 0,
            totalProducts: data?.stats?.totalProducts ?? 0,
            totalOrders: data?.stats?.totalOrders ?? 0,
            totalRevenue: data?.stats?.totalRevenue ?? 0,
          })
        }
      } catch (err) {
        console.error("Failed to load admin stats", err)
        if (isMounted) {
          setError("Unable to load stats right now.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchStats()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Back to Site
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading && (
          <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg p-4 mb-6">
            Loading latest stats...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers} color="text-primary-600" />
          <StatCard title="Total Products" value={stats.totalProducts} color="text-green-600" />
          <StatCard title="Total Orders" value={stats.totalOrders} color="text-blue-600" />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            color="text-purple-600"
          />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard href="/admin/products/add" title="Add Product" desc="Create a new product listing" />
          <ActionCard href="/admin/news/add" title="Add News" desc="Publish a new news article" />
          <ActionCard href="/admin/users" title="View Users" desc="Manage user accounts" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function ActionCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{desc}</p>
        </div>
        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
    </Link>
  );
}
