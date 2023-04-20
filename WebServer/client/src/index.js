import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ProtectedRoute } from './routes/ProtectedRoute';
import Registration from './routes/Registration';
import { AuthProvider } from './utility/auth';
import Error from './routes/Error';
import Login from './routes/Login';
import BackendTesting from './routes/BackendTesting';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute>
                <App />
             </ProtectedRoute>,
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registration",
    element: <Registration />
  },
  {
    path: "/backendtesting",
    element: <BackendTesting />
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </React.StrictMode>
);
