"use client";
import { Button } from "@/components/ui/button";
import NMImageUploader from "@/components/ui/core/NMImageUploader";
import ImagePreviewer from "@/components/ui/core/NMImageUploader/ImagePriviewer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { updateProfile } from "@/services/authService";
import { getAllUsers } from "@/services/User";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UpdateProfileStudent = () => {
  const [imageFiels, setImageFiels] = useState<File[] | []>([]);
  const [imagePreview, setImagePreview] = useState<string[] | []>([]);

  const [currentUser, setCurrentUsers] = useState<any>("");

  const { user } = useUser();

  const form = useForm({
    defaultValues: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phoneNumber: currentUser?.phoneNumber || "",
      bio: currentUser?.bio || "",

      profileImage: currentUser?.profileImage || "",
    },
  });
  const {
    formState: { isSubmitting },
  } = form;

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.userEmail) return;
        const data = await getAllUsers();
        if (data?.data) {
          const foundUser = data.data.find(
            (item: any) => item.email === user?.userEmail
          );
          setCurrentUsers(foundUser);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        phoneNumber: currentUser?.phoneNumber || "",
        bio: currentUser?.bio || "",

        profileImage: currentUser?.profileImage,
      });
    }
  }, [currentUser, form]);

  const onSubmit = async () => {
    try {
      const formdata = new FormData();
      formdata.append("file", imageFiels[0] as File);

      const res = await updateProfile(formdata, currentUser?._id);

      if (res.success) {
        toast.success(res?.message);
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex-grow  max-w-md p-5 rounded">
      <div className="mb-5">Update Profile</div>
      <div className="flex flex-col items-center mb-5 ">
        {" "}
        <div className="flex items-center justify-center ">
          {imagePreview.length > 0 ? (
            <ImagePreviewer
              setImagePreview={setImagePreview}
              setImageFiels={setImageFiels}
              imagePreview={imagePreview}
              className="mt-5"
            />
          ) : (
            <NMImageUploader
              setImagePreview={setImagePreview}
              setImageFiels={setImageFiels}
              label="Profile Image"
              className="mt-5"
            />
          )}
        </div>
        <div className=" w-2/5 flex flex-grow flex-col space-y-1  mt-2">
          <Button
            onClick={onSubmit}
            className=" cursor-pointer border-0 hover:border btn bg-gray-300 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ..."
            type="submit"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="border border-gray-400 "
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mt-2">Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="border border-gray-400  "
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default UpdateProfileStudent;
