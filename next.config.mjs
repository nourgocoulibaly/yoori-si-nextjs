/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",

	images: {
		domains: ["pbs.twimg.com"],
		unoptimized: true,
	},

	reactStrictMode: true,
	swcMinify: true,
};

export default nextConfig;
