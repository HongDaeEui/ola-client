import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { usePostsList } from '@/hooks/queries/useUgc';
import { Post } from '@/models/ugc';

const columnHelper = createColumnHelper<Post>();

export default function PostsListPage() {
  const { data: posts, isLoading } = usePostsList();

  const columns = [
    columnHelper.accessor('title', {
      header: '커뮤니티 글',
      cell: (info) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white leading-tight">
            {info.getValue()}
          </p>
        </div>
      )
    }),
    columnHelper.accessor('category', {
      header: '카테고리',
      cell: (info) => (
        <span className="px-2 py-1 bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-md text-xs font-medium border border-amber-200 dark:border-amber-800/50">
          {info.getValue()}
        </span>
      )
    }),
    columnHelper.accessor('author', {
      header: '작성자',
      cell: (info) => {
        const author = info.getValue();
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              {author?.avatarUrl ? <img src={author.avatarUrl} alt="avatar" /> : <div className="w-full h-full bg-gradient-to-bl from-orange-400 to-rose-500" />}
            </div>
            <span className="text-sm font-medium">{author?.name || '익명'}</span>
          </div>
        );
      }
    }),
    columnHelper.accessor('likes', {
      header: '반응',
      cell: (info) => (
        <div className="flex gap-3 text-xs text-slate-500">
          <span title="추천수">👍 {info.getValue()}</span>
          <span title="조회수">👁️ {info.row.original.views}</span>
        </div>
      )
    }),
    columnHelper.accessor('createdAt', {
      header: '작성일',
      cell: (info) => <span className="text-sm text-slate-500">{new Date(info.getValue()).toLocaleDateString()}</span>
    }),
  ];

  const table = useReactTable({
    data: posts || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent pb-1">
            커뮤니티 글 관리
          </h1>
          <p className="text-slate-500 font-medium mt-1">유저가 남긴 피드나 자유게시판 글을 모니터링합니다.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">데이터를 불러오는 중입니다...</td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">등록된 게시글이 없습니다.</td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
