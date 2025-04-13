"use client";
import { AboutComponent } from "@/components/modules/about/AboutComponent";
import dynamic from "next/dynamic";

const StarRating = dynamic(
  () => import("@/components/modules/starRating/StarRating"),
  { ssr: false }
);
const AboutPage = () => {
  return (
    <div className="px-10 pt-20 text-4xl text-center">
      <AboutComponent></AboutComponent>
      <StarRating />
    </div>
  );
};

export default AboutPage;
