'use client';

import * as z from 'zod';
import {
	Category,
	Color,
	Image,
	Product,
	ProductCategory,
	Size,
} from '@prisma/client';
import { Check, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertModal } from '@/components/modals/alert-modal';

import ImageUpload from '@/components/ui/image-upload';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

//Creation du schema avec zod
const formSchema = z.object({
	name: z.string().min(1),
	images: z.object({ url: z.string() }).array(),
	//Pour les décimales
	categoryId: z.string().min(1),
	colorId: z.string().min(1).optional(),
	sizeId: z.string().min(1).optional(),
	stock: z.coerce.number().min(1).optional(),
	price: z.coerce.number().min(1),
	isFeatured: z.boolean().default(false).optional(),
	isArchived: z.boolean().default(false).optional(),

	description: z
		.string()
		.max(400, { message: 'Décrire votre produit si besoin' })
		.optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;
// ---------------------------

interface ProductFormProps {
	initialData:
		| (Product & { images: Image[] } & { categories: ProductCategory[] })
		| null;
	categories: Category[];
	colors: Color[];
	sizes: Size[];
}
export const ProductForm: React.FC<ProductFormProps> = ({
	initialData,
	categories,
	colors,
	sizes,
}) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>(
		[]
	);
	const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const title = initialData ? 'Editer un produit' : 'Créer un produit';
	const description = initialData
		? 'Editer une description'
		: 'Ajouter une description';
	const toastMessage = initialData ? 'Produit modifié.' : 'Produit créé.';
	const action = initialData ? 'Sauvegarder' : 'Créer';

	//utilisation de zod pour le form
	const form = useForm<ProductFormValues>({
		resolver: zodResolver(formSchema),

		// comme on a un float, et que dans prisma et la database non
		defaultValues: initialData
			? {
					...initialData,
					price: parseFloat(String(initialData?.price)),
					stock: parseInt(String(initialData?.stock)) | 1,
					colorId: initialData.colorId ?? undefined,
					sizeId: initialData.sizeId ?? undefined,
					description: initialData.description ?? undefined,
					categoryId: categories.map((cat) => cat.name).toString(),
			  }
			: {
					name: '',
					images: [],
					categoryId: '',
					isFeatured: false,
					isArchived: false,
					sizeId: undefined,
					colorId: undefined,
					description: undefined,
			  },
	});
	// --------------------------------

	// Mise à jour des catégories sélectionnées initiales une fois
	useEffect(() => {
		if (initialData?.categories) {
			const initialCategoryIds = initialData.categories.map(
				(cat) => cat.categoryId
			);
			const initialCategoryNames = categories
				.filter((cat) => initialCategoryIds.includes(cat.id))
				.map((cat) => cat.name);

			setSelectedCategoryIds(initialCategoryIds);
			setSelectedCategoryNames(initialCategoryNames);
		}
	}, [initialData, categories]);

	useEffect(() => {
		form.setValue('categoryId', selectedCategoryIds.join(', '));
	}, [selectedCategoryIds, form]);

	// creation du form
	const onSubmit = async (data: ProductFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/products/${params.productId}`,
					data
				);
			} else {
				console.log(data);
				await axios.post(`/api/${params.storeId}/products`, data);
			}

			// Pour aller sur la page product une fois un changement
			router.push(`/${params.storeId}/products`);
			router.refresh();
			// ------
			toast.success(toastMessage);
		} catch (error) {
			if (error instanceof Error) {
				console.log(error.message);
			} else {
				console.log('Une erreur inconnue est survenue');
			}

			toast.error('Quelque chose se déroule mal.');
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
			router.push(`/${params.storeId}/products`);
			router.refresh();
			toast.success('Produit supprimé.');
		} catch (error) {
			toast.error('Quelque chose se déroule mal');
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};
	// --------------------------------

	// Fonction pour gérer le changement des checkboxes
	const handleCheckboxChange = (categoryName: string, categoryId: string) => {
		setSelectedCategoryNames((prevSelectedNames) => {
			if (prevSelectedNames.includes(categoryName)) {
				// Si la catégorie est déjà sélectionnée, on la retire des noms
				return prevSelectedNames.filter((name) => name !== categoryName);
			} else {
				// Sinon, on l'ajoute aux noms
				return [...prevSelectedNames, categoryName];
			}
		});

		setSelectedCategoryIds((prevSelectedIds) => {
			if (prevSelectedIds.includes(categoryId)) {
				// Si la catégorie est déjà sélectionnée, on la retire des identifiants
				return prevSelectedIds.filter((id) => id !== categoryId);
			} else {
				// Sinon, on l'ajoute aux identifiants
				return [...prevSelectedIds, categoryId];
			}
		});
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className="flex items-center justify-between">
				<Heading title={title} description={description} />
				{initialData && (
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
					<FormField
						control={form.control}
						name="images"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Images</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value.map((image) => image.url)}
										disable={loading}
										onChange={(url) =>
											field.onChange([...field.value, { url }])
										}
										onRemove={(url) =>
											field.onChange([
												...field.value.filter((current) => current.url !== url),
											])
										}
										localisation="vervel_moto_piece-2/product"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
											placeholder="Nom du produit"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="stock"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre en stock</FormLabel>
									<FormControl>
										<Input
											type="number"
											disabled={loading}
											placeholder="Ajouter une valeur"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Prix</FormLabel>
									<FormControl>
										<Input
											type="number"
											disabled={loading}
											placeholder="Ajoute le prix"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-2">
									<FormLabel>Catégorie(s)</FormLabel>
									<div className="relative inline-block text-left gap-2">
										<div className="text-sm font-medium overflow-y-auto h-20 border rounded-lg p-2 mb-2 ">
											{selectedCategoryNames.join(', ')}
										</div>

										<Button
											variant={'secondary'}
											type={'button'}
											onClick={() => setIsDropdownOpen(!isDropdownOpen)}
										>
											Selectionne une catégorie
										</Button>

										{isDropdownOpen && (
											<div className="absolute mt-2 rounded-md shadow-lg bg-primary-foreground ring-1 ring-black ring-opacity-5 z-10">
												<div
													className="py-1"
													role="menu"
													aria-orientation="vertical"
													aria-labelledby="options-menu"
												>
													{categories.map((category) => (
														<div
															key={category.id}
															className="flex flex-col gap-1 p-2"
														>
															<div className="flex gap-1 items-center ">
																<input
																	className="hidden"
																	id={'input' + category.id}
																	type="checkbox"
																	checked={selectedCategoryNames.includes(
																		category.name
																	)}
																	onChange={() =>
																		handleCheckboxChange(
																			category.name,
																			category.id
																		)
																	}
																/>
																<label
																	htmlFor={'input' + category.id}
																	className="flex gap-2 text-sm font-medium text-muted-foreground"
																>
																	<div
																		className={`flex justify-center items-center peer h-4 w-4 
																	shrink-0 rounded-sm border border-muted-foreground ring-offset-background
																	  disabled:cursor-not-allowed disabled:opacity-50 
																	`}
																	>
																		{selectedCategoryNames.includes(
																			category.name
																		) ? (
																			<Check
																				className={`font-medium text-muted-foreground`}
																			/>
																		) : null}
																	</div>
																	<span
																		className={`font-medium text-muted-foreground`}
																	>
																		{category.name}
																	</span>
																</label>
															</div>
														</div>
													))}
												</div>
											</div>
										)}

										{/* <div className="mt-2">
											<div>
												Chaîne de caractères des noms de catégories
												sélectionnées : {selectedCategoryNames.join(', ')}
											</div>
											<div>
												Chaîne de caractères des identifiants de catégories
												sélectionnées : {selectedCategoryIds.join(', ')}
											</div>
										</div> */}
									</div>
									<FormControl>
										<Input
											className="invisible"
											disabled={loading}
											value={selectedCategoryIds}
											readOnly
											onBlur={field.onBlur}
											name={field.name}
											ref={field.ref}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="sizeId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Modèle</FormLabel>
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
													placeholder="Choisir un modèle"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{sizes.map((size) => (
												<SelectItem key={size.id} value={size.id}>
													{size.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="colorId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Couleur</FormLabel>
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
													placeholder="Choisir une couleur"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{colors.map((color) => (
												<SelectItem key={color.id} value={color.id}>
													{color.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isFeatured"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											// Dans le cas de problème qui ne pose pas de proglème
											// @ts-ignore
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>En vedette</FormLabel>
										<FormDescription>
											{"Ce produit apparaîtra sur la page d'accueil"}
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isArchived"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											// Dans le cas de problème qui ne pose pas de proglème
											// @ts-ignore
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>Archivé</FormLabel>
										<FormDescription>
											{"Ce produit n'apparaîtra nulle part dans le magasin"}
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										className="bg-background resize-none"
										rows={7}
										placeholder={'Décrire votre produit si besoin'}
										{...field}
									/>
								</FormControl>
								<FormDescription>
									{
										'Ajouter les détails pertinents pour la vente de votre produit'
									}
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button disabled={loading} className="ml-auto" type="submit">
						{action}
					</Button>
				</form>
			</Form>
		</>
	);
};
