'use client';

import * as z from 'zod';
import { Store } from '@prisma/client';
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
import { ApiAlert } from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';

interface SettingsFormProps {
	initalData: Store;
}

//Creation du schema avec zod
const formSchema = z.object({
	name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;
// ---------------------------

const SettingsForm: React.FC<SettingsFormProps> = ({ initalData }) => {
	const params = useParams();
	const router = useRouter();
	const origin = useOrigin();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	//utilisation de zod pour le form
	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initalData,
	});
	// --------------------------------

	// creation du form
	const onSubmit = async (data: SettingsFormValues) => {
		try {
			setLoading(true);
			await axios.patch(`/api/stores/${params.storeId}`, data);
			router.refresh();
			toast.success('Magasin modifié.');
		} catch (error) {
			toast.error('Quelque chose se déroule mal.');
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/stores/${params.storeId}`);
			router.push('/');
			router.refresh();
			toast.success('Magasin supprimé.');
		} catch (error) {
			toast.error("Assurez-vous d'abord d'avoir supprimé tous les produits et catégories.");
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};
	// --------------------------------

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className="flex items-center justify-between">
				<Heading title="Paramètres" description="Gérer les préférences du magasin" />
				<Button
					disabled={loading}
					variant={'destructive'}
					size={'icon'}
					onClick={() => setOpen(true)}
				>
					<Trash className="h-4 w-4" />
				</Button>
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
							name="name" /* attention ici le name de schema les 2 sont differents */
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nom</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Nom du magasin"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button disabled={loading} className="ml-auto" type="submit">
						Sauvegarder
					</Button>
				</form>
			</Form>
			<Separator />

			{/* Permet de copier la route du back */}
			<ApiAlert
				title="NEXT_PUBLIC_API_URL"
				description={`${origin}/api/${params.storeId}`}
				variant="public"
			/>
		</>
	);
};

export default SettingsForm;
