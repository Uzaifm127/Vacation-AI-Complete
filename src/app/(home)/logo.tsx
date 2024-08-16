"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Redirect from "@/components/ui/icons/redirect";

const Logo = () => {
  const router = useRouter();

  return (
    <header id="logo" className="absolute z-[1] top-[3%] left-[5%] sm:left-[2%]">
      <h2 className="font-medium text-lg sm:text-2xl md:text-3xl pointer-events-none">Vacation.AI</h2>
      <div
        className="flex hover:underline transition text-[10px] sm:text-sm items-center cursor-pointer justify-end ml-auto mt-2"
        onClick={() => router.push("https://uzaifm127.vercel.app")}
      >
        <h4 className="mr-1">by Uzaif</h4>
        <Redirect />
      </div>
    </header>
  );
};

export default Logo;
