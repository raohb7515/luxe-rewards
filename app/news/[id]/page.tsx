import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface NewsPageProps {
  params: { id: string }
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { id } = params

  // Database se news fetch karo
  const news = await prisma.news.findUnique({
    where: { id },
  })

  if (!news) {
    // Agar news nahi mili toh 404 page
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
      {news.thumbnail && (
        <img
          src={news.thumbnail}
          alt={news.title}
          className="w-full max-w-2xl mb-6 rounded"
        />
      )}
      <p className="text-gray-700">{news.content}</p>
      <p className="text-gray-400 mt-4 text-sm">
        Published on {new Date(news.date).toLocaleDateString()}
      </p>
    </div>
  )
}
