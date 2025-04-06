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
      success_url: `http://localhost:3000/payment-confirm?tran_id=${transactionId}`,
      fail_url: `http://localhost:3000/payment-failed`,
      cancel_url: `http://localhost:3000/payment-cancelled`,
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
        { message: result.failedreason },
        { status: 400 }
      );
    }

    if (result.status === "SUCCESS") {
      return NextResponse.json({
        url: result.GatewayPageURL,
        transactionId,
      });
    }

    return NextResponse.json(
      { message: "Unknown error occurred" },
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
