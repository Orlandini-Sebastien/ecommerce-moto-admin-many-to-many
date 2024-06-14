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

		const { source, link } = body;
		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}
		if (!source) {
			return new NextResponse('Source is required', { status: 400 });
		}
		if (!link) {
			return new NextResponse('Link is required', { status: 400 });
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

		const review = await prismadb.review.create({
			data: {
				source,
				link,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(review);

		// Traitement supplémentaire ici...

		return new NextResponse('Success', { status: 200 });
	} catch (error) {
		console.log('[REVIEW_POST]', error);
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

		const reviews = await prismadb.review.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(reviews);
	} catch (error) {
		console.log('[REVIEWS_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
