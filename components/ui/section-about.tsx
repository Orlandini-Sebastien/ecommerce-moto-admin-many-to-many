import { Separator } from './separator';
import Image from 'next/image';

interface SectionAboutProps {
	title: string;
	text: string | null | undefined;
	image: string | null | undefined;
	add: string;
}

const SectionAbout: React.FC<SectionAboutProps> = ({
	title,
	text,
	image,
	add,
}) => {
	return (
		<>
			<Separator />
			<div className="text-2xl font-bold">{title}</div>
			{text ? (
				<div>
					<div className="grid grid-cols-2">
						<div>{text}</div>
						<div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
							{image && (
								<Image src={image} alt={image} fill className="object-cover" />
							)}
						</div>
					</div>
				</div>
			) : (
				<div>{add}</div>
			)}
		</>
	);
};

export default SectionAbout;
