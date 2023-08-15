import { PostMetaData } from "types";

export default function sortPosts(posts: PostMetaData[]): PostMetaData[] {
    return posts.sort((a, b) => b.date - a.date);
}
