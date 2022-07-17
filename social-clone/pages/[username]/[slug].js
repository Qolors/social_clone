import PostContent from "../../components/PostContent";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { useDocumentDate } from 'react-firebase-hooks/firestore';



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
        props: { posts, path },
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

    const [realtimePost] = useDocumentDate(postRef);

    const post = realtimePost || props.post;
    return (
        <main>
            <section>
                <PostContent post={post} />
            </section>
            <section>
                <p>
                    <strong>{post.heartCount || 0} &#x2764;</strong>
                </p>
            </section>
            
        </main>
    )
}