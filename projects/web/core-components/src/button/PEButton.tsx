export interface PEButtonProps {
    title: string;
    type?: 'primary' | 'secondary' | 'submit';
    onClick?: () => void;
}

export function PEButton({ title, type = 'primary', onClick }: PEButtonProps) {
    if (type === 'submit') {
        return (
            <input
                type="submit"
                className="rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 cursor-pointer"
                value={title}
            />
        );
    }

    if (type === 'secondary')
        return (
            <button
                type="button"
                className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={onClick}
            >
                {title}
            </button>
        );

    return (
        <button
            type="button"
            className="rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            onClick={onClick}
        >
            {title}
        </button>
    );
}
