import Link from "next/link";

export default function PaymentFailed() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-4">
          Your payment could not be processed. Please try again.
        </p>
        <Link
          href="/"
          className="inline-block bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
