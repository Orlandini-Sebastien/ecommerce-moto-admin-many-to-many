import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import prismadb from '@/lib/prismadb';

export default async function SetupLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	//Rediretion s'il n'y a pas de user
	const { userId } = auth();
	if (!userId) {
		redirect('/sign-in');
	}
	// ---------------------------------

	//On cherche un store
	const store = await prismadb.store.findFirst({
		where: {
			userId,
		},
	});

	if (store) {
		redirect(`/${store.id}`);
	}

	return <>{children}</>;
}
