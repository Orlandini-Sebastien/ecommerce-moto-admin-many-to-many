import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request, // Même inutiliser on doit le garder tout de même
	{ params }: { params: { aboutId: string } }
) {
	try {
		if (!params.aboutId) {
			return new NextResponse('About id is required', { status: 400 });
		}

		const about = await prismadb.about.findUnique({
			where: {
				id: params.aboutId,
			},
		});
		return NextResponse.json(about);
	} catch (error) {
		console.log('[ABOUTID_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; aboutId: string } }
) {
	console.log('params >>>>', params);

	try {
		const { userId } = auth();
		const body = await req.json();
		const {
			introduction,
			history,
			team,
			services,
			personnalMotivation,
			putForward,
			value,
			introPicture,
			historyPicture,
			teamPicture,
			servicesPicture,
			personnalMotivationPicture,
			putForwardPicture,
			valuePicture,
		} = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!params.aboutId) {
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

		const about = await prismadb.about.updateMany({
			where: {
				id: params.aboutId,
			},
			data: {
				introduction,
				history,
				team,
				services,
				personnalMotivation,
				putForward,
				value,
				introPicture,
				historyPicture,
				teamPicture,
				servicesPicture,
				personnalMotivationPicture,
				putForwardPicture,
				valuePicture,
			},
		});
		return NextResponse.json(about);
	} catch (error) {
		console.log('[ABOUT_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request, // Même inutiliser on doit le garder tout de même
	{ params }: { params: { storeId: string; aboutId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!params.aboutId) {
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

		const about = await prismadb.about.deleteMany({
			where: {
				id: params.aboutId,
			},
		});
		return NextResponse.json(about);
	} catch (error) {
		console.log('[ABOUT_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
