import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import Badge from "../components/ui/badge/Badge";

const orders = [
  {
    id: "1901-04",
    customer: { name: "HIBA BEHELLAL", phone: "+2136565656" },
    car: { name: "GEELY ", ref: "/" },
    total: "3 000 000 DA",
    status: "Validated",
    date: "27 Jan",
  },
  {
    id: "1901-05",
    customer: { name: "Meriem Belouti", phone: "+213770123456" },
    car: { name: "TOYOTA", ref: "/" },
    total: "4 000 000 DA",
    status: "Cancelled",
    date: "28 Jan",
  },
  {
    id: "1901-06",
    customer: { name: "AICHA BOUMAZA", phone: "+213661262642" },
    car: { name: "GEELY", ref: "/" },
    total: "4 100 000 DA",
    status: "Waiting",
    date: "29 Jan",
  },
];

const stats = [
  { label: "Total Orders", value: 3, color: "text-gray-800 dark:text-white" },
  { label: "Waiting", value: 1, color: "text-yellow-500" },
  { label: "Validated", value: 1, color: "text-green-500" },
  { label: "Delivered", value: 0, color: "text-blue-500" },
  { label: "Cancelled", value: 1, color: "text-red-500" },
];

const statusColor = (status: string) => {
  if (status === "Validated") return "success";
  if (status === "Waiting") return "warning";
  if (status === "Cancelled") return "error";
  return "info";
};

export default function Blank() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.car.name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search);
    const matchStatus =
      statusFilter === "All statuses" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <PageMeta
        title="Orders Management | Oodeskoo"
        description="Orders Management page for Oodeskoo dealership system"
      />
      <PageBreadcrumb pageTitle="Orders Management" />

      <div className="space-y-6">

        {/* Search + Filter */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search by customer, car, order number, or status..."
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
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-200 bg-white px-5 py-6 dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              <p className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {["Order #", "Customer", "Car", "Total", "Status", "Date"].map((col) => (
                    <TableCell
                      key={col}
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap"
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filtered.map((order) => (
                  <TableRow key={order.id}>

                    {/* Order # */}
                    <TableCell className="px-5 py-4 text-brand-500 font-medium text-theme-sm whitespace-nowrap">
                      {order.id}
                    </TableCell>

                    {/* Customer */}
                    <TableCell className="px-5 py-4 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.customer.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {order.customer.phone}
                      </span>
                    </TableCell>

                    {/* Car */}
                    <TableCell className="px-5 py-4 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.car.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {order.car.ref}
                      </span>
                    </TableCell>

                    {/* Total */}
                    <TableCell className="px-5 py-4 text-gray-800 font-medium text-theme-sm dark:text-white/90 whitespace-nowrap">
                      {order.total}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-5 py-4">
                      <Badge size="sm" color={statusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">
                      {order.date}
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





{/*import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";

export default function Blank() {
  return (
    <>
      
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Blank Page" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Card Title Here
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Start putting content on grids or panels, you can also use different
            combinations of grids.Please check out the dashboard and other pages
          </p>
        </div>
      </div>
    </div>
    
    </>
  );
}
*/}