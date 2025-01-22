import Navbar from "@/components/Navbar";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <title>Yummy Eats</title>
          <meta name="description" content="A recipe sharing website" />
        </head>
        <body>
          <header>
            <Navbar />
          </header>

          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
