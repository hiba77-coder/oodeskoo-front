import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllShowrooms } from "../../../requestes/showroom";
import { createStaff } from "../../../requestes/staff";

interface Showroom { id: string; name: string; }

export default function AddStaffForm() {
    const [showrooms, setShowrooms] = useState<Showroom[]>([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        Role: "EMPLOYEE", // ✅ updated
        showroomId: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        getAllShowrooms().then(setShowrooms);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!form.fullName || !form.email || !form.Role || !form.showroomId || !form.password) {
            return setError("Please fill all required fields.");
        }
        if (form.password !== form.confirmPassword) {
            return setError("Passwords do not match.");
        }
        setSaving(true);
        try {
            await createStaff({
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                Role: form.Role,
                showroomId: form.showroomId,
                password: form.password,
            });
            setSuccess("Staff account created successfully!");
            setForm({ fullName: "", email: "", phone: "", Role: "EMPLOYEE", showroomId: "", password: "", confirmPassword: "" }); // ✅ updated
            setTimeout(() => setSuccess(""), 4000);
        } catch {
            setError("Failed to create staff account.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
            <div className="w-full max-w-md sm:pt-10 mx-auto mb-5 px-6">
                <Link
                    to="/"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <svg className="stroke-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M12.7083 5L7.5 10.2083L12.7083 15.4167" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to dashboard
                </Link>
            </div>

            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-6 pb-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white/90 mb-2">Create Staff Account</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details to register a new staff member</p>
                </div>

                {error && (
                    <div className="mb-5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                        ⚠ {error}
                    </div>
                )}
                {success && (
                    <div className="mb-5 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                        ✓ {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 text-sm text-gray-800 dark:text-white outline-none placeholder:text-gray-400 focus:border-brand-500 dark:focus:border-brand-500 transition-colors"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 text-sm text-gray-800 dark:text-white outline-none placeholder:text-gray-400 focus:border-brand-500 dark:focus:border-brand-500 transition-colors"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 text-sm text-gray-800 dark:text-white outline-none placeholder:text-gray-400 focus:border-brand-500 dark:focus:border-brand-500 transition-colors"
                        />
                    </div>

                    {/* Role ✅ updated options */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Role <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="Role"
                            value={form.Role}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 text-sm text-gray-800 dark:text-white outline-none focus:border-brand-500 dark:focus:border-brand-500 transition-colors"
                        >
                            <option value="EMPLOYEE">Employee</option>
                            <option value="ADMIN">Admin</option>
                            <option value="OWNER">Owner</option>
                            <option value="CLIENT">Client</option>
                        </select>
                    </div>

                    {/* Showroom */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Showroom <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="showroomId"
                            value={form.showroomId}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 text-sm text-gray-800 dark:text-white outline-none focus:border-brand-500 dark:focus:border-brand-500 transition-colors"
                        >
                            <option value="">Select a showroom</option>
                            {showrooms.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 text-sm text-gray-800 dark:text-white outline-none placeholder:text-gray-400 focus:border-brand-500 dark:focus:border-brand-500 transition-colors pr-12"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                name="confirmPassword"
                                type={showConfirm ? "text" : "password"}
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm password"
                                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 text-sm text-gray-800 dark:text-white outline-none placeholder:text-gray-400 focus:border-brand-500 dark:focus:border-brand-500 transition-colors pr-12"
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showConfirm ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 transition-colors mt-2"
                    >
                        {saving ? "Creating..." : "Create Account"}
                    </button>

                </form>
            </div>
        </div>
    );
}