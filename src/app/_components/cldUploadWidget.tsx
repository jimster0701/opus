// cldUploadWidget.ts
"use client";

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface UploadWidgetProps {
  cloudName: string;
  uploadPreset: string;
  folder: string;
  id: string | undefined;
}

export const openUploadWidget = (props: UploadWidgetProps) => {
  const widget = window.cloudinary.createUploadWidget({
    cloudName: "",
    uploadPreset: props.uploadPreset,
    options: {
      maxFiles: 1,
      folder: "profile-pictures",
      publicId: props.id,
    },
  });

  widget.open();
};
