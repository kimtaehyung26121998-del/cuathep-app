import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://cuathep-app.vercel.app"),
  title: "Lên đơn An Phát",
  description: "Ứng dụng lên đơn cửa thép, cửa nhập khẩu và sơn An Phát.",
  openGraph: {
    title: "Lên đơn cửa nhập khẩu An Phát",
    description: "Bảng giá KLD 2026 với giá bán, giá đại lý và phụ kiện nhập khẩu.",
    images: [{ url: "/og.png", width: 1680, height: 945, alt: "Lên đơn cửa nhập khẩu An Phát" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lên đơn cửa nhập khẩu An Phát",
    description: "Bảng giá KLD 2026 với giá bán, giá đại lý và phụ kiện nhập khẩu.",
    images: ["/og.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
