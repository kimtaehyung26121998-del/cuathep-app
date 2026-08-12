import "./globals.css";

export const metadata = {
  title: "Báo giá cửa thép",
  description: "Ứng dụng lập báo giá cửa thép",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
