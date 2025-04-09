import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useProductContext } from "../../context/ProductContext";
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

const ReviewList = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getProduct } = useProductContext();

  useEffect(() => {
    // Set up real-time listener for new reviews
    const q = query(
      collection(db, "reviews"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
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

        console.log("Real-time reviews update:", reviewsData);
        setReviews(reviewsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error in real-time listener:", error);
        setError("Failed to load reviews. Please try again later.");
        setLoading(false);
      }
    );

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, []);

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

  if (reviews.length === 0) {
    return (
      <div className="text-[#48392e] dark:text-[#e0e0e0] py-4">
        No reviews yet. Be the first to review!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const product = getProduct(review.productId);

        return (
          <div
            key={review.id}
            className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-[#48392e] dark:text-[#e0e0e0]">
                  Review by: {review.name}
                </h4>
                <p className="text-sm text-[#4b774a] dark:text-[#6a9e69]">
                  Product: {product ? product.name : "Unknown Product"}
                </p>
              </div>
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

            <p className="text-[#48392e] dark:text-[#e0e0e0] text-sm">
              {review.reviewText}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
