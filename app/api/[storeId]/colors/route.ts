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

		const { name, value } = body;
		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}
		if (!name) {
			return new NextResponse('Name is required', { status: 400 });
		}
		if (!value) {
			return new NextResponse('Value is required', { status: 400 });
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

		const color = await prismadb.color.create({
			data: {
				name,
				value,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(color);

		// Traitement supplémentaire ici...

		return new NextResponse('Success', { status: 200 });
	} catch (error) {
		console.log('[COLORS_POST]', error);
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

		const colors = await prismadb.color.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(colors);
	} catch (error) {
		console.log('[COLORS_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
