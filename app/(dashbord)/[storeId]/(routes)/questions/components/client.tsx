'use client';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { QuestionColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

//Maintenant que l'on fetch la data
interface QuestionsClientProps {
	data: QuestionColumn[];
}

export const QuestionsClient: React.FC<QuestionsClientProps> = ({
	data,
}) => {
	const router = useRouter();
	const params = useParams();
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Questions (${data.length})`}
					description="Gérer les questions à propos de votre magasin"
				/>
				<Button onClick={() => router.push(`/${params.storeId}/questions/new`)}>
					<Plus className="mr-2 h-4 w-4" />
					Ajouter un nouvelle
				</Button>
			</div>
			<Separator />
			<DataTable searchKey="name" columns={columns} data={data} />
			<Heading title="API" description="API calls for Models" />
			<Separator />
			<ApiList entityName="questions" entityIdName="QuesitonId" />
		</>
	);
};
