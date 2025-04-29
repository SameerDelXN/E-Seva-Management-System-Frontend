// import { NextResponse } from "next/server";
// import cloudinary from "@/utils/cloudinary"; 

// export async function POSt(req) {
// try{
//     const data = await req.formData();
//     const file = data.get("file");
//     if (!file) {
//         return NextResponse.json({ error: "File or type missing" }, { status: 400 });
//       }
//       const arrayBuffer = await file.arrayBuffer();
//     const base64String = Buffer.from(arrayBuffer).toString("base64");
//     const fileData = `data:${file.type};base64,${base64String}`;
    
//         const timestamp = Date.now();
//         const fileName = `${type}_data_${timestamp}`;
//         // ✅ Fix Cloudinary Upload
//         const uploadResponse = await cloudinary.uploader.upload(fileData, {
//           folder: "serviceGroupImages",
//           public_id: fileName, // Set the custom filename
//           use_filename: true,
//           resource_type: "auto",
//         });
    
//         console.log("Upload Successful:", uploadResponse.secure_url);
    
//         return NextResponse.json({ url: uploadResponse.secure_url }, { status: 200 });

//     } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json({ error: "Upload failed", details: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
 import cloudinary from "@/utils/cloudinary"; 

export async function POST(request) {
    try {
      const formData = await request.formData();
      const file = formData.get('file');
      
      if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
      }
  
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
  
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'serviceGroupimage',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          }
        ).end(buffer);
      });
  
      return Response.json({
        url: result.secure_url,
        public_id: result.public_id
      });
    } catch (error) {
      console.error('Upload error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }