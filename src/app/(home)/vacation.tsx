"use client";

import Destination from "@/components/destination";
import VacationDetails from "@/components/vacation-details";
import { Form } from "@/components/ui/form";
import React, { ReactNode, useCallback, useRef, useState } from "react";
import { VacationSchema } from "@/types";
import { vacationSchema } from "@/lib/validator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { inriaSerif } from "@/lib/font";
import BgVector from "@/components/ui/icons/bg-vector";
import VacationResponse from "@/components/vacation-response";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const Vacation = () => {
  const [response, setResponse] = useState();

  const contentType = useStore((state) => state.contentType);
  const changeContent = useStore((state) => state.changeContent);
  const responseLoading = useStore((state) => state.responseLoading);
  const setResponseLoading = useStore((state) => state.setResponseLoading);

  const vacationForm = useForm<z.infer<typeof vacationSchema>>({
    resolver: zodResolver(vacationSchema),
    mode: "onSubmit",
    defaultValues: {
      destination: "",
      reason: "",
    },
  });

  const { toast } = useToast();

  const headingRef = useRef<ReactNode>(<></>);
  const vacationRef = useRef<ReactNode>(<></>);

  const onSubmit = useCallback(
    async (values: VacationSchema) => {
      try {
        const { destination, startDate, endDate, reason } = values;

        if (new Date(startDate) > new Date(endDate)) {
          toast({
            description: "Start Date must be lower than End Date.",
          });
          return;
        }

        changeContent("vacation");

        setResponseLoading(true);

        const { data } = await axios.post("/api/ai/ask", {
          destination,
          endDate,
          reason,
          startDate,
        });

        setResponseLoading(false);

        setResponse(data.plan.itinerary);
      } catch (error) {
        toast({
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    },
    [changeContent, setResponseLoading, toast]
  );

  if (contentType === "destination") {
    headingRef.current = (
      <h1
        className={cn(
          inriaSerif.className,
          `text-center text-3xl sm:text-5xl mx-5 md:text-6xl mb-2`
        )}
      >
        Let’s plan your vacation
      </h1>
    );
    vacationRef.current = <Destination vacationForm={vacationForm} />;
  } else if (contentType === "vacationDetail") {
    headingRef.current = (
      <h1
        className={cn(
          inriaSerif.className,
          `text-center text-3xl md:text-4xl lg:text-5xl mx-5 mt-32 xl:mt-10`
        )}
      >
        Tell us more about your vacation
      </h1>
    );
    vacationRef.current = <VacationDetails vacationForm={vacationForm} />;
  } else {
    headingRef.current = (
      <h1
        className={cn(
          inriaSerif.className,
          `text-center text-3xl md:text-4xl max-[900px]:mt-20 lg:text-5xl mt-10`
        )}
      >
        Here’s your itinerary
      </h1>
    );
    vacationRef.current = (
      <VacationResponse
        isLoading={responseLoading}
        vacationForm={vacationForm}
        response={response}
      />
    );
  }

  return (
    <main className="h-screen relative overflow-hidden w-full flex items-center justify-center">
      <div className="absolute">
        <div className="h-full top-0 absolute w-full">
          <div
            style={{ background: "url(/light-noise.png)" }}
            className="h-1/2 w-full bg-cover absolute top-0 opacity-30 bg-center bg-no-repeat"
          ></div>
          <div
            style={{ background: "url(/noiseTexture.png)" }}
            className="h-1/2 w-full bg-cover absolute opacity-20 top-1/2 bg-center bg-no-repeat"
          ></div>
        </div>
        <BgVector className="rotate-[-27.77]" />
      </div>
      <section className="flex absolute z-[1] flex-col items-center justify-center">
        {headingRef.current && headingRef.current}
        <Form {...vacationForm}>
          <form
            onSubmit={vacationForm.handleSubmit(onSubmit)}
            className={`my-10 ${
              contentType === "vacationDetail" &&
              "w-[80vw] md:w-[30rem] lg:w-[40rem]"
            }`}
          >
            {vacationRef.current}
          </form>
        </Form>
      </section>
    </main>
  );
};

export default Vacation;
