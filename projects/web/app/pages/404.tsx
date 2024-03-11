import { PEFooter, PEHeader } from '@people-eat/web-components';
import { PELink } from '@people-eat/web-core-components';

export default function NotFoundPage() {
    return (
        <div>
            <PEHeader signedInUser={null} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 my-16">Seite nicht gefunden</h1>

                <div className="flex flex-col gap-16 items-center">
                    <p>Es sieht so aus als konnte die von dir gesuchte Seite leider nicht gefunden werden.</p>
                    <div>
                        <PELink title="Zur Home Seite" href="/" />
                    </div>
                </div>
            </div>

            <PEFooter />
        </div>
    );
}
