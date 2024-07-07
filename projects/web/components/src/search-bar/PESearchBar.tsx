import { Combobox, Popover, Transition } from '@headlessui/react';
import { PEAutoComplete, PEButton, PECalendar, PEFullPageSheet, PEIconButton } from '@people-eat/web-core-components';
import { LocationSearchResult, SearchMode, toTranslatedFormattedDate } from '@people-eat/web-domain';
import classNames from 'classnames';
import { random } from 'lodash';
import { CheckIcon, SearchIcon } from 'lucide-react';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SearchModeSwitch } from '../search-mode-switch/SearchModeSwitch';
import { ParticipantsPicker } from './PEParticipantsPicker';

export interface PESearchBarProps {
    onLocationSearchTextChange: (changedLocationSearchText: string) => void;
    locationSearchResults: LocationSearchResult[];
    selectedLocation?: LocationSearchResult;
    setSelectedLocation: (location: LocationSearchResult) => void;
    adults: number;
    setAdults: (changedAdults: number) => void;
    kids: number;
    setKids: (changedKids: number) => void;
    date: Date;
    setDate: (changedDate: Date) => void;
    searchMode: SearchMode;
    setSearchMode: (changedSearchMode: SearchMode) => void;

    onSearchMenus: () => void;
    onSearchCooks: () => void;
}

interface PESearchBarFormInputs {
    location: string;
}

export function PESearchBar({
    onLocationSearchTextChange,
    locationSearchResults,
    selectedLocation,
    setSelectedLocation,
    adults,
    setAdults,
    kids,
    setKids,
    date,
    setDate,
    searchMode,
    setSearchMode,
    onSearchMenus,
    onSearchCooks,
}: PESearchBarProps) {
    const [showMobileDialog, setShowMobileDialog] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PESearchBarFormInputs>();

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);

    return (
        <div className="bg-white rounded-full shadow-lg shadow-orange-500/20 flex-1">
            {/* Mobile */}
            <div className="lg:hidden p-4">
                <button
                    type="button"
                    className="flex gap-6 items-center w-full rounded-full  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                    onClick={() => setShowMobileDialog(!showMobileDialog)}
                >
                    <SearchIcon strokeWidth={1.5} />
                    <div className="flex flex-col items-start rounded-md w-full">
                        <label htmlFor="name" className="font-semibold text-gray-900">
                            Suchkriterien
                        </label>
                        <span className="text-gray-400 line-clamp-1 text-start">
                            {selectedLocation ? selectedLocation.text : 'Adresse'}
                        </span>
                    </div>
                </button>

                <PEFullPageSheet title="Suche" open={showMobileDialog} onClose={() => setShowMobileDialog(!showMobileDialog)}>
                    <form
                        className="flex flex-col gap-16"
                        onSubmit={handleSubmit(() => {
                            searchMode === 'COOKS' ? onSearchCooks() : onSearchMenus();
                            setShowMobileDialog(false);
                        })}
                    >
                        <div className="flex flex-col gap-4">
                            <h2 className="text-lg font-semibold">Wonach suchst du?</h2>
                            <SearchModeSwitch activeMode={searchMode} onChange={setSearchMode} />
                        </div>

                        <PEAutoComplete
                            title="Adresse"
                            options={locationSearchResults}
                            selectedOption={selectedLocation}
                            onSelectedOptionChange={setSelectedLocation}
                            getOptionIdentifier={(location) => location.text + random()}
                            getLabel={(location) => location.text}
                            errorMessage={errors.location && 'This field is required'}
                            {...register('location', { onChange: (event) => onLocationSearchTextChange(event.target.value) })}
                        />

                        <ParticipantsPicker adults={adults} setAdults={setAdults} children={kids} setChildren={setKids} />

                        <div className="flex flex-col gap-4">
                            <h2 className="text-lg font-semibold">Wann soll das Event stattfinden?</h2>
                            <PECalendar selectedDate={date} onSelectDate={setDate} minDate={minDate} />
                        </div>
                        <div className="flex flex-row-reverse mt-4">
                            <PEButton title="Suchen" type="submit" size="constant" />
                        </div>
                    </form>
                </PEFullPageSheet>
            </div>

            {/* Desktop */}
            <div className="hidden lg:block w-full pl-4 py-2 pr-2">
                <div className="flex gap-2">
                    <Combobox
                        as="div"
                        value={selectedLocation}
                        onChange={setSelectedLocation}
                        className="flex flex-col items-start px-3 pt-2.5 flex-[3]"
                    >
                        <Combobox.Label className="text-xs font-medium text-gray-900">Adresse</Combobox.Label>
                        <div className="relative w-full">
                            <Combobox.Input
                                className="border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 w-full"
                                onChange={(event) => onLocationSearchTextChange(event.target.value)}
                                displayValue={(person: LocationSearchResult) => person?.text}
                                placeholder="Wo?"
                            />
                            {/* <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <ChevronsUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </Combobox.Button> */}

                            {locationSearchResults.length > 0 && (
                                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {locationSearchResults.map((location) => (
                                        <Combobox.Option
                                            key={location.id}
                                            value={location}
                                            className={({ active }) =>
                                                classNames(
                                                    'relative cursor-default select-none py-2 pl-3 pr-9',
                                                    active ? 'bg-orange-400 text-white' : 'text-gray-900',
                                                )
                                            }
                                        >
                                            {({ active, selected }) => (
                                                <>
                                                    <div className="flex">
                                                        <span className={classNames('truncate', selected && 'font-semibold')}>
                                                            {location.text}
                                                        </span>
                                                        {/* <span
                                                                className={classNames(
                                                                    'ml-2 truncate text-gray-500',
                                                                    active ? 'text-indigo-200' : 'text-gray-500',
                                                                )}
                                                            >
                                                                {person.secondaryText}
                                                            </span> */}
                                                    </div>

                                                    {selected && (
                                                        <span
                                                            className={classNames(
                                                                'absolute inset-y-0 right-0 flex items-center pr-4',
                                                                active ? 'text-white' : 'text-orange-500',
                                                            )}
                                                        >
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))}
                                </Combobox.Options>
                            )}
                        </div>
                    </Combobox>

                    <div className="flex-[2] flex gap-2 [&>*]:flex-1">
                        <Popover className="relative">
                            <Popover.Button className="flex flex-col items-start rounded-md px-3 pb-1.5 pt-2.5 w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
                                <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                                    Wann?
                                </label>

                                <p className="block w-full text-start text-gray-900 focus:ring-0 sm:text-sm sm:leading-6">
                                    {toTranslatedFormattedDate(date)}
                                </p>
                            </Popover.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                    {({ close }) => (
                                        <div className="w-screen max-w-sm flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                            <div className="p-4">
                                                <PECalendar
                                                    selectedDate={date}
                                                    onSelectDate={(changedDate) => {
                                                        setDate(changedDate);
                                                        close();
                                                    }}
                                                    minDate={minDate}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </Popover.Panel>
                            </Transition>
                        </Popover>
                    </div>

                    <div className="flex-1 flex gap-2 [&>*]:flex-1">
                        <Popover className="relative">
                            <Popover.Button className="flex flex-col items-start rounded-md px-3 pb-1.5 pt-2.5 w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
                                <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                                    Wer?
                                </label>
                                <div className="block w-full text-start text-gray-900 focus:ring-0 sm:text-sm sm:leading-6">
                                    {adults + kids}
                                </div>
                            </Popover.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                    <div className="w-screen max-w-sm flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                        <div className="p-4">
                                            <ParticipantsPicker
                                                adults={adults}
                                                setAdults={setAdults}
                                                children={kids}
                                                setChildren={setKids}
                                            />
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </Popover>
                    </div>

                    <PEIconButton onClick={searchMode === 'COOKS' ? onSearchCooks : onSearchMenus}>
                        <SearchIcon strokeWidth={1.5} />
                    </PEIconButton>
                </div>
            </div>
        </div>
    );
}
