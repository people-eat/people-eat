import { Dialog } from '@headlessui/react';
import { PELink } from '@people-eat/web-core-components';
import { SignedInUser } from '@people-eat/web-domain';
import { MenuIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const navigationItems = [
    { name: 'Individuelle Anfrage', href: '/global-booking-request' },
    { name: 'Privatkoch werden', href: '/how-to-become-a-chef' },
    { name: 'Über uns', href: '/about-us' },
    { name: 'Blog', href: '/blogs' },
];

export interface PEHeaderProps {
    signedInUser: SignedInUser | null;
}

export function PEHeader({ signedInUser }: PEHeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link href="/">
                        <span className="sr-only">Your Company</span>
                        <Image src="/people-eat-logo.jpeg" alt="" width={256} height={256} className="h-8 w-auto" />
                    </Link>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigationItems.map((item) => (
                        <Link key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                            {item.name}
                        </Link>
                    ))}
                </div>
                {!signedInUser && (
                    <div className="flex flex-1 items-center justify-end gap-x-6">
                        <Link href="/sign-in" className="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900">
                            Anmelden
                        </Link>
                        <PELink title="Registrieren" href="/sign-up" />
                    </div>
                )}
                {signedInUser && (
                    <div className="flex-1 flex justify-end">
                        <PELink title="Profil" href="/profile" />{' '}
                    </div>
                )}
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <MenuIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
            </nav>
            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-10" />
                <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center gap-x-6">
                        <Link href="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">PeopleEat</span>
                            <Image src="/people-eat-logo.jpeg" alt="" width={256} height={256} className="h-8 w-auto" />
                        </Link>
                        <span className="ml-auto"></span>
                        <PELink title="Registrieren" href="#" />
                        <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                            <span className="sr-only">Close menu</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navigationItems.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                            <div className="py-6">
                                <Link
                                    href="/sign-in"
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Anmelden
                                </Link>
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    );
}
