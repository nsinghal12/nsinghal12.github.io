import * as fs from 'fs';
import * as path from 'path';
import yamlFront from 'yaml-front-matter';
import { JSDOM } from 'jsdom';
import summarizeText from './summarizeText.js';
import computeWPM from './computeWpm.js';
import extractDate from './extractDate.js';
import Showdown from 'showdown';

const converter = new Showdown.Converter();
converter.setFlavor('github');

export default async function processPost(postFolder, postFileRelative, distFolderPath, wordsPerMinute) {
    // start processing
    const postFile = path.resolve(postFolder, postFileRelative);
    if (fs.lstatSync(postFile).isDirectory()) {
        return;
    }

    console.log('Processing file: ' + postFile);
    if (typeof postFile !== 'string') {
        console.warn('Post file path is not a string: ' + postFile);
        return;
    }

    // get the post file contents
    const post = (fs.readFileSync(postFile, 'utf8') || '').trim();
    const postStat = fs.statSync(postFile);

    // find end of front matter if any
    const endOfFrontMatter = post.startsWith('---') ? post.indexOf('---\n', 3) : 0;
    const frontMatter = yamlFront.loadFront(post);
    const content = post.substring(endOfFrontMatter + 4).trim();

    console.log(`  > post markdown length: ${content.length}`);

    // conver the content to html
    const html = converter.makeHtml(content);    
    const dom = new JSDOM(html);
    const text = dom.window.document.body.textContent || '';

    console.log(`  > text length: ${text.length}`);

    // check key pieces of data in frontMatter
    const metadata = {
        id: postFile,
        title: frontMatter.title || path.parse(postFileRelative).name,
        path: frontMatter.path || postFileRelative,
        category: frontMatter.category || '',
        description: frontMatter.description || '',
        date: extractDate(frontMatter.date, postStat),
        published: frontMatter.published || true,
        tags: frontMatter.tags || [],
        expiry: extractDate(frontMatter.expiry),
        series: frontMatter.series || '',
        summary: await summarizeText(text, 200),
        timeToRead: computeWPM(text, wordsPerMinute),
        content: content,
        contentType: path.extname(postFile) === '.md' ? 'markdown' : 'html',
    }

    if (metadata.published) {
        // write the content to the dist folder
        const target = path.resolve(distFolderPath, metadata.path.startsWith('/') ? metadata.path.substring(1) : metadata.path);
        fs.mkdirSync(path.dirname(target), { recursive: true });

        console.log(`  > Writing post "${postFile}" to dist folder: ${metadata.path}`)
        fs.writeFileSync(target, content);
    }

    return metadata
}
