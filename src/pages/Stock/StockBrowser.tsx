import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { getAllBrands } from "../../../requestes/brand";
import { getModelsByBrand } from "../../../requestes/model";
import { getEditionsByModel } from "../../../requestes/edition";
import { getAllShowrooms } from "../../../requestes/showroom";
import { createCar } from "../../../requestes/car";

// ─── Types ───────────────────────────────────────────────
interface Brand { id: string; name: string; logo?: string; models?: unknown[]; cars?: unknown[]; }
interface Model { id: string; name: string; category: string; engine: string; years: string[]; cars?: unknown[]; editions?: unknown[]; }
interface Edition { id: string; name: string; sellingPrice: number; purchasePrice: number; gearType: string; colors: string[]; cars?: unknown[]; }
interface Showroom { id: string; name: string; }

type View = "brands" | "models" | "editions";

const inputClass = "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-800 dark:text-white outline-none focus:border-brand-500 transition-colors";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

export default function StockBrowser() {
    const [view, setView] = useState<View>("brands");
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);

    // ─── Data ─────────────────────────────────────────────
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [editions, setEditions] = useState<Edition[]>([]);
    const [showrooms, setShowrooms] = useState<Showroom[]>([]);
    const [loading, setLoading] = useState(false);

    // ─── Add Car Modal ─────────────────────────────────────
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // cascade selects inside modal
    const [modalBrands, setModalBrands] = useState<Brand[]>([]);
    const [modalModels, setModalModels] = useState<Model[]>([]);
    const [modalEditions, setModalEditions] = useState<Edition[]>([]);

    const [carForm, setCarForm] = useState({
        brandId: "",
        modelId: "",
        editionId: "",
        showroomId: "",
        year: new Date().getFullYear(),
        color: "",
        engine: "",
        transmission: "MANUAL",
        specialPrice: "",
        status: "Available",
    });

    useEffect(() => {
        if (view === "brands") {
            setLoading(true);
            getAllBrands().then(setBrands).finally(() => setLoading(false));
        }
        if (view === "models" && selectedBrand) {
            setLoading(true);
            getModelsByBrand(selectedBrand.id).then(setModels).finally(() => setLoading(false));
        }
        if (view === "editions" && selectedModel) {
            setLoading(true);
            getEditionsByModel(selectedModel.id).then(setEditions).finally(() => setLoading(false));
        }
    }, [view, selectedBrand, selectedModel]);

    // load brands + showrooms when modal opens
    useEffect(() => {
        if (showModal) {
            getAllBrands().then(setModalBrands);
            getAllShowrooms().then(setShowrooms);
        }
    }, [showModal]);

    // cascade: brand → models
    useEffect(() => {
        if (carForm.brandId) {
            getModelsByBrand(carForm.brandId).then(setModalModels);
            setCarForm((p) => ({ ...p, modelId: "", editionId: "" }));
            setModalEditions([]);
        }
    }, [carForm.brandId]);

    // cascade: model → editions
    useEffect(() => {
        if (carForm.modelId) {
            getEditionsByModel(carForm.modelId).then(setModalEditions);
            setCarForm((p) => ({ ...p, editionId: "" }));
        }
    }, [carForm.modelId]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCarForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleCreateCar = async () => {
        if (!carForm.brandId || !carForm.modelId || !carForm.editionId || !carForm.showroomId || !carForm.color || !carForm.engine) {
            return setError("Please fill all required fields.");
        }
        setError("");
        setSaving(true);
        try {
            await createCar({
                brandId: carForm.brandId,
                modelId: carForm.modelId,
                editionId: carForm.editionId,
                showroomId: carForm.showroomId,
                year: Number(carForm.year),
                color: carForm.color,
                engine: carForm.engine,
                transmission: carForm.transmission,
                specialPrice: parseFloat(carForm.specialPrice) || 0,
                status: carForm.status,
            });
            // refresh current view
            if (view === "editions" && selectedModel) {
                getEditionsByModel(selectedModel.id).then(setEditions);
            }
            if (view === "brands") {
                getAllBrands().then(setBrands);
            }
            setSuccess("Car added successfully!");
            setTimeout(() => setSuccess(""), 3000);
            setShowModal(false);
            setCarForm({ brandId: "", modelId: "", editionId: "", showroomId: "", year: new Date().getFullYear(), color: "", engine: "", transmission: "MANUAL", specialPrice: "", status: "Available" });
        } catch {
            setError("Failed to add car.");
        } finally {
            setSaving(false);
        }
    };

    const pageTitle =
        view === "brands" ? "Stock" :
            view === "models" ? `${selectedBrand?.name}` :
                `${selectedBrand?.name} ${selectedModel?.name}`;

    return (
        <div>
            <PageMeta title="Stock | Oodeskoo" description="Browse stock by brand, model and edition" />
            <PageBreadcrumb pageTitle={pageTitle} />

            {success && (
                <div className="mb-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-5 py-3 text-sm text-green-600 dark:text-green-400">
                    ✓ {success}
                </div>
            )}

            {/* ── Top bar with Add Car button ── */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
                >
                    + Add Car
                </button>
            </div>

            {/* Breadcrumb trail */}
            {view !== "brands" && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <button onClick={() => setView("brands")} className="text-brand-500 hover:underline">Stock</button>
                    {view === "editions" && (
                        <>
                            <span>›</span>
                            <button onClick={() => setView("models")} className="text-brand-500 hover:underline">{selectedBrand?.name}</button>
                        </>
                    )}
                    <span>›</span>
                    <span className="text-gray-800 dark:text-white font-medium">
                        {view === "models" ? selectedBrand?.name : selectedModel?.name}
                    </span>
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">

                    {/* ── BRANDS ── */}
                    {view === "brands" && (
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {["Brand", "Models", "Cars", ""].map((col) => (
                                        <TableCell key={col} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            {col}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {loading && <TableRow><TableCell className="px-5 py-6 text-center text-gray-400" colSpan={4}>Loading...</TableCell></TableRow>}
                                {!loading && brands.length === 0 && <TableRow><TableCell className="px-5 py-6 text-center text-gray-400" colSpan={4}>No brands found.</TableCell></TableRow>}
                                {brands.map((brand) => (
                                    <TableRow key={brand.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]" onClick={() => { setSelectedBrand(brand); setView("models"); }}>
                                        <TableCell className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {brand.logo ? (
                                                    <img src={brand.logo} alt={brand.name} className="w-9 h-9 rounded-full object-contain bg-gray-100 dark:bg-gray-800 p-1" />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">{brand.name.charAt(0).toUpperCase()}</div>
                                                )}
                                                <span className="font-medium text-gray-800 dark:text-white/90 text-theme-sm">{brand.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">{brand.models?.length ?? 0}</TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">{brand.cars?.length ?? 0}</TableCell>
                                        <TableCell className="px-5 py-4 text-right text-gray-400">›</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {/* ── MODELS ── */}
                    {view === "models" && (
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {["Model", "Category", "Engine", "Years", "Editions", ""].map((col) => (
                                        <TableCell key={col} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">{col}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {loading && <TableRow><TableCell className="px-5 py-6 text-center text-gray-400" colSpan={6}>Loading...</TableCell></TableRow>}
                                {!loading && models.length === 0 && <TableRow><TableCell className="px-5 py-6 text-center text-gray-400" colSpan={6}>No models found.</TableCell></TableRow>}
                                {models.map((model) => (
                                    <TableRow key={model.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]" onClick={() => { setSelectedModel(model); setView("editions"); }}>
                                        <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white/90 text-theme-sm">{model.name}</TableCell>
                                        <TableCell className="px-5 py-4">
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-500 dark:bg-brand-500/10">{model.category}</span>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">{model.engine}</TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-xs dark:text-gray-400">{model.years?.join(", ") || "—"}</TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">{model.editions?.length ?? 0}</TableCell>
                                        <TableCell className="px-5 py-4 text-right text-gray-400">›</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {/* ── EDITIONS ── */}
                    {view === "editions" && (
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {["Edition", "Gear", "Selling Price", "Purchase Price", "Colors", "Cars"].map((col) => (
                                        <TableCell key={col} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">{col}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {loading && <TableRow><TableCell className="px-5 py-6 text-center text-gray-400" colSpan={6}>Loading...</TableCell></TableRow>}
                                {!loading && editions.length === 0 && <TableRow><TableCell className="px-5 py-6 text-center text-gray-400" colSpan={6}>No editions found.</TableCell></TableRow>}
                                {editions.map((edition) => (
                                    <TableRow key={edition.id}>
                                        <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white/90 text-theme-sm">{edition.name}</TableCell>
                                        <TableCell className="px-5 py-4">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${edition.gearType === "AUTOMATIC" ? "bg-blue-50 text-blue-500 dark:bg-blue-500/10" : "bg-green-50 text-green-500 dark:bg-green-500/10"}`}>
                                                {edition.gearType}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white/90 text-theme-sm whitespace-nowrap">{edition.sellingPrice.toLocaleString()} DA</TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">{edition.purchasePrice.toLocaleString()} DA</TableCell>
                                        <TableCell className="px-5 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {edition.colors?.slice(0, 3).map((c, i) => (
                                                    <span key={i} className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">{c}</span>
                                                ))}
                                                {(edition.colors?.length ?? 0) > 3 && (
                                                    <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 dark:bg-gray-800">+{edition.colors.length - 3}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">{edition.cars?.length ?? 0}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>

            {/* ── ADD CAR MODAL ── */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg mx-4 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Add New Car</h3>
                            <button onClick={() => { setShowModal(false); setError(""); }} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                        </div>

                        {error && (
                            <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 px-4 py-3 text-sm text-red-600 dark:text-red-400">⚠ {error}</div>
                        )}

                        <div className="space-y-4">

                            {/* Brand */}
                            <div>
                                <label className={labelClass}>Brand <span className="text-red-500">*</span></label>
                                <select name="brandId" value={carForm.brandId} onChange={handleFormChange} className={inputClass}>
                                    <option value="">Select brand</option>
                                    {modalBrands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>

                            {/* Model — only show after brand selected */}
                            {carForm.brandId && (
                                <div>
                                    <label className={labelClass}>Model <span className="text-red-500">*</span></label>
                                    <select name="modelId" value={carForm.modelId} onChange={handleFormChange} className={inputClass}>
                                        <option value="">Select model</option>
                                        {modalModels.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>
                            )}

                            {/* Edition — only show after model selected */}
                            {carForm.modelId && (
                                <div>
                                    <label className={labelClass}>Edition <span className="text-red-500">*</span></label>
                                    <select name="editionId" value={carForm.editionId} onChange={handleFormChange} className={inputClass}>
                                        <option value="">Select edition</option>
                                        {modalEditions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                                    </select>
                                </div>
                            )}

                            {/* Showroom */}
                            <div>
                                <label className={labelClass}>Showroom <span className="text-red-500">*</span></label>
                                <select name="showroomId" value={carForm.showroomId} onChange={handleFormChange} className={inputClass}>
                                    <option value="">Select showroom</option>
                                    {showrooms.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>

                            {/* Year + Color */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Year <span className="text-red-500">*</span></label>
                                    <input name="year" type="number" value={carForm.year} onChange={handleFormChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Color <span className="text-red-500">*</span></label>
                                    <input name="color" value={carForm.color} onChange={handleFormChange} placeholder="e.g. White" className={inputClass} />
                                </div>
                            </div>

                            {/* Engine + Transmission */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Engine <span className="text-red-500">*</span></label>
                                    <input name="engine" value={carForm.engine} onChange={handleFormChange} placeholder="e.g. 1.5T" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Transmission</label>
                                    <select name="transmission" value={carForm.transmission} onChange={handleFormChange} className={inputClass}>
                                        <option value="MANUAL">Manual</option>
                                        <option value="AUTOMATIC">Automatic</option>
                                    </select>
                                </div>
                            </div>

                            {/* Special Price + Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Special Price (DA)</label>
                                    <input name="specialPrice" type="number" value={carForm.specialPrice} onChange={handleFormChange} placeholder="0" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Status</label>
                                    <select name="status" value={carForm.status} onChange={handleFormChange} className={inputClass}>
                                        <option value="Available">Available</option>
                                        <option value="Reserved">Reserved</option>
                                        <option value="Sold">Sold</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => { setShowModal(false); setError(""); }} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                Cancel
                            </button>
                            <button onClick={handleCreateCar} disabled={saving} className="px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-50">
                                {saving ? "Saving..." : "Add Car"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}