import { PEButton } from '@people-eat/web-core-components';
import { useRef, useState, type ReactElement, type SyntheticEvent } from 'react';
import { ReactCrop, centerCrop, makeAspectCrop, type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export interface PEImageClipperProps {
    imagePath: string;
    onSuccess: (croppedImage: File, croppedBase64Image: string) => void;
}

export function PEImageClipper({ imagePath, onSuccess }: PEImageClipperProps): ReactElement {
    const [crop, setCrop] = useState<Crop | undefined>();
    const imgRef = useRef<HTMLImageElement | null>(null);

    function onImageLoad(e: SyntheticEvent<HTMLImageElement, Event>): void {
        const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
        setCrop(centerCrop(makeAspectCrop({ unit: '%', width: 95 }, 1, width, height), width, height));
    }

    return (
        <div className="flex flex-col gap-16 w-full">
            <ReactCrop crop={crop} onChange={setCrop} onComplete={setCrop} keepSelection aspect={1}>
                <img src={imagePath} alt="" onLoad={onImageLoad} ref={imgRef} />
            </ReactCrop>

            <PEButton
                // eslint-disable-next-line max-statements
                onClick={(): void => {
                    if (!crop) return;

                    // create a canvas element to draw the cropped image
                    const canvas = document.createElement('canvas');

                    // get the image element
                    const image = imgRef.current;

                    // draw the image on the canvas
                    if (image) {
                        const scaleX = image.naturalWidth / image.width;
                        const scaleY = image.naturalHeight / image.height;
                        const ctx = canvas.getContext('2d');
                        const pixelRatio = window.devicePixelRatio;

                        // Calculate the canvas size while ensuring it doesn't exceed Safari's limits
                        // Adjust as needed
                        const maxCanvasSize = 4096;
                        const canvasWidth = Math.min(crop.width * pixelRatio * scaleX, maxCanvasSize);
                        const canvasHeight = Math.min(crop.height * pixelRatio * scaleY, maxCanvasSize);
                        canvas.width = canvasWidth;
                        canvas.height = canvasHeight;

                        if (ctx) {
                            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
                            ctx.imageSmoothingQuality = 'high';

                            // Calculate the size of the cropped region within the canvas
                            const scaledCropWidth = (crop.width * scaleX * canvasWidth) / (crop.width * pixelRatio * scaleX);
                            const scaledCropHeight = (crop.height * scaleY * canvasHeight) / (crop.height * pixelRatio * scaleY);

                            ctx.drawImage(
                                image,
                                crop.x * scaleX,
                                crop.y * scaleY,
                                crop.width * scaleX,
                                crop.height * scaleY,
                                0,
                                0,
                                scaledCropWidth,
                                scaledCropHeight,
                            );
                        }

                        // Convert the canvas to a base64 image
                        const base64Image = canvas.toDataURL('image/png');

                        if (base64Image) {
                            const fileType = base64Image.split(';')[0]?.split(':')[1];

                            const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
                            const file = new File([buffer], 'image', { type: fileType });

                            onSuccess(file, base64Image);
                        }
                    }
                }}
                title="Fertig"
            />
        </div>
    );
}
