/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Availability {
  day: string;
  time: string;
}

export interface ITutor {
  _id: string;
  name: string;
  email: string;
  bio: string;
  category: string;
  gradeLevel: string;
  hourlyRate: number;
  phoneNumber: string;
  profileImage: string;
  role: "tutor" | "student" | "admin";
  subjects: string[];
  ratings: number[];
  availability: Availability[];
  createdAt: string;
  updatedAt: string;
}

import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/services/User";
import Link from "next/link";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import {
  createReviewComments,
  getAllReviewComments,
} from "@/services/User/ReviewComment";
import { IReview } from "@/types/review";
import { useUser } from "@/context/UserContext";
import { getAllBooking, requestBooking } from "@/services/request";
import { toast } from "sonner";
import { SkeletonLoading } from "@/components/ui/shared/SkeletonLoading";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquareMore } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
const AllTutorComponents = () => {
  const [tutors, setTutors] = useState<ITutor[] | []>([]);
  const [isUser, setIsUser] = useState<ITutor[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [requestedTutors, setRequestedTutors] = useState<string[]>([]);
  const [acceptedTutors, setAccetedTutors] = useState<string[]>([]);

  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [filteredSubjects, setFilteredSubjects] = useState<string[]>([]);

  const [tutorId, setTutorId] = useState("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { user } = useUser();

  const form = useForm();

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);

        const usersData = await getAllUsers();

        const loggedUser = usersData?.data?.filter(
          (item: ITutor) => item.email === user?.userEmail
        );

        setIsUser(loggedUser);

        const allTutor = usersData?.data?.filter(
          (item: ITutor) => item.role === "tutor"
        );
        setTutors(allTutor);

        if (user) {
          const bookingsData = await getAllBooking();

          const tutorIdList = bookingsData?.data
            ?.filter((item: any) => item.student?._id === loggedUser[0]?._id)
            .map((item: any) => item.tutor);
          setRequestedTutors(tutorIdList);

          // filter out the checking accepted request
          const acceptedTutorId = bookingsData?.data
            ?.filter(
              (item: any) =>
                item.bookingRequest === true &&
                item.student?._id === loggedUser[0]?._id
            )
            .map((item: any) => item.tutor);
          setAccetedTutors(acceptedTutorId);
          setLoading(false);
        }

        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTutors();
  }, [user]);

  useEffect(() => {
    const allSubjects = [
      ...new Set(tutors?.flatMap((tutor) => tutor.subjects)),
    ];

    setFilteredSubjects(allSubjects);
  }, [tutors]);

  const filteredTutors = tutors?.filter((tutor) => {
    const searchQuery = searchValue.trim().toLowerCase();

    const categoryMatch =
      !selectedCategory ||
      selectedCategory === "All" ||
      tutor.category === selectedCategory;

    const subjectMatch =
      !selectedSubject ||
      selectedSubject === "All" ||
      tutor.subjects.includes(selectedSubject);

    const priceMatch =
      !selectedPrice ||
      selectedPrice === "All" ||
      (() => {
        const [min, max] = selectedPrice.split("-").map(Number);
        return tutor.hourlyRate >= min && tutor.hourlyRate <= max;
      })();

    const searchMatch =
      !searchQuery ||
      tutor.name.toLowerCase().includes(searchQuery) ||
      tutor.category.toLowerCase().includes(searchQuery) ||
      tutor.subjects.some((subject) =>
        subject.toLowerCase().includes(searchQuery)
      ) ||
      (!isNaN(Number(searchQuery)) && tutor.hourlyRate <= Number(searchQuery));

    return categoryMatch && subjectMatch && priceMatch && searchMatch;
  });

  //handle Booking Request
  const handleRequest = async (id: string) => {
    const requestData = {
      student: isUser[0]?._id,
      tutor: id,
    };

    try {
      const res = await requestBooking(requestData);

      if (res.success) {
        toast.success(res.message);
        setRequestedTutors((prev) => [...(prev || []), id]);
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

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);

    const filteredTutors = tutors?.filter((tutor) => tutor.category === value);
    const subjectsInCategory = [
      ...new Set(filteredTutors?.flatMap((tutor) => tutor.subjects)),
    ];

    setFilteredSubjects(["All", ...subjectsInCategory]);
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
  };

  const handlePriceChange = (value: string) => {
    setSelectedPrice(value);
  };

  const onSubmit = async (data: FieldValues) => {
    const rating = Number(data?.rating);
    const review = { ...data, rating, tutor: tutorId, student: isUser[0]?._id };
    try {
      setLoading(true);
      const res = await createReviewComments(review);
      if (res?.success) {
        toast.success(res?.message);
      } else toast.success(res?.message);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div>
        <div className="px-10 mt-10 pt-10">
          <div>
            {" "}
            <h2 className="text-xl md:text-2xl lg:text-4xl  ">
              Tutors of <span className="text-pink-500">e_Learn Tutorlink</span>
            </h2>
            <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4 max-w-3xl pb-5">
              Looking for the best tutors? TutorLink 🎓 connects students with
              expert tutors for personalized learning. Find tutors by subject,
              grade, or expertise and book sessions effortlessly. Learn smarter,
              achieve more!
            </p>
            <div className="py-5 flex flex-wrap gap-2">
              <input
                type="text"
                onChange={(e) => setSearchValue(e.currentTarget.value)}
                placeholder="Search for tutors"
                className=" w-full max-w-[30%] rounded-md border border-gray-400 px-5  text-sm md:text-sm lg:text-lg text-gray-700"
              />
              <Select onValueChange={handleCategoryChange}>
                <SelectTrigger className="max-w-[30%] rounded-md border border-gray-400 ">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-md border border-gray-400">
                  <SelectGroup>
                    <SelectItem value="All">All</SelectItem>
                    {[...new Set(tutors?.map((tutor) => tutor.category))].map(
                      (category, index) => (
                        <SelectItem key={index} value={category || "1"}>
                          {category}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {selectedCategory === "All" ? (
                <Select onValueChange={handleSubjectChange}>
                  <SelectTrigger className="max-w-[30%] rounded-md border border-gray-400 ">
                    <SelectValue placeholder="Select Subjects" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-md border border-gray-400">
                    <SelectGroup>
                      <SelectItem value="All">All</SelectItem>
                      {[
                        ...new Set(tutors?.flatMap((tutor) => tutor.subjects)),
                      ].map((subject, index) => (
                        <SelectItem key={index} value={subject || "1"}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <Select onValueChange={handleSubjectChange}>
                  <SelectTrigger className="max-w-[30%] rounded-md border border-gray-400 ">
                    <SelectValue placeholder="Select Subjects" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-md border border-gray-400">
                    <SelectGroup>
                      <SelectItem value="All">All</SelectItem>
                      {filteredSubjects?.map(
                        (subject, index) =>
                          subject !== "All" && (
                            <SelectItem key={index} value={subject || "1"}>
                              {subject}
                            </SelectItem>
                          )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}

              <Select onValueChange={handlePriceChange}>
                <SelectTrigger className="max-w-[30%] rounded-md border border-gray-400 ">
                  <SelectValue placeholder="Select Price" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-md border border-gray-400">
                  <SelectGroup>
                    <SelectLabel>HourlyRate</SelectLabel>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="1-3">1-3</SelectItem>
                    <SelectItem value="4-6">4-6</SelectItem>
                    <SelectItem value="7-9">7-9</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-y-3">
            {filteredTutors?.map((tutor, index) => (
              <div
                key={tutor._id || index}
                className="card bg-base-100 w-[95%] group border border-gray-200 hover:shadow-lg"
              >
                <figure className="relative ">
                  <Image
                    src={tutor?.profileImage}
                    priority={true}
                    width={1100}
                    height={650}
                    alt="BannerImg"
                  ></Image>
                  <Link
                    className="roudend-ful w-full absolute text-center py-1 top-1/2 left-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    href={`/tutors/${tutor._id}`}
                  >
                    Details
                  </Link>
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-xl">{tutor.name}</h2>
                  <p className=" text-sm md:text-sm lg:text-lg text-gray-700 ">
                    {tutor.category}
                  </p>
                  <p className=" text-sm md:text-sm lg:text-lg text-gray-700 line-clamp-2">
                    {tutor.gradeLevel}
                  </p>
                  <div className="card-actions justify-between items-center">
                    <p>
                      <span className="text-sm md:text-sm lg:text-lg text-gray-700">
                        ${tutor.hourlyRate}
                      </span>{" "}
                      hr
                    </p>
                    <div className="flex gap-1 text-sm md:text-sm lg:text-lg text-gray-700">
                      <FaStar className="text-yellow-500" />
                      <FaStar className="text-yellow-500" />
                      <FaStarHalfAlt className="text-yellow-500" />
                      <FaRegStar className="text-yellow-500" />
                    </div>
                  </div>
                  <div className=" flex flex-wrap gap-y-2 justify-between  items-center">
                    {user?.role === "student" && (
                      <div className="flex justify-between items-center gap-8">
                        <div>
                          {acceptedTutors?.includes(tutor?._id) ? (
                            <Button className="roudend-ful cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                              Accpted
                            </Button>
                          ) : requestedTutors?.includes(tutor?._id) ? (
                            <Button className="roudend-ful cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                              Request
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleRequest(tutor?._id)}
                              className="roudend-ful cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                            >
                              Add
                            </Button>
                          )}
                        </div>
                        <div className=" hover:bg-gray-400/25">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="bg-blue-50">
                                <MessageSquareMore />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-white">
                              <DialogHeader>
                                <DialogTitle></DialogTitle>
                                <DialogDescription></DialogDescription>
                              </DialogHeader>
                              <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                  <div className="grid grid-cols-1  gap-2">
                                    <FormField
                                      control={form.control}
                                      name="comment"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Your opinion</FormLabel>
                                          <FormControl>
                                            <Textarea
                                              {...field}
                                              value={field.value || ""}
                                            ></Textarea>
                                          </FormControl>
                                          <FormMessage className="text-red-500" />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="rating"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Your Rating</FormLabel>
                                          <FormControl>
                                            <Input
                                              type="number"
                                              className="border border-gray-400 "
                                              {...field}
                                              value={field.value || ""}
                                            />
                                          </FormControl>
                                          <FormMessage className="text-red-500" />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div>
                                    <Button
                                      onClick={() => setTutorId(tutor?._id)}
                                      className="mt-2 cursor-pointer border-0 hover:border btn bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ..."
                                      type="submit"
                                    >
                                      Submit
                                    </Button>
                                  </div>
                                </form>
                              </Form>
                              <DialogFooter></DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    )}
                    <Link href={`/booking/${tutor._id}`}>
                      <Button className="roudend-ful  cursor-pointer hover:text-gray-900 border-0 bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        Booking
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTutorComponents;
