import prismadb from '@/lib/prismadb';
import {TestimonyForm} from './components/testimony-form';

// on peut récupérer le params car c'est un serveur component
const TestimonyPage = async ({
	params,
}: {
	params: { testimonyId: string };
}) => {
	// On fetch un billborad existant
	const testimony = await prismadb.testimony.findUnique({
		where: {
			id: params.testimonyId,
		},
	});
	return (
		<div className="flex-col">
			<div className="flex-1 spcace-y-4 p-8 pt-6">
                <TestimonyForm initalData={testimony}/>
            </div>
		</div>
	);
};

export default TestimonyPage;
