import axios from "axios";

// utils/uploadImageToImgBB.js
export async function imageUpload(imageFile) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD;
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
  formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    if (response.status) {
      console.log(response.status.url);
      return response.data.url;
    } else {
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error("ImgBB Upload Error:", error.message);
    return null;
  }
}
