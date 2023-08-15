import * as fs from 'fs';
import * as path from 'path';
import processPost from './processPost.js';

export default async function generateBlog(wordsPerMinute = 200, configFile) {
    const blogJson = {
        posts: [],
    };
    
    // read the config file
    console.log('Reading config file: ' + configFile);
    const configExists = fs.existsSync(configFile);
    const config = configExists ? JSON.parse(fs.readFileSync(configFile, 'utf8')) : {};

    const postFolder = path.resolve(config.posts || 'posts');
    if (!fs.existsSync(postFolder)) {
        console.log('Posts folder does not exist: ' + postFolder);
        process.exit(1);
    }

    // read all posts from the folder
    console.log('Reading all files from folder: ' + postFolder);
    const postFiles = fs.readdirSync(postFolder, {
        recursive: true
    });

    if (postFiles && postFiles.length === 0) {
        console.log('No posts found in the posts folder');
        process.exit(1);
    }

    // dist folder
    const distFolderPath = path.resolve(config.dist || 'dist');
    console.log('Creating dist folder at: ' + distFolderPath);
    fs.mkdirSync(distFolderPath, { recursive: true });

    // now recurse and build all posts
    for(let i = 0; i < postFiles.length; i++) {
        const postFileRelative = postFiles[i];
        const metadata = await processPost(postFolder, postFileRelative, distFolderPath, wordsPerMinute);
        if(metadata) {
            blogJson.posts.push(metadata);
        }
    }

    // all done, write the blog json file
    fs.writeFileSync(path.resolve(distFolderPath, 'blog.json'), JSON.stringify(blogJson, null, 2));
}

