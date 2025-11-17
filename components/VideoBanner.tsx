'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function VideoBanner() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative aspect-video bg-gray-900">
            {!isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80"
                  alt="Video thumbnail"
                  fill
                  className="object-cover opacity-70"
                />
                <button
                  onClick={() => setIsPlaying(true)}
                  className="relative z-10 bg-white/90 hover:bg-white rounded-full p-4 transition-all"
                  aria-label="Play video"
                >
                  <svg
                    className="w-16 h-16 text-primary-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>
              </div>
            ) : (
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Promotional Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">Discover Our Story</h2>
            <p className="text-gray-600">
              Experience the luxury and quality that defines our brand. Watch our story and see what makes us unique.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

