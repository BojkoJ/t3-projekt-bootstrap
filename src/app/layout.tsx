import "~/styles/globals.css";

import "bootstrap/dist/css/bootstrap.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import BootstrapClient from "./_components/bootstrap-client";

const inter = Inter({
	subsets: ["latin"],
});

export const metadata = {
	title: "Evidence termínů",
	description: "Projekt URO Bootstrap",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<TRPCReactProvider>
					{children}
					<BootstrapClient />
				</TRPCReactProvider>
			</body>
		</html>
	);
}
