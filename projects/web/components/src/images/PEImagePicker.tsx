import { PEDialog } from '@people-eat/web-core-components';
import Compressor from 'compressorjs';
import { Plus, Trash } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, type ReactElement } from 'react';
import { useFilePicker } from 'use-file-picker';
import { PEImageClipper } from './PEImageClipper';

export interface PEImagePickerProps {
    onPick?: (image: File) => void;
    onRemoveDefaultImage?: () => void;
    defaultImage?: string;
}

export function PEImagePicker({ onPick, onRemoveDefaultImage, defaultImage }: PEImagePickerProps): ReactElement {
    const [base64Image, setBase64Image] = useState<string | undefined>(defaultImage);
    const [base64CroppedImage, setBase64CroppedImage] = useState<string | undefined>(defaultImage);
    const [showImageCropper, setShowImageCropper] = useState(false);

    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        limitFilesConfig: { max: 1 },
        // in megabytes
        maxFileSize: 12,
        onFilesSuccessfullySelected: ({ plainFiles, filesContent }) => {
            const selectedImage: File | undefined = plainFiles[0];
            const selectedBase64Image: string | undefined = filesContent[0]?.content;
            if (!selectedImage || !selectedBase64Image) return;
            setBase64Image(selectedBase64Image);
            setShowImageCropper(true);
        },
    });

    useEffect(() => {
        setBase64Image(defaultImage);
        setBase64CroppedImage(defaultImage);
    }, [defaultImage]);

    function handleRemoveImage(event: React.MouseEvent<HTMLButtonElement>): void {
        event.stopPropagation();
        setBase64CroppedImage(undefined);
        onRemoveDefaultImage?.();
    }

    return (
        <div className="flex flex-col items-start">
            <button
                type="button"
                onClick={openFilePicker}
                className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 focus:ring-orange-600 relative flex overflow-hidden items-center w-[200px] h-[200px] hover:cursor-pointer select-none hover:shadow-primary delay-100 ease-linear transition justify-center"
            >
                {base64CroppedImage && (
                    <>
                        <Image
                            style={{ width: '100%', objectPosition: 'center', objectFit: 'cover' }}
                            src={base64CroppedImage}
                            alt=""
                            width={200}
                            height={200}
                        />
                        <button
                            type="button"
                            onClick={(event): void => handleRemoveImage(event)}
                            className="flex justify-center items-center opacity-50 hover:opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                            <Trash />
                        </button>
                    </>
                )}
                {!base64CroppedImage && <Plus />}
            </button>

            {base64Image && showImageCropper && (
                <PEDialog open>
                    <PEImageClipper
                        imagePath={base64Image}
                        onSuccess={(croppedImage: File, croppedBase64Image: string): void => {
                            new Compressor(croppedImage, {
                                maxWidth: 1000,
                                maxHeight: 1000,
                                quality: 0.6,
                                success: (compressedImage: File): void => onPick?.(compressedImage),
                            });

                            setBase64CroppedImage(croppedBase64Image);
                            setShowImageCropper(false);
                        }}
                    />
                </PEDialog>
            )}
        </div>
    );
}
