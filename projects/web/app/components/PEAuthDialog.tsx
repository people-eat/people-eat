import { useLazyQuery, useMutation } from '@apollo/client';
import { LoadingDialog, SignInDialog, SignUpDialog } from '@people-eat/web-components';
import { PEAlert } from '@people-eat/web-components';
import {
    AssignOneSessionByEmailAddressDocument,
    CreateOneUserDocument,
    GetSignedInUserDocument,
    SignedInUser,
} from '@people-eat/web-domain';
import { useEffect, useState } from 'react';

export interface PEAuthDialogProps {
    open: boolean;
    onSignInSuccessful?: () => void;
    onSignedInUserFetched?: (signedInUser: SignedInUser) => void;
    onClose: () => void;
    signInButtonTitle: string;
    signUpButtonTitle: string;
}

export function PEAuthDialog({
    open,
    onClose,
    signInButtonTitle,
    signUpButtonTitle,
    onSignInSuccessful,
    onSignedInUserFetched,
}: PEAuthDialogProps) {
    const [showSignIn, setShowSignIn] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const [assignOneSessionByEmailAddress, { data: signInData, loading: assignSessionLoading, reset: signInReset }] = useMutation(
        AssignOneSessionByEmailAddressDocument,
    );
    const [createOneUser, { data: signUpData, loading: createUserLoading, reset: signUpReset }] = useMutation(CreateOneUserDocument);

    const [getSignedInUser, { loading: loadingSignedInUser }] = useLazyQuery(GetSignedInUserDocument);

    useEffect(() => {
        if (open) {
            setShowSignIn(open);
            setShowSignUp(false);
        } else {
            setShowSignIn(false);
            setShowSignUp(false);
        }
    }, [open]);

    const showCreateUserSuccessAlert = signUpData?.users.createOne.__typename === 'CreateOneUserSuccessResult';
    const showCreatesUserFailedAlert = signUpData?.users.createOne.__typename === 'CreateOneUserFailedResult';
    const showAlreadyExistsAlert = signUpData?.users.createOne.__typename === 'CreateOneUserFailedAlreadyExistsResult';

    const showSignInFailedAlert = signInData ? !signInData.sessions.success : false;

    return (
        <>
            {/* Sign In */}

            <LoadingDialog active={assignSessionLoading} />

            <SignInDialog
                open={showSignIn}
                onClose={() => {
                    setShowSignIn(false);
                    if (!showSignUp) onClose();
                }}
                completeTitle={signInButtonTitle}
                onSignIn={({ emailAddress, password }) => {
                    assignOneSessionByEmailAddress({
                        variables: {
                            request: {
                                emailAddress,
                                password,
                                platform: 'BROWSER',
                                title: '',
                            },
                        },
                    }).then(() => {
                        setShowSignIn(false);
                        onSignInSuccessful?.();
                        getSignedInUser()
                            .then((result) =>
                                result.data?.sessions.current.user
                                    ? onSignedInUserFetched?.(result.data?.sessions.current.user)
                                    : setShowSignIn(true),
                            )
                            .catch(() => setShowSignIn(true));
                    });
                }}
                onSignUp={() => {
                    setShowSignIn(false);
                    setShowSignUp(true);
                }}
            />

            <PEAlert
                type="ERROR"
                open={showSignInFailedAlert}
                title="Leider ist ein Fehler aufgetreten"
                subtitle="Du kannst es erneut versuchen"
                primaryButton={{
                    title: 'Erneut versuchen',
                    onClick: () => {
                        signInReset();
                        setShowSignIn(true);
                    },
                }}
            />

            {/* Sign Up */}
            <LoadingDialog active={createUserLoading} />

            <SignUpDialog
                open={showSignUp}
                onClose={() => {
                    setShowSignUp(false);
                    if (!showSignIn) onClose();
                }}
                completeTitle={signUpButtonTitle}
                onSignUp={({ firstName, lastName, emailAddress, phoneNumber, password }) => {
                    createOneUser({
                        variables: {
                            request: {
                                firstName,
                                lastName,
                                emailAddress,
                                phoneNumber,
                                password,
                                gender: 'NO_INFORMATION',
                                language: 'GERMAN',
                            },
                        },
                    }).then(() => setShowSignUp(false));
                }}
                onSignIn={() => {
                    setShowSignIn(true);
                    setShowSignUp(false);
                }}
            />

            <PEAlert
                open={showCreateUserSuccessAlert}
                title="Deine Registrierung war erfolgreich"
                subtitle="Bitte überprüfe dein Email Postfach um deine E-Mail Adresse zu bestätigen und komme anschießend hierher zurück."
                primaryButton={{
                    title: 'Zur Anmeldung',
                    onClick: () => {
                        setShowSignUp(false);
                        setShowSignIn(true);
                        signUpReset();
                    },
                }}
            />

            <PEAlert
                type="ERROR"
                open={showCreatesUserFailedAlert}
                title="Leider ist ein Fehler aufgetreten"
                subtitle="Du kannst es erneut versuchen"
                primaryButton={{ title: 'Erneut versuchen', onClick: () => signUpReset() }}
            />

            <PEAlert
                type="ERROR"
                open={showAlreadyExistsAlert}
                title="Es existiert bereits ein Benutzer mit der von dir angegebenen Email Adresse"
                subtitle="Anstatt dich zu registrieren, melde dich bitte an. Solltest du dein Passwort vergessen haben, wähle 'Passwort vergessen?'"
                primaryButton={{
                    title: 'Zur Anmeldung',
                    onClick: () => {
                        setShowSignIn(true);
                        setShowSignUp(false);
                        signUpReset();
                    },
                }}
                secondaryButton={{ title: 'Passwort vergessen?', onClick: () => undefined }}
            />

            {/* Fetch signed in user */}

            <LoadingDialog active={loadingSignedInUser} />
        </>
    );
}
