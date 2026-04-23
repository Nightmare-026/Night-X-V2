import { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us | Night X",
  description: "Learn more about Night X - Practical utility tools built for speed, focusing on browser-first workflows that value your time and privacy.",
};

export default function AboutPage() {
  return <AboutContent />;
}
