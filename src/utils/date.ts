export function formatDateFromCompact(date: string): string
    {
        return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
    }
