'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Review = {
  id: string
  name: string
  country?: string | null
  rating: number
  comment: string
  image_url?: string | null
  created_at?: string
}

const FALLBACK_IMAGE = '/placeholder.jpg'

export default function CustomerReview() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const reviewsPerPage = 3

  useEffect(() => {
    supabase
      .from('reviews')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Failed to load reviews:', error)
        if (data) setReviews(data as Review[])
        setLoading(false)
      })
  }, [])

  const totalPages = Math.max(1, Math.ceil(reviews.length / reviewsPerPage))
  const currentReviews = reviews.slice(
    currentIndex * reviewsPerPage,
    (currentIndex + 1) * reviewsPerPage
  )

  const nextReviews = () => setCurrentIndex((prev) => (prev + 1) % totalPages)
  const prevReviews = () =>
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1 " style={{ justifyContent: 'center' }}>
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-yellow-500 text-xl">
          {i < rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  )

  const formatDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : ''

  return (
    <div className="bg-[#E8DCD0] py-16">
      <div className="container mx-auto px-6 max-w-[90%]">
        <h2 className="text-5xl font-bold text-black mb-4 text-center">
          Customer Reviews
        </h2>
        <p className="text-center text-black mb-12 text-lg">
          Hear what our students have to say about their cooking experience
        </p>

        {loading ? (
          <p className="text-center text-black">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center">No Reviews Yet</p>
        ) : (
          <>
            {/* Reviews Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {currentReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border-2 border-black p-6 flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={review.image_url || FALLBACK_IMAGE}
                      alt={review.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-black"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
                      }}
                    />
                    <div>
                      <h3 className="font-bold text-black text-lg">
                        {review.name}
                      </h3>
                      {review.country && (
                        <p className="text-sm text-gray-600">
                          {review.country}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <StarRating rating={review.rating} />
                  </div>

                  <p className="text-black leading-relaxed mb-4 flex-grow">
                    "{review.comment}"
                  </p>

                  <p className="text-sm text-gray-500 italic">
                    {formatDate(review.created_at)}
                  </p>
                </div>
              ))}
            </div>

            {/* Navigation */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={prevReviews}
                  className="w-12 h-12 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors flex items-center justify-center font-bold text-xl"
                >
                  ←
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i === currentIndex ? 'bg-black' : 'bg-white'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextReviews}
                  className="w-12 h-12 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors flex items-center justify-center font-bold text-xl"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
