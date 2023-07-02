import { NextResponse } from "next/server";
import dbConnect from "@/utils/MongoConnect";
import User from "@/models/user";

export const GET = async (request) => {
  const username = request.url.slice(request.url.lastIndexOf("/") + 1);

  try {
    await dbConnect();
    const user = await User.findOne({ username });

    if (user) {
      return NextResponse.json(
        {
          message: "Username already exists. Please choose a different username.",
          exists: true,
          user: user,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Username is available.",
          exists: false,
          user: null,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};
