import prismadb from '@/lib/prismadb';
import { CategoryForm } from './components/category-form';

// on peut récupérer le params car c'est un serveur component
const CategoryPage = async ({
	params,
}: {
	params: { categoryId: string; storeId: string };
}) => {
	// On fetch un billborad existant
	const category = await prismadb.category.findUnique({
		where: {
			id: params.categoryId,
		},
	});

	const billboards = await prismadb.billboard.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	return (
		<div className="flex-col">
			<div className="flex-1 spcace-y-4 p-8 pt-6">
				<CategoryForm billboards={billboards} initalData={category} />
			</div>
		</div>
	);
};

export default CategoryPage;
