import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { getAllShowrooms } from "../../../requestes/showroom";
import { getAllCars } from "../../../requestes/car";
import { createCustomer } from "../../../requestes/customer";
import { createOrder } from "../../../requestes/order";
import { updateCar } from "../../../requestes/car";

interface Showroom { id: string; name: string; }
interface Car {
  id: string;
  color: string;
  year: number;
  transmission: string;
  specialPrice: number;
  status: string;
  brand?: { name: string };
  model?: { name: string };
  edition?: { name: string; sellingPrice: number };
}

export default function FormElements() {
  // ─── Showrooms + Cars ─────────────────────────────────
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  useEffect(() => {
    getAllShowrooms().then(setShowrooms);
    getAllCars().then((data: Car[]) =>
      setCars(data.filter((c) => c.status === "Available"))
    );
  }, []);

  // ─── Form State ───────────────────────────────────────
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    NIN: "",
    email: "",
    phone: "",
    adress: "",
    gender: "Male",
    showroomId: "",
  });

  const [order, setOrder] = useState({
    carId: "",
    finalPrice: "",
    date: new Date().toISOString().split("T")[0],
    status: "Waiting",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCarSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const car = cars.find((c) => c.id === e.target.value) || null;
    setSelectedCar(car);
    setOrder((prev) => ({
      ...prev,
      carId: e.target.value,
      finalPrice: car?.edition?.sellingPrice?.toString() || car?.specialPrice?.toString() || "",
    }));
  };

  const handleSubmit = async () => {
    // validation
    if (!form.firstName || !form.lastName || !form.NIN || !form.email || !form.phone || !form.adress || !form.showroomId) {
      return setError("Please fill all required customer fields.");
    }
    setError("");
    setSaving(true);
    try {
      // 1. create customer
      const customerRes = await createCustomer({ ...form, showroomId: form.showroomId });
      const customerId = customerRes.data.id;

      // 2. create order if car selected
      if (order.carId) {
        await createOrder({
          customerId,
          carId: order.carId,
          date: order.date,
          price: selectedCar?.edition?.sellingPrice || selectedCar?.specialPrice || 0,
          finalPrice: parseFloat(order.finalPrice),
          status: order.status,
        });
        // 3. update car status to Reserved
        await updateCar(order.carId, { status: "Reserved" });
      }

      setSuccess(true);
      // reset
      setForm({ firstName: "", lastName: "", NIN: "", email: "", phone: "", adress: "", gender: "Male", showroomId: "" });
      setOrder({ carId: "", finalPrice: "", date: new Date().toISOString().split("T")[0], status: "Waiting" });
      setSelectedCar(null);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-800 dark:text-white outline-none focus:border-brand-500 transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div>
      <PageMeta title="Customer Form | Oodeskoo" description="Add a new customer" />
      <PageBreadcrumb pageTitle="Customer Form" />

      {success && (
        <div className="mb-6 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-5 py-4 text-sm text-green-600 dark:text-green-400">
          ✓ Customer created successfully!
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-5 py-4 text-sm text-red-600 dark:text-red-400">
          ⚠ {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* ── Personal Information ── */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-2">Personal Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name <span className="text-red-500">*</span></label>
              <input name="firstName" value={form.firstName} onChange={handleFormChange} placeholder="Enter first name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Last Name <span className="text-red-500">*</span></label>
              <input name="lastName" value={form.lastName} onChange={handleFormChange} placeholder="Enter last name" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>National ID (NIN) <span className="text-red-500">*</span></label>
            <input name="NIN" value={form.NIN} onChange={handleFormChange} placeholder="Enter national ID number" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Gender <span className="text-red-500">*</span></label>
            <select name="gender" value={form.gender} onChange={handleFormChange} className={inputClass}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Address <span className="text-red-500">*</span></label>
            <input name="adress" value={form.adress} onChange={handleFormChange} placeholder="Enter full address" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Showroom <span className="text-red-500">*</span></label>
            <select name="showroomId" value={form.showroomId} onChange={handleFormChange} className={inputClass}>
              <option value="">Select showroom</option>
              {showrooms.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Contact Information ── */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-2">Contact Information</h2>

          <div>
            <label className={labelClass}>Email <span className="text-red-500">*</span></label>
            <input name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="info@gmail.com" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Phone <span className="text-red-500">*</span></label>
            <input name="phone" value={form.phone} onChange={handleFormChange} placeholder="+213..." className={inputClass} />
          </div>
        </div>

      </div>

      {/* ── Order Information ── */}
      <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-2">Order Information <span className="text-xs font-normal text-gray-400">(Optional)</span></h2>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div>
            <label className={labelClass}>Select Car</label>
            <select value={order.carId} onChange={handleCarSelect} className={inputClass}>
              <option value="">Select an available car</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.brand?.name} {car.model?.name} — {car.edition?.name} — {car.color} ({car.year})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Order Status</label>
            <select value={order.status} onChange={(e) => setOrder((p) => ({ ...p, status: e.target.value }))} className={inputClass}>
              <option value="Waiting">Waiting</option>
              <option value="Validated">Validated</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Final Price (DA)</label>
            <input
              type="number"
              value={order.finalPrice}
              onChange={(e) => setOrder((p) => ({ ...p, finalPrice: e.target.value }))}
              placeholder="0"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Order Date</label>
            <input
              type="date"
              value={order.date}
              onChange={(e) => setOrder((p) => ({ ...p, date: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>

        {/* Car specs preview */}
        {selectedCar && (
          <div className="mt-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Brand", value: selectedCar.brand?.name },
              { label: "Model", value: selectedCar.model?.name },
              { label: "Edition", value: selectedCar.edition?.name },
              { label: "Transmission", value: selectedCar.transmission },
              { label: "Color", value: selectedCar.color },
              { label: "Year", value: selectedCar.year },
              { label: "Selling Price", value: `${selectedCar.edition?.sellingPrice?.toLocaleString() || selectedCar.specialPrice?.toLocaleString()} DA` },
              { label: "Status", value: selectedCar.status },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">{item.value || "—"}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Submit ── */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Create Customer"}
        </button>
      </div>
    </div>
  );
}