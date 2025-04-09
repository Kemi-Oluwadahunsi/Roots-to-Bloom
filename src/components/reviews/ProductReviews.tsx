import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { Star } from "lucide-react";
import { format } from "date-fns";

interface Review {
  id: string;
  name: string;
  productId: string;
  rating: number;
  reviewText: string;
  createdAt: Date;
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        const q = query(
          collection(db, "reviews"),
          where("productId", "==", productId),
          orderBy("createdAt", "desc")
        );

        // Set up real-time listener
        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const reviewsData: Review[] = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              reviewsData.push({
                id: doc.id,
                name: data.name,
                productId: data.productId,
                rating: data.rating,
                reviewText: data.reviewText,
                createdAt: data.createdAt?.toDate() || new Date(),
              });
            });

            console.log(
              `Fetched ${reviewsData.length} reviews for product ${productId}`
            );
            setReviews(reviewsData);

            // Calculate average rating
            if (reviewsData.length > 0) {
              const totalRating = reviewsData.reduce(
                (sum, review) => sum + review.rating,
                0
              );
              setAverageRating(totalRating / reviewsData.length);
            }

            setLoading(false);
          },
          (error) => {
            console.error("Error fetching product reviews:", error);
            setError("Failed to load reviews. Please try again later.");
            setLoading(false);
          }
        );

        // Clean up listener on component unmount
        return () => unsubscribe();
      } catch (err) {
        console.error("Error setting up reviews listener:", err);
        setError("Failed to load reviews. Please try again later.");
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4b774a] dark:border-[#6a9e69]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-4">
        Customer Reviews
      </h3>

      {reviews.length > 0 ? (
        <>
          <div className="flex items-center mb-6">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? "text-[#d79f63] fill-[#d79f63]"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-[#48392e] dark:text-[#e0e0e0]">
              {averageRating.toFixed(1)} out of 5 ({reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>

          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-[#48392e] dark:text-[#e0e0e0]">
                    {review.name}
                  </h4>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {format(review.createdAt, "MMM d, yyyy")}
                  </div>
                </div>

                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "text-[#d79f63] fill-[#d79f63]"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-[#48392e] dark:text-[#e0e0e0]">
                  {review.reviewText}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-[#48392e] dark:text-[#e0e0e0] py-4">
          No reviews yet for this product. Be the first to leave a review!
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
