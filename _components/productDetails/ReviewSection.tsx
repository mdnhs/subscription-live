"use client";
import { useEffect, useState } from "react";
import { Product } from "@/_types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getFormattedExpireDate } from "@/function/dateFormatter";
import useFetch from "@/services/fetch/csrFecth";
import { toast } from "sonner";
import { setProductById } from "@/services/api/productRequest";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ReviewSectionProps {
  product: Product;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: string;
  date: string;
}

interface ProductUpdatePayload {
  data: {
    reviews: Review[];
  };
}

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(10, "Review must be at least 10 characters").max(500),
});

const ReviewSection = ({ product }: ReviewSectionProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { fetchPublic } = useFetch();
  const pathName = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(product?.reviews || []);
  const callbackUrl = encodeURIComponent(pathName);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  // Calculate total reviews and average rating
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        ).toFixed(1)
      : "0.0";

  const handleReviewSubmit = () => {
    if (!session?.user) {
      toast.error("Please sign in to submit a review");
      router.push(`/login?callbackUrl=${callbackUrl}`);
      return;
    }

    const currentRating = form.getValues("rating");

    if (currentRating === 0) {
      toast.error("Please select a star rating before submitting");
      form.setError("rating", {
        type: "manual",
        message: "Please select a rating",
      });
      return;
    }

    form.handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: z.infer<typeof reviewSchema>) => {
    try {
      setIsLoading(true);
      const newReview: Review = {
        id: Date.now().toString(),
        rating: data.rating,
        comment: data.comment,
        user: session?.user?.name || "Anonymous",
        date: new Date().toISOString().split("T")[0],
      };

      const payload: ProductUpdatePayload = {
        data: {
          reviews: [...(product?.reviews || []), newReview],
        },
      };

      console.log("Sending payload:", payload);
      const req = setProductById(payload, product.documentId);
      const response = await fetchPublic(req);

      if (!response.success) {
        throw new Error(response.message || "Failed to submit review");
      }

      setReviews([newReview, ...reviews]);
      form.reset();
      toast.success("Review submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit review");
      console.error("Review submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number, setRating?: (value: number) => void) => {
    return (
      <div className="flex" role="radiogroup" aria-label="Rating stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 transition-colors ${
              setRating ? "cursor-pointer hover:text-yellow-300" : ""
            } ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => {
              if (!session?.user) {
                toast.error("Please sign in to rate this product");
                router.push(`/login?callbackUrl=${callbackUrl}`);
                return;
              }
              if (setRating) {
                setRating(star);
                form.clearErrors("rating");
              }
            }}
            role={setRating ? "radio" : undefined}
            aria-checked={setRating && star === rating}
            tabIndex={setRating ? 0 : undefined}
            onKeyDown={(e) => {
              if (setRating && (e.key === "Enter" || e.key === " ")) {
                setRating(star);
                form.clearErrors("rating");
              }
            }}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    setReviews(product?.reviews || []);
  }, [product]);

  return (
    <Card className="mt-8 bg-background/95 text-white col-span-full rounded-xl shadow-lg py-6 pb-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold">Customer Reviews</CardTitle>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
          <span className="text-lg font-semibold">
            {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
          </span>
          <div className="flex items-center gap-2">
            {renderStars(Number(averageRating))}
            <span className="text-lg font-medium">{averageRating} / 5</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        {/* Review Form */}
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleReviewSubmit();
            }}
            className="space-y-6 bg-gray-800/50 p-6 rounded-lg"
          >
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">
                    Your Rating <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div>
                      {renderStars(field.value, (value) =>
                        field.onChange(value)
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        session?.user
                          ? "Share your thoughts about the product..."
                          : "Please sign in to write a review"
                      }
                      className="bg-gray-900 text-white border-gray-700 focus:border-primary focus:ring-primary min-h-[120px] rounded-md"
                      disabled={isLoading || !session?.user}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="font-semibold py-2 px-6 disabled:opacity-50"
              disabled={isLoading || !session?.user}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </div>
              ) : (
                "Submit Review"
              )}
            </Button>
            {!session?.user && (
              <p className="text-sm text-gray-400">
                You need to be signed in to submit a review.{" "}
                <a
                  href={`/login?callbackUrl=${callbackUrl}`}
                  className="text-primary hover:underline"
                >
                  Sign in now
                </a>
              </p>
            )}
          </form>
        </Form>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-400 text-center text-lg">
              No reviews yet. Be the first to share your thoughts!
            </p>
          ) : (
            reviews.map((review) => (
              <Card
                key={review.id}
                className="bg-gray-800/50 border-gray-700 rounded-md "
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <span className="font-semibold text-lg">
                        {review.user}
                      </span>
                      <span className="text-sm text-gray-400">
                        {getFormattedExpireDate(review.date)}
                      </span>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSection;
