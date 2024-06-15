import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import prismadb from '@/lib/prismadb';
import NavBar from '@/components/navbar';

export default async function DashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { storeId: string };
}) {
	// Authentification
	const { userId }: { userId: string | null } = auth();
	if (!userId) {
		redirect('/sign-in');
	}
	

	const store = await prismadb.store.findFirst({
		where: {
			id: params.storeId,
			userId,
		},
	});

	if (!store) {
		redirect('/');
	}
	return (
		<>
			<NavBar />
			{children}
		</>
	);
}
