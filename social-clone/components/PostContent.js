import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function PostContent({ post }) {
    const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

    return (
        <div className="w-full flex flex-col justify-center place-items-center">
            <h1 className="text-2xl">{post?.title}</h1>
            <span className="text-sm">
                Written by{' '}
                <Link href={`/${post.username}/`}>
                    <a><strong>{post.username}</strong></a>
                </Link>{' '}
                on {createdAt.toISOString()}
            </span>
            <div className="w-3/4 min-h-screen bg-slate-50">
                <ReactMarkdown>{post?.content}</ReactMarkdown>
            </div>
        </div>
    );
}