import { dataConfig, sslConfig } from "@/_config/sslConfig";
import { NextRequest, NextResponse } from "next/server";

interface SSLResponse {
  GatewayPageURL?: string;
  status: string;
  failedreason?: string;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();
    const transactionId = `T-${Date.now()}`;

    const data = dataConfig({
      total_amount: Number(formData.amount),
      tran_id: transactionId,
      success_url: `${process.env.NEXTAUTH_URL}/api/payment-confirm?tran_id=${transactionId}`, // Updated to API route
      fail_url: `${process.env.NEXTAUTH_URL}/payment-failed`,
      cancel_url: `${process.env.NEXTAUTH_URL}/payment-cancelled`,
      product_name: formData.product_name,
      product_category: formData.product_category,
      cus_name: formData.customer_name,
      cus_email: formData.email,
      cus_add1: formData.address,
      cus_phone: formData.phone,
    });

    const result: SSLResponse = await sslConfig.init(data);

    if (!result.GatewayPageURL || result.status === "FAILED") {
      return NextResponse.json(
        { message: result.failedreason || "Payment initiation failed" },
        { status: 400 }
      );
    }

    if (result.status === "SUCCESS" && typeof result.GatewayPageURL === "string") {
      return NextResponse.json({
        url: result.GatewayPageURL,
        transactionId,
      });
    }

    return NextResponse.json(
      { message: "Invalid gateway URL returned" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
