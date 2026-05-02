import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { getAllBrands } from "../../../requestes/brand";
import { getModelsByBrand } from "../../../requestes/model";
import { getEditionsByModel } from "../../../requestes/edition";

// ─── Types ───────────────────────────────────────────────
interface Brand { id: string; name: string; logo?: string; models?: unknown[]; cars?: unknown[]; }
interface Model { id: string; name: string; category: string; engine: string; years: string[]; cars?: unknown[]; editions?: unknown[]; }
interface Edition { id: string; name: string; sellingPrice: number; purchasePrice: number; gearType: string; colors: string[]; cars?: unknown[]; }

type View = "brands" | "models" | "editions";

export default function StockBrowser() {
    const [view, setView] = useState<View>("brands");
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);

    // ─── Data ─────────────────────────────────────────────
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [editions, setEditions] = useState<Edition[]>([]);
    const [loading, setLoading] = useState(false);

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

    // ─── Breadcrumb label ─────────────────────────────────
    const pageTitle =
        view === "brands" ? "Stock" :
            view === "models" ? `${selectedBrand?.name}` :
                `${selectedBrand?.name} ${selectedModel?.name}`;

    return (
        <div>
            <PageMeta title="Stock | Oodeskoo" description="Browse stock by brand, model and edition" />
            <PageBreadcrumb pageTitle={pageTitle} />

            {/* Breadcrumb trail for drill-down */}
            {view !== "brands" && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <button onClick={() => setView("brands")} className="text-brand-500 hover:underline">
                        Stock
                    </button>
                    {view === "editions" && (
                        <>
                            <span>›</span>
                            <button onClick={() => setView("models")} className="text-brand-500 hover:underline">
                                {selectedBrand?.name}
                            </button>
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
                                {loading && (
                                    <TableRow>
                                        <TableCell className="px-5 py-6 text-center text-gray-400" colSpan={4}>Loading...</TableCell>
                                    </TableRow>
                                )}
                                {!loading && brands.length === 0 && (
                                    <TableRow>
                                        <TableCell className="px-5 py-6 text-center text-gray-400" colSpan={4}>No brands found.</TableCell>
                                    </TableRow>
                                )}
                                {brands.map((brand) => (
                                    <TableRow
                                        key={brand.id}
                                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                                        onClick={() => { setSelectedBrand(brand); setView("models"); }}
                                    >
                                        <TableCell className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {brand.logo ? (
                                                    <img src={brand.logo} alt={brand.name} className="w-9 h-9 rounded-full object-contain bg-gray-100 dark:bg-gray-800 p-1" />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                                                        {brand.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="font-medium text-gray-800 dark:text-white/90 text-theme-sm">{brand.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {brand.models?.length ?? 0}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {brand.cars?.length ?? 0}
                                        </TableCell>
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
                                        <TableCell key={col} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            {col}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {loading && (
                                    <TableRow>
                                        <TableCell className="px-5 py-6 text-center text-gray-400" colSpan={6}>Loading...</TableCell>
                                    </TableRow>
                                )}
                                {!loading && models.length === 0 && (
                                    <TableRow>
                                        <TableCell className="px-5 py-6 text-center text-gray-400" colSpan={6}>No models found for this brand.</TableCell>
                                    </TableRow>
                                )}
                                {models.map((model) => (
                                    <TableRow
                                        key={model.id}
                                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                                        onClick={() => { setSelectedModel(model); setView("editions"); }}
                                    >
                                        <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white/90 text-theme-sm">
                                            {model.name}
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-500 dark:bg-brand-500/10">
                                                {model.category}
                                            </span>
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
                                        <TableCell key={col} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            {col}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {loading && (
                                    <TableRow>
                                        <TableCell className="px-5 py-6 text-center text-gray-400" colSpan={6}>Loading...</TableCell>
                                    </TableRow>
                                )}
                                {!loading && editions.length === 0 && (
                                    <TableRow>
                                        <TableCell className="px-5 py-6 text-center text-gray-400" colSpan={6}>No editions found.</TableCell>
                                    </TableRow>
                                )}
                                {editions.map((edition) => (
                                    <TableRow key={edition.id}>
                                        <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white/90 text-theme-sm">
                                            {edition.name}
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${edition.gearType === "AUTOMATIC"
                                                    ? "bg-blue-50 text-blue-500 dark:bg-blue-500/10"
                                                    : "bg-green-50 text-green-500 dark:bg-green-500/10"
                                                }`}>
                                                {edition.gearType}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white/90 text-theme-sm whitespace-nowrap">
                                            {edition.sellingPrice.toLocaleString()} DA
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">
                                            {edition.purchasePrice.toLocaleString()} DA
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {edition.colors?.slice(0, 3).map((c, i) => (
                                                    <span key={i} className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                                        {c}
                                                    </span>
                                                ))}
                                                {(edition.colors?.length ?? 0) > 3 && (
                                                    <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 dark:bg-gray-800">
                                                        +{edition.colors.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {edition.cars?.length ?? 0}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                </div>
            </div>
        </div>
    );
}