import { format } from 'date-fns';
import prismadb from '@/lib/prismadb';

import { TestimoniesClient } from './components/client';
import { TestimonyColumn } from './components/columns';

const TestimoniesPage = async ({ params }: { params: { storeId: string } }) => {
	//Pour montrer l'ensemble des billboard spécifique aux store qui est actif donc besoin
	// D'utiliser le params pour obtenir le store actif
	const testimonies = await prismadb.testimony.findMany({
		where: {
			storeId: params.storeId,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const formattedTestimonies: TestimonyColumn[] = testimonies.map((item) => ({
		id: item.id,
		name: item.name,
		description : item.description,
		createdAt: format(item.createdAt, 'MMMM do, yyyy'),
	}));

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<TestimoniesClient data={formattedTestimonies} />
			</div>
		</div>
	);
};

export default TestimoniesPage;
