
/**
 * Converts a timestamp to a human-readable relative time string (e.g., "2 days ago")
 *
 * @param timestamp - Timestamp in milliseconds (e.g., Date.now() or createdAt value)
 * @returns A string representing the relative time (e.g., "just now", "2 minutes ago", "3 days ago")
 */
export const getRelativeTimeString = (timestamp: number): string => {
  const currentTime = Date.now();
  const timeDifference = currentTime - timestamp;

  // Convert to seconds
  const secondsDifference = Math.floor(timeDifference / 1000);

  // Less than 1 minute
  if (secondsDifference < 60) {
    return "just now";
  }

  // Convert to minutes
  const minutesDifference = Math.floor(secondsDifference / 60);

  // Less than 1 hour
  if (minutesDifference < 60) {
    return minutesDifference === 1
      ? "1 minute ago"
      : `${minutesDifference} minutes ago`;
  }

  // Convert to hours
  const hoursDifference = Math.floor(minutesDifference / 60);

  // Less than 1 day
  if (hoursDifference < 24) {
    return hoursDifference === 1
      ? "1 hour ago"
      : `${hoursDifference} hours ago`;
  }

  // Convert to days
  const daysDifference = Math.floor(hoursDifference / 24);

  // Less than 1 month (approximated as 30 days)
  if (daysDifference < 30) {
    return daysDifference === 1 ? "1 day ago" : `${daysDifference} days ago`;
  }

  // Convert to months
  const monthsDifference = Math.floor(daysDifference / 30);

  // Less than 1 year
  if (monthsDifference < 12) {
    return monthsDifference === 1
      ? "1 month ago"
      : `${monthsDifference} months ago`;
  }

  // Convert to years
  const yearsDifference = Math.floor(monthsDifference / 12);
  return yearsDifference === 1 ? "1 year ago" : `${yearsDifference} years ago`;
};

/**
 * A more precise version that handles edge cases better and supports future timestamps
 *
 * @param timestamp - Timestamp in milliseconds
 * @param options - Optional configuration
 * @returns A string representing the relative time
 */
export const getRelativeTime = (
  timestamp: number,
  options: {
    future?: boolean; // Allow "in X days" for future dates
    shortFormat?: boolean; // Use shorter format (e.g., "2d ago" instead of "2 days ago")
  } = {}
): string => {
  const { future = true, shortFormat = false } = options;

  const now = Date.now();
  let diff = now - timestamp;
  let isFuture = false;

  // Handle future dates
  if (diff < 0) {
    if (!future) {
      return shortFormat ? "now" : "just now";
    }
    isFuture = true;
    diff = Math.abs(diff);
  }

  // Convert to seconds
  const seconds = Math.floor(diff / 1000);

  // Helper function to format the output
  const format = (value: number, unit: string, shortUnit: string): string => {
    if (value === 0) {
      return shortFormat ? "now" : "just now";
    }

    const unitStr = shortFormat ? shortUnit : value === 1 ? unit : `${unit}s`;
    const timeStr = `${value}${shortFormat ? "" : " "}${unitStr}`;

    if (isFuture) {
      return shortFormat ? `in ${timeStr}` : `in ${timeStr}`;
    } else {
      return shortFormat ? `${timeStr} ago` : `${timeStr} ago`;
    }
  };

  // Less than a minute
  if (seconds < 60) {
    return format(0, "second", "s");
  }

  // Less than an hour
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return format(minutes, "minute", "m");
  }

  // Less than a day
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return format(hours, "hour", "h");
  }

  // Less than a month (30 days)
  if (seconds < 2592000) {
    const days = Math.floor(seconds / 86400);
    return format(days, "day", "d");
  }

  // Less than a year
  if (seconds < 31536000) {
    const months = Math.floor(seconds / 2592000);
    return format(months, "month", "mo");
  }

  // Years
  const years = Math.floor(seconds / 31536000);
  return format(years, "year", "y");
};
