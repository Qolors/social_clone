import Link from 'next/link'

export default function PostFeed({ posts, admin }) {
    return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : null;

}

function PostItem({ post, admin=false }) {

    const wordCount = post?.content.trim().split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);

    return (
        <div className='relative flex flex-col w-3/4 p-4 rounded-md bg-slate-50 shadow-md'>
            <Link href={`/${post.username}`}>
                <a className='rounded-lg px-2 w-fit bg-indigo-50 text-sm font-light'>
                    <strong>By @{post.username}</strong>
                </a>
            </Link>
            <div className='absolute top-4 right-4 z-10'>{post.heartCount || 0} &#x2764;</div>
            <Link href={`/${post.username}/${post.slug}`}>
                <div className='w-full rounded-full text-lg mt-4 mb-4 font-bold text-center hover:cursor-pointer'>
                    <a>{post.title}</a>
                </div>
            </Link>
            <footer>
                <div className='flex flex-row-reverse text-sm text-right w-full'>
                    {wordCount} words. {minutesToRead} min read
                </div>
            </footer>
            {admin && (
                <>
                    <Link href={`/admin/${post.slug}`}>
                        <h3>
                            <button className='rounded-md bg-slate-400 px-2 text-white'>Edit</button>
                        </h3>
                    </Link>
                </>
            )}
        </div>
    )

}