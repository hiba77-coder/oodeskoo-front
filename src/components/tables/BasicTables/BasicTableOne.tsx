import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";

// MODIFIED: replaced Order interface with Customer
interface Customer {
  id: number;
  user: {
    image: string;
    name: string;
    // REMOVED: role from user object — now its own column
  };
  // REMOVED: projectName
  // REMOVED: team
  // ADDED: phone, role, documents, showroom, created
  phone: string;
  role: string;
  documents: number;
  showroom: string;
  created: string;
  status: string;
}

// MODIFIED: updated tableData to match Customer interface
const tableData: Customer[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Benhellal Hiba",
    },
    phone: "0661262642",
    role: "Normal",
    documents: 0,
    showroom: "Oodeskoo Motors",
    created: "29 Apr 2026",
    status: "Active",
  },
  {
    id: 2,
    user: {
      image: "/images/user/user-18.jpg",
      name: "Belouti Meriem",
    },
    phone: "0770123456",
    role: "VIP",
    documents: 2,
    showroom: "Oodeskoo Sétif",
    created: "28 Apr 2026",
    status: "Pending",
  },
  {
    id: 3,
    user: {
      image: "/images/user/user-19.jpg",
      name: "Boumaza Aicha",
    },
    phone: "0723847566",
    role: "VIP",
    documents: 2,
    showroom: "Oodeskoo Algiers",
    created: "28 Apr 2026",
    status: "Pending",
  },
];

export default function BasicTableOne() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {/* MODIFIED: label "User" → "Customer" */}
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Customer
              </TableCell>

              {/* ADDED: Phone column */}
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Phone
              </TableCell>

              {/* MODIFIED: label "Project Name" → "Role" */}
              {/* <TableCell isHeader ...>Project Name</TableCell> */}
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Role
              </TableCell>

              {/* REMOVED: Team column */}
              {/* <TableCell isHeader ...>Team</TableCell> */}

              {/* MODIFIED: label "Status" → "Documents" */}
              {/* <TableCell isHeader ...>Status</TableCell> */}
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Documents
              </TableCell>

              {/* MODIFIED: label "Budget" → "Showroom" */}
              {/* <TableCell isHeader ...>Budget</TableCell> */}
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Showroom
              </TableCell>

              {/* ADDED: Created column */}
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Created
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableData.map((order) => (
              <TableRow key={order.id}>

                {/* Customer cell — REMOVED: order.user.role from display */}
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={order.user.image}
                        alt={order.user.name}
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.user.name}
                      </span>
                      {/* REMOVED: <span>{order.user.role}</span> */}
                    </div>
                  </div>
                </TableCell>

                {/* ADDED: Phone cell */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.phone}
                </TableCell>

                {/* MODIFIED: was projectName, now role as Badge */}
                {/* <TableCell>{order.projectName}</TableCell> */}
                <TableCell className="px-4 py-3 text-start">
                  <Badge
                    size="sm"
                    color={order.role === "VIP" ? "warning" : "success"}
                  >
                    {order.role}
                  </Badge>
                </TableCell>

                {/* REMOVED: Team avatars cell */}
                {/* <TableCell>
                  <div className="flex -space-x-2">
                    {order.team.images.map(...)}
                  </div>
                </TableCell> */}

                {/* MODIFIED: was Status Badge, now Documents count */}
                {/* <TableCell><Badge ...>{order.status}</Badge></TableCell> */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.documents} Docs
                </TableCell>

                {/* MODIFIED: was budget, now showroom */}
                {/* <TableCell>{order.budget}</TableCell> */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.showroom}
                </TableCell>

                {/* ADDED: Created cell */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.created}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}