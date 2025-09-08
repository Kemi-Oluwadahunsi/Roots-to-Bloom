# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image uploads in your Roots to Bloom application.

## 1. Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your Cloudinary Credentials

1. Log into your Cloudinary dashboard
2. Go to the "Dashboard" section
3. Copy the following values:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)

## 3. Create an Upload Preset

1. In your Cloudinary dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: `product-images` (or any name you prefer)
   - **Signing Mode**: `Unsigned` (for client-side uploads)
   - **Folder**: `products` (optional, for organization)
   - **Transformation**: 
     - Format: `f_auto` (auto format)
     - Quality: `q_auto` (auto quality)
     - Width: `w_1000` (max width 1000px)
     - Height: Leave empty (maintains natural aspect ratio)
     - Crop: `c_scale` (maintains aspect ratio, no stretching)
   - **Auto-upload**: Enable
   - **Moderation**: None (unless you want content moderation)
5. Click **Save**

## 4. Set Up Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
```

Replace the values with your actual Cloudinary credentials:
- `your_cloudinary_cloud_name`: Your Cloud Name from step 2
- `your_upload_preset_name`: The preset name you created in step 3
- `your_cloudinary_api_key`: Your API Key from step 2

## 5. Test the Setup

1. Start your development server: `npm run dev`
2. Go to `/admin/images`
3. Try uploading an image
4. Check your Cloudinary dashboard to see if the image appears

## 6. Features Included

### ✅ **Automatic Image Optimization**
- Images are automatically optimized for web delivery
- Multiple formats supported (JPEG, PNG, WebP, GIF)
- Automatic quality and format selection

### ✅ **Responsive Images**
- Images are automatically resized to 800px max width
- Maintains aspect ratio
- Fast loading with Cloudinary's CDN

### ✅ **Cloud Storage**
- Images stored securely in Cloudinary's cloud
- Global CDN for fast delivery worldwide
- No local storage limitations

### ✅ **Professional Features**
- Image transformations on-the-fly
- Automatic format conversion
- Quality optimization
- Secure uploads

## 7. Free Tier Limits

Cloudinary's free tier includes:
- **25 GB storage**
- **25 GB bandwidth per month**
- **25,000 transformations per month**

This is more than enough for most small to medium applications.

## 8. Security Notes

- Upload presets are configured for unsigned uploads (client-side)
- Images are stored in a private folder structure
- API key is used for image management operations
- For production, consider implementing server-side uploads for enhanced security

## 9. Troubleshooting

### Common Issues:

1. **"Cloudinary configuration is missing"**
   - Check your `.env` file exists and has the correct variable names
   - Restart your development server after adding environment variables

2. **"Upload failed"**
   - Verify your upload preset is set to "Unsigned"
   - Check that your Cloud Name is correct
   - Ensure the upload preset name matches exactly

3. **Images not appearing**
   - Check your Cloudinary dashboard to see if uploads are successful
   - Verify the folder structure in Cloudinary
   - Check browser console for any error messages

## 10. Next Steps

Once set up, you can:
- Upload images through the admin interface
- Use images in product forms
- Manage images through the Cloudinary dashboard
- Implement image deletion (requires backend implementation)

## Support

If you encounter any issues:
1. Check the Cloudinary documentation
2. Verify your environment variables
3. Check the browser console for errors
4. Ensure your upload preset is configured correctly
