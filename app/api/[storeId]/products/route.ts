import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'; // Notez l'utilisation de /server

import prismadb from '@/lib/prismadb';

function separateCategoryIds(categoryId: string) {
	// Supprimer les espaces blancs en début et fin de la chaîne, puis séparer par virgule
	return categoryId
		.trim()
		.split(',')
		.map((id) => id.trim())
		.filter((id) => id !== '');
}

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
			description,
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

		//Conversion de la chaine string de id en un tableau

		const separatedCategoryIds = separateCategoryIds(categoryId);

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
				price,
				isFeatured,
				isArchived,
				storeId: params.storeId,
				...(colorId && { colorId }),
				...(sizeId && { sizeId }),
				...(description && { description }),
			},
		});

		const productCategories = await prismadb.productCategory.createMany({
			data: separatedCategoryIds.map((categoryId) => ({
				productId: product.id,
				categoryId: categoryId,
			})),
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

		const categories = searchParams.get('categories') || undefined;
		const colorId = searchParams.get('colorId') || undefined;
		const sizeId = searchParams.get('sizeId') || undefined;
		const isFeatured = searchParams.get('isFeatured');

		if (!params.storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		const products = await prismadb.product.findMany({
			where: {
				storeId: params.storeId,
				colorId,
				sizeId,
				isFeatured: isFeatured ? true : undefined,
				isArchived: false,
			},
			include: {
				images: true,
				categories: true,
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
