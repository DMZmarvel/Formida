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
import Dashboard from '@/pages/Dashboard';
import PreviewNotice from '@/pages/PreviewNotice';
import PayNotice from '@/pages/PayNotice';
import Publications from '@/pages/Publications';

import AdminLayout from '@/admin/layout/AdminLayout';
import AdminGuard from '@/admin/AdminGuard';
import AdminDashboard from '@/admin/pages/AdminDashboard';
import Pricing from '@/admin/pages/Pricing';
import Vendors from '@/admin/pages/Vendors';
import AdminUsers from '@/admin/pages/AdminUsers';
import AdminLogin from '@/admin/pages/AdminLogin';
import AdminNotices from '@/admin/pages/AdminNotices';
import VendorDetails from '@/admin/pages/VendorDetails';

import VendorLogin from '@/vendor/VendorLogin';
import VendorLayout from '@/vendor/VendorLayout';
import VendorDashboard from '@/vendor/pages/VendorDashboard';
import VendorNotices from '@/vendor/pages/VendorNotices';
import VendorEarnings from '@/vendor/pages/VendorEarnings';

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
        path: '/admin/vendors/:id',
        element: <VendorDetails />,
      },

      {
        path: '/publications',
        element: <Publications />,
      },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'notices', element: <AdminNotices /> },
      { path: 'pricing', element: <Pricing /> },
      { path: 'vendors', element: <Vendors /> },

      { path: 'admin-users', element: <AdminUsers /> },
    ],
  },

  {
    path: '/vendor/login',
    element: <VendorLogin />,
  },
  {
    path: '/vendor',
    element: <VendorLayout />,
    children: [
      { path: 'dashboard', element: <VendorDashboard /> },
      { path: 'notices', element: <VendorNotices /> },
      { path: 'earnings', element: <VendorEarnings /> },
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
