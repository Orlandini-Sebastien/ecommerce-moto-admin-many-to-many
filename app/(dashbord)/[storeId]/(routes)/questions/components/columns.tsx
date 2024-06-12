'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type QuestionColumn = {
	id: string;
	question : string
	answer : string;
	createdAt: string;
};

export const columns: ColumnDef<QuestionColumn>[] = [
	{
		accessorKey: 'question',
		header: 'Questions',
	},
	{
		accessorKey: 'answer',
		header: 'Réponses',
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
