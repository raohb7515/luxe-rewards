import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth"; // path correct
import Link from "next/link";

export default async function AdminDashboard() {
  // 1️⃣ Get JWT token from cookies
  const token = cookies().get("token")?.value;
  if (!token) return redirect("/login");

  // 2️⃣ Verify token safely
  const user = verifyToken(token);
  if (!user || !user.isAdmin) return redirect("/login"); // redirect if not admin

  // 3️⃣ Fetch admin stats
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await res.json();
  const stats = data?.stats || {};

  // 4️⃣ Render dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-semibold">
            Back to Site
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers || 0} color="text-primary-600" />
          <StatCard title="Total Products" value={stats.totalProducts || 0} color="text-green-600" />
          <StatCard title="Total Orders" value={stats.totalOrders || 0} color="text-blue-600" />
          <StatCard
            title="Total Revenue"
            value={`$${(stats.totalRevenue ?? 0).toFixed(2)}`}
            color="text-purple-600"
          />
        </div>

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
