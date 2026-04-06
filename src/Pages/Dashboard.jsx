import { useEffect, useState, useCallback } from "react";
import {
  getPieChart,
  getStatistics,
  getHighestPurchaseOrder,
  getListOfOrder,
} from "../Api/Dashboard";
import BaseTable from "../Components/Base/Table";
import { Avatar } from "primereact/avatar";
import { Skeleton } from "primereact/skeleton";
import PieChartDemo from "../Components/PieChart";
import BarChartDemo from "../Components/BarChart";
import { commonLabel } from "../utils/label";

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pieChartLoader, setPieChartLoader] = useState(false);
  const [pieChartData, setPieChartData] = useState(null);
  const [barChartLoader, setBarChartLoader] = useState(false);
  const [barChartData, setBarChartData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPieChartData = useCallback(async () => {
    try {
      setPieChartLoader(true);
      const response = await getPieChart({ timeFrame: "year" });
      if (response.success) {
        setPieChartData(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPieChartLoader(false);
    }
  }, []);

  const fetchBarChartData = useCallback(async () => {
    try {
      setBarChartLoader(true);
      const response = await getHighestPurchaseOrder();
      if (response.success) {
        setBarChartData(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBarChartLoader(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const payload = {
        limit: 10,
        page: 1,
        sortValue: "desc",
        sortKey: "id",
        search: "",
      };
      const response = await getListOfOrder(payload);
      if (response.success) {
        setOrders(response.data.orders);
        setTotalOrders(response.data.totalOrders);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
    fetchBarChartData();
    fetchPieChartData();
    fetchOrders();
  }, [fetchStatistics, fetchBarChartData, fetchPieChartData, fetchOrders]);

  const statCards = [
    {
      label: commonLabel.totalOrders,
      value: statistics?.total_order || 0,
      icon: "pi-shopping-cart",
      color: "bg-blue-500",
      textColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: commonLabel.pendingOrders,
      value: statistics?.total_pending_order || 0,
      icon: "pi-clock",
      color: "bg-amber-500",
      textColor: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      label: commonLabel.totalCustomers,
      value: statistics?.total_customer || 0,
      icon: "pi-users",
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      label: commonLabel.totalProducts,
      value: statistics?.total_product || 0,
      icon: "pi-box",
      color: "bg-violet-500",
      textColor: "text-violet-500",
      bgColor: "bg-violet-50",
    },
  ];

  const columns = [
    {
      field: "name",
      header: "Customer Name",
      sortable: false,
      body: (rowData) => (
        <div className="flex items-center gap-3 py-1">
          <div className="relative group">
            <Avatar
              label={rowData.name?.charAt(0)}
              className="bg-linear-to-br from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-md transform group-hover:rotate-6 transition-transform duration-300"
              size="normal"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <span className="font-semibold text-gray-900 block text-sm group-hover:text-blue-600 transition-colors">
              {rowData.name}
            </span>
          </div>
        </div>
      ),
    },
    {
      field: "total_items",
      header: "Quantity",
      sortable: false,
      body: (rowData) => (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center bg-gray-900 text-white rounded-xl font-bold text-[10px] shadow-inner">
            {rowData.total_items}
          </div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
            {commonLabel.units}
          </span>
        </div>
      ),
    },
    {
      field: "order_amount",
      header: "Order Amount",
      sortable: false,
      body: (rowData) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-900 tabular-nums tracking-tighter font-semibold">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(rowData.order_amount)}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      body: () => (
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50/50 border border-emerald-100 rounded-xl w-fit group hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-300">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:bg-white animate-pulse"></div>
          <span className="text-[10px] font-black text-emerald-700 group-hover:text-white uppercase tracking-widest">
            {commonLabel.completed}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="p-2 md:p-4 lg:p-6 max-w-(--breakpoint-2xl) mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-widest">
              {commonLabel.storeOverview}
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {commonLabel.welcomeBack}
          </h1>
          <p className="text-gray-500 mt-1 font-semibold flex items-center gap-2">
            <i className="pi pi-calendar text-blue-500"></i>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <i className="pi pi-cog text-gray-600"></i>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {loading && !statistics
          ? Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-6">
                    <Skeleton shape="circle" size="3.5rem" />
                    <Skeleton width="40%" height="2rem" />
                  </div>
                  <Skeleton width="60%" height="1rem" className="mb-2" />
                  <Skeleton width="30%" height="0.8rem" />
                </div>
              ))
          : statCards.map((card, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 transform hover:-translate-y-1.5 group cursor-default"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`${card.bgColor} ${card.textColor} p-3 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}
                  >
                    <i className={`pi ${card.icon} text-2xl`}></i>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      {card.label}
                    </p>
                    <h3 className="text-3xl font-black text-gray-900 tabular-nums">
                      {card.value}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 h-[480px]">
          <BarChartDemo data={barChartData} loading={barChartLoader} />
        </div>
        <div className="h-[480px]">
          <PieChartDemo data={pieChartData} loading={pieChartLoader} />
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 last:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 px-2">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {commonLabel.recentActivity}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">
                {commonLabel.latestOrders} {orders.length}{" "}
                {commonLabel.orderFrom} {totalOrders} {commonLabel.totalOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="shadow-2xl shadow-gray-200/50">
          <BaseTable
            showSearch={false}
            showActions={false}
            paginator={false}
            columns={columns}
            data={orders}
            loading={ordersLoading}
            lazy={true}
            scrollHeight="auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
