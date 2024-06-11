import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { MainNav } from '@/components/main-nav';
import StoreSwitcher from '@/components/store-switcher';
import prismadb from '@/lib/prismadb';
import { ModeToggle } from '@/components/theme-toggle';
import { ArrowBigDownDash, ArrowBigRightDash } from 'lucide-react';
import { MainNavSection } from './main-nav-section';

const NavBar = async () => {
	//authentification
	const { userId } = auth();
	if (!userId) {
		redirect('/sign-in');
	}
	// --------- -------

	const stores = await prismadb.store.findMany({
		where: { userId },
	});

	return (
		<div className="border-b">
			<div className="flex h-16 items-center px-4">
				<StoreSwitcher items={stores} />
				<div className="mx-4 flex flex-col">
					<div className="flex items-center space-x-2">
						<span className='w-20'>Site web</span>
						<ArrowBigRightDash className="h-6 w-6" />
						<MainNavSection className="mx-6" />
					</div>
					<div className="flex items-center space-x-2">
						<span className='w-20'>Magasin</span>
						<ArrowBigRightDash className="h-6 w-6" />
						<MainNav className="mx-6" />
					</div>
				</div>

				<div className="ml-auto flex items-center space-x-4">
					<ModeToggle />
					<UserButton afterSignOutUrl="/" />
				</div>
			</div>
		</div>
	);
};

export default NavBar;
