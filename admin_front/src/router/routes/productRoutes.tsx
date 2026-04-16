import { RouteWithMeta } from '../types';
import { withSuspense } from '../utils/withSuspense';
import { lazy } from 'react';

const ProductListPage = withSuspense(lazy(() => import('@/pages/product/ProductListPage')));
const ProductDetailPage = withSuspense(lazy(() => import('@/pages/product/ProductDetailPage')));
const ProductCreatePage = withSuspense(lazy(() => import('@/pages/product/ProductCreatePage')));

export const productRoutes: RouteWithMeta[] = [
  {
    path: 'product',
    meta: { label: 'Products', showInMenu: true },
    children: [
      {
        index: true,
        element: ProductListPage,
        meta: { label: 'Product Management', showInMenu: true },
      },
      {
        path: 'add',
        element: ProductCreatePage,
        meta: { label: 'Create Product', showInMenu: false },
      },
      {
        path: ':id',
        element: ProductDetailPage,
        meta: { label: 'Product Detail', showInMenu: false },
      },
    ],
  },
];
