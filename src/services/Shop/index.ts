"use server";

import { cookies } from "next/headers";

export const createShop = async (shopData: FormData) => {
  const token = (await cookies()).get("accessToken")!.value;
  console.log(token);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/shop`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: shopData,
    });

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};
