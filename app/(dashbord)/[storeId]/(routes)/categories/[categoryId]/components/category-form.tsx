'use client';

import * as z from 'zod';
import { Billboard, Category } from '@prisma/client';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

//Creation du schema avec zod
const formSchema = z.object({
	name: z.string().min(1),
	billboardId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;
// ---------------------------

interface CategoryFormProps {
	initalData: Category | null;
	billboards: Billboard[];
}
export const CategoryForm: React.FC<CategoryFormProps> = ({
	initalData,
	billboards,
}) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initalData ? 'Editer une catégorie' : 'Créer une catégorie';
	const description = initalData
		? 'Editer une description'
		: 'Ajouter une description';
	const toastMessage = initalData ? 'Catégorie modifié.' : 'Catégorie créée.';
	const action = initalData ? 'Sauvegarder les changeements' : 'Créer';

	//utilisation de zod pour le form
	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initalData || {
			name: '',
			billboardId: '',
		},
	});
	// --------------------------------

	// creation du form
	const onSubmit = async (data: CategoryFormValues) => {
		try {
			setLoading(true);
			if (initalData) {
				await axios.patch(
					`/api/${params.storeId}/categories/${params.categoryId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/categories`, data);
			}

			// Pour aller sur la page category une fois un changement
			router.push(`/${params.storeId}/categories`);
			// ------
			router.refresh();
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
				`/api/${params.storeId}/categories/${params.categoryId}`
			);
			router.push(`/${params.storeId}/categories`);
			router.refresh();
			toast.success('Catégorie supprimée.');
		} catch (error) {
			toast.error(
				"Assurez-vous d'abord d'avoir supprimé tous les produits utilisant cette catégorie"
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
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nom</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Nom de la catégorie"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="billboardId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{"Panneau d'affichage"}</FormLabel>
									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder="Selectionner un panneau"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{billboards.map((billboard) => (
												<SelectItem key={billboard.id} value={billboard.id}>
													{billboard.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
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
