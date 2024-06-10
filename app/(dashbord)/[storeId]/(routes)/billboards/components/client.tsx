'use client';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { BillboardColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

//Maintenant que l'on fetch la data
interface BillboardClientProps {
	data: BillboardColumn[];
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Affichages (${data.length})`}
					description="Gérer les panneaux d'affichage de votre magasin"
				/>
				<Button
					onClick={() => router.push(`/${params.storeId}/billboards/new`)}
				>
					<Plus className="mr-2 h-4 w-4" />
					Ajouter un nouveau
				</Button>
			</div>
			<Separator />
			<DataTable searchKey="label" columns={columns} data={data} />
			<Heading title="API" description="API calls for Billboards" />
			<Separator />
			<ApiList entityName="billboards" entityIdName="billboardId" />
		</>
	);
};
