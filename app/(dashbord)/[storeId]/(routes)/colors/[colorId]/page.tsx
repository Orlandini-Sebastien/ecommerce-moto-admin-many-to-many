import prismadb from '@/lib/prismadb';
import {ColorForm} from './components/color-form';

// on peut récupérer le params car c'est un serveur component
const ColorPage = async ({
	params,
}: {
	params: { colorId: string };
}) => {
	// On fetch un billborad existant
	const color = await prismadb.color.findUnique({
		where: {
			id: params.colorId,
		},
	});
	return (
		<div className="flex-col">
			<div className="flex-1 spcace-y-4 p-8 pt-6">
                <ColorForm initalData={color}/>
            </div>
		</div>
	);
};

export default ColorPage;
