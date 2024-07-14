import classNames from 'classnames';

export const primaryButtonClassName = classNames(
    'rounded-full bg-orange-500 font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 cursor-pointer',
    'px-4 py-2.5',
    'text-sm',
    'text-nowrap',
);

export const secondaryButtonClassName = classNames(
    'rounded-full bg-white font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
    'px-4 py-2.5',
    'text-sm',
    'text-nowrap',
    'text-center',
);
