import Image from 'next/image';
import { SignUpForm, SignUpFormInputs } from '../../_forms/SignUpForm';
import { PEDialog } from '../dialog/PEDialog';

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
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Image
                    className="mx-auto h-10 w-auto hidden md:block mb-10"
                    src="/people-eat-logo-title.png"
                    alt="PeopleEat Firmen Logo"
                    width={800}
                    height={240}
                />
                <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">Einen Gastgeberaccount erstellen</h2>
            </div>

            <SignUpForm completeTitle={completeTitle} onSignUp={onSignUp} onSignIn={onSignIn} />
        </PEDialog>
    );
}
