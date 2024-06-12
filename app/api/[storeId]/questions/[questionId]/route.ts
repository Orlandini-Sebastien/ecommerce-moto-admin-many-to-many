import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request, // Même inutiliser on doit le garder tout de même
	{ params }: { params: { questionId: string } }
) {
	try {
		if (!params.questionId) {
			return new NextResponse('Question id is required', { status: 400 });
		}

		const question = await prismadb.question.findUnique({
			where: {
				id: params.questionId,
			},
		});
		return NextResponse.json(question);
	} catch (error) {
		console.log('[QUESTION_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; questionId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		const { question, answer } = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}
		if (!question) {
			return new NextResponse('Question is required', { status: 400 });
		}
		if (!answer) {
			return new NextResponse('Answer is required', { status: 400 });
		}
		if (!params.questionId) {
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

		const question1 = await prismadb.question.updateMany({
			where: {
				id: params.questionId,
			},
			data: {
				question,
				answer,
			},
		});
		return NextResponse.json(question1);
	} catch (error) {
		console.log('[QUESTION_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request, // Même inutiliser on doit le garder tout de même
	{ params }: { params: { storeId: string; questionId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!params.questionId) {
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

		const question = await prismadb.question.deleteMany({
			where: {
				id: params.questionId,
			},
		});
		return NextResponse.json(question);
	} catch (error) {
		console.log('[QUESTION_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
