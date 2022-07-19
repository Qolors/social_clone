import AuthCheck from "../../components/AuthCheck"
import PostFeed from "../../components/PostFeed"
import { UserContext } from "../../lib/context"
import { firestore, auth, serverTimestamp } from "../../lib/firebase"

import { useContext, useState } from "react"
import { useRouter } from "next/router"

import { useCollection } from "react-firebase-hooks/firestore"
import kebabCase from "lodash.kebabcase"
import toast from 'react-hot-toast'
import Post from "../[username]/[slug]"

export default function AdminPostsPage(props) {
    return (
        <div className="w-full flex flex-col justify-center place-items-center">
            <AuthCheck>
                <h1 className='text-2xl'>Share Something New</h1>
                <CreateNewPost />
                <PostList />    
            </AuthCheck>
        </div>

    )
}

function PostList() {
    const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts');
    const query = ref.orderBy('createdAt');
    const [querySnapshot] = useCollection(query);

    const posts = querySnapshot?.docs.map((doc) => doc.data());

    return (
        <div className="w-full flex flex-col justify-center place-items-center gap-6 mt-10">
            <h1 className="text-2xl">Manage your Posts</h1>
            <PostFeed posts={posts} admin />
        </div>
    )

}

function CreateNewPost() {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');

    const slug = encodeURI(kebabCase(title));

    const isValid = title.length > 3 && title.length < 100;

    const createPost = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug);

        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: '# hello world!',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            heartCount: 0,
        };

        await ref.set(data);

        toast.success('Post Created!')

        router.push(`/admin/${slug}`);

    }

    return (
        <form className="bg-slate-50 w-3/4 flex flex-col justify-center place-items-center gap-2 py-6 rounded-lg  shadow-indigo-500 shadow-sm" onSubmit={createPost}>
            <input
                className='text-center w-3/4'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New Thought"
            />
            <p>
                <strong>Thread:</strong> {slug}
            </p>
            <button className='w-1/4 px-2 py-2 bg-indigo-500 text-white rounded-sm' type="submit" disabled={!isValid}>
                Create New Post
            </button>
        </form>
    );
}