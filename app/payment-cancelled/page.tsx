import Link from "next/link";

export default function PaymentCancelled() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-4">
          Your payment was cancelled. You can try again when you&apos;re ready.
        </p>
        <Link
          href="/"
          className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700"
        >
          Return to Payment
        </Link>
      </div>
    </div>
  );
}
