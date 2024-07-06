import prismadb from '@/lib/prismadb';
import { ProductForm } from './components/product-form';

// on peut récupérer le params car c'est un serveur component
const ProductPage = async ({
	params,
}: {
	params: { productId: string; storeId: string };
}) => {
	// On fetch un billborad existant
	const product = await prismadb.product.findUnique({
		where: {
			id: params.productId,
		},
		include: {
			images: true,
			categories:true
		},
	});

	const categories = await prismadb.category.findMany({
		where: {
			storeId: params.storeId,
		},
	});

	const sizes = await prismadb.size.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	const colors = await prismadb.color.findMany({
		where: {
			storeId: params.storeId,
		},
	});



	return (
		<div className="flex-col">
			<div className="flex-1 spcace-y-4 p-8 pt-6">
				<ProductForm
					categories={categories}
					colors={colors}
					sizes={sizes}
					initialData={product}
				/>
			</div>
		</div>
	);
};

export default ProductPage;
