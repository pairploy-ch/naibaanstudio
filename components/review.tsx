'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Review = {
  id: string
  name: string
  country?: string | null
  rating: number
  comment: string
  image_url?: string | null
  image_urls?: string[] | null
  created_at?: string
}

const FALLBACK_IMAGE = '/placeholder.jpg'

export default function CustomerReview() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const reviewsPerPage = 3

  // Lightbox for viewing a review's photos full-size
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null)
  const openLightbox = (images: string[], index: number) => setLightbox({ images, index })
  const closeLightbox = () => setLightbox(null)
  const showPrevImage = () =>
    setLightbox((prev) =>
      prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : prev
    )
  const showNextImage = () =>
    setLightbox((prev) => (prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : prev))

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

  // แสดงเป็นเวลาสัมพัทธ์ เช่น "5 months ago" (ใช้ created_at ที่แอดมินตั้งได้เองในหน้า /admin/review)
  const formatDate = (iso?: string) => {
    if (!iso) return ''
    const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
    if (seconds < 60) return 'Just now'

    const units: [string, number][] = [
      ['year', 60 * 60 * 24 * 365],
      ['month', 60 * 60 * 24 * 30],
      ['week', 60 * 60 * 24 * 7],
      ['day', 60 * 60 * 24],
      ['hour', 60 * 60],
      ['minute', 60],
    ]
    for (const [label, secondsInUnit] of units) {
      const count = Math.floor(seconds / secondsInUnit)
      if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`
    }
    return 'Just now'
  }

  return (
    <div id="review" className="bg-[#E8DCD0] py-16 scroll-mt-24">
      <div className="container mx-auto px-6 max-w-[90%]">
        <h2 className="text-5xl font-bold text-black mb-4 text-center">
          Customer Reviews
        </h2>
        <p className="text-center text-black mb-12 text-lg">
         Moments shared, memories made, and stories from our guests.
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

                  <p className="text-black leading-relaxed mb-4 flex-grow whitespace-pre-wrap">
                    "{review.comment}"
                  </p>

                  {review.image_urls && review.image_urls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {review.image_urls.slice(0, 3).map((url, i) => {
                        const remaining = review.image_urls!.length - 3
                        const isLastVisible = i === 2 && remaining > 0
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => openLightbox(review.image_urls as string[], i)}
                            className="relative aspect-square border-2 border-black overflow-hidden"
                          >
                            <img
                              src={url}
                              alt={`${review.name} review photo ${i + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
                              }}
                            />
                            {isLastVisible && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-lg">
                                +{remaining}
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}

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

      {/* Lightbox for review photos */}
      <Dialog open={lightbox !== null} onOpenChange={(open) => !open && closeLightbox()}>
        <DialogContent className="sm:max-w-2xl bg-black border-black p-2">
          <DialogTitle className="sr-only">Review photo</DialogTitle>
          {lightbox && (
            <div className="relative flex items-center justify-center min-h-[50vh]">
              <img
                src={lightbox.images[lightbox.index]}
                alt="Review photo"
                className="max-h-[80vh] w-auto mx-auto object-contain"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
                }}
              />
              {lightbox.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={showNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-xs bg-black/60 px-2 py-1 rounded-full">
                    {lightbox.index + 1} / {lightbox.images.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
