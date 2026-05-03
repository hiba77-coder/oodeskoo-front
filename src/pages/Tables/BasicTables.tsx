import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { getAllCustomers } from "../../../requestes/customer";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  NIN: string;
  phone: string;
  email: string;
  adress: string;
  gender: string;
  showroom?: { name: string };
  orders?: unknown[];
  cars?: unknown[];
}

export default function BasicTables() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllCustomers().then(setCustomers).finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) => {
    const full = `${c.firstName} ${c.lastName} ${c.email} ${c.phone}`.toLowerCase();
    return full.includes(search.toLowerCase());
  });

  return (
    <>
      <PageMeta title="Customers | Oodeskoo" description="Customers list" />
      <PageBreadcrumb pageTitle="Customers" />

      <div className="space-y-6">

        {/* Search */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Customers", value: customers.length, color: "text-gray-800 dark:text-white" },
            { label: "Male", value: customers.filter((c) => c.gender === "Male").length, color: "text-blue-500" },
            { label: "Female", value: customers.filter((c) => c.gender === "Female").length, color: "text-pink-500" },
            { label: "With Orders", value: customers.filter((c) => (c.orders?.length ?? 0) > 0).length, color: "text-green-500" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white px-5 py-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {["Customer", "NIN", "Contact", "Address", "Gender", "Showroom", "Orders"].map((col) => (
                    <TableCell key={col} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading && (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-400" colSpan={7}>Loading...</TableCell>
                  </TableRow>
                )}
                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-400" colSpan={7}>No customers found.</TableCell>
                  </TableRow>
                )}
                {filtered.map((c) => (
                  <TableRow key={c.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {c.firstName.charAt(0)}{c.lastName.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white/90 text-theme-sm whitespace-nowrap">
                          {c.firstName} {c.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">
                      {c.NIN}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <span className="block text-gray-800 dark:text-white/90 text-theme-sm">{c.email}</span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{c.phone}</span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">{c.adress}</TableCell>
                    <TableCell className="px-5 py-4">
                      <Badge size="sm" color={c.gender === "Male" ? "info" : "light"}>
                        {c.gender}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">
                      {c.showroom?.name || "—"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                      {c.orders?.length ?? 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>
    </>
  );
}