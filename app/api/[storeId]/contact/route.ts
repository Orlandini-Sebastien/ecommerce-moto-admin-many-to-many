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

		const {
			name,
			firstname,
			mail,
			phone,
			imageURL,
			imageURLPlace,
			postal,
			adress,
			country,
		} = body;
		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}
		if (!name) {
			return new NextResponse('Name is required', { status: 400 });
		}
		if (!firstname) {
			return new NextResponse('Firstname is required', { status: 400 });
		}
		if (!mail) {
			return new NextResponse('E-mail is required', { status: 400 });
		}
		if (!phone) {
			return new NextResponse('Phone is required', { status: 400 });
		}
		if (!imageURL) {
			return new NextResponse('image URL is required', { status: 400 });
		}
		if (!imageURLPlace) {
			return new NextResponse('image URL Place is required', { status: 400 });
		}
		if (!country) {
			return new NextResponse('Country is required', { status: 400 });
		}
		if (!adress) {
			return new NextResponse('Adress is required', { status: 400 });
		}
		if (!postal) {
			return new NextResponse('Postal is required', { status: 400 });
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

		const contact = await prismadb.contact.create({
			data: {
				name,
				firstname,
				mail,
				phone,
				imageURL,
				adress,
				postal,
				imageURLPlace,
				country,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(contact);

		// Traitement supplémentaire ici...

		return new NextResponse('Success', { status: 200 });
	} catch (error) {
		console.log('[CONTACT_POST]', error);
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

		const contact = await prismadb.contact.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(contact);
	} catch (error) {
		console.log('[CONTACT_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
