'use client';

import * as z from 'zod';
import { About } from '@prisma/client';
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
	introduction: z.string().nullable().optional(),
	history: z.string().nullable().optional(),
	team: z.string().nullable().optional(),
	services: z.string().nullable().optional(),
	personnalMotivation: z.string().nullable().optional(),
	putForward: z.string().nullable().optional(),
	value: z.string().nullable().optional(),
	introPicture: z.string().nullable().optional(),
	historyPicture: z.string().nullable().optional(),
	teamPicture: z.string().nullable().optional(),
	servicesPicture: z.string().nullable().optional(),
	personnalMotivationPicture: z.string().nullable().optional(),
	putForwardPicture: z.string().nullable().optional(),
	valuePicture: z.string().nullable().optional(),
});

type AboutFormValues = z.infer<typeof formSchema>;
// ---------------------------

interface AboutFormProps {
	initalData: About | null;
}
export const AboutForm: React.FC<AboutFormProps> = ({ initalData }) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initalData ? 'Modifier la page about' : 'Créer la page about';
	const description = initalData
		? 'Modifier le contenu de la page, chaque champs est optionnel'
		: 'Ajouter du contenu à votre page, chaque champs est optionnel';
	const toastMessage = initalData ? 'About modifié.' : 'About créé.';
	const action = initalData ? 'Sauvegarder' : 'Créer';

	//utilisation de zod pour le form
	const form = useForm<AboutFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initalData || {
			introduction: '',
			history: '',
			team: '',
			services: '',
			personnalMotivation: '',
			putForward: '',
			value: '',

			introPicture: '',
			historyPicture: '',
			teamPicture: '',
			servicesPicture: '',
			personnalMotivationPicture: '',
			putForwardPicture: '',
			valuePicture: '',
		},
	});
	// --------------------------------

	// creation du form
	const onSubmit = async (data: AboutFormValues) => {
		try {
			setLoading(true);
			if (initalData) {
				await axios.patch(
					`/api/${params.storeId}/about/${params.aboutId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/about`, data);
			}

			// Pour aller sur la page billboard une fois un changement
			router.push(`/${params.storeId}/about`);
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
			await axios.delete(`/api/${params.storeId}/about/${params.aboutId}`);
			router.push(`/${params.storeId}/about`);
			router.refresh();
			toast.success('About supprimé.');
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
							name="introduction"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Introduction </FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Introduction de la page"
											{...field}
											value={field.value ?? ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="introPicture"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Image Introductive </FormLabel>
									<FormControl>
										<ImageUpload
											value={field.value ? [field.value] : []}
											disable={loading}
											onChange={(url) => field.onChange(url)}
											onRemove={() => field.onChange('')}
											localisation='vervel_moto_piece/about'
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
							name="history"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Histoire perso / entreprise </FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="C'est comme cela que tout à commencer"
											{...field}
											value={field.value ?? ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="historyPicture"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Image historique </FormLabel>
									<FormControl>
										<ImageUpload
											value={field.value ? [field.value] : []}
											disable={loading}
											onChange={(url) => field.onChange(url)}
											onRemove={() => field.onChange('')}
											localisation='vervel_moto_piece/about'
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
							name="team"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Votre Equipe </FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Petite description"
											{...field}
											value={field.value ?? ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="teamPicture"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Image de la team </FormLabel>
									<FormControl>
										<ImageUpload
											value={field.value ? [field.value] : []}
											disable={loading}
											onChange={(url) => field.onChange(url)}
											onRemove={() => field.onChange('')}
											localisation='vervel_moto_piece/about'
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
							name="services"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Services </FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Les différents types de produit & en quoi vous êtes différents"
											{...field}
											value={field.value ?? ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="servicesPicture"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Exemple </FormLabel>
									<FormControl>
										<ImageUpload
											value={field.value ? [field.value] : []}
											disable={loading}
											onChange={(url) => field.onChange(url)}
											onRemove={() => field.onChange('')}
											localisation='vervel_moto_piece/about'
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
							name="personnalMotivation"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Vos motivations perso </FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Je fais ceci car ..."
											{...field}
											value={field.value ?? ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="personnalMotivationPicture"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Vos motivations </FormLabel>
									<FormControl>
										<ImageUpload
											value={field.value ? [field.value] : []}
											disable={loading}
											onChange={(url) => field.onChange(url)}
											onRemove={() => field.onChange('')}
											localisation='vervel_moto_piece/about'
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
							name="putForward"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mise en avnt </FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Le truc de ouf"
											{...field}
											value={field.value ?? ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="putForwardPicture"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Le produit phare </FormLabel>
									<FormControl>
										<ImageUpload
											value={field.value ? [field.value] : []}
											disable={loading}
											onChange={(url) => field.onChange(url)}
											onRemove={() => field.onChange('')}
											localisation='vervel_moto_piece/about'
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
							name="value"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Vos valeurs perso </FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Je fais ceci car ..."
											{...field}
											value={field.value ?? ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="valuePicture"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Vos valeurs perso en image </FormLabel>
									<FormControl>
										<ImageUpload
											value={field.value ? [field.value] : []}
											disable={loading}
											onChange={(url) => field.onChange(url)}
											onRemove={() => field.onChange('')}
											localisation='vervel_moto_piece/about'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Separator />

					<Button disabled={loading} className="ml-auto" type="submit">
						{action}
					</Button>
				</form>
			</Form>
		</div>
	);
};
