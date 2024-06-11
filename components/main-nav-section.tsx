'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export function MainNavSection({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const pathname = usePathname();
	const params = useParams();

	const routes = [
		{
			href: `/${params.storeId}/contact`,
			label: 'Contact',
			active: pathname === `/${params.storeId}/contact`,
		},
		{
			href: `/${params.storeId}/testimonies`,
			label: 'Témoignages',
			active: pathname === `/${params.storeId}/testimonies`,
		},
		{
			href: `/${params.storeId}/faq`,
			label: 'Faq',
			active: pathname === `/${params.storeId}/faq`,
		},
	
	
	
	
	];
	return (
		<nav className={cn('flex item-center space-x-4 lg:space-x-6', className)}>
			{routes.map((route) => (
				<Link
					key={route.href}
					href={route.href}
					className={cn(
						'text-sm font-medium transition-colors hover:text-primary w-24 text-center border border-3xl',
						route.active
							? 'text-black dark:text-white'
							: 'text-muted-foreground'
					)}
				>
					{route.label}
				</Link>
			))}
		</nav>
	);
}
