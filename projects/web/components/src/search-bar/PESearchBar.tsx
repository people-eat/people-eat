import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label, Popover, Transition } from '@headlessui/react';
import { LocationSearchResult, SearchMode, toTranslatedFormattedDate } from '@people-eat/web-domain';
import classNames from 'classnames';
import { random } from 'lodash';
import { ChevronDownIcon, SearchIcon } from 'lucide-react';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PEAutoComplete, PEButton, PECalendar, PEFullPageSheet, PEIconButton } from '../_core';
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
                        className="flex flex-col gap-8"
                        onSubmit={handleSubmit(() => {
                            searchMode === 'COOKS' ? onSearchCooks() : onSearchMenus();
                            setShowMobileDialog(false);
                        })}
                        autoComplete="off"
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

                        <PEButton title="Suchen" type="submit" />
                    </form>
                </PEFullPageSheet>
            </div>

            {/* Desktop */}
            <div className="hidden lg:block w-full pl-4 py-2 pr-2">
                <div className="flex gap-2">
                    <Combobox
                        value={selectedLocation}
                        onChange={setSelectedLocation}
                        // onClose={() => undefined}
                        className="px-3 pt-2.5 flex-[3]"
                        as="div"
                    >
                        <div className="flex">
                            <div className="flex flex-col items-start w-full">
                                <Label className="text-xs font-medium text-gray-900">Adresse</Label>
                                <ComboboxInput
                                    className="border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 w-full"
                                    displayValue={(searchResult: LocationSearchResult) => searchResult?.text}
                                    onChange={(event) => onLocationSearchTextChange(event.target.value)}
                                    placeholder="Wo?"
                                    autoComplete="off"
                                />
                            </div>
                            <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                                <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white" />
                            </ComboboxButton>
                        </div>

                        {locationSearchResults.length > 0 && (
                            <ComboboxOptions
                                anchor="bottom end"
                                transition
                                className={classNames(
                                    'w-[var(--input-width)] rounded-xl border border-white/5 bg-white p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
                                    'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0',
                                    'shadow-lg',
                                )}
                            >
                                {locationSearchResults.map((searchResult) => (
                                    <ComboboxOption
                                        key={searchResult.id}
                                        value={searchResult}
                                        className={classNames(
                                            'relative cursor-default select-none p-2 w-full',
                                            'hover:bg-orange-400 hover:text-white',
                                            'focus:bg-orange-400 focus:text-white',
                                        )}
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <span className="truncate group-data-[selected]:font-semibold text-sm">
                                                {searchResult.text}
                                            </span>

                                            {/* <Check className="size-8 text-orange-500 bg-white rounded-full p-1 hidden group-data-[selected]:visible" /> */}
                                        </div>
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        )}
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
