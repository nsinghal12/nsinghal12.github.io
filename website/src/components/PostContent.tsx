import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkImages from 'remark-images'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from "rehype-raw";
import { Tweet } from 'react-tweet'

interface PostContentProps {
    content: string;
}

interface PostContentState {
    hasError: boolean;
    error?: Error;
}

const REMARK_PLUGINS = [remarkGfm, remarkImages];
const REHYPE_PLUGINS = [rehypeRaw];

export default class PostContent extends React.Component<PostContentProps, PostContentState> {

    state: PostContentState = {
        hasError: false
    };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    render() {
        const { content } = this.props;
        const { hasError, error } = this.state;
        if (hasError) {
            return <div className='blog-post-content'>
                <div className='alert alert-warning'>Unable to render Markdown, below is the plain text version of the post.</div>
                {content}
            </div>
        }

        return <div className='blog-post-content'>
            <ReactMarkdown
                remarkPlugins={REMARK_PLUGINS}
                rehypePlugins={REHYPE_PLUGINS}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match: string[] = /language-(\w+)/.exec(className || '') || [];
                        const language = (match[1] || '').toLowerCase().trim();
                        console.log(String(children));

                        if (language === 'tweet') {
                            return <Tweet id={String(children)} />
                        }

                        if (language === 'prompt') {
                            return <SyntaxHighlighter
                                {...props}
                                customStyle={{
                                    borderRadius: '8px'
                                }}
                                children={'"' + String(children).replace(/\n$/, '') + '"'}
                                style={vscDarkPlus}
                                language='java'
                                showLineNumbers={false}
                                wrapLongLines={true}
                                PreTag="div"
                            />
                        }

                        if (!inline && match) {
                            return <SyntaxHighlighter
                                {...props}
                                customStyle={{
                                    borderRadius: '8px'
                                }}
                                children={String(children).replace(/\n$/, '')}
                                style={vscDarkPlus}
                                language={language}
                                showLineNumbers={true}
                                wrapLongLines={true}
                                PreTag="div"
                            />
                        }

                        return <code {...props} className={className}>
                            {children}
                        </code>
                    }
                }}
                children={content} />
        </div>
    }

}
