'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type BillboardColumn = {
	id: string;
	label: string;
	createdAt: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
	{
		accessorKey: 'label',
		header: 'Étiquette',
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
