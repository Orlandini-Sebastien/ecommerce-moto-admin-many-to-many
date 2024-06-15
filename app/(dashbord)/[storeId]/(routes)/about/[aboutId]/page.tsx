import prismadb from '@/lib/prismadb';
import { AboutForm } from './components/about-form';

// on peut récupérer le params car c'est un serveur component
const AboutPage = async ({ params }: { params: { aboutId: string } }) => {
	// On fetch un billborad existant
	const about = await prismadb.about.findUnique({
		where: {
			id: params.aboutId,
		},
	});
	return (
		<div className="flex-col">
			<div className="flex-1 spcace-y-4 p-8 pt-6">
				<AboutForm initalData={about} />
			</div>
		</div>
	);
};

export default AboutPage;
