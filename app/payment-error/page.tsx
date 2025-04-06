import Link from "next/link";

export default function PaymentError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Error Processing Payment
        </h1>
        <p className="text-gray-600 mb-4">
          An unexpected error occurred while processing your payment.
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
