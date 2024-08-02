import { CalendarIcon } from "@radix-ui/react-icons";
import { BellIcon, LayoutDashboard, Share2Icon } from "lucide-react";
import Image from "next/image";

import AnimatedBeamMultipleOutputDemo from "@/components/example/animated-beam-multiple-outputs";
import AnimatedListDemo from "@/components/example/animated-list-demo";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import Marquee from "@/components/magicui/marquee";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const files = [
  {
    name: "intervention 1.pdf",
    body: "Je rencontre un probleme avec mon ordinateur.",
  },
  {
    name: "intervention 2.pdf",
    body: "Je n'ai plus acces a internet.",
  },
  {
    name: "intervention 3.pdf",
    body: "Je n'ai plus acces au SIF.",
  },
  {
    name: "intervention 4.pdf",
    body: "J'ai oublie mon mot de passe.",
  },
  {
    name: "intervention 5.pdf",
    body: "Mon ordinateur ne demarre plus.",
  },
];

const features = [
  {
    Icon: LayoutDashboard,
    name: "Dashboard",
    description: "Acceder au tableau de bord Administrateur.",
    href: "/adminDashboard",
    cta: "Acceder",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none",
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white ">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: BellIcon,
    name: "Liste des Interventions",
    description: "Gerer les demandes d'interventions.",
    href: "/adminRequests",
    cta: "Acceder",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedListDemo className="absolute right-2 top-4 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    Icon: Share2Icon,
    name: "Nouvelle Demande d'Intervention",
    description: "Creer une nouvelle demande d'intervention.",
    href: "/adminRequests/requestForm",
    cta: "Acceder",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedBeamMultipleOutputDemo className="absolute right-2 top-4 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    Icon: CalendarIcon,
    name: "Historique",
    description: "Gerer l'historique des demandes d'interventions.",
    className: "col-span-3 lg:col-span-1",
    href: "/adminRequests/history",
    cta: "Acceder",
    background: (
      <Calendar
        mode="single"
        selected={new Date(2022, 4, 11, 0, 0, 0)}
        className="absolute right-0 top-10 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105"
      />
    ),
  },
];

export default function BentoDemo() {
  return (
    // <div className="flex items-center justify-center min-h-screen dark:bg-gray-900 dark">

    <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-900">
  <Image
    src={`/yoori-si-large.png`}
    className="w-32 h-auto my-8"
    alt="Logo Yoori Link"
    loading="lazy"
  />
  <div className="w-full max-w-4xl">
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  </div>
</div>
  );
}