import React from 'react';
import BlogPost from 'components/BlogPost';
import { Blog, PostMetaData } from 'types';
import parseBlog from 'utils/parseBlog';
import BlogAside from 'components/BlogAside';

interface BlogPageState {
    loading: boolean;
    blog?: Blog;
    error: boolean;
}

export default class BlogPage extends React.Component<React.PropsWithChildren, BlogPageState> {

    state: BlogPageState = {
        loading: true,
        error: false,
    }

    componentDidMount = async (): Promise<void> => {
        try {
            const response = await fetch('/blog.json');
            const blogJson = await response.json();
            this.setState({ blog: parseBlog(blogJson), loading: false });
        } catch (e) {
            this.setState({ loading: false, error: true });
        }
    }

    render() {
        const { loading, blog, error } = this.state;

        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        console.log('filtering for category', category);

        if (error) {
            return <div className='alert alert-danger'>
                Unable to load blog data. Please try again later.
            </div>
        }

        if (loading) {
            return <h1>Loading...</h1>
        }

        let list: PostMetaData[] = blog?.posts || [];
        if (category) {
            list = list.filter((post: PostMetaData) => {
                return post.category === category;
            });
        }

        return <div className='d-flex flex-row'>
            <div className='sidebar'>
                <BlogAside blog={blog} />
            </div>
            <div className='blog-posts'>
                {list.map((post: PostMetaData) => {
                    return <BlogPost post={post} key={post.id} />
                })}
            </div>
        </div >
    }

}
