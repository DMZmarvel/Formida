// /* eslint-disable @typescript-eslint/no-unsafe-call */
// import React, { useEffect } from 'react';
// import { onAuthStateChanged } from 'firebase/auth';
// import './App.css'
// import MainLayout from './layouts/MainLayout'
// import { setLoading, setUser } from './redux/features/users/userSlice';
// import { useAppDispatch } from './redux/hook';
// import { auth } from './utils/firebase';
// // import { Toaster } from 'react-hot-toast';

// function App() {
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     dispatch(setLoading(true));

//     onAuthStateChanged(auth, (user) => {

//       if (user) {
//         dispatch(setUser(user?.email));
//         dispatch(setLoading(false));
//       } else {
//         dispatch(setLoading(false));
//       }
//     });
//   }, [dispatch]);

//   return (
//     <>

//      <MainLayout/>
//      {/* <Toaster position="top-center" /> */}
//     </>
//   )
// }

// export default App

/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from 'react';
import './App.css';
import MainLayout from './layouts/MainLayout';
import { setLoading, setUser } from './redux/features/users/userSlice';
import { useAppDispatch } from './redux/hook';
// import { Toaster } from "react-hot-toast";

function App() {
  const dispatch = useAppDispatch();

  // ...
  React.useEffect(() => {
    dispatch(setLoading(true));

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail') || '';

    if (token) {
      dispatch(setUser(email || null));
    } else {
      dispatch(setUser(null));
    }
    dispatch(setLoading(false));

    const onStorage = () => {
      const nextToken = localStorage.getItem('token');
      const nextEmail = localStorage.getItem('userEmail') || '';
      dispatch(setUser(nextToken ? nextEmail || null : null));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [dispatch]);
  // ...

  return (
    <>
      <MainLayout />
      {/* <Toaster position="top-center" /> */}
    </>
  );
}

export default App;
