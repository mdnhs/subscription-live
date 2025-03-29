// app/api/subscriptions/import/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Subscription from "@/models/Subscription";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    // Clear existing data if needed
    // await Subscription.deleteMany({});

    // Insert all subscriptions
    const result = await Subscription.insertMany(data);

    return NextResponse.json({
      message: "Subscriptions imported successfully",
      count: result.length,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Import error:", err.message);
    return NextResponse.json(
      { message: "Failed to import subscriptions", error: err.message },
      { status: 500 }
    );
  }
}
