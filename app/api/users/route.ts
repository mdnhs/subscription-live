// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { Types } from "mongoose";

// Define proper types for MongoDB documents
interface UserDocument {
  _id: Types.ObjectId;
  role?: string;
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
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    console.log(`Fetching users: page=${page}, limit=${limit}, skip=${skip}`);

    const users = await User.find({}).skip(skip).limit(limit).lean() as UserDocument[];

    if (!users || users.length === 0) {
      console.log("No users found in the database");
      return NextResponse.json([]);
    }

    const usersWithId = users.map((user) => ({
      ...user,
      id: user._id.toString(),
    }));

    console.log("Fetched users:", usersWithId);
    return NextResponse.json(usersWithId);
  } catch (error) {
    const err = error as ErrorWithMessage;
    console.error("API GET error:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    return NextResponse.json(
      {
        message: "Failed to fetch users",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

interface UpdateUserBody {
  userId: string;
  role: string;
}

interface UpdateResult {
  modifiedCount: number;
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json() as UpdateUserBody;
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { message: "Missing userId or role" },
        { status: 400 }
      );
    }

    console.log(`Updating user: ${userId} to role: ${role}`);

    const result = await User.updateOne(
      { _id: userId }, 
      { $set: { role } }
    ) as UpdateResult;

    if (result.modifiedCount === 0) {
      console.log(`No changes made for user: ${userId}`);
      return NextResponse.json(
        { message: "User not found or role unchanged" },
        { status: 404 }
      );
    }

    console.log("Update result:", result);
    return NextResponse.json({ message: "Role updated successfully" });
  } catch (error) {
    const err = error as ErrorWithMessage;
    console.error("API PATCH error:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    return NextResponse.json(
      {
        message: "Failed to update role",
        error: err.message,
      },
      { status: 500 }
    );
  }
}