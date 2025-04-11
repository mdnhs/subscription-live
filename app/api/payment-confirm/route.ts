import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Extract query param
    const tranId = req.nextUrl.searchParams.get("tran_id");
    
    // Optionally, parse the POST body if the gateway sends data
    const body = await req.json().catch(() => ({})); // Handle cases where no body is sent
    console.log("Payment Gateway Response:", { tranId, body });

    // Here, you could validate the payment with sslConfig if needed
    // For now, assume success and redirect to the UI page
    const redirectUrl = new URL(`/payment-confirm?tran_id=${tranId}`, req.nextUrl.origin);
    return NextResponse.redirect(redirectUrl, { status: 303 }); // 303 forces a GET request
  } catch (error) {
    console.error("Error handling payment confirmation:", error);
    return NextResponse.json(
      { message: "Failed to process payment confirmation" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}