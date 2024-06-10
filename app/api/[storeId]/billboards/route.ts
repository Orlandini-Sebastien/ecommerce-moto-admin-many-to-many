import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'; // Notez l'utilisation de /server

import prismadb from '@/lib/prismadb';

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();

		const { label, imageURL } = body;
		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}
		if (!label) {
			return new NextResponse('Label is required', { status: 400 });
		}
		if (!imageURL) {
			return new NextResponse('image URL is required', { status: 400 });
		}
		if (!params.storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		// Verification si le storeId existe pour le user
		// Le user peut aller que sur son store et pas sur les autre d'autre user
		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});
		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 403 });
		}
		// -------------------------------------------

		const billboard = await prismadb.billboard.create({
			data: {
				label,
				imageURL,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(billboard);

		// Traitement supplémentaire ici...

		return new NextResponse('Success', { status: 200 });
	} catch (error) {
		console.log('[BILLBOARD_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		if (!params.storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		const billboards = await prismadb.billboard.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(billboards);
	} catch (error) {
		console.log('[BILLBOARDS_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
