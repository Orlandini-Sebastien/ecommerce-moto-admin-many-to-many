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

		console.log(body);

		const {
			name,
			images,
			categoryId,
			price,
			isFeatured,
			isArchived,

			sizeId,
			colorId,
			description
		} = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!name) {
			return new NextResponse('Name is required', { status: 400 });
		}

		if (!images || images.lenght === 0) {
			return new NextResponse('Images are required', { status: 400 });
		}

		if (!price) {
			return new NextResponse('Price is required', { status: 400 });
		}
		if (!categoryId) {
			return new NextResponse('Category id is required', { status: 400 });
		}
		// if (!sizeId) {
		// 	return new NextResponse('Size id is required', { status: 400 });
		// }
		// if (!colorId) {
		// 	return new NextResponse('Color id is required', { status: 400 });
		// }

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

		console.log('here we go');

		const product = await prismadb.product.create({
			data: {
				name,
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)],
					},
				},
				categoryId,

				price,
				isFeatured,
				isArchived,
				storeId: params.storeId,
				...(colorId && { colorId }),
				...(sizeId && { sizeId }),
				...(description && { description }),
			},
		});

		return NextResponse.json(product);

		// Traitement supplémentaire ici...

		return new NextResponse('Success', { status: 200 });
	} catch (error) {
		console.log('[PRODUCTS_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { searchParams } = new URL(req.url);

		const categoryId = searchParams.get('categoryId') || undefined;
		const colorId = searchParams.get('colorId') || undefined;
		const sizeId = searchParams.get('sizeId') || undefined;
		const isFeatured = searchParams.get('isFeatured');

		if (!params.storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		const products = await prismadb.product.findMany({
			where: {
				storeId: params.storeId,
				categoryId,
				colorId,
				sizeId,
				isFeatured: isFeatured ? true : undefined,
				isArchived: false,
			},
			include: {
				images: true,
				category: true,
				color: true,
				size: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json(products);
	} catch (error) {
		console.log('[PRODUCTS_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
