'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type ReviewColumn = {
	id: string;
	source: string;
	link: string;
	createdAt: string;
};

export const columns: ColumnDef<ReviewColumn>[] = [
	{
		accessorKey: 'source',
		header: 'Source',
	},
	{
		accessorKey: 'link',
		header: 'Link',
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
