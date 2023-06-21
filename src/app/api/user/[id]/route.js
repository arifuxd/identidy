import { NextResponse } from "next/server";
import dbConnect from "@/utils/MongoConnect";
import User from "@/models/user";

export const GET = async (request) => {
  const username = request.url.slice(request.url.lastIndexOf("/") + 1);

  try {
    await dbConnect();
    const user = await User.findOne({ username });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};
