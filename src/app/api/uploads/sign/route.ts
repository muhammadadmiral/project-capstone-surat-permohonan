import { signCloudinaryPayload } from "@/lib/cloudinary";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const folder = typeof body.folder === "string" ? body.folder : undefined;
    const public_id = typeof body.public_id === "string" ? body.public_id : undefined;
    const { signature, timestamp } = signCloudinaryPayload({ folder, public_id });
    return NextResponse.json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error("Cloudinary sign error", error);
    return NextResponse.json({ error: "Tidak dapat membuat signature upload." }, { status: 400 });
  }
}
