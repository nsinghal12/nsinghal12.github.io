export interface PostMetaData {
    id: string;
    title: string;
    path: string;
    description: string;
    date: number;
    published: boolean;
    tags: string[];
    expiry: number;
    series: string;
    category: string;
    summary: string;
    content: string;
    contentType: string;
    timeToRead?: number;
}

export interface BlogJson {
    posts: PostMetaData[];
}

export interface Blog {
    categories: string[];
    tags: string[];
    series: string[];
    posts: PostMetaData[];
    categoryCount: Record<string, number>;
}
