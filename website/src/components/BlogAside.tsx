import React from 'react';
import { Blog } from './../types';
import Link from './Link';
import titleCase from 'utils/titleCase';

interface BlogAsideProps {
    blog?: Blog
}

export default class BlogAside extends React.Component<BlogAsideProps> {

    render() {
        const { blog } = this.props;
        return <div className='blog-sidebar'>
            <Link href='/blog'>All ({blog?.posts.length})</Link>
            {
                blog?.categories.map((category: string) => {
                    return <Link href={`/blog?category=${category}`} key={category}>
                        {titleCase(category)} ({blog.categoryCount[category]})
                    </Link>
                })
            }

            <hr />
            <Link href='/blogArchive'>Archive</Link>
        </div>
    }
}
