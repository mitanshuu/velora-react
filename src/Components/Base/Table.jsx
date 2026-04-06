import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import BaseInput from "./Input";
import BaseTooltip from "./Tooltip";

const BaseTable = ({
  data = [],
  columns = [],
  loading = false,
  totalRecords = 0,
  rows = 10,
  rowsPerPageOptions = [5, 10, 25],
  lazy = true,
  onPage,
  onSort,
  onSearch,
  onView,
  onEdit,
  onDelete,
  globalFilterFields = [],
  showSearch = true,
  showActions = false,
  scrollHeight = "400px",
  paginator = true,
  tableClassName,
  title,
  ...props
}) => {
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (onSearch) onSearch(globalFilter);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [globalFilter, onSearch]);

  const header = showSearch && (
    <div className="flex justify-between">
      <div className="flex items-center">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 font-black rounded-full uppercase tracking-widest text-[12px]">
          {title}
        </span>
      </div>
      <div className="w-58">
        <BaseInput
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          showSearch={true}
          className="p-inputtext-sm"
        />
      </div>
    </div>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2 justify-center">
        <span
          className="cursor-pointer text-green-500 hover:text-green-700"
          onClick={() => onView?.(rowData)}
        >
          <i id={`view-icon-${rowData.id}`} className="pi pi-eye text-lg"></i>
        </span>
        <BaseTooltip
          target={`#view-icon-${rowData.id}`}
          tooltip="View"
          position="top"
        />

        <span
          className="cursor-pointer text-blue-500 hover:text-blue-700"
          onClick={() => onEdit?.(rowData)}
        >
          <i
            id={`edit-icon-${rowData.id}`}
            className="pi pi-pencil text-lg"
          ></i>
        </span>
        <BaseTooltip
          target={`#edit-icon-${rowData.id}`}
          tooltip="Edit"
          position="top"
        />

        <span
          className="cursor-pointer text-red-500 hover:text-red-700"
          onClick={() => onDelete?.(rowData)}
        >
          <i
            id={`delete-icon-${rowData.id}`}
            className="pi pi-trash text-lg"
          ></i>
        </span>
        <BaseTooltip
          target={`#delete-icon-${rowData.id}`}
          tooltip="Delete"
          position="top"
        />
      </div>
    );
  };

  return (
    <div className={`base-table-container ${tableClassName}`}>
      <DataTable
        value={data}
        lazy={lazy}
        loading={loading}
        paginator={paginator}
        rows={rows}
        totalRecords={totalRecords}
        onPage={onPage}
        onSort={onSort}
        sortMode="single"
        removableSort
        rowsPerPageOptions={rowsPerPageOptions}
        globalFilter={globalFilter}
        globalFilterFields={globalFilterFields}
        header={header}
        scrollable
        scrollHeight={scrollHeight}
        className="premium-datatable"
        {...props}
      >
        {columns.map((col, index) => (
          <Column
            key={index}
            field={col.field}
            header={col.header}
            sortable={col.sortable}
            body={col.body}
            style={col.style}
            className={col.className}
          />
        ))}

        {showActions && (
          <Column
            header="Actions"
            body={actionBodyTemplate}
            style={{ width: "120px", textAlign: "center" }}
            headerClassName="text-center"
          />
        )}
      </DataTable>

      <style>{`
        /* Container styling */
        .base-table-container {
          background: white;
          border-radius: 1.5rem;
          overflow: hidden;
        }

        /* Header (Search Bar Area) */
        .premium-datatable .p-datatable-header {
          background: white !important;
          border: none;
          padding: 1rem 1rem 1rem 1rem;
        }

        /* Table Header Columns */
        .premium-datatable .p-datatable-thead > tr > th {
          background: #f8fafc !important; /* Matches gray-50/100 theme */
          color: #64748b !important;
          font-weight: 800 !important;
          font-size: 0.725rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.075em !important;
          padding: 1.25rem 1rem !important;
          border-bottom: 2px solid #f1f5f9 !important;
          transition: background-color 0.2s;
        }

        .premium-datatable .p-datatable-thead > tr > th:hover {
          background: #f1f5f9 !important;
        }

        /* Table Body */
        .premium-datatable .p-datatable-tbody > tr {
          background: white !important;
          color: #334155 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-datatable .p-datatable-tbody > tr:hover {
          background-color: #f8fafc !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.05);
        }

        .premium-datatable .p-datatable-tbody > tr > td {
          padding: 1.15rem 1rem !important;
          border-bottom: 1px solid #f1f5f9 !important;
          font-size: 0.875rem;
        }

        /* Actions Column Alignment */
        .premium-datatable .p-datatable-tbody > tr > td:last-child {
          border-left: 1px solid #f8fafc;
        }

        /* Paginator Styling */
        .premium-datatable .p-paginator {
          background: white !important;
          border: none !important;
          padding: 1.25rem 1rem !important;
          border-top: 1px solid #f1f5f9 !important;
        }

        .premium-datatable .p-paginator .p-paginator-pages .p-paginator-page {
          border-radius: 12px;
          min-width: 2.5rem;
          height: 2.5rem;
          color: #64748b;
          font-weight: 600;
          transition: all 0.2s;
        }

        .premium-datatable
          .p-paginator
          .p-paginator-pages
          .p-paginator-page.p-highlight {
          background: #3b82f6 !important;
          color: white !important;
          box-shadow: 0 4px 12px -2px rgba(59, 130, 246, 0.4);
        }

        /* Scrollbar Styling */
        .premium-datatable .p-datatable-wrapper::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .premium-datatable .p-datatable-wrapper::-webkit-scrollbar-track {
          background: #f8fafc;
        }

        .premium-datatable .p-datatable-wrapper::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .premium-datatable .p-datatable-wrapper::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default BaseTable;
