'use client';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { CategoryColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

//Maintenant que l'on fetch la data
interface CategoryClientProps {
	data: CategoryColumn[];
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Catégories (${data.length})`}
					description="Gérer les catégories de votre boutique"
				/>
				<Button
					onClick={() => router.push(`/${params.storeId}/categories/new`)}
				>
					<Plus className="mr-2 h-4 w-4" />
					Ajouter une nouvelle
				</Button>
			</div>
			<Separator />
			<DataTable searchKey="name" columns={columns} data={data} />
			<Heading title="API" description="API calls for categories" />
			<Separator />
			<ApiList entityName="categories" entityIdName="categoryId" />
		</>
	);
};
