import { useState, useCallback, useEffect } from "react";
import BaseTable from "../Components/Base/Table";
import { commonLabel } from "../utils/label";
import { errorHandler } from "../utils/common";
import { getUserReport } from "../Api/report";

const Report = () => {
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    page: 1,
    limit: 10,
    sortKey: "",
    sortValue: "asc",
    search: "",
  });

  const [reportData, setReportData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchUserReport = useCallback(async () => {
    try {
      setLoading(true);
      const payload = {
        limit: tableParams.limit,
        page: tableParams.page,
        sortKey: tableParams.sortKey,
        sortValue: tableParams.sortValue,
        search: tableParams.search,
      };
      const response = await getUserReport(payload);
      if (response.success) {
        setReportData(response.data?.users || []);
        setTotalRecords(response.data?.totalItems || 0);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  }, [
    tableParams.page,
    tableParams.limit,
    tableParams.sortKey,
    tableParams.sortValue,
    tableParams.search,
  ]);

  useEffect(() => {
    fetchUserReport();
  }, [fetchUserReport]);

  const columns = [
    {
      field: "name",
      header: commonLabel.name,
      body: (rowData) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-blue-100 shadow-sm overflow-hidden pt-1">
            <i className={`pi pi-user text-blue-500 scale-125`}></i>
          </div>
          <span className="font-bold text-gray-800 tracking-tight">
            {rowData.name}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      field: "email",
      header: commonLabel.email,
      body: (rowData) => (
        <div className="flex items-center gap-2 text-gray-600">
          <i className="pi pi-envelope text-[10px] text-gray-400"></i>
          <span className="text-sm font-medium">{rowData.email}</span>
        </div>
      ),
      sortable: true,
    },
    {
      field: "phone_number",
      header: commonLabel.phoneNumber,
      body: (rowData) => (
        <div className="flex items-center gap-2 text-gray-600">
          <i className="pi pi-phone text-[10px] text-green-400"></i>
          <span className="text-sm font-semibold tracking-wide">
            {rowData.phone_number}
          </span>
        </div>
      ),
    },
    {
      field: "gender",
      header: commonLabel.gender,
      body: (rowData) => {
        const gender = rowData.gender?.toLowerCase();

        const genderConfig = {
          male: {
            className: "bg-blue-50 text-blue-600 border border-blue-100",
            icon: "pi-mars",
          },
          female: {
            className: "bg-pink-50 text-pink-600 border border-pink-100",
            icon: "pi-venus",
          },
          other: {
            className: "bg-purple-50 text-purple-600 border border-purple-100",
            icon: "pi-circle", // neutral icon
          },
        };

        const config = genderConfig[gender] || genderConfig.other;

        return (
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${config.className}`}
            >
              <i className={`pi text-[8px] ${config.icon}`}></i>
              {rowData.gender}
            </span>
          </div>
        );
      },
      sortable: true,
    },
  ];

  const onPage = (event) => {
    const newPage = event.page + 1;
    const newLimit = event.rows;
    if (newPage !== tableParams.page || newLimit !== tableParams.limit) {
      setTableParams((prev) => ({
        ...prev,
        page: newPage,
        limit: newLimit,
      }));
    }
  };

  const onSort = (event) => {
    const newSortKey = event.sortField || "id";
    const newSortValue = event.sortOrder === 1 ? "asc" : "desc";
    if (
      newSortKey !== tableParams.sortKey ||
      newSortValue !== tableParams.sortValue
    ) {
      setTableParams((prev) => ({
        ...prev,
        sortKey: newSortKey,
        sortValue: newSortValue,
      }));
    }
  };

  const onSearch = (value) => {
    if (value !== tableParams.search) {
      setTableParams((prev) => ({
        ...prev,
        search: value,
        page: 1,
      }));
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-(--breakpoint-2xl) mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 px-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-indigo-200">
              {commonLabel.analysis}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {totalRecords} {commonLabel.totalResults}
            </span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            {commonLabel.userReports}
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-2 max-w-md leading-relaxed">
            {commonLabel.reportDetails}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              {commonLabel.dataUpdate}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-[1px]">
                {commonLabel.liveAnalytics}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="relative group/table">
        <div className="absolute -inset-1 bg-linear-to-r from-indigo-500/10 to-blue-500/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover/table:opacity-100 transition duration-1000"></div>
        <div className="relative bg-white/80 backdrop-blur-xl rounded-[2.2rem] border border-gray-100/50 shadow-2xl shadow-gray-200/50 overflow-hidden">
          <BaseTable
            data={reportData}
            columns={columns}
            loading={loading}
            totalRecords={totalRecords}
            rows={tableParams.limit}
            first={(tableParams.page - 1) * tableParams.limit}
            sortField={tableParams.sortKey}
            sortOrder={tableParams.sortValue === "asc" ? 1 : -1}
            onPage={onPage}
            onSort={onSort}
            onSearch={onSearch}
            showActions={false}
            scrollHeight="calc(100vh - 380px)"
            title={commonLabel.userAnalytics}
          />
        </div>
      </div>
    </div>
  );
};

export default Report;
