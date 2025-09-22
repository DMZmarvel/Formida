import { createBrowserRouter, Route } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

import BookList from '../components/books/NoticeList';
import BookDetails from '../components/books/BookDetails';
import AddNewBook from '../components/books/AddNoticeForm';
import EditBook from '../components/books/EditNoticeForm';
import PrivateRoute from './PrivateRoute';
import SubmitNotice from '@/pages/SubmitNotice';
import CheckStatus from '@/pages/CheckStatus';
import MyNotices from '@/pages/MyNotices';
import AdminNotices from '@/pages/AdminNotices';
import Dashboard from '@/pages/Dashboard';
import PreviewNotice from '@/pages/PreviewNotice';
import PayNotice from '@/pages/PayNotice';
import Publications from '@/pages/Publications';

import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsConditions from '../pages/TermsConditions';
import FAQ from '../pages/FAQ';
import SupportCenter from '../pages/SupportCenter';
import ContactUs from '../pages/ContactUs';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/books',
        element: <BookList />,
      },
      {
        path: '/books/:id',
        element: <BookDetails />,
      },

      {
        path: '/books/add-new',
        element: (
          <PrivateRoute>
            <AddNewBook />
          </PrivateRoute>
        ),
      },
      {
        path: '/books/:id/edit',
        element: (
          <PrivateRoute>
            <EditBook />
          </PrivateRoute>
        ),
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicy />,
      },
      {
        path: '/terms-conditions',
        element: <TermsConditions />,
      },
      {
        path: '/faq',
        element: <FAQ />,
      },
      {
        path: '/support',
        element: <SupportCenter />,
      },
      {
        path: '/contact',
        element: <ContactUs />,
      },
      {
        path: '/checkout',
        // element: (
        //   <PrivateRoute>
        //     <Checkout/>
        //   </PrivateRoute>
        // ),
      },
      {
        path: '/notice',
        element: <SubmitNotice />,
      },
      {
        path: '/status',
        element: <CheckStatus />,
      },

      {
        path: '/my-notices',
        element: <MyNotices />,
      },

      {
        path: '/admin/notices',
        element: <AdminNotices />,
      },

      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/notice/preview/:ref',
        element: <PreviewNotice />,
      },
      {
        path: '/pay/:refId',
        element: <PayNotice />,
      },

      {
        path: '/publications',
        element: <Publications />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '*',
    // element: <NotFound />,
  },
]);

export default routes;
