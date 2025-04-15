"use client";
import Image from "next/image";
import photo from "../../../app/assest/images/ContactImg.png";
import Link from "next/link";
import { FaGreaterThan, FaTag } from "react-icons/fa";
import { useEffect, useState } from "react";
import { NewsArticle } from "@/types/blogs";
import { RiAdminFill } from "react-icons/ri";
import { Input } from "@/components/ui/input";
import { MdDateRange } from "react-icons/md";
import { SkeletonLoading } from "@/components/ui/shared/SkeletonLoading";
import { useUser } from "@/context/UserContext";

const BlogsComponents = () => {
  const [education, setEducation] = useState<NewsArticle[] | []>([]);

  const [industrial, setIndustrial] = useState<NewsArticle[] | []>([]);
  const [educationData, setEducationData] = useState(false);
  const [industrialData, setIndustrialData] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { setIsLoading, isLoading } = useUser();

  const [selectTab, setSelectTab] = useState<
    "Industry" | "Education" | "All News"
  >("All News");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=education%20tips&lang=en&max=10&apikey=776f6f0b122cac01f4af40f2534f5575`
        );

        const industrialRresponse = await fetch(
          "https://gnews.io/api/v4/search?q=industrial&lang=en&max=10&apikey=776f6f0b122cac01f4af40f2534f5575"
        );

        const industrialResult = await industrialRresponse.json();
        const educationResult = await response.json();

        setIndustrial(industrialResult?.articles || []);
        setEducation(educationResult?.articles || []);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const recentlyUpdated = education?.slice(0, 3)?.length;
  const recentlyPosted = education?.slice(0, 2)?.length;

  const curretntdate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // educational data
  const contentword = education?.map((item: NewsArticle) =>
    item.content.split("").slice(0, 20)
  );
  const contentwords = industrial?.map((item: NewsArticle) =>
    item.content.split("").slice(0, 100)
  );
  // industrial data
  const contentwordIndustrial = education?.map((item: NewsArticle) =>
    item.content.split("").slice(0, 20)
  );
  const contentwordsIndustrial = industrial?.map((item: NewsArticle) =>
    item.content.split("").slice(0, 100)
  );

  const educationFiltered = education.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const industrialFiltered = industrial.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading)
    return (
      <div className="pt-20 flex justify-center">
        <SkeletonLoading />
      </div>
    );

  return (
    <div className="pb-0 md:pb-5">
      <div className="relative">
        <Image
          src={photo}
          priority={true}
          width={1900}
          height={600}
          alt="BannerImg"
        ></Image>
        <div className="absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          <h2 className=" text-xs md:text-xl lg:text-5xl">NewsLatter</h2>
          <div className="flex items-center text-xs md:text-sm gap-1">
            <Link
              className="hover:underline hover:text-fuchsia-700 "
              href={"/"}
            >
              Home
            </Link>
            <FaGreaterThan className=" text-rose-500" />
            <Link
              className="hover:underline hover:text-fuchsia-700 "
              href={"/blog"}
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-15 sm:justify-start ">
        <div className="hidden sm:inline w-full md:w-[70%] lg:w-[50%]  order-2 md:order-1  ">
          {education?.slice(6, 7)?.map((article: NewsArticle, index) => (
            <div key={index} className="mt-5 mb-5">
              <Image
                src={article?.image}
                width={1900}
                height={900}
                priority={true}
                alt="blogImage"
                className="rounded-lg"
              ></Image>
              <div className="flex items-center gap-5 pt-1 pb-2">
                <div className="flex justify-center items-center  text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                  {" "}
                  <RiAdminFill />
                  Admin
                </div>
                <div className="flex justify-center items-center  text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                  {" "}
                  <MdDateRange />
                  {curretntdate}
                </div>
                <div className=" sm:flex hidden  justify-center items-center text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                  {" "}
                  <FaTag />
                  HandeMade
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 ">
                <Link
                  className="hover:underline hover:text-purple-500"
                  href={article?.url}
                >
                  {article?.title}
                </Link>
              </h2>
              {educationData ? (
                <p className="text-sm md:text-sm lg:text-lg text-gray-700 ">
                  {contentwords}{" "}
                  <button
                    onClick={() => setEducationData(false)}
                    className="text-purple-500 hover:underline"
                  >
                    Read Less...
                  </button>
                </p>
              ) : (
                <p className="text-sm md:text-sm lg:text-lg text-gray-700">
                  {contentword}{" "}
                  <button
                    onClick={() => setEducationData(true)}
                    className="text-purple-500 hover:underline"
                  >
                    Read More...
                  </button>
                </p>
              )}
            </div>
          ))}
          {industrial?.slice(4, 6)?.map((article: NewsArticle, index) => (
            <div key={index} className="mt-5">
              <Image
                src={article?.image}
                width={1900}
                height={100}
                priority={true}
                alt="blogImage"
                className="rounded-lg"
              ></Image>
              <div className="flex  items-center gap-5 pt-1 pb-2">
                <div className="flex justify-center items-center  text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                  {" "}
                  <RiAdminFill />
                  Admin
                </div>
                <div className="flex justify-center items-center  text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                  {" "}
                  <MdDateRange />
                  {curretntdate}
                </div>
                <div className=" sm:flex hidden  justify-center items-center text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                  {" "}
                  <FaTag />
                  HandeMade
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-700">
                <Link
                  className="hover:underline hover:text-purple-500"
                  href={article?.url}
                >
                  {article?.title}
                </Link>
              </h2>
              {industrialData ? (
                <p className="text-sm md:text-sm lg:text-lg text-gray-700">
                  {contentwordsIndustrial}{" "}
                  <button
                    onClick={() => setIndustrialData(false)}
                    className="text-purple-500 hover:underline"
                  >
                    Read Less...
                  </button>
                </p>
              ) : (
                <p className="text-sm md:text-sm lg:text-lg text-gray-700">
                  {contentwordIndustrial}{" "}
                  <button
                    onClick={() => setIndustrialData(true)}
                    className="text-purple-500 hover:underline"
                  >
                    Read More...
                  </button>
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="w-full hidden lg:inline lg:w-[25%]  order-3 md:order-2 mt-5">
          <Input
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search here"
            className="w-full"
          ></Input>
          <div>
            <h2 className="text-2xl py-3 bg-gray-200 my-5 ps-3">Categories</h2>
            <div className="flex justify-between pt-5 ">
              <p className="text-sm md:text-sm lg:text-lg text-gray-700 ps-3">
                Educational
              </p>{" "}
              <p>{education?.length}</p>
            </div>
            <div className="flex justify-between pt-3">
              <p className="text-sm md:text-sm lg:text-lg text-gray-700 ps-3">
                Industrial
              </p>{" "}
              <p>{industrial?.length}</p>
            </div>
            <div className="flex justify-between pt-3 ">
              <p className="text-sm md:text-sm lg:text-lg text-gray-700 ps-3">
                Recently Posted
              </p>{" "}
              <p>{recentlyPosted}</p>
            </div>
            <div className="flex justify-between pt-3">
              <p className="text-sm md:text-sm lg:text-lg text-gray-700 ps-3 ">
                Recently Updated
              </p>{" "}
              <p>{recentlyUpdated}</p>
            </div>
          </div>

          <div>
            {searchQuery === "" ? (
              <div>
                <h2 className="text-2xl py-3 bg-gray-200 my-5 ps-3 ">
                  Recently Updates
                </h2>
                <div>
                  {industrial
                    ?.slice(2, 4)
                    ?.map((article: NewsArticle, index) => (
                      <div
                        key={index}
                        className="mt-5 flex flex-col md:flex-row gap-2  overflow-hidden"
                      >
                        <Image
                          src={article?.image}
                          width={100}
                          height={1300}
                          priority={true}
                          alt="blogImage"
                          className="rounded-lg "
                        ></Image>
                        <div className="">
                          <h2 className="text-lg font-semibold text-gray-700 line-clamp-1">
                            <Link
                              className="hover:underline hover:text-purple-500"
                              href={article?.url}
                            >
                              {article?.title}
                            </Link>
                          </h2>
                          <div className=" text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                            {" "}
                            {article?.publishedAt}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>{" "}
                <h2 className="text-2xl py-3 bg-gray-200 my-5 ps-3 ">
                  Recently Posted
                </h2>
                <div>
                  {education
                    ?.slice(0, 3)
                    ?.map((article: NewsArticle, index) => (
                      <div
                        key={index}
                        className="mt-5 flex flex-col md:flex-row gap-2 overflow-hidden"
                      >
                        <Image
                          src={article?.image}
                          width={100}
                          height={100}
                          priority={true}
                          alt="blogImage"
                          className="rounded-lg"
                        ></Image>
                        <div className="">
                          <h2 className="text-lg font-semibold text-gray-700 line-clamp-1">
                            <Link
                              className="hover:underline hover:text-purple-500"
                              href={article?.url}
                            >
                              {article?.title}
                            </Link>
                          </h2>
                          <div className="flex items-center line-clamp-1 text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                            {" "}
                            {article?.publishedAt}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div>
                  {industrial
                    ?.slice(0, 2)
                    ?.map((article: NewsArticle, index) => (
                      <div
                        key={index}
                        className="mt-5 flex flex-col md:flex-row gap-2 overflow-hidden "
                      >
                        <Image
                          src={article?.image}
                          width={100}
                          height={1300}
                          priority={true}
                          alt="blogImage"
                          className="rounded-lg "
                        ></Image>
                        <div className="">
                          <h2 className="text-lg font-semibold text-gray-700 line-clamp-1">
                            <Link
                              className="hover:underline hover:text-purple-500"
                              href={article?.url}
                            >
                              {article?.title}
                            </Link>
                          </h2>
                          <div className="flex items-center line-clamp-1 text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                            {" "}
                            {article?.publishedAt}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div>
                {" "}
                <h2 className="text-2xl pt-10">Search Result</h2>
                {educationFiltered?.length > 0 ? (
                  <div>
                    {educationFiltered?.map((article: NewsArticle, index) => (
                      <div
                        key={index}
                        className="mt-5 flex flex-col md:flex-row gap-2 overflow-hidden"
                      >
                        <Image
                          src={article?.image}
                          width={100}
                          height={100}
                          priority={true}
                          alt="blogImage"
                          className="rounded-lg"
                        ></Image>
                        <div className="w-[]">
                          <h2 className="text-lg font-semibold text-gray-700 line-clamp-1">
                            <Link
                              className="hover:underline hover:text-purple-500"
                              href={article?.url}
                            >
                              {article?.title}
                            </Link>
                          </h2>
                          <div className="flex items-center line-clamp-1 text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                            {" "}
                            {article?.publishedAt}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Not Matche</p>
                )}
                <div>
                  {industrialFiltered?.map((article: NewsArticle, index) => (
                    <div
                      key={index}
                      className="mt-5 flex flex-col md:flex-row gap-2  overflow-hidden"
                    >
                      <Image
                        src={article?.image}
                        width={100}
                        height={1300}
                        priority={true}
                        alt="blogImage"
                        className="rounded-lg "
                      ></Image>
                      <div className="">
                        <h2 className="text-lg font-semibold text-gray-700 line-clamp-1">
                          <Link
                            className="hover:underline hover:text-purple-500"
                            href={article?.url}
                          >
                            {article?.title}
                          </Link>
                        </h2>
                        <div className="flex items-center line-clamp-1 text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                          {" "}
                          {article?.publishedAt}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className=" w-full md:w-[30%] lg:w-[25%]  order-1 md:order-3">
          <h2 className="text-2xl my-5 "></h2>
          <div className="bg-gray-200 grid grid-cols-12 ">
            <p
              onClick={() => setSelectTab("Industry")}
              className={`py-4 col-span-4 text-center ${
                selectTab === "Industry" ? "bg-purple-500 text-white" : ""
              }`}
            >
              Industry
            </p>
            <p
              onClick={() => setSelectTab("Education")}
              className={`py-4 col-span-4 text-center ${
                selectTab === "Education" ? "bg-purple-500 text-white" : ""
              }`}
            >
              Education
            </p>
            <p
              onClick={() => setSelectTab("All News")}
              className={`py-4 col-span-4 text-center ${
                selectTab === "All News" ? "bg-purple-500 text-white" : ""
              }`}
            >
              All News{" "}
            </p>
          </div>

          <div className="inline sm:hidden">
            {selectTab === "Industry" &&
              industrial?.map((article: NewsArticle, index) => (
                <div key={index} className="mt-5 mb-5">
                  <Image
                    src={article?.image}
                    width={1900}
                    height={900}
                    priority={true}
                    alt="blogImage"
                    className="rounded-lg"
                  ></Image>
                  <div className="flex items-center gap-5 pt-1 pb-2">
                    <div className="flex justify-center items-center  text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                      {" "}
                      <RiAdminFill />
                      Admin
                    </div>
                    <div className="flex justify-center items-center  text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                      {" "}
                      <MdDateRange />
                      {curretntdate}
                    </div>
                    <div className=" sm:flex hidden  justify-center items-center text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                      {" "}
                      <FaTag />
                      HandeMade
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-700 ">
                    <Link
                      className="hover:underline hover:text-purple-500"
                      href={article?.url}
                    >
                      {article?.title}
                    </Link>
                  </h2>
                  {educationData ? (
                    <p className="text-sm md:text-sm lg:text-lg text-gray-700 ">
                      {contentwords}{" "}
                      <button
                        onClick={() => setEducationData(false)}
                        className="text-purple-500 hover:underline"
                      >
                        Read Less...
                      </button>
                    </p>
                  ) : (
                    <p className="text-sm md:text-sm lg:text-lg text-gray-700">
                      {contentword}{" "}
                      <button
                        onClick={() => setEducationData(true)}
                        className="text-purple-500 hover:underline"
                      >
                        Read More...
                      </button>
                    </p>
                  )}
                </div>
              ))}
          </div>
          <div className="inline sm:hidden">
            {selectTab === "Education" &&
              education?.map((article: NewsArticle, index) => (
                <div key={index} className="mt-5 mb-5">
                  <Image
                    src={article?.image}
                    width={1900}
                    height={900}
                    priority={true}
                    alt="blogImage"
                    className="rounded-lg"
                  ></Image>
                  <div className="flex items-center gap-5 pt-1 pb-2">
                    <div className="flex justify-center items-center  text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                      {" "}
                      <RiAdminFill />
                      Admin
                    </div>
                    <div className="flex justify-center items-center  text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                      {" "}
                      <MdDateRange />
                      {curretntdate}
                    </div>
                    <div className=" sm:flex hidden  justify-center items-center text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                      {" "}
                      <FaTag />
                      HandeMade
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-700 ">
                    <Link
                      className="hover:underline hover:text-purple-500"
                      href={article?.url}
                    >
                      {article?.title}
                    </Link>
                  </h2>
                  {educationData ? (
                    <p className="text-sm md:text-sm lg:text-lg text-gray-700 ">
                      {contentwords}{" "}
                      <button
                        onClick={() => setEducationData(false)}
                        className="text-purple-500 hover:underline"
                      >
                        Read Less...
                      </button>
                    </p>
                  ) : (
                    <p className="text-sm md:text-sm lg:text-lg text-gray-700">
                      {contentword}{" "}
                      <button
                        onClick={() => setEducationData(true)}
                        className="text-purple-500 hover:underline"
                      >
                        Read More...
                      </button>
                    </p>
                  )}
                </div>
              ))}
          </div>

          <div className="inline sm:hidden">
            {selectTab === "All News" && (
              <div>
                {industrial?.map((article: NewsArticle, index) => (
                  <div key={index} className="mt-5 mb-5">
                    <Image
                      src={article?.image}
                      width={1900}
                      height={900}
                      priority={true}
                      alt="blogImage"
                      className="rounded-lg"
                    ></Image>
                    <div className="flex items-center gap-5 pt-1 pb-2">
                      <div className="flex justify-center items-center  text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                        {" "}
                        <RiAdminFill />
                        Admin
                      </div>
                      <div className="flex justify-center items-center  text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                        {" "}
                        <MdDateRange />
                        {curretntdate}
                      </div>
                      <div className=" sm:flex hidden  justify-center items-center text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                        {" "}
                        <FaTag />
                        HandeMade
                      </div>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-700 ">
                      <Link
                        className="hover:underline hover:text-purple-500"
                        href={article?.url}
                      >
                        {article?.title}
                      </Link>
                    </h2>
                    {educationData ? (
                      <p className="text-sm md:text-sm lg:text-lg text-gray-700 ">
                        {contentwords}{" "}
                        <button
                          onClick={() => setEducationData(false)}
                          className="text-purple-500 hover:underline"
                        >
                          Read Less...
                        </button>
                      </p>
                    ) : (
                      <p className="text-sm md:text-sm lg:text-lg text-gray-700">
                        {contentword}{" "}
                        <button
                          onClick={() => setEducationData(true)}
                          className="text-purple-500 hover:underline"
                        >
                          Read More...
                        </button>
                      </p>
                    )}
                  </div>
                ))}
                {education?.map((article: NewsArticle, index) => (
                  <div key={index} className="mt-5 mb-5">
                    <Image
                      src={article?.image}
                      width={1900}
                      height={900}
                      priority={true}
                      alt="blogImage"
                      className="rounded-lg"
                    ></Image>
                    <div className="flex items-center gap-5 pt-1 pb-2">
                      <div className="flex justify-center items-center  text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                        {" "}
                        <RiAdminFill />
                        Admin
                      </div>
                      <div className="flex justify-center items-center  text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                        {" "}
                        <MdDateRange />
                        {curretntdate}
                      </div>
                      <div className=" sm:flex hidden  justify-center items-center text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                        {" "}
                        <FaTag />
                        HandeMade
                      </div>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-700 ">
                      <Link
                        className="hover:underline hover:text-purple-500"
                        href={article?.url}
                      >
                        {article?.title}
                      </Link>
                    </h2>
                    {educationData ? (
                      <p className="text-sm md:text-sm lg:text-lg text-gray-700 ">
                        {contentwords}{" "}
                        <button
                          onClick={() => setEducationData(false)}
                          className="text-purple-500 hover:underline"
                        >
                          Read Less...
                        </button>
                      </p>
                    ) : (
                      <p className="text-sm md:text-sm lg:text-lg text-gray-700">
                        {contentword}{" "}
                        <button
                          onClick={() => setEducationData(true)}
                          className="text-purple-500 hover:underline"
                        >
                          Read More...
                        </button>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* ===========================smal device============== */}
          <div className="hidden sm:inline">
            {selectTab === "Industry" &&
              industrial?.map((article: NewsArticle, index) => (
                <div
                  key={index}
                  className="mt-5 flex flex-col md:flex-row gap-2  overflow-hidden"
                >
                  <Image
                    src={article?.image}
                    width={100}
                    height={1300}
                    priority={true}
                    alt="blogImage"
                    className="rounded-lg "
                  ></Image>
                  <div className="">
                    <h2 className="text-lg font-semibold text-gray-700 line-clamp-1">
                      <Link
                        className="hover:underline hover:text-purple-500"
                        href={article?.url}
                      >
                        {article?.title}
                      </Link>
                    </h2>
                    <div className="flex items-center  text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                      {" "}
                      {article?.publishedAt}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="hidden sm:inline">
            {selectTab === "Education" &&
              education?.map((article: NewsArticle, index) => (
                <div
                  key={index}
                  className="mt-5 flex flex-col md:flex-row gap-2 overflow-hidden "
                >
                  <Image
                    src={article?.image}
                    width={100}
                    height={1300}
                    priority={true}
                    alt="blogImage"
                    className="rounded-lg "
                  ></Image>
                  <div className="">
                    <h2 className="text-lg font-semibold text-gray-700 line-clamp-1">
                      <Link
                        className="hover:underline hover:text-purple-500"
                        href={article?.url}
                      >
                        {article?.title}
                      </Link>
                    </h2>
                    <div className="flex items-center  text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                      {" "}
                      {article?.publishedAt}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="hidden sm:inline">
            {selectTab === "All News" &&
              [...industrial, ...education]?.map(
                (article: NewsArticle, index) => (
                  <div
                    key={index}
                    className="mt-5 flex flex-col md:flex-row gap-2 overflow-hidden "
                  >
                    <Image
                      src={article?.image}
                      width={100}
                      height={1300}
                      priority={true}
                      alt="blogImage"
                      className="rounded-lg "
                    ></Image>
                    <div className="">
                      <h2 className="text-lg font-semibold text-gray-700 line-clamp-1">
                        <Link
                          className="hover:underline hover:text-purple-500"
                          href={article?.url}
                        >
                          {article?.title}
                        </Link>
                      </h2>
                      <div className="flex items-center  text-xs sm:text-sm md:text-sm lg:text-lg text-gray-700 ">
                        {" "}
                        {article?.publishedAt}
                      </div>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsComponents;
