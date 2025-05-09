import { NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary"; // ✅ Correct Import

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");
    const type = data.get("type");

    if (!file) {
      return NextResponse.json({ error: "File or type missing" }, { status: 400 });
    }

    const folderMap = {
      aadhar: "aadhar_docs",
      pan: "shop_licencse",
      profile: "profile_pictures",
      support: "support_docs",
      serviceImage:"serviceImage"

    };
    const uploadFolder = folderMap[type] || "others";

    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");
    const fileData = `data:${file.type};base64,${base64String}`;


    const timestamp = Date.now();
    const fileName = `${type}_data_${timestamp}`;
    // ✅ Fix Cloudinary Upload
    const uploadResponse = await cloudinary.uploader.upload(fileData, {
      folder: uploadFolder,
      public_id: fileName, // Set the custom filename
      use_filename: true,
      resource_type: "auto",
    });

    console.log("Upload Successful:", uploadResponse.secure_url);

    return NextResponse.json({ url: uploadResponse.secure_url }, { status: 200 });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed", details: error.message }, { status: 500 });
  }
}
