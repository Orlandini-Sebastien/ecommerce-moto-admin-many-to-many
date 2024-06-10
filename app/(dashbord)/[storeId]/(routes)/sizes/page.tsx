import { format } from 'date-fns';
import prismadb from '@/lib/prismadb';

import { SizesClient } from './components/client';
import { SizeColumn } from './components/columns';

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
	//Pour montrer l'ensemble des billboard spécifique aux store qui est actif donc besoin
	// D'utiliser le params pour obtenir le store actif
	const sizes = await prismadb.size.findMany({
		where: {
			storeId: params.storeId,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const formattedSizes: SizeColumn[] = sizes.map((item) => ({
		id: item.id,
		name: item.name,
		value : item.value,
		createdAt: format(item.createdAt, 'MMMM do, yyyy'),
	}));

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<SizesClient data={formattedSizes} />
			</div>
		</div>
	);
};

export default SizesPage;
