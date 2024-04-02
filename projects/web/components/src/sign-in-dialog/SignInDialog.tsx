import { PEDialog } from '@people-eat/web-core-components';
import Image from 'next/image';
import { SignInForm, SignInFormInputs } from '../_forms/SignInForm';

export interface SignInDialogProps {
    open: boolean;
    onClose: () => void;
    completeTitle: string;
    onSignIn: (formData: SignInFormInputs) => void;
    onSignUp: () => void;
}

export function SignInDialog({ open, onClose, completeTitle, onSignIn, onSignUp }: SignInDialogProps) {
    return (
        <PEDialog open={open} onClose={onClose}>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Image
                    unoptimized
                    className="mx-auto h-10 w-auto"
                    src="/people-eat-logo.jpeg"
                    alt="PeopleEat Firmen Logo"
                    width={800}
                    height={240}
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    In deinem Benutzerkonto anmelden
                </h2>
            </div>

            <SignInForm completeTitle={completeTitle} onSignIn={onSignIn} onSignUp={onSignUp} />
        </PEDialog>
    );
}
