'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type SizeColumn = {
	id: string;
	name: string;
	value: string;
	createdAt: string;
};

export const columns: ColumnDef<SizeColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Nom',
	},
	{
		accessorKey: 'value',
		header: 'Valeur',
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
