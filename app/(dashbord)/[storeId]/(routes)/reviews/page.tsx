import { format } from 'date-fns';
import prismadb from '@/lib/prismadb';

import { ReviewsClient } from './components/client';
import { ReviewColumn } from './components/columns';

const ReviewsPage = async ({ params }: { params: { storeId: string } }) => {
	//Pour montrer l'ensemble des billboard spécifique aux store qui est actif donc besoin
	// D'utiliser le params pour obtenir le store actif
	const reviews = await prismadb.review.findMany({
		where: {
			storeId: params.storeId,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const formattedReviews: ReviewColumn[] = reviews.map((item) => ({
		id: item.id,
		source: item.source,
		link : item.link,
		createdAt: format(item.createdAt, 'MMMM do, yyyy'),
	}));

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ReviewsClient data={formattedReviews} />
			</div>
		</div>
	);
};

export default ReviewsPage;
