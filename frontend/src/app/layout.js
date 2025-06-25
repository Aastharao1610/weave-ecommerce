import "./globals.css";
import { ToastContainer } from "react-toastify";
import LayoutContainer from "./components/layout/layoutContainer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastContainer position="top-right" autoClose={3000} />
        <LayoutContainer>{children}</LayoutContainer>
      </body>
    </html>
  );
}
