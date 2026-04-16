import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseTable, ColumnDef } from "@/components/common/BaseTable.tsx";
import { FilterTabs, FilterTab } from "@/components/common/FilterTabs.tsx";
import { useListFilters } from "@/hooks/useListFilters.ts";
import { SearchBox, SearchOption } from "@/components/common/SearchBox.tsx";
import { BasePagination } from "@/components/common/Pagination.tsx";
import { useCategoryStore } from "@/stores/category_store.ts";
import { formatTDate } from "@/lib/formatDate.ts";
import { toast } from "sonner";
import { Category } from "@/models/category.ts";
import BaseButton from "@/components/common/BaseButton.tsx";

const sortFilterTabs: FilterTab[] = [
  { value: "name", label: "Name", sortValue: "name" },
  { value: "order", label: "Order", sortValue: "order" },
  { value: "createdAt", label: "Created", sortValue: "createdAt" },
];

const searchOptions: SearchOption[] = [
  { value: "name", label: "Name" },
  { value: "slug", label: "Slug" },
];

export default function CategoryListPage() {
  const navigate = useNavigate();
  const { getList, loading } = useCategoryStore();

  const filters = useListFilters({
    page: 1,
    limit: 30,
    sort: 'createdAt',
    order: 'desc',
    searchOption: 'name'
  });

  const [list, setList] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);

  const fetchList = async () => {
    try {
      const sortTab = sortFilterTabs.find(tab => tab.value === filters.sort);

      const params = {
        ...(filters.searchValue && {
          search: filters.searchValue,
          searchKey: filters.searchOption
        }),
        page: filters.page,
        limit: filters.limit,
        sort: sortTab?.sortValue,
        order: filters.order,
      };

      const response = await getList(params);
      const formattedList = (response.data.items || []).map(item => ({
        ...item,
        createdAt: formatTDate(item.createdAt),
        updatedAt: formatTDate(item.updatedAt),
      }));

      setList(formattedList || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    fetchList();
  }, [filters.searchValue, filters.page, filters.limit, filters.sort, filters.order]);

  const columns: ColumnDef[] = [
    { key: 'no', label: 'No', width: '5%' },
    { key: 'name', label: 'Name', width: '25%' },
    { key: 'slug', label: 'Slug', width: '20%' },
    { key: 'order', label: 'Order', width: '10%' },
    { key: 'isActive', label: 'Active', width: '10%' },
    { key: 'createdAt', label: 'Created', width: '15%' },
  ];

  const handleRowClick = (row: Category) => {
    navigate(`/category/${row.id}`);
  };

  const totalPages = Math.ceil(total / filters.limit);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <SearchBox
          options={searchOptions}
          selectedOption={filters.localSearchOption}
          onOptionChange={filters.setLocalSearchOption}
          searchValue={filters.localSearchValue}
          onSearchChange={filters.setLocalSearchValue}
          onSearch={filters.executeSearch}
        />
        <BaseButton
          label="Create"
          color="blue"
          width="80px"
          onClick={() => navigate('/category/add')}
        />
      </div>
      <div className="flex justify-end gap-4 mb-1">
        <FilterTabs
          tabs={sortFilterTabs}
          activeTab={filters.sort}
          onTabChange={filters.setSort}
          showSortOrder={true}
          sortOrder={filters.order}
          onSortOrderChange={filters.setOrder}
        />
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : (
        <BaseTable
          columns={columns}
          data={list.map((item, index) => ({
            ...item,
            no: total - ((filters.page - 1) * filters.limit + index)
          }))}
          onRowClick={handleRowClick}
        />
      )}
      <BasePagination
        currentPage={filters.page}
        totalPages={totalPages}
        onPageChange={(page) => filters.setPage(page)}
        itemsPerPage={filters.limit}
        onItemsPerPageChange={(newLimit) => filters.setLimit(newLimit)}
      />
    </div>
  );
}
