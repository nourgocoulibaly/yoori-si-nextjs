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
        <div className="flex flex-col overflow-hidden">
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
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
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
