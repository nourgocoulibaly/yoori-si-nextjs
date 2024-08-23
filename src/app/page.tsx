"use client";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import { useEffect } from "react";

import { Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";


export default function HeroScrollDemo() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div>
  <Navbar className="top-2" />
  <div className="flex flex-col items-center overflow-hidden">
    <ContainerScroll
      titleComponent={
        <>
          <div className="flex justify-center items-center space-x-4 mb-6 mt-[-2rem]">
            <Image
              src={`/mclu-logo.png`}
              className="w-40 h-auto"
              width={160}
              height={160}
              alt="Logo MCLU"
              loading="lazy"
            />
            <Image
              src={`/logo-sigfu.png`}
              className="w-40 h-auto my-6"
              width={160}
              height={160}
              alt="Logo SIGFU"
              loading="lazy"
            />
          </div>
          <h1 className="text-4xl font-semibold text-black dark:text-white text-center">
            Bienvenue !✌️ <br />
            <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
              Ravie de vous voir.
            </span>
          </h1>
        </>
      }
    >
      <Image
        src={`/tabscreen.webp`}
        alt="hero"
        height={720}
        width={1400}
        className="mx-auto rounded-2xl object-cover h-full object-left-top"
        draggable={false}
      />
    </ContainerScroll>
  </div>
</div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-5 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>    
        <MenuItem setActive={setActive} active={active} item="Se Connecter">
          <div className="  text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Utilisateur"
              href="/userAuth"
              src={`/user.webp`}
              description="Connectez-vous en tant qu'utilisateur."
            />
            <ProductItem
              title="Administrateur"
              href="/adminAuth"
              src={`/admin.webp`}
              description="Connectez-vous en tant qu'administrateur."
            />
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}