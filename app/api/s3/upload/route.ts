import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { S3 } from "@/lib/S3Client";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, "FileName is required"),
  contentType: z.string().min(1, "Content type is required"),
  size: z.coerce.number().min(1, "Size is required"),
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const fileName = formData.get("fileName")?.toString() ?? "upload";
    const contentType = formData.get("contentType")?.toString() ?? "application/octet-stream";
    const size = formData.get("size")?.toString();

    if (!(file instanceof Blob) || !size) {
      return NextResponse.json({ error: "Invalid upload payload" }, { status: 400 });
    }

    const validation = fileUploadSchema.safeParse({
      fileName,
      contentType,
      size: Number(size),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid upload payload" },
        { status: 400 },
      );
    }

    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
    const uniqueKey = `${uuidv4()}-${safeFileName}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    await S3.send(
      new PutObjectCommand({
        Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
        ContentType: contentType,
        ContentLength: fileBuffer.byteLength,
        Key: uniqueKey,
        Body: fileBuffer,
      }),
    );

    return NextResponse.json({ key: uniqueKey });
  } catch (error) {
    console.error("S3 upload route failed", error);
    return NextResponse.json(
      {
        error: "Failed to upload file",
      },
      { status: 500 },
    );
  }
}
