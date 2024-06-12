import prismadb from '@/lib/prismadb';
import {QuestionForm} from './components/question-form';

// on peut récupérer le params car c'est un serveur component
const QuestionPage = async ({
	params,
}: {
	params: { questionId: string };
}) => {
	// On fetch un billborad existant
	const question = await prismadb.question.findUnique({
		where: {
			id: params.questionId,
		},
	});
	return (
		<div className="flex-col">
			<div className="flex-1 spcace-y-4 p-8 pt-6">
                <QuestionForm initalData={question}/>
            </div>
		</div>
	);
};

export default QuestionPage;
