import { auth, firestore, googleAuthProvider } from '../lib/firebase'
import { useCallback, useContext, useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { UserContext } from '../lib/context';
import Image from 'next/image';

export default function EnterPage(props) {

    const { user, username } = useContext(UserContext);

    return (
        <div className='mt-24 flex flex-row place-items-center justify-center w-full h-96 text-white'>
            <div className='flex flex-col shadow-2xl shadow-indigo-400 place-items-center justify-center rounded-md w-1/2 h-full bg-indigo-500 border-2 border-white'>
                <h2 className='mb-24 text-xl'>Welcome to ShareThought</h2>
                {user ?
                    !username ? <UsernameForm /> : <SignOutButton />
                    :
                    <SignInButton />
                }
            </div>
        </div>
    )
}

function SignInButton() {
    const signInWithGoogle = async () => {
        await auth.signInWithPopup(googleAuthProvider);
    };

    return (
        <div>
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-sky-400 opacity-75"></span>
            <button className='bg-white px-4 py-1 rounded-full text-black shadow-lg shadow-gray-700' onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    );

}

function SignOutButton() {
    return (
        <button className='px-4 py-2 text-sm rounded-full bg-white text-black' onClick={() => auth.signOut()}>Sign Out</button>
    )
}

function UsernameForm() {

    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    const onSubmit = async (e) => {
        e.preventDefault();

        const userDoc = firestore.doc(`users/${user.uid}`);
        const usernameDoc = firestore.doc(`usernames/${formValue}`);

        const batch = firestore.batch();
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });

        await batch.commit();
    }

    const onChange = (e) => {
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    }

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = firestore.doc(`usernames/${username}`);
                const { exists } = await ref.get();
                console.log('Firestore read executed!');
                setIsValid(!exists);
                setLoading(false);
            }
        }, 500),
        []
    );

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input name="username" placeholder='username' value={formValue} onChange={onChange}/>
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                    <button type="submit" className='' disabled={!isValid}>
                        Choose
                    </button>
                </form>
            </section>
        )
    )
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking...</p>
    } else if (isValid) {
        return <p>{username} is available!</p>
    } else if (username && !isValid) {
        return <p>That username is taken!</p>
    } else {
        return<p></p>
    }
}