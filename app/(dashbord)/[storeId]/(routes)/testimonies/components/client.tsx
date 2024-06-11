'use client';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { TestimonyColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

//Maintenant que l'on fetch la data
interface TestimoniesClientProps {
	data: TestimonyColumn[];
}

export const TestimoniesClient: React.FC<TestimoniesClientProps> = ({
	data,
}) => {
	const router = useRouter();
	const params = useParams();
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Avis (${data.length})`}
					description="Gérer les avis de votre magasin"
				/>
				<Button onClick={() => router.push(`/${params.storeId}/testimonies/new`)}>
					<Plus className="mr-2 h-4 w-4" />
					Ajouter un nouveau
				</Button>
			</div>
			<Separator />
			<DataTable searchKey="name" columns={columns} data={data} />
			<Heading title="API" description="API calls for Models" />
			<Separator />
			<ApiList entityName="testimonies" entityIdName="TestimonyId" />
		</>
	);
};
