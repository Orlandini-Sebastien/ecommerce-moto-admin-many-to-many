'use client';

import * as z from 'zod';
import { Question } from '@prisma/client';
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
	question: z.string().min(1),
	answer: z.string().min(1),
});

type QuestionFormValues = z.infer<typeof formSchema>;
// ---------------------------

interface QuestionFormProps {
	initalData: Question | null;
}
export const QuestionForm: React.FC<QuestionFormProps> = ({ initalData }) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initalData ? 'Modifier la question' : 'Créer une question';
	const description = initalData
		? 'Editer vos questions'
		: 'Ajouter vos questions';
	const toastMessage = initalData ? 'Question modifié.' : 'Question créé.';
	const action = initalData ? 'Sauvegarder' : 'Créer';

	//utilisation de zod pour le form
	const form = useForm<QuestionFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initalData || {
			question: '',
			answer: '',
		},
	});
	// --------------------------------

	// creation du form
	const onSubmit = async (data: QuestionFormValues) => {
		try {
			setLoading(true);
			if (initalData) {
				await axios.patch(
					`/api/${params.storeId}/questions/${params.questionId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/questions`, data);
			}

			// Pour aller sur la page size une fois un changement
			router.push(`/${params.storeId}/questions`);
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
				`/api/${params.storeId}/questions/${params.questionId}`
			);
			router.push(`/${params.storeId}/questions`);
			router.refresh();
			toast.success('QUestion supprimé.');
		} catch (error) {
			toast.error("Assurez-vous d'abord d'avoir supprimé tous les questions");
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
							name="question"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Question</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Ajouter une question"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="answer"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Réponse</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Ecrire votre réponse à la question"
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
