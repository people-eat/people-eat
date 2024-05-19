import { useMutation } from '@apollo/client';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { PELink } from '@people-eat/web-core-components';
import { ExpireCurrentSessionDocument, SignedInUser } from '@people-eat/web-domain';
import classNames from 'classnames';
import { MenuIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';

const navigationItems = [
    { name: 'Individuelle Anfrage', href: '/global-booking-request' },
    { name: 'Privatkoch werden', href: '/how-to-become-a-chef' },
    { name: 'Über uns', href: '/about-us' },
    { name: 'Blog', href: '/blogs' },
];

export interface PEHeaderProps {
    signedInUser: SignedInUser | null;
    className?: string;
}

export function PEHeader({ signedInUser, className }: PEHeaderProps) {
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [expireCurrentSession] = useMutation(ExpireCurrentSessionDocument, { variables: { userId: signedInUser?.userId ?? '' } });

    return (
        <header className={classNames('bg-white', className)}>
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link href="/">
                        <span className="sr-only">PeopleEat</span>
                        <Image src="/people-eat-logo-title.png" alt="" width={256} height={256} className="h-8 w-auto" />
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
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-400">
                                    <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </span>
                                </Menu.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href="/profile"
                                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                            >
                                                Gastgeberprofil
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    {signedInUser.isCook && (
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/chef-profile"
                                                    className={classNames(
                                                        active ? 'bg-gray-100' : '',
                                                        'block px-4 py-2 text-sm text-gray-700',
                                                    )}
                                                >
                                                    Kochprofil
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    )}
                                    {signedInUser.isAdmin && (
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/administration"
                                                    className={classNames(
                                                        active ? 'bg-gray-100' : '',
                                                        'block px-4 py-2 text-sm text-gray-700',
                                                    )}
                                                >
                                                    Administration
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    )}
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                type="button"
                                                className={classNames(
                                                    active ? 'bg-gray-100' : '',
                                                    'block px-4 py-2 text-sm text-gray-700 w-full text-start',
                                                )}
                                                onClick={() => expireCurrentSession().then(() => router.push('/'))}
                                            >
                                                Abmelden
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
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
                            <Image src="/people-eat-logo-title.png" alt="" width={256} height={256} className="h-8 w-auto" />
                        </Link>

                        <span className="ml-auto"></span>

                        {!signedInUser && <PELink title="Registrieren" href="/sign-up" />}

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

                            {!signedInUser && (
                                <div className="py-6 flex items-stretch">
                                    <PELink title="Anmelden" href="/sign-in" type="secondary" />
                                </div>
                            )}
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    );
}
