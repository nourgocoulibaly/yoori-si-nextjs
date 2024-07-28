"use client";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { KeyRound } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";


export default function HeroScrollDemo() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="flex flex-col overflow-hidden">
      <Link href="/userAuth">
        <KeyRound /> Connectez-Vous 
      </Link>
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Bienvenue !✌️ <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Ravie de vous voire.
              </span>
            </h1>
          </>
        }
      >
        <Image
          src={`/linear.webp`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}