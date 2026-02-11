import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary using server-side credentials
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dsnewvfyp';
    const apiKey = '712338574842352';
    const apiSecret = '0Eek2Xn4e-rdwkjinug02EJWKCk';
    
    // Generate timestamp
    const timestamp = Math.round(Date.now() / 1000);
    
    // Create signature
    const crypto = require('crypto');
    const stringToSign = `folder=turfs&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash('sha1')
      .update(stringToSign)
      .digest('hex');

    // Upload to Cloudinary
    const uploadFormData = new FormData();
    uploadFormData.append('file', base64File);
    uploadFormData.append('folder', 'turfs');
    uploadFormData.append('timestamp', timestamp.toString());
    uploadFormData.append('api_key', apiKey);
    uploadFormData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'Failed to upload to Cloudinary', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      url: data.secure_url,
      publicId: data.public_id,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
