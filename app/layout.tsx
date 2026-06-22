import "./globals.css";

export const metadata = {
  title: "Excelandia LMS",
  description: "Academia de Excelandia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}