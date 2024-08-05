'use client';

import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import { About } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import SectionAbout from '@/components/ui/section-about';

interface AboutClientProps {
	data: About | null;
}

export const AboutClient: React.FC<AboutClientProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();

	const introduction = data
		? "Modifier votre page 'À propos'"
		: "Créer votre page 'À propos'";
	const history = data
		? "Modifier l'histoire de votre entreprise ?"
		: "Ajouter l'histoire de votre entreprise ?";

	const button = data ? 'Modifier ' : 'Créer';

	return (
		<div className="flex-col space-y-4">
			<div className="flex items-center justify-between">
				<Heading
					title="À propos de votre entreprise"
					description={introduction}
				/>
				<Button
					onClick={() =>
						data
							? router.push(`/${params.storeId}/about/${data.id}`)
							: router.push(`/${params.storeId}/about/new`)
					}
				>
					<Plus className="mr-2 h-4 w-4" />
					{button}
				</Button>
			</div>

			<SectionAbout
				title="Introduction"
				text={data?.introduction}
				image={data?.introPicture}
				add={'Ajouter une intro ?'}
			/>

			<SectionAbout
				title="Histoire"
				text={data?.history}
				image={data?.historyPicture}
				add={'Ajouter une histoire à votre entreprise ?'}
			/>

			<SectionAbout
				title="L'équipe"
				text={data?.team}
				image={data?.teamPicture}
				add={'Ajouter une description de votre équipe ?'}
			/>

			<SectionAbout
				title={'Vos services'}
				text={data?.services}
				image={data?.servicesPicture}
				add={'Ajouter une description de vos services ?'}
			/>

			<SectionAbout
				title={'Vos motivations'}
				text={data?.personnalMotivation}
				image={data?.personnalMotivationPicture}
				add={'Ajouter une description de vos motivations ?'}
			/>

			<SectionAbout
				title={'Le meilleur produit'}
				text={data?.putForward}
				image={data?.putForwardPicture}
				add={'Ajouter votre meilleur produit ?'}
			/>

			<SectionAbout
				title={'Vos valeurs'}
				text={data?.value}
				image={data?.valuePicture}
				add={'Décrire vos valeurs ?'}
			/>
		</div>
	);
};
