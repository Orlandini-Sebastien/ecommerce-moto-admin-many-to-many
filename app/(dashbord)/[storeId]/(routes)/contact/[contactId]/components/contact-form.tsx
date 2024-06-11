'use client';

import * as z from 'zod';
import { Contact } from '@prisma/client';
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
	firstname: z.string().min(1),
	name: z.string().min(1),
	imageURL: z.string().min(1),
	phone: z.string().min(8),
	mail: z.string().min(1),
	adress: z.string().min(1),
	postal: z.string().min(1),
	country: z.string().min(1),
	imageURLPlace: z.string().min(1),
});

type ContactFormValues = z.infer<typeof formSchema>;
// ---------------------------

interface ContactFormProps {
	initalData: Contact | null;
}
export const ContactForm: React.FC<ContactFormProps> = ({ initalData }) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initalData
		? 'Modifier la page contact'
		: 'Créer la page contact';
	const description = initalData
		? 'Modifier vos coordonnées perso'
		: 'Ajouter vos coordonnées perso';
	const toastMessage = initalData ? 'Contact modifié.' : 'Contact créé.';
	const action = initalData ? 'Sauvegarder' : 'Créer';

	//utilisation de zod pour le form
	const form = useForm<ContactFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initalData || {
			name: '',
			firstname: '',
			mail: '',
			phone: '',
			imageURL: '',
			adress: '',
			postal: '',
			country: '',
			imageURLPlace: '',
		},
	});
	// --------------------------------

	// creation du form
	const onSubmit = async (data: ContactFormValues) => {
		try {
			setLoading(true);
			if (initalData) {
				await axios.patch(
					`/api/${params.storeId}/contact/${params.contactId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/contact`, data);
			}

			// Pour aller sur la page billboard une fois un changement
			router.push(`/${params.storeId}/contact`);
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
			await axios.delete(`/api/${params.storeId}/contact/${params.contactId}`);
			router.push(`/${params.storeId}/contact`);
			router.refresh();
			toast.success('Contact supprimé.');
		} catch (error) {
			toast.error("Cela n'a pas fonctionné.");
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
					<div className="grid grid-cols-2 gap-8">
						<FormField
							control={form.control}
							name="imageURL"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Photo de profil</FormLabel>
									<FormControl>
										<ImageUpload
											value={field.value ? [field.value] : []}
											disable={loading}
											onChange={(url) => field.onChange(url)}
											onRemove={() => field.onChange('')}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="imageURLPlace"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Photo de votre magasin</FormLabel>
									<FormControl>
										<ImageUpload
											value={field.value ? [field.value] : []}
											disable={loading}
											onChange={(url) => field.onChange(url)}
											onRemove={() => field.onChange('')}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Separator />
					<div className="grid grid-cols-2 gap-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nom de famille</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Insérer votre nom"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="firstname"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Prénom</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Insérer votre prénom"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Numéro de téléphone</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="06 XX XX XX XX"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="mail"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Adresse mail</FormLabel>
									<FormControl>
										<Input
											type="mail"
											disabled={loading}
											placeholder="Insérer votre adresse mail"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="adress"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{"Adresse de l'entreprise"}</FormLabel>
									<FormControl>
										<Input
											type="mail"
											disabled={loading}
											placeholder="Entrer le nom et le numéro de la rue"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="postal"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{'Code postal de la ville'}</FormLabel>
									<FormControl>
										<Input
											type="mail"
											disabled={loading}
											placeholder="Exemple :54 590 "
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="country"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{'Pays'}</FormLabel>
									<FormControl>
										<Input
											type="mail"
											disabled={loading}
											placeholder="Exemple : France"
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
