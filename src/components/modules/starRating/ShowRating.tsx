"use client";
import { FaStar } from "react-icons/fa";

const ShowRating = ({ RatingShow }: { RatingShow: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((star, i) => {
        const startValue = i + 1;
        return (
          <div key={i}>
            <FaStar
              className={`${
                startValue <= RatingShow ? "text-yellow-300" : "text-gray-200"
              }`}
              size={30}
            ></FaStar>
          </div>
        );
      })}
    </div>
  );
};

export default ShowRating;
