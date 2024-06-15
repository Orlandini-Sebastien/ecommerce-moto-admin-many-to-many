'use client';

import * as z from 'zod';
import { Review } from '@prisma/client';
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
	source: z.string().min(1),
	link: z.string().min(1),
});

type ReviewFormValues = z.infer<typeof formSchema>;
// ---------------------------

interface ReviewFormProps {
	initalData: Review | null;
}
export const ReviewForm: React.FC<ReviewFormProps> = ({ initalData }) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initalData ? 'Modifier les avis' : 'Ajouter les avis';
	const description = initalData
		? 'Modifier les liens'
		: 'Ajouter les liens de vos avis';
	const toastMessage = initalData ? 'Avis modifiés.' : 'Avis créés.';
	const action = initalData ? 'Sauvegarder' : 'Créer';

	//utilisation de zod pour le form
	const form = useForm<ReviewFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initalData || {
			source: '',
			link: '',
		},
	});
	// --------------------------------

	// creation du form
	const onSubmit = async (data: ReviewFormValues) => {
		try {
			setLoading(true);
			if (initalData) {
				await axios.patch(
					`/api/${params.storeId}/reviews/${params.reviewId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/reviews`, data);
			}

			// Pour aller sur la page size une fois un changement
			router.push(`/${params.storeId}/reviews`);
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
			await axios.delete(`/api/${params.storeId}/reviews/${params.reviewId}`);
			router.push(`/${params.storeId}/reviews`);
			router.refresh();
			toast.success('Avis supprimé.');
		} catch (error) {
			toast.error("Assurez-vous d'abord d'avoir supprimé tous les avis");
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
							name="source"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Source</FormLabel>
									<FormControl>
										<Input disabled={loading} placeholder="Google" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="link"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Link</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Insérer le lien de SociableKit"
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
