import prismadb from '@/lib/prismadb';
import {SizeForm} from './components/size-form';

// on peut récupérer le params car c'est un serveur component
const SizePage = async ({
	params,
}: {
	params: { sizeId: string };
}) => {
	// On fetch un billborad existant
	const size = await prismadb.size.findUnique({
		where: {
			id: params.sizeId,
		},
	});
	return (
		<div className="flex-col">
			<div className="flex-1 spcace-y-4 p-8 pt-6">
                <SizeForm initalData={size}/>
            </div>
		</div>
	);
};

export default SizePage;
