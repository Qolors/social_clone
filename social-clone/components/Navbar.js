import Link from 'next/link'
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import EnterPage from '../pages/enter';

export default function NavBar() {
    
    const { user, username } = useContext(UserContext);

    return (
        <nav className="h-24 w-full bg-white text-indigo-500 fixed top-0 px-10 font-bold border-b z-50">
            <ul className='flex flex-row justify-between items-center h-full w-full'>
                <li>
                    <Link href="/">
                        <button className="w-32 h-12 rounded-lg bg-indigo-500 text-white">FEED</button>
                    </Link>
                </li>
                {/* user is signed-in and has username */}
                {username && (
                    <>
                        <li>
                            <Link href="/admin">
                                <button className='w-32 h-12 rounded-lg bg-indigo-500 text-white'>Write Post</button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <img src={user?.photoURL} />
                            </Link>
                        </li>
                        <li>
                            <EnterPage />
                        </li>
                    </>
                )}
                {/* user is not signed OR has not created username */}
                {!username && (
                    <li>
                        <Link href="/enter">
                            <button className='w-24 h-12 rounded-lg bg-slate-500 text-white'>Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}