import { format } from 'date-fns';
import prismadb from '@/lib/prismadb';

import { BillboardClient } from './components/client';
import { BillboardColumn } from './components/columns';

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
	//Pour montrer l'ensemble des billboard spécifique aux store qui est actif donc besoin
	// D'utiliser le params pour obtenir le store actif
	const billboards = await prismadb.billboard.findMany({
		where: {
			storeId: params.storeId,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
		id: item.id,
		label: item.label,
		createdAt: format(item.createdAt, 'MMMM do, yyyy'),
	}));

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<BillboardClient data={formattedBillboards} />
			</div>
		</div>
	);
};

export default BillboardsPage;
