import "./globals.css";

export const metadata = {
  title: "Rialo Community Identity",
  description: "Create your Rialo Community Identity Card.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}