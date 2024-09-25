'use client';

import { useEffect, useState } from 'react';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';

import { Button } from '@/components/ui/button';

interface ImageUploadProps {
	disable?: boolean;
	onSuccess: (value: string) => void;
	onRemove: (value: string) => void;
	value: string[];
	localisation: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	disable,
	onSuccess,
	onRemove,
	value,
	localisation,
}) => {
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);

	const onUpload = (result: any) => {
		if (result && result.info) {
			onSuccess(result.info.secure_url);
		} else {
			// Handle error (e.g., show an alert or message)
			console.error('Upload failed:', result);
		}
	};

	if (!isMounted) {
		return null;
	}

	return (
		<div>
			<div className="mb-4 flex items-center gap-4">
				{value.map((url) => (
					<div
						key={url}
						className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
					>
						<div className="z-10 absolute top-2 right-2">
							<Button
								type="button"
								onClick={() => onRemove(url)}
								variant={'destructive'}
								size={'icon'}
							>
								<Trash className="w-4 h-4" />
							</Button>
						</div>
						<Image fill className="object-cover" alt="Image" src={url} />
					</div>
				))}
			</div>
			{/* Ajout d'un folder en dur */}
			<CldUploadWidget
				onSuccess={onUpload}
				uploadPreset="jwd3yczt"
				options={{ folder: `${localisation}`, multiple: true }}
			>
				{({ open }) => {
					const onClick = () => {
						open();
					};
					return (
						<Button
							type="button"
							disabled={disable}
							variant={'secondary'}
							onClick={onClick}
						>
							<ImagePlus className="w-4 h-4 mr-2" />
							Télécharger une image
						</Button>
					);
				}}
			</CldUploadWidget>
		</div>
	);
};

export default ImageUpload;
