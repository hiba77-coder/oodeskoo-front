import { useEffect, useRef, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
    Table, TableBody, TableCell, TableHeader, TableRow,
} from "../../components/ui/table";
import { getAllBrands, createBrand } from "../../../requestes/brand";
import { getModelsByBrand, createModel } from "../../../requestes/model";
import { getEditionsByModel, createEdition } from "../../../requestes/edition";
import { getAllCars } from "../../../requestes/car";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Brand {
    id: string; name: string; logo?: string;
}
interface Model {
    id: string; name: string; category: string; years: string[]; engine: string;
    editions?: Edition[];
}
interface Edition {
    id: string; name: string; photo: string[]; years: string[]; colors: string[];
    sellingPrice: number; purchasePrice: number;
    gearType: "MANUAL" | "AUTOMATIC";
    interiorSpecifications: string[];
    exteriorSpecifications: string[];
    safetySpecifications: string[];
    cars?: Car[];
}
interface Car {
    id: string; color: string; status: "Available" | "Sold" | "Reserved";
    year?: number; engine?: string; transmission?: string; specialPrice?: number;
    editionId?: string;
}

type View = "brands" | "models" | "editions" | "editionDetail";

const CATEGORIES = ["Sedan", "SUV", "Hatchback", "Coupe", "Truck", "Van", "Convertible"];
const YEARS = Array.from({ length: 10 }, (_, i) => String(2026 - i));
const COLORS = ["White", "Black", "Gray", "Silver", "Blue", "Red", "Green", "Brown", "Beige"];
const GEAR_TYPES = ["MANUAL", "AUTOMATIC"] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusBadge = (s: string) => {
    if (s === "Available") return "bg-green-500/10 text-green-500";
    if (s === "Sold") return "bg-red-500/10 text-red-400";
    return "bg-yellow-500/10 text-yellow-400";
};

const fmtPrice = (n?: number) =>
    n ? `${n.toLocaleString("fr-DZ")} DA` : "N/A";

const inputCls =
    "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-800 dark:text-white outline-none focus:border-brand-500 transition-colors";
const inputDisabledCls =
    "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 outline-none";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CarSettings() {
    const [view, setView] = useState<View>("brands");
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null);

    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [editions, setEditions] = useState<Edition[]>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCars, setShowCars] = useState(false);

    // ── Brand modal
    const [showBrandModal, setShowBrandModal] = useState(false);
    const [brandName, setBrandName] = useState("");
    const [brandLogo, setBrandLogo] = useState("");
    const [logoPreview, setLogoPreview] = useState("");
    const [brandSaving, setBrandSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    // ── Model modal
    const [showModelModal, setShowModelModal] = useState(false);
    const [modelName, setModelName] = useState("");
    const [modelYears, setModelYears] = useState<string[]>([]);
    const [modelCategory, setModelCategory] = useState("");
    const [modelEngine, setModelEngine] = useState("");
    const [modelSaving, setModelSaving] = useState(false);

    // ── Edition modal
    const [showEditionModal, setShowEditionModal] = useState(false);
    const [editionName, setEditionName] = useState("");
    const [editionYears, setEditionYears] = useState<string[]>([]);
    const [editionColors, setEditionColors] = useState<string[]>([]);
    const [editionSellingPrice, setEditionSellingPrice] = useState("");
    const [editionPurchasePrice, setEditionPurchasePrice] = useState("");
    const [editionGearType, setEditionGearType] = useState<"MANUAL" | "AUTOMATIC">("MANUAL");
    const [editionInterior, setEditionInterior] = useState("");
    const [editionExterior, setEditionExterior] = useState("");
    const [editionSafety, setEditionSafety] = useState("");
    const [editionPhotos, setEditionPhotos] = useState<string[]>([]);
    const [editionSaving, setEditionSaving] = useState(false);
    const photoRef = useRef<HTMLInputElement>(null);

    // ── Data fetching
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
        if (view === "editionDetail" && selectedEdition) {
            setLoading(true);
            // Use existing getAllCars and filter by editionId on the client
            getAllCars()
                .then((all: Car[]) => setCars(all.filter((c) => c.editionId === selectedEdition.id)))
                .finally(() => setLoading(false));
            setShowCars(false);
        }
    }, [view, selectedBrand, selectedModel, selectedEdition]);

    // ── Logo file → base64
    const handleLogoFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const r = e.target?.result as string;
            setBrandLogo(r); setLogoPreview(r);
        };
        reader.readAsDataURL(file);
    };

    // ── Photo files → base64
    const handlePhotoFiles = (files: FileList) => {
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const r = e.target?.result as string;
                setEditionPhotos((prev) => [...prev, r]);
            };
            reader.readAsDataURL(file);
        });
    };

    // ── Create brand
    const handleCreateBrand = async () => {
        if (!brandName || !brandLogo) return alert("Brand name and logo are required");
        setBrandSaving(true);
        try {
            await createBrand({ name: brandName, logo: brandLogo });
            setBrands(await getAllBrands());
            setShowBrandModal(false);
            setBrandName(""); setBrandLogo(""); setLogoPreview("");
        } catch { alert("Failed to create brand"); }
        finally { setBrandSaving(false); }
    };

    // ── Create model
    const handleCreateModel = async () => {
        if (!modelName || !modelCategory || !modelEngine)
            return alert("Name, category and engine are required");
        if (!selectedBrand) return;
        setModelSaving(true);
        try {
            await createModel({
                name: modelName, years: modelYears,
                category: modelCategory, engine: modelEngine,
                brandId: selectedBrand.id,
            });
            setModels(await getModelsByBrand(selectedBrand.id));
            setShowModelModal(false);
            setModelName(""); setModelYears([]); setModelCategory(""); setModelEngine("");
        } catch { alert("Failed to create model"); }
        finally { setModelSaving(false); }
    };

    // ── Create edition
    const handleCreateEdition = async () => {
        if (!editionName || !editionSellingPrice || !editionPurchasePrice)
            return alert("Name and prices are required");
        if (!selectedModel) return;
        setEditionSaving(true);
        try {
            await createEdition({
                name: editionName,
                years: editionYears,
                colors: editionColors,
                sellingPrice: parseFloat(editionSellingPrice),
                purchasePrice: parseFloat(editionPurchasePrice),
                gearType: editionGearType,
                interiorSpecifications: editionInterior.split(",").map((s) => s.trim()).filter(Boolean),
                exteriorSpecifications: editionExterior.split(",").map((s) => s.trim()).filter(Boolean),
                safetySpecifications: editionSafety.split(",").map((s) => s.trim()).filter(Boolean),
                photo: editionPhotos,
                modelId: selectedModel.id,
            });
            setEditions(await getEditionsByModel(selectedModel.id));
            setShowEditionModal(false);
            setEditionName(""); setEditionYears([]); setEditionColors([]);
            setEditionSellingPrice(""); setEditionPurchasePrice("");
            setEditionGearType("MANUAL");
            setEditionInterior(""); setEditionExterior(""); setEditionSafety("");
            setEditionPhotos([]);
        } catch { alert("Failed to create edition"); }
        finally { setEditionSaving(false); }
    };

    // ── Back navigation
    const goBack = () => {
        if (view === "editionDetail") setView("editions");
        else if (view === "editions") setView("models");
        else if (view === "models") setView("brands");
    };

    const toggleChip = (val: string, list: string[], setter: (v: string[]) => void) =>
        setter(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div>
            <PageMeta title="Cars Settings | Oodeskoo" description="Manage brands, models and editions" />
            <PageBreadcrumb pageTitle={
                view === "brands" ? "Cars Settings"
                    : view === "models" ? `${selectedBrand?.name} - Select Model`
                        : view === "editions" ? `${selectedBrand?.name} / ${selectedModel?.name} - Select Edition`
                            : `${selectedBrand?.name} / ${selectedModel?.name} / ${selectedEdition?.name}`
            } />

            {/* Back button */}
            {view !== "brands" && (
                <button
                    onClick={goBack}
                    className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-brand-500 dark:text-gray-400 transition-colors"
                >
                    ← Back
                </button>
            )}

            {/* ══════════════════ BRANDS GRID ══════════════════ */}
            {view === "brands" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                    <div
                        onClick={() => setShowBrandModal(true)}
                        className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 cursor-pointer hover:border-brand-500 transition-colors group min-h-[140px]"
                    >
                        <div className="w-14 h-14 rounded-full bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                            <span className="text-brand-500 text-3xl font-light">+</span>
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Add New Brand</span>
                    </div>

                    {loading && <div className="col-span-5 py-10 text-center text-gray-400">Loading...</div>}

                    {brands.map((brand) => (
                        <div
                            key={brand.id}
                            onClick={() => { setSelectedBrand(brand); setView("models"); }}
                            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 cursor-pointer hover:border-brand-500 transition-all min-h-[140px]"
                        >
                            {brand.logo
                                ? <img src={brand.logo} alt={brand.name} className="w-16 h-16 object-contain" />
                                : <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-2xl">{brand.name.charAt(0)}</div>
                            }
                            <span className="text-sm font-semibold text-gray-800 dark:text-white/90 text-center">{brand.name}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ══════════════════ MODELS TABLE ══════════════════ */}
            {view === "models" && (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
                        <h2 className="font-semibold text-gray-800 dark:text-white/90">Select Model</h2>
                        <button
                            onClick={() => setShowModelModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
                        >
                            + Add New Model
                        </button>
                    </div>
                    <div className="max-w-full overflow-x-auto">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {["Model Name", "Category", "Years", "Editions", "Action"].map((col) => (
                                        <TableCell key={col} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">{col}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {loading && (
                                    <TableRow><TableCell colSpan={5} className="px-5 py-6 text-center text-gray-400">Loading...</TableCell></TableRow>
                                )}
                                {!loading && models.length === 0 && (
                                    <TableRow><TableCell colSpan={5} className="px-5 py-10 text-center text-gray-400">No models found</TableCell></TableRow>
                                )}
                                {models.map((model) => (
                                    <TableRow key={model.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                                        <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white/90 text-theme-sm">{model.name}</TableCell>
                                        <TableCell className="px-5 py-4">
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-500 dark:bg-brand-500/10">{model.category}</span>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-xs dark:text-gray-400">{model.years?.join(", ") || "—"}</TableCell>
                                        <TableCell className="px-5 py-4 text-brand-500 font-semibold text-theme-sm">{model.editions?.length ?? 0}</TableCell>
                                        <TableCell className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => { setSelectedModel(model); setView("editions"); }}
                                                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:border-brand-500 hover:text-brand-500 transition-colors"
                                                >
                                                    Select
                                                </button>
                                                <IconBtn title="Edit" onClick={() => { }}><EditIcon /></IconBtn>
                                                <IconBtn title="Delete" onClick={() => { }} danger><TrashIcon /></IconBtn>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {/* ══════════════════ EDITIONS TABLE ══════════════════ */}
            {view === "editions" && (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
                        <h2 className="font-semibold text-gray-800 dark:text-white/90">Select Edition</h2>
                        <button
                            onClick={() => setShowEditionModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
                        >
                            + Add New Edition
                        </button>
                    </div>
                    <div className="max-w-full overflow-x-auto">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {["Image", "Edition Name", "Years", "Engine", "Fuel / Gear", "Price Excl. Tax", "Status", "Action"].map((col) => (
                                        <TableCell key={col} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">{col}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {loading && (
                                    <TableRow><TableCell colSpan={8} className="px-5 py-6 text-center text-gray-400">Loading...</TableCell></TableRow>
                                )}
                                {!loading && editions.length === 0 && (
                                    <TableRow><TableCell colSpan={8} className="px-5 py-10 text-center text-gray-400">No editions found</TableCell></TableRow>
                                )}
                                {editions.map((edition) => {
                                    const hasStock = edition.cars?.some((c) => c.status === "Available");
                                    return (
                                        <TableRow key={edition.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                                            <TableCell className="px-5 py-4">
                                                {edition.photo?.[0]
                                                    ? <img src={edition.photo[0]} alt={edition.name} className="w-14 h-10 object-cover rounded-lg" />
                                                    : <div className="w-14 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-xs">—</div>
                                                }
                                            </TableCell>
                                            <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white/90 text-theme-sm">{edition.name}</TableCell>
                                            <TableCell className="px-5 py-4 text-gray-500 text-theme-xs dark:text-gray-400">{edition.years?.join(", ") || "—"}</TableCell>
                                            <TableCell className="px-5 py-4 text-gray-500 text-theme-xs dark:text-gray-400">
                                                <span className="block text-gray-400 text-xs">N/A</span>
                                                <span className="text-xs">{selectedModel?.engine || "—"}</span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-500 text-theme-xs dark:text-gray-400">
                                                <span className="block">Gasoline</span>
                                                <span className="text-xs">{edition.gearType === "MANUAL" ? "Manual" : "Automatic"}</span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-800 dark:text-white/90 font-medium text-theme-sm">{fmtPrice(edition.sellingPrice)}</TableCell>
                                            <TableCell className="px-5 py-4">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${hasStock ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-400"}`}>
                                                    {hasStock ? "Available" : "No Stock"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => { setSelectedEdition(edition); setView("editionDetail"); }}
                                                        className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:border-brand-500 hover:text-brand-500 transition-colors whitespace-nowrap"
                                                    >
                                                        View Details
                                                    </button>
                                                    <IconBtn title="Edit" onClick={() => { }}><EditIcon /></IconBtn>
                                                    <IconBtn title="Delete" onClick={() => { }} danger><TrashIcon /></IconBtn>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {/* ══════════════════ EDITION DETAIL ══════════════════ */}
            {view === "editionDetail" && selectedEdition && (
                <div className="space-y-5">
                    {/* Header */}
                    <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                                    {selectedBrand?.name} {selectedModel?.name}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-0.5">{selectedEdition.name}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-500">Available</span>
                        </div>
                        {selectedEdition.photo?.length > 0 ? (
                            <div className="flex gap-3 overflow-x-auto pb-1">
                                {selectedEdition.photo.map((p, i) => (
                                    <img key={i} src={p} alt="" className="h-44 w-auto rounded-xl object-cover flex-shrink-0" />
                                ))}
                            </div>
                        ) : (
                            <div className="h-44 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">No photos</div>
                        )}
                    </div>

                    {/* Price cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: "Price TTC", value: "N/A", highlight: false },
                            { label: "Price Excluding Tax", value: fmtPrice(selectedEdition.sellingPrice), highlight: true },
                            { label: "Customs Fees", value: "N/A", highlight: false },
                        ].map(({ label, value, highlight }) => (
                            <div key={label} className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-5">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                                <p className={`text-xl font-bold ${highlight ? "text-brand-500" : "text-gray-800 dark:text-white/90"}`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Engine specs */}
                    <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                        <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-5">Engine Specs</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5">
                            {[
                                { label: "Engine Name", value: "N/A" },
                                { label: "Capacity", value: "—" },
                                { label: "Horsepower", value: "—" },
                                { label: "Turbo", value: "No" },
                                { label: "Fuel Type", value: "Gasoline" },
                                { label: "Transmission", value: selectedEdition.gearType === "MANUAL" ? "Manual" : "Automatic" },
                                { label: "Model Years", value: selectedEdition.years?.join(", ") || "—" },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Available Colors */}
                    <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                        <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-4">Available Colors</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedEdition.colors?.length > 0
                                ? selectedEdition.colors.map((c) => (
                                    <span key={c} className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">{c}</span>
                                ))
                                : <span className="text-gray-400 text-sm">No colors specified</span>
                            }
                        </div>
                    </div>

                    {/* Specs sections */}
                    {selectedEdition.interiorSpecifications?.length > 0 && (
                        <SpecsCard title="Interior Features" items={selectedEdition.interiorSpecifications} />
                    )}
                    {selectedEdition.exteriorSpecifications?.length > 0 && (
                        <SpecsCard title="Exterior Features" items={selectedEdition.exteriorSpecifications} />
                    )}
                    {selectedEdition.safetySpecifications?.length > 0 && (
                        <SpecsCard title="Safety Features" items={selectedEdition.safetySpecifications} />
                    )}

                    {/* Cars in Stock */}
                    <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-800 dark:text-white/90">Cars in Stock</h3>
                            <button
                                onClick={() => setShowCars((v) => !v)}
                                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-brand-500 hover:text-brand-500 transition-colors"
                            >
                                {showCars ? "Hide Cars" : "Show Cars"}
                            </button>
                        </div>

                        {showCars && (
                            loading
                                ? <p className="text-center text-gray-400 py-6">Loading...</p>
                                : cars.length === 0
                                    ? <p className="text-center text-gray-400 py-6">No cars in stock for this edition.</p>
                                    : (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                                    <TableRow>
                                                        {["Color", "Year", "Engine", "Transmission", "Price", "Status"].map((col) => (
                                                            <TableCell key={col} isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">{col}</TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                                    {cars.map((car) => (
                                                        <TableRow key={car.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                                                            <TableCell className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{car.color}</TableCell>
                                                            <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{car.year ?? "—"}</TableCell>
                                                            <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{car.engine ?? "—"}</TableCell>
                                                            <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{car.transmission ?? "—"}</TableCell>
                                                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">{fmtPrice(car.specialPrice)}</TableCell>
                                                            <TableCell className="px-4 py-3">
                                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusBadge(car.status)}`}>
                                                                    {car.status}
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )
                        )}
                    </div>
                </div>
            )}

            {/* ══════════════════ BRAND MODAL ══════════════════ */}
            {showBrandModal && (
                <Modal title="Create New Brand" onClose={() => setShowBrandModal(false)}>
                    <div className="space-y-4">
                        <FormField label="Brand Name" required>
                            <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Enter brand name" className={inputCls} />
                        </FormField>
                        <FormField label="Brand Logo" required>
                            <div
                                onClick={() => fileRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleLogoFile(f); }}
                                className="w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-brand-500 transition-colors"
                            >
                                {logoPreview
                                    ? <img src={logoPreview} alt="preview" className="w-20 h-20 object-contain" />
                                    : <>
                                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-2xl">↑</div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Drag and drop or <span className="text-brand-500 underline">Browse File</span></p>
                                    </>
                                }
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoFile(f); }} />
                        </FormField>
                    </div>
                    <ModalFooter onCancel={() => setShowBrandModal(false)} onConfirm={handleCreateBrand} saving={brandSaving} label="Create Brand" />
                </Modal>
            )}

            {/* ══════════════════ MODEL MODAL ══════════════════ */}
            {showModelModal && (
                <Modal title="Create New Model" onClose={() => setShowModelModal(false)}>
                    <div className="space-y-4">
                        <FormField label="Brand">
                            <input value={selectedBrand?.name || ""} disabled className={inputDisabledCls} />
                        </FormField>
                        <FormField label="Model Name" required>
                            <input type="text" value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="Enter model name" className={inputCls} />
                        </FormField>
                        <FormField label="Engine" required>
                            <input type="text" value={modelEngine} onChange={(e) => setModelEngine(e.target.value)} placeholder="e.g. 1.5T" className={inputCls} />
                        </FormField>
                        <FormField label="Model Years">
                            <div className="flex flex-wrap gap-2">
                                {YEARS.map((y) => (
                                    <ChipToggle key={y} label={y} active={modelYears.includes(y)} onClick={() => toggleChip(y, modelYears, setModelYears)} />
                                ))}
                            </div>
                        </FormField>
                        <FormField label="Category" required>
                            <select value={modelCategory} onChange={(e) => setModelCategory(e.target.value)} className={inputCls}>
                                <option value="">Select a category</option>
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </FormField>
                    </div>
                    <ModalFooter onCancel={() => setShowModelModal(false)} onConfirm={handleCreateModel} saving={modelSaving} label="Create Model" />
                </Modal>
            )}

            {/* ══════════════════ EDITION MODAL ══════════════════ */}
            {showEditionModal && (
                <Modal title="Create New Edition" onClose={() => setShowEditionModal(false)} wide>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Model">
                                <input value={selectedModel?.name || ""} disabled className={inputDisabledCls} />
                            </FormField>
                            <FormField label="Edition Name" required>
                                <input type="text" value={editionName} onChange={(e) => setEditionName(e.target.value)} placeholder="e.g. 7 SEATER" className={inputCls} />
                            </FormField>
                            <FormField label="Selling Price (DA)" required>
                                <input type="number" value={editionSellingPrice} onChange={(e) => setEditionSellingPrice(e.target.value)} placeholder="2790000" className={inputCls} />
                            </FormField>
                            <FormField label="Purchase Price (DA)" required>
                                <input type="number" value={editionPurchasePrice} onChange={(e) => setEditionPurchasePrice(e.target.value)} placeholder="2500000" className={inputCls} />
                            </FormField>
                        </div>

                        <FormField label="Gear Type">
                            <div className="flex gap-3">
                                {GEAR_TYPES.map((g) => (
                                    <button key={g} type="button" onClick={() => setEditionGearType(g)}
                                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${editionGearType === g ? "bg-brand-500 text-white border-brand-500" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}>
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </FormField>

                        <FormField label="Model Years">
                            <div className="flex flex-wrap gap-2">
                                {YEARS.map((y) => (
                                    <ChipToggle key={y} label={y} active={editionYears.includes(y)} onClick={() => toggleChip(y, editionYears, setEditionYears)} />
                                ))}
                            </div>
                        </FormField>

                        <FormField label="Available Colors">
                            <div className="flex flex-wrap gap-2">
                                {COLORS.map((c) => (
                                    <ChipToggle key={c} label={c} active={editionColors.includes(c)} onClick={() => toggleChip(c, editionColors, setEditionColors)} />
                                ))}
                            </div>
                        </FormField>

                        <FormField label="Interior Specifications (comma-separated)">
                            <input type="text" value={editionInterior} onChange={(e) => setEditionInterior(e.target.value)} placeholder="Leather seats, AC, Bluetooth..." className={inputCls} />
                        </FormField>
                        <FormField label="Exterior Specifications (comma-separated)">
                            <input type="text" value={editionExterior} onChange={(e) => setEditionExterior(e.target.value)} placeholder="LED headlights, Fog lights..." className={inputCls} />
                        </FormField>
                        <FormField label="Safety Specifications (comma-separated)">
                            <input type="text" value={editionSafety} onChange={(e) => setEditionSafety(e.target.value)} placeholder="ABS brakes, Airbags..." className={inputCls} />
                        </FormField>

                        <FormField label="Edition Photos">
                            <div
                                onClick={() => photoRef.current?.click()}
                                className="w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-brand-500 transition-colors"
                            >
                                {editionPhotos.length > 0
                                    ? <div className="flex gap-2 flex-wrap">{editionPhotos.map((p, i) => <img key={i} src={p} alt="" className="w-16 h-16 object-cover rounded-lg" />)}</div>
                                    : <p className="text-sm text-gray-500">Click to upload photos</p>
                                }
                            </div>
                            <input ref={photoRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files) handlePhotoFiles(e.target.files); }} />
                        </FormField>
                    </div>
                    <ModalFooter onCancel={() => setShowEditionModal(false)} onConfirm={handleCreateEdition} saving={editionSaving} label="Create Edition" />
                </Modal>
            )}
        </div>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className={`bg-white dark:bg-gray-900 rounded-2xl w-full p-6 shadow-xl overflow-y-auto max-h-[90vh] ${wide ? "max-w-2xl" : "max-w-lg"}`}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {children}
        </div>
    );
}

function ModalFooter({ onCancel, onConfirm, saving, label }: { onCancel: () => void; onConfirm: () => void; saving: boolean; label: string }) {
    return (
        <div className="flex justify-end gap-3 mt-6">
            <button onClick={onCancel} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Cancel
            </button>
            <button onClick={onConfirm} disabled={saving} className="px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-50 transition-colors">
                {saving ? "Saving..." : label}
            </button>
        </div>
    );
}

function ChipToggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${active ? "bg-brand-500 text-white border-brand-500" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-500"}`}>
            {label}
        </button>
    );
}

function IconBtn({ children, onClick, title, danger }: { children: React.ReactNode; onClick: () => void; title?: string; danger?: boolean }) {
    return (
        <button onClick={onClick} title={title}
            className={`p-1.5 rounded-lg transition-colors ${danger
                ? "text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                : "text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10"}`}>
            {children}
        </button>
    );
}

function SpecsCard({ title, items }: { title: string; items: string[] }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-4">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3">
                {items.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function EditIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" /><path d="M14 11v6" />
            <path d="M9 6V4h6v2" />
        </svg>
    );
}