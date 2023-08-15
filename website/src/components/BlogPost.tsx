import React from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { PostMetaData } from 'types';
import remarkGfm from 'remark-gfm';
import PostContent from './PostContent';
import PostDivider from './PostDivider';

interface BlogPostProps {
    post: PostMetaData;
    summarize?: boolean;
}

export default class BlogPost extends React.Component<BlogPostProps> {

    render() {
        const { post, summarize = false } = this.props;
        return <article className='blog-post' key={post.id}>
            <h1><a href={post.path}>{post.title}</a></h1>
            <div className='blog-post-meta text-muted'>
                {post.category && <>
                    <span className='category'>
                        Published in {post.category}
                    </span>
                    <span className='spacer'>⏺</span>
                </>}
                <span className='reading-time'>
                    {post.timeToRead} min read
                </span>
                <span className='spacer'>⏺</span>
                <span className='published'>
                    {new Date(post.date).toLocaleDateString('en-US')}
                </span>
            </div>
            <hr />
            <PostContent content={post.content} />

            <PostDivider />
        </article >
    }

}
