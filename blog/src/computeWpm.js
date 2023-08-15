export default function computeWPM(text, wordsPerMinute = 238) {
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return time;
}
