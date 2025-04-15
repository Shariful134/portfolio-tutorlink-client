/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";

import { getAllUsers, getSingleTutors } from "@/services/User";
import Image from "next/image";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { ITutor } from "../home/page";
import { useUser } from "@/context/UserContext";
import { getAllBooking, requestBooking } from "@/services/request";
import { toast } from "sonner";
import { SkeletonLoading } from "@/components/ui/shared/SkeletonLoading";
import { IReview } from "@/types/review";
import { getAllReviewComments } from "@/services/User/ReviewComment";
import ShowRating from "../starRating/ShowRating";

const TutorDetailsComponent = ({ id }: { id: string }) => {
  const [tutors, setTutors] = useState<ITutor[] | []>([]);
  const [specificTutors, setSpecificTutors] = useState<ITutor[] | []>([]);
  const [tutor, setTutor] = useState<ITutor[] | []>([]);
  const [student, setStudent] = useState<ITutor[] | []>([]);
  const [requestedTutors, setRequestedTutors] = useState<string[]>([]);
  const [acceptedTutors, setAccetedTutors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [reviews, setReviews] = useState<IReview[] | []>([]);

  const { user, ratings } = useUser();

  // using UseEffect for the Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // api call for SingletutorData
        const tutor = await getSingleTutors(id);
        setTutor([tutor?.data]);

        // api call for AllUSersData
        const usersData = await getAllUsers();
        const allTutorsData = usersData?.data.filter(
          (tutor: any) => tutor.role === "tutor"
        );
        setTutors(allTutorsData);

        const data = await getAllReviewComments();
        setReviews(data?.data);

        // current setStudentData
        let currentStudent = [];
        if (user) {
          currentStudent = usersData?.data.filter(
            (student: any) => student.email === user?.userEmail
          );
          setStudent(currentStudent);
        }

        if (user && currentStudent.length > 0) {
          const bookingsData = await getAllBooking();
          setSpecificTutors(bookingsData?.data);
          if (bookingsData?.data) {
            const tutorIdList = bookingsData?.data
              ?.filter(
                (item: any) =>
                  item.student?._id === currentStudent[0]?._id &&
                  item.tutor === id
              )
              .map((item: any) => item.tutor);
            setRequestedTutors(tutorIdList);

            //filter out the checking accepted request
            const acceptedTutorId = bookingsData?.data
              ?.filter((item: any) => item.bookingRequest === true)
              .map((item: any) => item.tutor);
            setAccetedTutors(acceptedTutorId);
            setLoading(false);
          }
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
      setLoading(false);
    };

    fetchData();
  }, [id, user]);

  const tBook = specificTutors
    ?.filter(
      (item: any) => item.student?._id === student[0]?._id && item.tutor === id
    )
    .map((item: any) => item.tutor);

  //set releted tutor of category
  const reletedTutor = tutors?.filter(
    (item) => item.category === tutor[0]?.category
  );

  const ratingsMap: any = {};
  reviews?.forEach(({ tutor, rating }) => {
    if (!ratingsMap[tutor._id]) {
      ratingsMap[tutor._id] = [];
    }
    ratingsMap[tutor._id].push(rating);
  });

  const reletedTutors = reletedTutor?.map((tutor) => ({
    ...tutor,
    ratings: ratingsMap[tutor._id] || tutor.ratings,
  }));

  const tutorDetails = tutor?.map((tutor) => ({
    ...tutor,
    ratings: ratingsMap[tutor._id] || tutor.ratings,
  }));

  const handleRequest = async (id: string) => {
    const requestData = {
      student: student[0]?._id,
      tutor: id,
    };

    try {
      const res = await requestBooking(requestData);

      if (res.success) {
        toast.success(res.message);
        setRequestedTutors((prev) => [...prev, id]);
      } else {
        toast.success(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 flex justify-center">
        <SkeletonLoading />
      </div>
    );
  }
  return (
    <>
      <div className="pt-20 px-10 ">
        <div className="">
          {tutorDetails?.map((tutorData: ITutor) => (
            <div
              key={tutorData?._id}
              className=" p-5 card shadow-md xl:shadow-white bg-base-100 mx-auto min-w-[70%]  h-full flex flex-col md:flex-row justify-center items-center "
            >
              <div className="flex flex-col justify-center items-center">
                <Image
                  src={tutorData?.profileImage ?? "/default-profile.png"}
                  width={200}
                  height={200}
                  alt={tutorData?.name ?? "Tutor"}
                  className="rounded-md"
                ></Image>
                <span className="text-sm">{tutorData?.email}</span>
                <ShowRating RatingShow={tutorData?.ratings[0]}></ShowRating>
              </div>
              <div className="card-body ps-0 sm:ps-5 ">
                <div className="flex justify-center items-center">
                  <h2 className="card-title text-sm sm:text-xl ">
                    {tutorData?.name}{" "}
                  </h2>
                  <p className=" text-sm md:text-sm  text-gray-700 ">
                    ( {tutorData?.gradeLevel})
                  </p>
                </div>
                <p className="  text-gray-700 ">
                  <span className="font-semibold text-sm md:text-smlg:text-lg">
                    {tutorData?.category}
                  </span>
                  (category)
                </p>
                <p className=" text-sm md:text-sm lg:text-lg text-gray-700 ">
                  <span className="text-gray-900">Subject: </span>{" "}
                  {tutorData?.subjects?.join(", ")}
                </p>
                <p className=" text-sm md:text-sm lg:text-lg text-gray-700 ">
                  <span className="text-gray-900">HourlyRatelity:</span>{" "}
                  {tutorData?.hourlyRate} $
                </p>

                <p className=" text-sm md:text-sm lg:text-lg text-gray-700 ">
                  Phone: {tutorData?.phoneNumber}
                </p>

                <p className=" text-sm md:text-sm lg:text-lg text-gray-700 ">
                  <span className="text-gray-900"> </span>{" "}
                  {tutorData?.availability
                    ?.map(
                      (avail: { day: string; time: string }) =>
                        `${avail.day}: ${avail.time}`
                    )
                    .join(", ")}
                </p>
                <p className=" text-sm md:text-sm lg:text-lg text-gray-700 ">
                  <span className="text-gray-900">
                    Details: {tutorData?.bio}
                  </span>{" "}
                </p>
                <div className=" flex flex-wrap gap-y-2 gap-x-2 justify-start  items-center">
                  {user?.role === "student" && (
                    <div>
                      {acceptedTutors?.includes(tutorData?._id) ? (
                        <Button className="roudend-ful cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ...">
                          Accpted
                        </Button>
                      ) : requestedTutors?.includes(tutorData?._id) ? (
                        <Button className="roudend-ful cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ...">
                          Request
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleRequest(tutorData?._id)}
                          className="roudend-ful cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ..."
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  )}

                  <Link href={`/booking/${tutorData?._id}`}>
                    <Button className="roudend-ful  cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ...">
                      Booking
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* =============================Releted Tutor================================ */}
        <div className="flex flex-wrap justify-start mt-5  gap-3 ">
          {reletedTutors?.map((tutor) => (
            <div
              key={tutor._id}
              className="card bg-base-100 w-[95%] group min-w-[100px] max-w-[120px]  border border-gray-200 hover:shadow-sm"
            >
              <figure className="relative h-[100%]">
                <Image
                  className="h-[100%]"
                  src={tutor.profileImage}
                  width={400}
                  height={100}
                  alt="profileImage"
                ></Image>
                <Link
                  className="absolute w-full text-center py-1 lg:py-2 bottom-0 lg:bottom-1/2 left-0 lg:translate-y-1/2 opacity-100 lg:opacity-0 group-hover:opacity-100 roudend-md  text-xs cursor-pointer hover:text-gray-900 border-0 bg-gray-300  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ..."
                  href={`/tutors/${tutor._id}`}
                >
                  Details
                </Link>
              </figure>

              <div className="py-2">
                <div className="card-actions flex-col justify-center items-center">
                  <h2 className="card-title text-center text-xs">
                    {tutor.name}
                  </h2>
                  <p className="text-xs  text-gray-700">
                    ${tutor.hourlyRate}
                    <span>hr</span>{" "}
                  </p>
                  <ShowRating RatingShow={tutor?.ratings[0]}></ShowRating>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TutorDetailsComponent;
