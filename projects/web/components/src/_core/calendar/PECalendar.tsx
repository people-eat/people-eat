import classnames from 'classnames';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DateItem {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isDisabled: boolean;
}

type FirstWeekDay = 'MONDAY' | 'SUNDAY';

function getDatesForMonth(
    year: number,
    month: number,
    firstWeekDay: FirstWeekDay = 'SUNDAY',
    selectedDate?: Date,
    minDate?: Date,
): DateItem[] {
    const dates: DateItem[] = [];
    const today = new Date();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDaysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysOffset = firstWeekDay === 'MONDAY' ? (firstDayOfWeek + 6) % 7 : firstDayOfWeek;

    // Add days from the previous month
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = daysOffset - 1; i >= 0; i--) {
        const date = new Date(year, month - 1, prevMonthLastDate - i);
        dates.push({
            date,
            isCurrentMonth: false,
            isToday: date.toDateString() === today.toDateString(),
            isSelected: selectedDate ? date.toDateString() === selectedDate.toDateString() : false,
            isDisabled: minDate ? date.getTime() < minDate.getTime() : false,
        });
    }

    // Add days from the current month
    for (let i = 1; i <= numDaysInMonth; i++) {
        const date = new Date(year, month, i);
        dates.push({
            date,
            isCurrentMonth: true,
            isToday: date.toDateString() === today.toDateString(),
            isSelected: selectedDate ? date.toDateString() === selectedDate.toDateString() : false,
            isDisabled: minDate ? date.getTime() < minDate.getTime() : false,
        });
    }

    // Determine if the last week of the current month is complete
    const lastDayOfWeek = lastDayOfMonth.getDay();
    const numDaysInLastWeek = firstWeekDay === 'SUNDAY' ? 6 - lastDayOfWeek : 7 - lastDayOfWeek;

    // Add days from the next month only if the last week of the current month is incomplete
    if (numDaysInLastWeek !== 7) {
        const numDaysFromNextMonth = 7 - numDaysInLastWeek;
        for (let i = 1; i <= numDaysFromNextMonth; i++) {
            const date = new Date(year, month + 1, i);
            dates.push({
                date,
                isCurrentMonth: false,
                isToday: date.toDateString() === today.toDateString(),
                isSelected: selectedDate ? date.toDateString() === selectedDate.toDateString() : false,
                isDisabled: minDate ? date.getTime() < minDate.getTime() : false,
            });
        }
    }

    return dates;
}

interface CalendarDay {
    date: string;
    isCurrentMonth?: boolean;
    isToday?: boolean;
    isSelected?: boolean;
    isDisabled: boolean;
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export interface PECalendarProps {
    selectedDate?: Date;
    onSelectDate: (selectedDate: Date) => void;

    minDate?: Date;
}

const monthName: Record<number, string> = {
    0: 'Januar',
    1: 'Februar',
    2: 'März',
    3: 'April',
    4: 'Mai',
    5: 'Juni',
    6: 'Juli',
    7: 'August',
    8: 'September',
    9: 'Oktober',
    10: 'November',
    11: 'Dezember',
};

export function PECalendar({ selectedDate, onSelectDate, minDate }: PECalendarProps) {
    const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
    const [displayYear, setDisplayYear] = useState(0);
    const [displayMonth, setDisplayMonth] = useState(0);

    useEffect(() => {
        const d = selectedDate ?? new Date();
        setDisplayYear(d.getFullYear());
        setDisplayMonth(d.getMonth());
        setCalendarDays(
            getDatesForMonth(d.getFullYear(), d.getMonth(), 'MONDAY', selectedDate, minDate).map((d1) => ({
                ...d1,
                date: formatDate(d1.date),
            })),
        );
    }, [selectedDate, minDate]);

    function incrementMonth() {
        const newDisplayMonth = displayMonth === 11 ? 0 : displayMonth + 1;
        setDisplayMonth(newDisplayMonth);
        const newDisplayYear = displayMonth === 11 ? displayYear + 1 : displayYear;
        setDisplayYear(newDisplayYear);

        setCalendarDays(
            getDatesForMonth(newDisplayYear, newDisplayMonth, 'MONDAY', selectedDate, minDate).map((d1) => ({
                ...d1,
                date: formatDate(d1.date),
            })),
        );
    }

    function decrementMonth() {
        const newDisplayMonth = displayMonth === 0 ? 11 : displayMonth - 1;
        setDisplayMonth(newDisplayMonth);
        const newDisplayYear = displayMonth === 0 ? displayYear - 1 : displayYear;
        setDisplayYear(newDisplayYear);

        setCalendarDays(
            getDatesForMonth(newDisplayYear, newDisplayMonth, 'MONDAY', selectedDate, minDate).map((d1) => ({
                ...d1,
                date: formatDate(d1.date),
            })),
        );
    }

    return (
        <div>
            <div className="flex items-center">
                {/* <h2 className="flex-auto text-sm font-semibold text-gray-900"> */}
                <h2 className="flex-auto text-lg font-semibold">
                    {monthName[displayMonth]} {displayYear}
                </h2>
                <button
                    type="button"
                    className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                    onClick={decrementMonth}
                >
                    <span className="sr-only">Previous month</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                    type="button"
                    className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                    onClick={incrementMonth}
                >
                    <span className="sr-only">Next month</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>
            <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
                <div>M</div>
                <div>D</div>
                <div>M</div>
                <div>D</div>
                <div>F</div>
                <div>S</div>
                <div>S</div>
            </div>
            <div className="mt-2 grid grid-cols-7 text-sm">
                {calendarDays.map((day, dayIdx) => (
                    <div key={day.date} className={classnames(dayIdx > 6 && 'border-t border-gray-200', 'py-2')}>
                        {!day.isDisabled && (
                            <button
                                type="button"
                                className={classnames(
                                    day.isSelected && 'text-white',
                                    !day.isSelected && day.isToday && 'text-orange-500',
                                    !day.isSelected && !day.isToday && day.isCurrentMonth && 'text-gray-900',
                                    !day.isSelected && !day.isToday && !day.isCurrentMonth && 'text-gray-400',
                                    day.isSelected && day.isToday && 'bg-orange-500',
                                    day.isSelected && !day.isToday && 'bg-gray-900',
                                    !day.isSelected && 'hover:bg-gray-200',
                                    (day.isSelected || day.isToday) && 'font-semibold',
                                    'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
                                )}
                                onClick={() => onSelectDate(new Date(day.date))}
                            >
                                <time dateTime={day.date}>{day.date.split('-').pop()?.replace(/^0/, '')}</time>
                            </button>
                        )}
                        {day.isDisabled && (
                            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full">
                                <time className={day.isToday ? 'text-orange-500' : 'text-gray-400'} dateTime={day.date}>
                                    {day.date.split('-').pop()?.replace(/^0/, '')}
                                </time>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
