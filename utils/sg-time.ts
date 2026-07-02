const SG_TIMEZONE = 'Asia/Singapore';

function parseDateOnly(dateOnly: string): Date {
  const match = dateOnly.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return new Date(dateOnly);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  // Use UTC noon to avoid day rollover when rendering in different server regions.
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

export function formatDateInSingapore(
  value: string | Date,
  options: Intl.DateTimeFormatOptions
): string {
  const date =
    typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? parseDateOnly(value)
      : new Date(value);

  return date.toLocaleString('en-SG', {
    ...options,
    timeZone: SG_TIMEZONE,
  });
}

export function formatSingaporeDate(value: string | Date): string {
  return formatDateInSingapore(value, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatSingaporeTime(value: string | Date): string {
  return formatDateInSingapore(value, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
