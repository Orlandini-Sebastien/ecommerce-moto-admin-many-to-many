import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request, // Même inutiliser on doit le garder tout de même
	{ params }: { params: { reviewId: string } }
) {
	try {
		if (!params.reviewId) {
			return new NextResponse('Testimony id is required', { status: 400 });
		}

		const review = await prismadb.review.findUnique({
			where: {
				id: params.reviewId,
			},
		});
		return NextResponse.json(review);
	} catch (error) {
		console.log('[REVIEW_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; reviewId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		const { source, link } = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}
		if (!source) {
			return new NextResponse('Name is required', { status: 400 });
		}
		if (!link) {
			return new NextResponse('link is required', { status: 400 });
		}
		if (!params.reviewId) {
			return new NextResponse('Size id is required', { status: 400 });
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

		const review = await prismadb.review.updateMany({
			where: {
				id: params.reviewId,
			},
			data: {
				source,
				link,
			},
		});
		return NextResponse.json(review);
	} catch (error) {
		console.log('[REVIEW_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request, // Même inutiliser on doit le garder tout de même
	{ params }: { params: { storeId: string; reviewId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!params.reviewId) {
			return new NextResponse('Testimony id is required', { status: 400 });
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

		const review = await prismadb.review.deleteMany({
			where: {
				id: params.reviewId,
			},
		});
		return NextResponse.json(review);
	} catch (error) {
		console.log('[REVIEW_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
