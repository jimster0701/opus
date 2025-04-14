import { CldUploadButton } from "next-cloudinary";

export function uploadCldImage() {
  return (
    <CldUploadButton
      uploadPreset="your_unsigned_upload_preset"
      onSuccess={(result) => {
        console.log(result?.info);
      }}
    />
  );
}
