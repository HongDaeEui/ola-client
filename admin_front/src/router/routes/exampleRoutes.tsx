import { RouteWithMeta } from '../types';
import { withSuspense } from '../utils/withSuspense';
import { lazy } from 'react';

const ExampleListPage = withSuspense(lazy(() => import('@/pages/example/ExampleListPage')));
const ExampleDetailPage = withSuspense(lazy(() => import('@/pages/example/ExampleDetailPage')));
const ExampleCreatePage = withSuspense(lazy(() => import('@/pages/example/ExampleCreatePage')));

export const exampleRoutes: RouteWithMeta[] = [
  {
    path: 'example',
    meta: { label: 'Examples', showInMenu: true },
    children: [
      {
        index: true,
        element: ExampleListPage,
        meta: { label: 'Example List', showInMenu: true },
      },
      {
        path: 'add',
        element: ExampleCreatePage,
        meta: { label: 'Create Example', showInMenu: false },
      },
      {
        path: ':id',
        element: ExampleDetailPage,
        meta: { label: 'Example Detail', showInMenu: false },
      },
    ],
  },
];
