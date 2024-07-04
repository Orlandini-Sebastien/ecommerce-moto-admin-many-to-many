'use client';

import * as z from 'zod';
import { Billboard } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertModal } from '@/components/modals/alert-modal';

import ImageUpload from '@/components/ui/image-upload';

//Creation du schema avec zod
const formSchema = z.object({
	label: z.string().min(1),
	imageURL: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;
// ---------------------------

interface BillboardFormProps {
	initalData: Billboard | null;
}
export const BillboardForm: React.FC<BillboardFormProps> = ({ initalData }) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initalData ? "Modifier l'affichage" : 'Créer un affichage';
	const description = initalData
		? 'Modifier la description'
		: 'Ajouter une description';
	const toastMessage = initalData ? 'Affichage modifié.' : 'Affichage créé.';
	const action = initalData ? 'Sauvegarder' : 'Créer';

	//utilisation de zod pour le form
	const form = useForm<BillboardFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initalData || {
			label: '',
			imageURL: '',
		},
	});
	// --------------------------------

	// creation du form
	const onSubmit = async (data: BillboardFormValues) => {
		try {
			setLoading(true);
			if (initalData) {
				await axios.patch(
					`/api/${params.storeId}/billboards/${params.billboardId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/billboards`, data);
			}

			// Pour aller sur la page billboard une fois un changement
			router.push(`/${params.storeId}/billboards`);
			router.refresh();
			// ------
			toast.success(toastMessage);
		} catch (error) {
			toast.error('Quelque chose se déroule mal.');
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(
				`/api/${params.storeId}/billboards/${params.billboardId}`
			);
			router.push(`/${params.storeId}/billboards`);
			router.refresh();
			toast.success('Affichage supprimé.');
		} catch (error) {
			toast.error(
				"Assurez-vous d'abord d'avoir supprimé toutes les catégories utilisant ce panneau d'affichage."
			);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};
	// --------------------------------

	return (
		<div className="space-y-4">
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className="flex items-center justify-between">
				<Heading title={title} description={description} />
				{initalData && (
					<Button
						disabled={loading}
						variant={'destructive'}
						size={'icon'}
						onClick={() => setOpen(true)}
					>
						<Trash className="h-4 w-4" />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full"
				>
					<FormField
						control={form.control}
						name="imageURL"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Image de fond</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value ? [field.value] : []}
										disable={loading}
										onChange={(url) => field.onChange(url)}
										onRemove={() => field.onChange('')}
										localisation="vervel_moto_piece-2/billboard"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="label"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Etiquette</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Etiquette de l'affichage"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button disabled={loading} className="ml-auto" type="submit">
						{action}
					</Button>
				</form>
			</Form>
		</div>
	);
};
