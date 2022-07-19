import Link from 'next/link'
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import EnterPage from '../pages/enter';
import { auth } from '../lib/firebase';

export default function NavBar() {
    
    const { user, username } = useContext(UserContext);

    return (
            <nav className="relative p-6 w-full bg-slate-50 mb-4 shadow-sm">
                <div className='flex items-center justify-between'>
                    <div className='pt-2'>
                        <Link href="/">
                            <button className="w-32 h-12 rounded-lg bg-indigo-500 text-white">Hub</button>
                        </Link>
                    </div>
                    {/* user is signed-in and has username */}
                    {username && (
                        <div className='hidden md:flex items-center justify-between space-x-2'>
                            <div>
                                <Link href="/admin">
                                    <button className='w-32 h-12 rounded-lg bg-indigo-500 text-white'>My Posts</button>
                                </Link>
                            </div>
                            <div className='flex flex-row w-1/2 justify-center'>
                                <Link href={`/${username}`}>
                                    <img className='rounded-full w-1/2 h-1/2 object-cover hover:cursor-pointer' src={user?.photoURL} />
                                </Link>
                            </div>
                            <div className='flex flex-1 w-3/4 h-3/4'>
                                <button className='w-24 h-6 rounded-md bg-red-300' onClick={() => auth.signOut()}>Sign Out</button>
                            </div>
                        </div>
                    )}
                    {/* user is not signed OR has not created username */}
                    {!username && (
                        <div>
                            <Link href="/enter">
                                <button className='w-24 h-12 rounded-lg bg-slate-500 text-white'>Log in</button>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
    );
}