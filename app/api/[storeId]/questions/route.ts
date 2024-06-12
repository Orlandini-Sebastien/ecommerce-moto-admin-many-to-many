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

		const question1 = await prismadb.question.create({
			data: {
				question,
				answer,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(question1);

		// Traitement supplémentaire ici...

		return new NextResponse('Success', { status: 200 });
	} catch (error) {
		console.log('[QUESTION_POST]', error);
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

		const questions = await prismadb.question.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(questions);
	} catch (error) {
		console.log('[QUESTIONS_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
