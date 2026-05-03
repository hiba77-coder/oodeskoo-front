import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { getAllShowrooms, createShowroom, deleteShowroom } from "../../../requestes/showroom";

interface Showroom {
    id: string;
    name: string;
    address: string;
    phone: string;
    managerName: string;
    managerPhone: string;
    managerEmail: string;
}

const inputClass = "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-800 dark:text-white outline-none focus:border-brand-500 transition-colors";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

export default function Showrooms() {
    const [showrooms, setShowrooms] = useState<Showroom[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        managerName: "",
        managerPhone: "",
        managerEmail: "",
    });

    const fetchShowrooms = () => {
        setLoading(true);
        getAllShowrooms().then(setShowrooms).finally(() => setLoading(false));
    };

    useEffect(() => { fetchShowrooms(); }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCreate = async () => {
        if (!form.name || !form.address || !form.phone || !form.managerName || !form.managerPhone || !form.managerEmail) {
            return setError("All fields are required.");
        }
        setError("");
        setSaving(true);
        try {
            await createShowroom(form);
            fetchShowrooms();
            setShowModal(false);
            setForm({ name: "", address: "", phone: "", managerName: "", managerPhone: "", managerEmail: "" });
            setSuccess("Showroom created successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch {
            setError("Failed to create showroom.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this showroom?")) return;
        try {
            await deleteShowroom(id);
            fetchShowrooms();
        } catch {
            setError("Failed to delete showroom.");
        }
    };

    return (
        <div>
            <PageMeta title="Showrooms | Oodeskoo" description="Manage showrooms" />
            <PageBreadcrumb pageTitle="Showrooms" />

            {success && (
                <div className="mb-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-5 py-3 text-sm text-green-600 dark:text-green-400">
                    ✓ {success}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">{showrooms.length} showroom(s) found</p>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
                >
                    + Add Showroom
                </button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                {["Showroom", "Address", "Phone", "Manager", "Manager Phone", "Manager Email", ""].map((col) => (
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
                            {!loading && showrooms.length === 0 && (
                                <TableRow>
                                    <TableCell className="px-5 py-8 text-center text-gray-400" colSpan={7}>No showrooms found. Add your first one.</TableCell>
                                </TableRow>
                            )}
                            {showrooms.map((s) => (
                                <TableRow key={s.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                                    <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white/90 text-theme-sm whitespace-nowrap">
                                        {s.name}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">{s.address}</TableCell>
                                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">{s.phone}</TableCell>
                                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">{s.managerName}</TableCell>
                                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">{s.managerPhone}</TableCell>
                                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">{s.managerEmail}</TableCell>
                                    <TableCell className="px-5 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(s.id)}
                                            className="text-red-400 hover:text-red-600 text-sm transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg mx-4 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Add New Showroom</h3>
                            <button onClick={() => { setShowModal(false); setError(""); }} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                        </div>

                        {error && (
                            <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                                ⚠ {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Showroom Name <span className="text-red-500">*</span></label>
                                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. CG Cars Sétif" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Address <span className="text-red-500">*</span></label>
                                <input name="address" value={form.address} onChange={handleChange} placeholder="Full address" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Phone <span className="text-red-500">*</span></label>
                                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+213..." className={inputClass} />
                            </div>

                            <hr className="border-gray-100 dark:border-gray-800" />
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Manager Info</p>

                            <div>
                                <label className={labelClass}>Manager Name <span className="text-red-500">*</span></label>
                                <input name="managerName" value={form.managerName} onChange={handleChange} placeholder="Full name" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Manager Phone <span className="text-red-500">*</span></label>
                                <input name="managerPhone" value={form.managerPhone} onChange={handleChange} placeholder="+213..." className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Manager Email <span className="text-red-500">*</span></label>
                                <input name="managerEmail" value={form.managerEmail} onChange={handleChange} placeholder="manager@email.com" className={inputClass} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => { setShowModal(false); setError(""); }} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                Cancel
                            </button>
                            <button onClick={handleCreate} disabled={saving} className="px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-50">
                                {saving ? "Saving..." : "Create Showroom"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}