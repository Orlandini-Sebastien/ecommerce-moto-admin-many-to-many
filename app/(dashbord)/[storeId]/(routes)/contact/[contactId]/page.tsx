import prismadb from '@/lib/prismadb';
import { ContactForm } from './components/contact-form';

// on peut récupérer le params car c'est un serveur component
const ContactPage = async ({ params }: { params: { contactId: string } }) => {
	// On fetch un billborad existant
	const contact = await prismadb.contact.findUnique({
		where: {
			id: params.contactId,
		},
	});
	return (
		<div className="flex-col">
			<div className="flex-1 spcace-y-4 p-8 pt-6">
				<ContactForm initalData={contact} />
			</div>
		</div>
	);
};

export default ContactPage;
