"use server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

interface RegisterValues {
  email: string;
  password: string;
  name: string;
  role?: string; // Make role optional
}

export const register = async (values: RegisterValues) => {
  const { email, password, name, role = "user" } = values;

  try {
    await connectDB();
    const userFound = await User.findOne({ email });
    if (userFound) {
      return {
        success: false,
        error: "Email already exists!",
      };
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    
    const savedUser = await user.save();
    
    return {
      success: true,
      user: {
        id: savedUser._id.toString(),
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: "Something went wrong during registration",
    };
  }
};