import { RouteWithMeta } from '../types';
import { withSuspense } from '../utils/withSuspense';
import { lazy } from 'react';

const CategoryListPage = withSuspense(lazy(() => import('@/pages/category/CategoryListPage')));
const CategoryDetailPage = withSuspense(lazy(() => import('@/pages/category/CategoryDetailPage')));
const CategoryCreatePage = withSuspense(lazy(() => import('@/pages/category/CategoryCreatePage')));

export const categoryRoutes: RouteWithMeta[] = [
  {
    path: 'category',
    meta: { label: 'Categories', showInMenu: true },
    children: [
      {
        index: true,
        element: CategoryListPage,
        meta: { label: 'Category Management', showInMenu: true },
      },
      {
        path: 'add',
        element: CategoryCreatePage,
        meta: { label: 'Create Category', showInMenu: false },
      },
      {
        path: ':id',
        element: CategoryDetailPage,
        meta: { label: 'Category Detail', showInMenu: false },
      },
    ],
  },
];
