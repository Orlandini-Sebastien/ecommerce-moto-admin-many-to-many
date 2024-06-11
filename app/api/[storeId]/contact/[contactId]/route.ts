import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request, // Même inutiliser on doit le garder tout de même
	{ params }: { params: { contactId: string } }
) {
	try {
		if (!params.contactId) {
			return new NextResponse('Contact id is required', { status: 400 });
		}

		const contact = await prismadb.contact.findUnique({
			where: {
				id: params.contactId,
			},
		});
		return NextResponse.json(contact);
	} catch (error) {
		console.log('[CONTACTID_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; contactId: string } }
) {
	console.log('params >>>>', params);

	try {
		const { userId } = auth();
		const body = await req.json();
		const {
			name,
			imageURL,
			firstname,
			phone,
			mail,
			imageURLPlace,
			adress,
			postal,
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
		if (!phone) {
			return new NextResponse('Phone number is required', { status: 400 });
		}
		if (!mail) {
			return new NextResponse('E-mail is required', { status: 400 });
		}
		if (!imageURL) {
			return new NextResponse('Image URL is required', { status: 400 });
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
		if (!params.contactId) {
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

		const contact = await prismadb.contact.updateMany({
			where: {
				id: params.contactId,
			},
			data: {
				name,
				firstname,
				phone,
				mail,
				imageURL,
				adress,
				postal,
				imageURLPlace,
				country,
			},
		});
		return NextResponse.json(contact);
	} catch (error) {
		console.log('[CONTACT_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request, // Même inutiliser on doit le garder tout de même
	{ params }: { params: { storeId: string; contactId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!params.contactId) {
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

		const contact = await prismadb.contact.deleteMany({
			where: {
				id: params.contactId,
			},
		});
		return NextResponse.json(contact);
	} catch (error) {
		console.log('[CONTACT_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
