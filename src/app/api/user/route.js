import { NextResponse } from "next/server";
import dbConnect from "@/utils/MongoConnect";
import User from "@/models/user";

export const GET = async () => {
  try {
    await dbConnect();
    const allUser = await User.find();
    return NextResponse.json(allUser, { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    await dbConnect();
    const data = await req.json();

    // Create a new user document using the User model
    const newUser = new User(data);

    // Save the new user document to the database
    await newUser.save();

    return NextResponse.json(
      {
        message: "User created successfully",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return new NextResponse(error, { status: 500 });
  }
};

export const DELETE = async (req) => {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    // Find the user document by ID and delete it
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User deleted successfully",
        user: deletedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return new NextResponse(error, { status: 500 });
  }
};

export const PUT = async (req) => {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = await req.json();

    // Find the user document by ID and update it
    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedUser) {
      return new NextResponse({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new NextResponse(error, { status: 500 });
  }
};
