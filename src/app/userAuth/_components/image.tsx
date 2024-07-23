import Image from "next/image";

export default function Img() {
	return (
		<div className='hidden bg-muted lg:block'>
			<Image
				src='/vercel.svg'
				alt='Image'
				width='1920'
				height='1080'
				className='h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
			/>
		</div>
	);
}
