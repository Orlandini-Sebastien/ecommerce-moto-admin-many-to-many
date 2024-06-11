
import prismadb from '@/lib/prismadb';

import { ContactClient } from './components/client';

const ContactPage = async ({ params }: { params: { storeId: string } }) => {
	//Pour montrer l'ensemble des product spécifique aux store qui est actif donc besoin
	// D'utiliser le params pour obtenir le store actif
	const contact = await prismadb.contact.findFirst({
		where: {
			storeId: params.storeId,
		},
	});

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ContactClient data={contact} />
			</div>
		</div>
	);
};

export default ContactPage;
