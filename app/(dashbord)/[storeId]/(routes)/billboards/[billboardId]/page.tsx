import prismadb from '@/lib/prismadb';
import {BillboardForm} from './components/billboard-form';

// on peut récupérer le params car c'est un serveur component
const BillboardPage = async ({
	params,
}: {
	params: { billboardId: string };
}) => {
	// On fetch un billborad existant
	const billboard = await prismadb.billboard.findUnique({
		where: {
			id: params.billboardId,
		},
	});
	return (
		<div className="flex-col">
			<div className="flex-1 spcace-y-4 p-8 pt-6">
                <BillboardForm initalData={billboard}/>
            </div>
		</div>
	);
};

export default BillboardPage;
