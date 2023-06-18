import { NextResponse } from "next/server";
import dbConnect from "@/utils/MongoConnect";
import User from "@/models/user";

export const GET = async (request) => {
  const id = request.url.slice(request.url.lastIndexOf("/") + 1);

  try {
    await dbConnect();
    const user = await User.findById(id);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};
