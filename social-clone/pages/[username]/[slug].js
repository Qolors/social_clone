import PostContent from "../../components/PostContent";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { useDocumentData } from 'react-firebase-hooks/firestore';
import AuthCheck from "../../components/AuthCheck";
import Link from "next/link";
import HeartButton from '../../components/HeartButton'



export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);
 
    let post;
    let path;

    if (userDoc) {
        const postRef = userDoc.ref.collection('posts').doc(slug);
        post = postToJSON(await postRef.get());

        path = postRef.path;
    }

    return {
        props: { post, path },
        revalidate: 5000,
    };
}

export async function getStaticPaths() {

    const snapshot = await firestore.collectionGroup('posts').get();

    const paths = snapshot.docs.map((doc) => {
        const { slug, username } = doc.data();
        return {
            params: { username, slug },
        };
    });

    return {
        paths,
        fallback: 'blocking',
    };
}


export default function Post(props) {

    const postRef = firestore.doc(props.path);

    const [realtimePost] = useDocumentData(postRef);

    const post = realtimePost || props.post;
    return (
        <main className="w-full grid grid-cols-1 place-items-center gap-y-2">
            <section className="w-3/4">
                <PostContent post={post} />
            </section>
            <section className="w-3/4 flex flex-row gap-2 place-items-center">
                <p>
                    <strong>{post.heartCount || 0} &#x2764;</strong>
                </p>

                <AuthCheck
                    fallback={
                        <Link href="/enter">
                            <button class='rounded-lg px-2 py-1 bg-indigo-500 text-white'>Sign Up</button>
                        </Link>
                    }
                >
                    <HeartButton postRef={postRef} />
                </AuthCheck>
                
            </section>
            
        </main>
    )
}