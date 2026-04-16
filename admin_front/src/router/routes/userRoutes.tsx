import { RouteWithMeta } from '../types';
import { withSuspense } from '../utils/withSuspense';
import { lazy } from 'react';

const UserListPage = withSuspense(lazy(() => import('@/pages/user/UserListPage')));
const UserDetailPage = withSuspense(lazy(() => import('@/pages/user/UserDetailPage')));
const UserCreatePage = withSuspense(lazy(() => import('@/pages/user/UserCreatePage')));

export const userRoutes: RouteWithMeta[] = [
  {
    path: 'user',
    meta: { label: 'Users', showInMenu: true },
    children: [
      {
        index: true,
        element: UserListPage,
        meta: { label: 'User Management', showInMenu: true },
      },
      {
        path: 'add',
        element: UserCreatePage,
        meta: { label: 'Create User', showInMenu: false },
      },
      {
        path: ':id',
        element: UserDetailPage,
        meta: { label: 'User Detail', showInMenu: false },
      },
    ],
  },
];
