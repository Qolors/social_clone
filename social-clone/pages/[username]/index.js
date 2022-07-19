import UserProfile from '../../components/UserProfile'
import PostFeed from '../../components/PostFeed'
import { getUserWithUsername } from '../../lib/firebase';
import { postToJSON } from '../../lib/firebase';


export async function getServerSideProps({ query }) {
    const { username } = query;

    const userDoc = await getUserWithUsername(username);

    if (!userDoc) {
        return {
            notFound: true,
        };
    }

    let user = null;
    let posts = null;

    if (userDoc) {
        user = userDoc.data();
        const postsQuery = userDoc.ref
            .collection('posts')
            .where('published', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(5);
        posts = (await postsQuery.get()).docs.map(postToJSON);
    }

    return {
        props: { user, posts },
    };
}


export default function UserProfilePage({ user, posts }) {
    return (
        <main className="mt-24 flex flex-col gap-4 items-center">
            <UserProfile user={user} />
            <h1 className='border-b border-black text-2xl'>Recent Postings</h1>
            <div className='flex flex-col gap-y-6 w-full justify-center place-items-center mb-6'>
                <PostFeed posts={posts} />
            </div>
        </main>
    )
}