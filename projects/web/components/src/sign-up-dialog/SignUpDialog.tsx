import { PEDialog } from '@people-eat/web-core-components';
import Image from 'next/image';
import { SignUpForm, SignUpFormInputs } from '../_forms/SignUpForm';

export interface SignUpDialogProps {
    open: boolean;
    onClose: () => void;
    completeTitle: string;
    onSignUp: (formData: SignUpFormInputs) => void;
    onSignIn: () => void;
}

export function SignUpDialog({ open, onClose, completeTitle, onSignUp, onSignIn }: SignUpDialogProps) {
    return (
        <PEDialog open={open} onClose={onClose}>
            <div className="bg-white rounded-xl flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <Image
                        unoptimized
                        className="mx-auto h-10 w-auto hidden md:block mb-10"
                        src="/people-eat-logo.jpeg"
                        alt="PeopleEat Firmen Logo"
                        width={800}
                        height={240}
                    />
                    <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">Einen Gastgeberaccount erstellen</h2>
                </div>

                <SignUpForm completeTitle={completeTitle} onSignUp={onSignUp} onSignIn={onSignIn} />
            </div>
        </PEDialog>
    );
}
