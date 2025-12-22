import { useState } from 'react'

const reviewsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    country: "United States",
    rating: 5,
    date: "December 15, 2024",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    course: "Pad Thai, Tom Yum Soup, Red Curry & Banana in coconut milk",
    review: "This was hands down one of the best cooking classes I've ever attended! The instructor was incredibly knowledgeable and patient. I learned authentic techniques that I can't wait to recreate at home. The atmosphere was warm and welcoming, and the food we made was absolutely delicious!",
  },
  {
    id: 2,
    name: "Marco Rossi",
    country: "Italy",
    rating: 5,
    date: "December 10, 2024",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    course: "Mastering Pad Thai",
    review: "As a chef from Italy, I have high standards, and this class exceeded them all. The Pad Thai we created was restaurant-quality. The instructor shared professional tips and the balance of flavors was perfect. Highly recommend!",
  },
  {
    id: 3,
    name: "Emma Williams",
    country: "Australia",
    rating: 5,
    date: "December 8, 2024",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    course: "Coconut & Curry Cooking Experience",
    review: "Amazing experience! I've always struggled with making Thai curries at home, but this class broke everything down so clearly. The hands-on approach and small class size meant I got plenty of individual attention. Worth every baht!",
  },
  {
    id: 4,
    name: "Takeshi Yamamoto",
    country: "Japan",
    rating: 5,
    date: "December 5, 2024",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    course: "Pad Thai, Tom Yum Soup, Red Curry & Banana in coconut milk",
    review: "The class was well-organized and very educational. Learning about the history and cultural significance of each dish added so much depth to the experience. The kitchen was clean and professional. I highly recommend this to anyone visiting Thailand!",
  },
  {
    id: 5,
    name: "Lisa Chen",
    country: "Singapore",
    rating: 5,
    date: "November 30, 2024",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    course: "Mastering Pad Thai",
    review: "I took this class with my husband and we both loved it! The instructor made everything so fun and easy to follow. We've already made Pad Thai twice at home since the class. Great date activity!",
  },
  {
    id: 6,
    name: "David Brown",
    country: "United Kingdom",
    rating: 5,
    date: "November 28, 2024",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    course: "Coconut & Curry Cooking Experience",
    review: "Brilliant class! I learned so much about Thai ingredients and cooking methods. The curry paste we made from scratch was incredible. The instructor was friendly and answered all our questions. Five stars!",
  }
]

export default function CustomerReview() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const reviewsPerPage = 3

  const totalPages = Math.ceil(reviewsData.length / reviewsPerPage)
  const currentReviews = reviewsData.slice(
    currentIndex * reviewsPerPage,
    (currentIndex + 1) * reviewsPerPage
  )

  const nextReviews = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevReviews = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1 " style={{justifyContent: 'center'}}>
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-yellow-500 text-xl">
          {i < rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-secondary py-16">
      <div className="container mx-auto px-6 max-w-[90%]">
        <h2 className="text-5xl font-bold text-black mb-4 text-center">
          Customer Reviews
        </h2>
        <p className="text-center text-black mb-12 text-lg">
          Hear what our students have to say about their cooking experience
        </p>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {currentReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border-2 border-black p-6 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-black"
                />
                <div>
                  <h3 className="font-bold text-black text-lg">{review.name}</h3>
                  <p className="text-sm text-gray-600">{review.country}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <StarRating rating={review.rating} />
              </div>

              {/* Review Text */}
              <p className="text-black leading-relaxed mb-4 flex-grow">
                "{review.review}"
              </p>

              {/* Date */}
              <p className="text-sm text-gray-500 italic">{review.date}</p>
            </div>
          ))}
        </div>

        {/* Navigation */}
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

        {/* Summary Stats */}
        <div className="mt-16 border-t-2 border-black pt-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-black mb-2">500+</div>
              <div className="text-lg text-gray-600">Happy Students</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-2">4.9</div>
              <div className="text-lg text-gray-600">Average Rating</div>
              <div className="mt-2">
                <StarRating rating={5} />
              </div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-2">98%</div>
              <div className="text-lg text-gray-600">Would Recommend</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}