import { Toaster } from "react-hot-toast";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Toaster position="bottom-center" />
      {children}
    </section>
  );
}
