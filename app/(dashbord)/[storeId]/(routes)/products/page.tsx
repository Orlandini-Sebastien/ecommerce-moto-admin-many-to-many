import { format } from 'date-fns';
import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';

import { ProductClient } from './components/client';
import { ProductColumn } from './components/columns';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
	//Pour montrer l'ensemble des product spécifique aux store qui est actif donc besoin
	// D'utiliser le params pour obtenir le store actif
	const products = await prismadb.product.findMany({
		where: {
			storeId: params.storeId,
		},
		//On polulate
		include: {
			categories: {
				include: { category: true },
			},
			size: true,
			color: true,
		},
		// ---
		orderBy: {
			createdAt: 'desc',
		},
	});



	const formattedProducts: ProductColumn[] = products.map((item) => {
		const categories = item.categories.map((cat) => ({
			id: cat.category.id,
			name: cat.category.name,
		}));

		return {
			id: item.id,
			name: item.name,
			isFeatured: item.isFeatured,
			isArchived: item.isArchived,
			price: formatter.format(item.price),
			categories: categories,
			size: item?.size?.name,
			color: item?.color?.value,
			createdAt: format(item.createdAt, 'MMMM do, yyyy'),
		};
	});



	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ProductClient data={formattedProducts} />
			</div>
		</div>
	);
};

export default ProductsPage;
