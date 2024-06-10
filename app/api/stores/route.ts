import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server'; // Notez l'utilisation de /server
import { NextRequest } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(req: NextRequest) {
	try {
		const { userId } = getAuth(req);
		const body = await req.json();

		const { name } = body;
		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		if (!name) {
			return new NextResponse('Name is required', { status: 400 });
		}

		const store = await prismadb.store.create({
			data: {
				name,
				userId,
			},
		});

		return NextResponse.json(store);

		// Traitement supplémentaire ici...

		return new NextResponse('Success', { status: 200 });
	} catch (error) {
		console.log('[STORES_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
