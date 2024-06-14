import prismadb from '@/lib/prismadb';
import {ReviewForm} from './components/review-form';

// on peut récupérer le params car c'est un serveur component
const ReviewPage = async ({
	params,
}: {
	params: { reviewId: string };
}) => {
	// On fetch un billborad existant
	const review = await prismadb.review.findUnique({
		where: {
			id: params.reviewId,
		},
	});
	return (
		<div className="flex-col">
			<div className="flex-1 spcace-y-4 p-8 pt-6">
                <ReviewForm initalData={review}/>
            </div>
		</div>
	);
};

export default ReviewPage;
