import NavBar from '../components/Navbar';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { UserContext } from '../lib/context';
import { useUserData } from '../lib/hooks';

function MyApp({ Component, pageProps }) {

  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <NavBar />
      <div className='mt-24 w-full h-full'>
        <Component {...pageProps} />
      </div>
      <Toaster />
    </UserContext.Provider>
  );
}

export default MyApp
