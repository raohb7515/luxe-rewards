import Image from 'next/image'
import Link from 'next/link'

interface NewsCardProps {
  news: {
    id: string
    title: string
    content: string
    thumbnail: string | null
    date: string
  }
}

export default function NewsCard({ news }: NewsCardProps) {
  const formattedDate = new Date(news.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link href={`/news/${news.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-48 bg-gray-200">
          {news.thumbnail ? (
            <Image
              src={news.thumbnail}
              alt={news.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold mb-2 line-clamp-2">{news.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
            {news.content}
          </p>
          <p className="text-xs text-gray-400 mt-auto">{formattedDate}</p>
        </div>
      </div>
    </Link>
  )
}

