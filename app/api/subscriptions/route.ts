import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import { Types } from "mongoose";

// Define proper types for MongoDB documents
interface SubscriptionDocument {
  _id: Types.ObjectId;
  title: string;
  targetUrl: string;
  json: unknown[];
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

// Define error type
interface ErrorWithMessage {
  message: string;
  stack?: string;
  name?: string;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const limit = parseInt(url.searchParams.get("limit") ?? "10");
    const skip = (page - 1) * limit;

    const total = await Subscription.countDocuments();
    const subscriptions = (await Subscription.find({})
      .skip(skip)
      .limit(limit)
      .lean() as unknown[]).map((sub) => sub as SubscriptionDocument);

    const subscriptionsWithId = subscriptions.map((sub) => ({
      ...sub,
      _id: sub._id.toString(),
    }));

    // If page and limit are provided, include pagination; otherwise, just return data
    if (url.searchParams.has("page") || url.searchParams.has("limit")) {
      const pagination = {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };
      return NextResponse.json({ data: subscriptionsWithId, pagination });
    }

    return NextResponse.json({ data: subscriptionsWithId });
  } catch (error) {
    const err = error as ErrorWithMessage;
    console.error("API GET error:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    return NextResponse.json(
      {
        message: "Failed to fetch subscriptions",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, targetUrl, json } = body;

    if (!title || !targetUrl || !json) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newSubscription = new Subscription({
      title,
      targetUrl,
      json,
    });

    await newSubscription.save();

    return NextResponse.json({
      message: "Subscription created successfully",
      data: {
        ...newSubscription.toObject(),
        _id: newSubscription._id.toString(),
      },
    });
  } catch (error) {
    const err = error as ErrorWithMessage;
    console.error("API POST error:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    return NextResponse.json(
      {
        message: "Failed to create subscription",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Missing subscription ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, targetUrl, json } = body;

    if (!title || !targetUrl || !json) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await Subscription.updateOne(
      { _id: id },
      { $set: { title, targetUrl, json, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Subscription updated successfully" });
  } catch (error) {
    const err = error as ErrorWithMessage;
    console.error("API PATCH error:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    return NextResponse.json(
      {
        message: "Failed to update subscription",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Missing subscription ID" },
        { status: 400 }
      );
    }

    const result = await Subscription.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Subscription deleted successfully" });
  } catch (error) {
    const err = error as ErrorWithMessage;
    console.error("API DELETE error:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    return NextResponse.json(
      {
        message: "Failed to delete subscription",
        error: err.message,
      },
      { status: 500 }
    );
  }
}