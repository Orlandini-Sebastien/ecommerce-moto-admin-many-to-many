'use client';

import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import React from 'react';
import { Contact } from '@prisma/client';
import Image from 'next/image';

interface ContactClientProps {
	data: Contact | null;
}

export const ContactClient: React.FC<ContactClientProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();

	const description = data ? 'Modifier votre profil' : 'Créer un profil';
	const coordonnees = data
		? 'Modifier vos coordonnées'
		: 'Ajouter vos coordonnées';
	const button = data ? 'Modifier ' : 'Créer';

	return (
		<div className="flex-col space-y-4">
			<div className="flex items-center justify-between">
				<Heading title="Profil" description={description} />
				<Button
					onClick={() =>
						data
							? router.push(`/${params.storeId}/contact/${data.id}`)
							: router.push(`/${params.storeId}/contact/new`)
					}
				>
					<Plus className="mr-2 h-4 w-4" />
					{button}
				</Button>
			</div>
			<Separator />
			<div>{!data && "Vous n'avez pas encore de profil"}</div>
			<div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
				{data && (
					<Image
						src={data.imageURL}
						alt="profil"
						fill
						className="object-cover"
					/>
				)}
			</div>
			<div className="grid grid-cols-2">
				<div>{data?.name}</div>
				<div>{data?.mail}</div>
				<div>{data?.firstname}</div>
				<div>{data?.phone}</div>
			</div>
			<Separator />
			<Heading title="Coordonnées" description={coordonnees} />
			<Separator />
			<div>{!data && "Vous n'avez pas encore de coordonnées"}</div>
			<div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
				{data && (
					<Image
						src={data.imageURLPlace}
						alt="profil"
						fill
						className="object-cover"
					/>
				)}
			</div>
			<div className="grid grid-cols-2">
				<div>{data?.adress}</div>
				<div>{data?.postal}</div>
				<div>{data?.country}</div>
			</div>
		</div>
	);
};
