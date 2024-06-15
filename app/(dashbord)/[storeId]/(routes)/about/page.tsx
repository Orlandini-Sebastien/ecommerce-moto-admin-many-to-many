
import prismadb from '@/lib/prismadb';

import { AboutClient } from './components/client';

const AboutPage = async ({ params }: { params: { storeId: string } }) => {
	//Pour montrer l'ensemble des product spécifique aux store qui est actif donc besoin
	// D'utiliser le params pour obtenir le store actif
	const about = await prismadb.about.findFirst({
		where: {
			storeId: params.storeId,
		},
	});

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<AboutClient data={about} />
			</div>
		</div>
	);
};

export default AboutPage;
