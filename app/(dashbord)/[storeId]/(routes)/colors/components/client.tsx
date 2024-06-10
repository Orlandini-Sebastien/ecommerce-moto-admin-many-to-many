'use client';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ColorColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

//Maintenant que l'on fetch la data
interface ColorsClientProps {
	data: ColorColumn[];
}

export const ColorsClient: React.FC<ColorsClientProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Couleurs (${data.length})`}
					description="Gérez les couleurs de votre magasin"
				/>
				<Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
					<Plus className="mr-2 h-4 w-4" />
					Ajouter une nouvelle
				</Button>
			</div>
			<Separator />
			<DataTable searchKey="name" columns={columns} data={data} />
			<Heading title="API" description="API calls for Colors" />
			<Separator />
			<ApiList entityName="colors" entityIdName="colorId" />
		</>
	);
};
