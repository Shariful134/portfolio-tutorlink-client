"use client";
import { AboutComponent } from "@/components/modules/about/AboutComponent";
import UploadWidget from "@/imgaeUpload/UploadWidget";
import Image from "next/image";
import { useState } from "react";

const AboutPage = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  console.log("imageUrl: ", imageUrl);
  return (
    <div className="px-10 pt-20 text-4xl text-center">
      <AboutComponent></AboutComponent>
      <UploadWidget onImageUpload={handleImageUpload} />
      {imageUrl && (
        <Image
          src={imageUrl}
          width={200}
          height={200}
          alt="uploadImage"
        ></Image>
      )}
    </div>
  );
};

export default AboutPage;
