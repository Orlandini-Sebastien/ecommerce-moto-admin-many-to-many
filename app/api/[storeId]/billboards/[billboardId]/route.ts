import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request, // Même inutiliser on doit le garder tout de même
	{ params }: { params: { billboardId: string } }
) {
	try {
		if (!params.billboardId) {
			return new NextResponse('Billboard id is required', { status: 400 });
		}

		const billboard = await prismadb.billboard.findUnique({
			where: {
				id: params.billboardId,
			},
		});
		return NextResponse.json(billboard);
	} catch (error) {
		console.log('[BILLBOARD_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; billboardId: string } }
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
			return new NextResponse('Image URL is required', { status: 400 });
		}
		if (!params.billboardId) {
			return new NextResponse('Billboard id is required', { status: 400 });
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

		const billboard = await prismadb.billboard.updateMany({
			where: {
				id: params.billboardId,
			},
			data: {
				label,
				imageURL,
			},
		});
		return NextResponse.json(billboard);
	} catch (error) {
		console.log('[BILLBOARD_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request, // Même inutiliser on doit le garder tout de même
	{ params }: { params: { storeId: string; billboardId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!params.billboardId) {
			return new NextResponse('Billboard id is required', { status: 400 });
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

		const billboard = await prismadb.billboard.deleteMany({
			where: {
				id: params.billboardId,
			},
		});
		return NextResponse.json(billboard);
	} catch (error) {
		console.log('[BILLBOARD_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
