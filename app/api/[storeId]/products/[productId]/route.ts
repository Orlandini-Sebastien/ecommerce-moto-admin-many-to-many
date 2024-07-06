import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

function separateCategoryIds(categoryId: string) {
	// Supprimer les espaces blancs en début et fin de la chaîne, puis séparer par virgule
	return categoryId
		.trim()
		.split(',')
		.map((id) => id.trim())
		.filter((id) => id !== '');
}

export async function GET(
	req: Request, // Même inutiliser on doit le garder tout de même
	{ params }: { params: { productId: string } }
) {
	try {
		if (!params.productId) {
			return new NextResponse('Product id is required', { status: 400 });
		}

		const product = await prismadb.product.findUnique({
			where: {
				id: params.productId,
			},
			include: {
				images: true,
				categories: true,
				size: true,
				color: true,
			},
		});
		return NextResponse.json(product);
	} catch (error) {
		console.log('[PRODUCT_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; productId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		const {
			name,
			price,
			categoryId,
			colorId,
			sizeId,
			images,
			isFeatured,
			isArchived,
			description,
		} = body;

		console.log('>>>>>>>>>>>> body <<<<<<<<<<<<<<<<<', body);

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}
		if (!name) {
			return new NextResponse('Name is required', { status: 400 });
		}
		// if (!images || images.length === 0) {
		// 	return new NextResponse('Images are required', { status: 400 });
		// }
		if (!price) {
			return new NextResponse('Price is required', { status: 400 });
		}
		if (!categoryId) {
			return new NextResponse('Category id is required', { status: 400 });
		}

		const separatedCategoryIds = separateCategoryIds(categoryId);

		console.log('array >>>>>>>>>>', separateCategoryIds);

		if (!params.productId) {
			return new NextResponse('Product id is required', { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});
		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 403 });
		}

		// Update the product details
		const updatedProduct = await prismadb.product.update({
			where: {
				id: params.productId,
			},
			data: {
				name,
				price,
				colorId,
				sizeId,
				description,
				isFeatured,
				isArchived,
			},
		});

		// Delete existing product images and add the new ones
		await prismadb.image.deleteMany({
			where: {
				productId: params.productId,
			},
		});
		await prismadb.image.createMany({
			data: images.map((image: { url: string }) => ({
				url: image.url,
				productId: params.productId,
			})),
		});

		// Delete existing product categories and add the new ones
		await prismadb.productCategory.deleteMany({
			where: {
				productId: params.productId,
			},
		});
		await prismadb.productCategory.createMany({
			data: separatedCategoryIds.map((categoryId) => ({
				productId: params.productId,
				categoryId: categoryId,
			})),
		});

		return NextResponse.json(updatedProduct);
	} catch (error) {
		console.log('[PRODUCT_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request, // Même inutiliser on doit le garder tout de même
	{ params }: { params: { storeId: string; productId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!params.productId) {
			return new NextResponse('Product id is required', { status: 400 });
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

		// Supprimer les entrées dans la table de jointure
		const deleteProductCategories = await prismadb.productCategory.deleteMany({
			where: {
				productId: params.productId,
			},
		});
		const product = await prismadb.product.deleteMany({
			where: {
				id: params.productId,
			},
		});
		return NextResponse.json(product);
	} catch (error) {
		console.log('[PRODUCT_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
