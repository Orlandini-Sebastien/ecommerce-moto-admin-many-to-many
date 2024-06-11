import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request, // Même inutiliser on doit le garder tout de même
	{ params }: { params: { testimonyId: string } }
) {
	try {
		if (!params.testimonyId) {
			return new NextResponse('Testimony id is required', { status: 400 });
		}

		const testimony = await prismadb.testimony.findUnique({
			where: {
				id: params.testimonyId,
			},
		});
		return NextResponse.json(testimony);
	} catch (error) {
		console.log('[TESTIMONY_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; testimonyId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		const { name, description } = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}
		if (!name) {
			return new NextResponse('Name is required', { status: 400 });
		}
		if (!description) {
			return new NextResponse('Description is required', { status: 400 });
		}
		if (!params.testimonyId) {
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

		const testimony = await prismadb.testimony.updateMany({
			where: {
				id: params.testimonyId,
			},
			data: {
				name,
				description,
			},
		});
		return NextResponse.json(testimony);
	} catch (error) {
		console.log('[TESTIMONY_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request, // Même inutiliser on doit le garder tout de même
	{ params }: { params: { storeId: string; testimonyId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!params.testimonyId) {
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

		const testimony = await prismadb.testimony.deleteMany({
			where: {
				id: params.testimonyId,
			},
		});
		return NextResponse.json(testimony);
	} catch (error) {
		console.log('[TESTIMONY_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
