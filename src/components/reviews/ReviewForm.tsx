import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useProductContext } from "../../context/ProductContext";
import { Star } from "lucide-react";
import ReviewSuccessModal from "./ReviewSuccessModal";

interface ReviewFormData {
  name: string;
  productId: string;
  rating: number;
  reviewText: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  productId: yup.string().required("Please select a product"),
  rating: yup
    .number()
    .min(1, "Please select a rating")
    .max(5)
    .required("Rating is required"),
  reviewText: yup
    .string()
    .required("Review text is required")
    .min(10, "Review must be at least 10 characters"),
});

const ReviewForm = () => {
  const { products } = useProductContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      productId: "",
      rating: 0,
      reviewText: "",
    },
  });

  const currentRating = watch("rating");

  const handleRatingClick = (rating: number) => {
    setValue("rating", rating, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<ReviewFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      // Add the review to Firestore
      await addDoc(collection(db, "reviews"), {
        ...data,
        createdAt: serverTimestamp(),
      });

      console.log("Review submitted successfully");
      reset();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding review: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Close the entire panel by triggering a click on the close button
    const closeButton = document.querySelector(
      '[aria-label="Close reviews panel"]'
    ) as HTMLButtonElement;
    if (closeButton) {
      closeButton.click();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-xl font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-2">
          Write a Review
        </h3>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-1"
          >
            Your Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="productId"
            className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-1"
          >
            Select Product
          </label>
          <select
            id="productId"
            {...register("productId")}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          {errors.productId && (
            <p className="mt-1 text-red-500 text-sm">
              {errors.productId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-1">
            Rating
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingClick(rating)}
                onMouseEnter={() => setHoverRating(rating)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    (
                      hoverRating
                        ? rating <= hoverRating
                        : rating <= currentRating
                    )
                      ? "text-[#d79f63] fill-[#d79f63]"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="mt-1 text-red-500 text-sm">{errors.rating.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="reviewText"
            className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-1"
          >
            Your Review
          </label>
          <textarea
            id="reviewText"
            {...register("reviewText")}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
            placeholder="Share your experience with this product..."
          ></textarea>
          {errors.reviewText && (
            <p className="mt-1 text-red-500 text-sm">
              {errors.reviewText.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-[#4b774a] dark:bg-[#6a9e69] text-white rounded-md hover:bg-opacity-90 transition duration-300 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {showSuccessModal && (
        <ReviewSuccessModal onClose={handleSuccessModalClose} />
      )}
    </>
  );
};

export default ReviewForm;
