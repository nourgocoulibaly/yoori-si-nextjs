/**
 * v0 by Vercel.
 * @see https://v0.dev/t/qmXWmAYuRRN
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import Link from "next/link";

import { LinkedinIcon } from "lucide-react";
import Image from "next/image";


export default function Footer() {
  return (
    <footer className='flex flex-col items-center gap-4 border-t bg-background px-4 py-px mt-12 md:flex-row md:justify-between'>
      <Link
            href="/home"
            className='flex items-center gap-2 text-lg font-semibold md:text-base'
          >
         <Image
            src={`/YooriLink.png`}
            className="w-16 h-auto md:w-20"
            width={64}
            height={64}
            alt="Logo Yoori Link"
            loading="lazy"
          />
          <span className='sr-only'>Yoori SI</span>
        </Link>
      <nav className="italic text-xs text-center mt-4 md:mt-0">
        Copyright © 2024 Par COULIBALY Nourgo Fantiele. Tous droits réservés
      </nav>
      <div className="flex items-center justify-center gap-4 mt-4 md:mt-0">
        <Link
          href="https://www.linkedin.com/in/nourgo-fantiele-coulibaly-773a442b0/"
          className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 shadow-sm hover:scale-110 transition-transform"
          prefetch={false}
        >
          <span className="sr-only">LinkedIn</span>
          <LinkedinIcon className="w-4 h-4" />
        </Link>
        <Link
          href="https://github.com/nourgocoulibaly"
          className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 shadow-sm hover:scale-110 transition-transform"
          prefetch={false}
        >
          <span className="sr-only">GitHub</span>
          <GithubIcon className="w-4 h-4" />
        </Link>
        <Link
          href="#"
          className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 shadow-sm hover:scale-110 transition-transform"
          prefetch={false}
        >
          <span className="sr-only">Portfolio</span>
          <PlayIcon className="w-4 h-4" />
        </Link>
      </div>
    </footer>
  )
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}


function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  )
}


function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}
