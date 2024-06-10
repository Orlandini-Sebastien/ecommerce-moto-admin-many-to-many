'use client';

import * as z from 'zod';
import { Color } from '@prisma/client';
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


//Creation du schema avec zod
const formSchema = z.object({
	name: z.string().min(1),
	value: z
		.string()
		.min(4)
		.regex(/^#/, { message: 'String must be a valid hex code' }),
});

type ColorFormValues = z.infer<typeof formSchema>;
// ---------------------------

interface ColorFormProps {
	initalData: Color | null;
}
export const ColorForm: React.FC<ColorFormProps> = ({ initalData }) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initalData ? 'Editer une couleur' : 'Créer une couleur';
	const description = initalData ? 'Editer une description' : 'Ajouter une description';
	const toastMessage = initalData ? 'Couleur modifiée.' : 'Couleur créée.';
	const action = initalData ? 'Sauvegarder' : 'Créer';

	//utilisation de zod pour le form
	const form = useForm<ColorFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initalData || {
			name: '',
			value: '',
		},
	});
	// --------------------------------

	// creation du form
	const onSubmit = async (data: ColorFormValues) => {
		try {
			setLoading(true);
			if (initalData) {
				await axios.patch(
					`/api/${params.storeId}/colors/${params.colorId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/colors`, data);
			}

			// Pour aller sur la page color une fois un changement
			router.push(`/${params.storeId}/colors`);
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
			await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
			router.push(`/${params.storeId}/colors`);
			router.refresh();
			toast.success('Couleur supprimée.');
		} catch (error) {
			toast.error("Assurez-vous d'abord d'avoir supprimé tous les produits utilisant cette couleur");
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};
	// --------------------------------

	return (
		<div className='space-y-4'>
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
						color={'icon'}
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
											placeholder="Nom de la couleur"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="value"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Valeur</FormLabel>
									<FormControl>
										<div className="flex items-center gap-4">
											<Input
												disabled={loading}
												placeholder="Valeur de la couleur"
												{...field}
											/>
											<div
												className="border p-4 rounded-full"
												style={{ backgroundColor: field.value }}
											/>
										</div>
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
