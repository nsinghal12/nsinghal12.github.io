// This is the main entry point for the blog engine.
// It is responsible for reading all the posts and pages
// from disk, and generate the required JSON and markdown files.
// It also generates the RSS feed and the sitemap.

import generateBlog from './src/generateBlog.js';

// basic initialization
const wordsPerMinute = 238;

// read command line arguments to find pages and posts parameters
const args = process.argv.slice(1);
const configFile = args[1] || 'blog.config.json';

generateBlog(wordsPerMinute, configFile)
    .then(() => {
        console.log('Blog generated successfully!');
    }).catch((err) => {
        console.error('Error generating blog', err);
    });


console.info('Blog generated successfully!');
