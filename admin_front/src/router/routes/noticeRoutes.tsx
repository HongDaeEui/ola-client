import { RouteWithMeta } from '../types';
import { withSuspense } from '../utils/withSuspense';
import { lazy } from 'react';

const NoticeListPage = withSuspense(lazy(() => import('@/pages/notice/NoticeListPage')));
const NoticeDetailPage = withSuspense(lazy(() => import('@/pages/notice/NoticeDetailPage')));
const NoticeCreatePage = withSuspense(lazy(() => import('@/pages/notice/NoticeCreatePage')));

export const noticeRoutes: RouteWithMeta[] = [
  {
    path: 'notice',
    meta: { label: 'Notices', showInMenu: true },
    children: [
      {
        index: true,
        element: NoticeListPage,
        meta: { label: 'Notice Board', showInMenu: true },
      },
      {
        path: 'add',
        element: NoticeCreatePage,
        meta: { label: 'Create Notice', showInMenu: false },
      },
      {
        path: ':id',
        element: NoticeDetailPage,
        meta: { label: 'Notice Detail', showInMenu: false },
      },
    ],
  },
];
