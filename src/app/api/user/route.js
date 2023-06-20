import { NextResponse } from "next/server";
import dbConnect from "@/utils/MongoConnect";
import User from "@/models/user";
import fs from "fs";
import path from "path";

// const saveBase64Image = async (base64Data) => {
//   const base64Image = base64Data.split(";base64,").pop();
//   const extension = base64Data.split(";")[0].split("/")[1];

//   // Generate a unique filename for the image
//   const filename = `${Date.now()}.${extension}`;
//   const imagePath = path.join(process.cwd(), "public", "uploads", filename);

//   try {
//     await fs.promises.mkdir(path.dirname(imagePath), { recursive: true });
//     await fs.promises.writeFile(imagePath, base64Image, "base64");
//     return filename; // or return imagePath;
//   } catch (error) {
//     throw new Error(`Error saving image: ${error}`);
//   }
// };

export const GET = async () => {
  try {
    await dbConnect();
    const allUser = await User.find();
    return NextResponse.json(allUser, { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};

// export const POST = async (req) => {
//   try {
//     await dbConnect();
//     const data = await req.json();

//     // Create a new user document using the User model
//     const newUser = new User(data);

//     // Save the new user document to the database
//     await newUser.save();

//     return NextResponse.json(
//       {
//         message: "User created successfully",
//         user: newUser,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return new NextResponse(error, { status: 500 });
//   }
// };

export const POST = async (req) => {
  try {
    await dbConnect();
    const data = await req.json();

    // Process the image and convert it to base64 encoding
    // const base64Image = await processImage(data.avatar);
    // var imagename = await saveBase64Image(data.avatar);
    var imagename = await saveFileToFirebaseStorage(data.avatar);
    // Create a new user document
    const newUser = new User({
      ...data,
      avatar: imagename,
    });

    // Save the user document to the database
    const savedUser = await newUser.save();

    return NextResponse.json(savedUser, { status: 200 });
  } catch (error) {
    console.error("Error creating user:", error);
    return new NextResponse(error, { status: 500 });
  }
};

// Example function to process the image and convert it to base64 encoding
// async function processImage(imageData) {
//   // Your image processing logic here
//   // For example, you can use a library like `sharp` to resize or modify the image
//   // Once you have the processed image, you can convert it to base64 encoding

//   // Example code to convert an image file to base64 encoding
//   const imageBuffer = Buffer.from(imageData, "base64");
//   const base64Image = imageBuffer.toString("base64");

//   return base64Image;
// }

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
