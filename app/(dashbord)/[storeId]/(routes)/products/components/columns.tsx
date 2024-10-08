'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type ProductColumn = {
	id: string;
	name: string;
	price: string;
	categories: { id: string; name: string }[];
	isFeatured: boolean;
	isArchived: boolean;
	createdAt: string;
	color?: string;
	size?: string;
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
		accessorKey: 'stock',
		header: 'En stock',
	},
	{
		accessorKey: 'price',
		header: 'Prix',
	},
	{
		accessorKey: 'categories',
		header: 'Catégories',
		cell: ({ row }) =>
			row.original.categories && (
				<div>
					{row.original.categories.map((cat) => (
						<div key={cat.id}>{cat.name}</div>
					))}
				</div>
			),
	},
	{
		accessorKey: 'size',
		header: 'Modèle',
		cell: ({ row }) => (row.original.size ? row.original.size : 'Non défini'),
	},
	{
		accessorKey: 'color',
		header: 'Couleur',
		cell: ({ row }) =>
			row.original.color ? (
				<div className="flex items-center gap-x-2">
					{row.original.color}
					<div
						className="h-6 w-6 rounded-full border"
						style={{ backgroundColor: row.original.color }}
					/>
				</div>
			) : (
				'Non défini'
			), // Gestion optionnelle pour color
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
