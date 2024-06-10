'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type ColorColumn = {
	id: string;
	name: string;
	value: string;
	createdAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Nom',
	},
	{
		accessorKey: 'value',
		header: 'Valeur',
		cell: ({ row }) => (
			<div className="flex items-center gap-x-2">
				{row.original.value}
				<div
					className="h-6 w-6 rounded-full border"
					// La class dynamique en dehors de tailwind pour etre sur de compiler
					// on évite bg-[${}] qui marche pas
					style={{ backgroundColor: row.original.value }}
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
