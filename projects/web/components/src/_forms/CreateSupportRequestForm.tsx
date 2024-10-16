import { useForm } from 'react-hook-form';
import { PEButton, PETextArea, PETextField } from '../_core';

export interface CreateSupportRequestFormProps {
    onCreate: (data: CreateSupportRequestFormInputs) => void;
}

export interface CreateSupportRequestFormInputs {
    title: string;
    message: string;
}

export function CreateSupportRequestForm({ onCreate }: CreateSupportRequestFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateSupportRequestFormInputs>({});

    return (
        <form
            onSubmit={handleSubmit((data) => {
                onCreate(data);
                reset();
            })}
            className="flex flex-col gap-8"
        >
            <PETextField
                id="title"
                labelTitle="Titel"
                placeholder="Worum geht es?"
                type="text"
                errorMessage={errors.title?.message}
                {...register('title', {
                    required: 'Deine Support Anfrage braucht noch einen Titel.',
                    minLength: {
                        value: 5,
                        message: 'Der Titel deiner Support Anfrage ist zu kurz.',
                    },
                })}
            />

            <PETextArea
                id="message"
                labelTitle="Nachricht"
                placeholder="Formuliere deine Support Anfrage"
                errorMessage={errors.message?.message}
                {...register('message', {
                    required: 'Deine Anfrage braucht eine Nachricht.',
                    minLength: {
                        value: 5,
                        message: 'Deine Nachricht ist zu kurz.',
                    },
                })}
            />

            <PEButton title="Support Anfrage senden" type="submit" />
        </form>
    );
}
