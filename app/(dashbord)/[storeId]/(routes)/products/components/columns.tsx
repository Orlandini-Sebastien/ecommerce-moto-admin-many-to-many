'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type ProductColumn = {
	id: string;
	name: string;
	price: string;
	size: string;
	category: string;
	color: string;
	isFeatured: boolean;
	isArchived: boolean;
	createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Nom',
	},
	{
		accessorKey: 'isArchived',
		header: 'Archivé',
	},
	{
		accessorKey: 'isFeatured',
		header: 'En vedette',
	},
	{
		accessorKey: 'price',
		header: 'Prix',
	},
	{
		accessorKey: 'category',
		header: 'Catégorie',
	},
	{
		accessorKey: 'size',
		header: 'Modèle',
	},
	{
		accessorKey: 'color',
		header: 'Couleur',
		cell: ({ row }) => (
			<div className="flex items-center gap-x-2">
				{row.original.color}
				<div
					className="h-6 w-6 rounded-full border"
					// La class dynamique en dehors de tailwind pour etre sur de compiler
					// on évite bg-[${}] qui marche pas
					style={{ backgroundColor: row.original.color }}
				/>
			</div>
		),
	},
	{
		accessorKey: 'createdAt',
		header: 'Date',
	},
	{
		id: 'action',
		// row.original provient de react/table
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
