import { CldUploadButton } from "next-cloudinary";

interface CldImageUploadProps {
  id: string | undefined;
}

export function CldImageUploadProfile(props: CldImageUploadProps) {
  return (
    <CldUploadButton
      uploadPreset="opus-profile-image"
      options={{
        maxFiles: 1,
        folder: "profile-pictures",
        publicId: props.id,
      }}
      onSuccess={(result) => {}}
    />
  );
}
