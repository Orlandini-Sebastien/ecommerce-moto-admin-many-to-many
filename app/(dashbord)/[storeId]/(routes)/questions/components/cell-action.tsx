'use client';
import { useParams, useRouter } from 'next/navigation';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import axios from 'axios';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { QuestionColumn } from './columns';
import { Button } from '@/components/ui/button';
import { AlertModal } from '@/components/modals/alert-modal';

interface CellActionProps {
	data: QuestionColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	//Pour le update
	const router = useRouter();
	const params = useParams();
	// ---

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const onCopy = (id: string) => {
		navigator.clipboard.writeText(id);
		toast.success("ID de la question copié dans le presse-papiers");
	};

	//Copy past to billbord-form
	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${params.storeId}/questions/${data.id}`);
			router.refresh();

			toast.success('Question supprimée.');
		} catch (error) {
			toast.error("Assurez-vous d'abord d'avoir supprimé tous les questions");
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant={'ghost'} className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem onClick={() => onCopy(data.id)}>
						<Copy className="mr-2 h-4 w-4" />
						{"Copier l'identifiant"}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							router.push(`/${params.storeId}/questions/${data.id}`)
						}
					>
						<Edit className="mr-2 h-4 w-4" />
						Modifier
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setOpen(true)}>
						<Trash className="mr-2 h-4 w-4" />
						Supprimer
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
