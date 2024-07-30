"use client"

import React from "react";
import { PinContainer } from "@/components/ui/3d-pin";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
	Activity,
	ArrowUpRight,
	CreditCard,
	DollarSign,
	Users,
} from "lucide-react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserDashboardContent() {
	const router = useRouter();

	return (
		<>
			<main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
			<div className="h-[40rem] w-full flex items-center justify-center ">
				<PinContainer
					title="Demande d'Intervention"
					href="/formRequest"
				>
					<div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
					<h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
						Demande d'Intervention
					</h3>
					<div className="text-base !m-0 !p-0 font-normal">
						<span className="text-slate-500 ">
						Envoyer une nouvelle demande d'intervention.
						</span>
					</div>
					<div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
					</div>
				</PinContainer>
				</div>
			</main>
		</>
	);
}