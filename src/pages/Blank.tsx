import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";
import Badge from "../components/ui/badge/Badge";
import { getAllOrders } from "../../requestes/order";

interface Order {
  id: string;
  date: string;
  price: number;
  finalPrice: number;
  status: string;
  customer?: { firstName: string; lastName: string; phone: string };
  car?: { brand?: { name: string }; model?: { name: string }; edition?: { name: string } };
}

const statusColor = (status: string) => {
  if (status === "Validated") return "success";
  if (status === "Waiting") return "warning";
  if (status === "Cancelled") return "error";
  if (status === "Delivered") return "info";
  return "info";
};

export default function Blank() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  useEffect(() => {
    getAllOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const customerName = `${o.customer?.firstName} ${o.customer?.lastName}`.toLowerCase();
    const carName = `${o.car?.brand?.name} ${o.car?.model?.name}`.toLowerCase();
    const matchSearch =
      customerName.includes(search.toLowerCase()) ||
      carName.includes(search.toLowerCase()) ||
      o.id.includes(search);
    const matchStatus = statusFilter === "All statuses" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // stats
  const stats = [
    { label: "Total Orders", value: orders.length, color: "text-gray-800 dark:text-white" },
    { label: "Waiting", value: orders.filter((o) => o.status === "Waiting").length, color: "text-yellow-500" },
    { label: "Validated", value: orders.filter((o) => o.status === "Validated").length, color: "text-green-500" },
    { label: "Delivered", value: orders.filter((o) => o.status === "Delivered").length, color: "text-blue-500" },
    { label: "Cancelled", value: orders.filter((o) => o.status === "Cancelled").length, color: "text-red-500" },
  ];

  return (
    <div>
      <PageMeta title="Orders Management | Oodeskoo" description="Orders Management page for Oodeskoo dealership system" />
      <PageBreadcrumb pageTitle="Orders Management" />

      <div className="space-y-6">

        {/* Search + Filter */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search by customer, car, or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 sm:w-48"
          >
            <option>All statuses</option>
            <option>Waiting</option>
            <option>Validated</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white px-5 py-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {["Order ID", "Customer", "Car", "Final Price", "Status", "Date"].map((col) => (
                    <TableCell key={col} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading && (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-400" colSpan={6}>Loading...</TableCell>
                  </TableRow>
                )}
                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-400" colSpan={6}>No orders found.</TableCell>
                  </TableRow>
                )}
                {filtered.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="px-5 py-4 text-brand-500 font-medium text-theme-sm whitespace-nowrap">
                      {order.id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {order.customer?.phone}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.car?.brand?.name} {order.car?.model?.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {order.car?.edition?.name}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 font-medium text-theme-sm dark:text-white/90 whitespace-nowrap">
                      {order.finalPrice?.toLocaleString()} DA
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Badge size="sm" color={statusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">
                      {new Date(order.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>
    </div>
  );
}