"use client";
import { useState } from "react";

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file");
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("No image selected");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "my_unsigned_preset");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/<your_cloud_name>/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setUploadedUrl(data.secure_url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {preview && (
        <div className="mb-4">
          <p>Preview:</p>
          <img
            src={preview}
            alt="Preview"
            className="rounded-lg shadow w-full"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        className={`px-4 py-2 rounded ${
          uploading ? "bg-gray-400" : "bg-blue-500 text-white"
        }`}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

      {uploadedUrl && (
        <div className="mt-4">
          <p>Uploaded Image:</p>
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={uploadedUrl}
              alt="Uploaded"
              className="rounded shadow w-full mt-2"
            />
          </a>
        </div>
      )}
    </div>
  );
}
