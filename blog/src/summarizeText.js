export default async function summarizeText(text, maxWords) {
    const words = text.trim().split(/\s+/);
    const summary = words.slice(0, maxWords).join(' ');
    return summary;
}
