export default function extractDate(dateStr, stats) {
    if (dateStr && dateStr.trim() !== '') {
        return Date.parse(dateStr);
    }

    if (stats) {
        // use file date
        return stats.mtime.getTime();
    }

    return -1;
}
