import { format } from 'date-fns';
import prismadb from '@/lib/prismadb';

import { QuestionsClient } from './components/client';
import { QuestionColumn } from './components/columns';

const QuestionsPage = async ({ params }: { params: { storeId: string } }) => {
	//Pour montrer l'ensemble des billboard spécifique aux store qui est actif donc besoin
	// D'utiliser le params pour obtenir le store actif
	const questions = await prismadb.question.findMany({
		where: {
			storeId: params.storeId,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const formattedQuestions: QuestionColumn[] = questions.map((item) => ({
		id: item.id,
		question: item.question,
		answer : item.answer,
		createdAt: format(item.createdAt, 'MMMM do, yyyy'),
	}));

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<QuestionsClient data={formattedQuestions} />
			</div>
		</div>
	);
};

export default QuestionsPage;
