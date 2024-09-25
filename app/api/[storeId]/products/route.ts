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

		// Ajout de logs pour vérifier le contenu du body
		console.log('Body:', body);

		const {
			name,
			images,
			categoryId,
			price,
			isFeatured,
			isArchived,
			stock,
			sizeId,
			colorId,
			description,
		} = body;

		// Vérification de l'authentification
		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		// Vérification des champs obligatoires
		if (!name) {
			return new NextResponse('Name is required', { status: 400 });
		}

		if (!images || images.length === 0) {
			return new NextResponse('Images are required', { status: 400 });
		}

		if (!price) {
			return new NextResponse('Price is required', { status: 400 });
		}

		if (!categoryId) {
			return new NextResponse('Category id is required', { status: 400 });
		}

		if (!params.storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		// Conversion de la chaine string de ids en un tableau
		const separatedCategoryIds = separateCategoryIds(categoryId);

		// Vérification si le storeId existe pour cet utilisateur
		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 403 });
		}

		// Vérification finale avant création
		console.log('Creating product with data:', {
			name,
			stock,
			price,
			colorId,
			sizeId,
			description,
			storeId: params.storeId,
		});

		// Création du produit
		const product = await prismadb.product.create({
			data: {
				name,
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)],
					},
				},
				stock,
				price,
				isFeatured,
				isArchived,
				storeId: params.storeId,
				...(colorId && { colorId }),
				...(sizeId && { sizeId }),
				...(description && { description }),
			},
		});

		// Création des catégories associées au produit
		const productCategories = await prismadb.productCategory.createMany({
			data: separatedCategoryIds.map((categoryId) => ({
				productId: product.id,
				categoryId: categoryId,
			})),
		});

		// Retour du produit créé
		return NextResponse.json(product);
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
		const colorId = searchParams.get('colorId') || undefined;
		const sizeId = searchParams.get('sizeId') || undefined;
		const isFeatured = searchParams.get('isFeatured');
		const name = searchParams.get('name') || undefined;

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
				name: name
					? {
							contains: name,
							mode: 'insensitive',
					  }
					: undefined,
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

		const response = NextResponse.json(products);
		response.headers.set('Access-Control-Allow-Origin', '*');
		response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

		return response;
	} catch (error) {
		console.log('[PRODUCTS_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
