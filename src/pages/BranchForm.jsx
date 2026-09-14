import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  MonitorSmartphone,
  Printer,
  Wifi,
  Camera,
  Zap,
  Star,
} from "lucide-react";
import api from "../api/client";

const STATION_TYPES = [
  "Pasta Screen",
  "Pizza Screen",
  "Cutting Table Screen",
  "Dispatch Screen",
  "Cash Counter Screen",
  "DineIn Screen",
  "Manager Screen",
  "DineIn Screen",
  "Other",
];
const ISP_OPTIONS = ["Storm Fiber", "PTCL", "Nayatel", "Other"];

const emptyStation = {
  stationType: "Pasta Screen",
  brand: "",
  model: "",
  generation: "",
  ramGb: "",
  storage: "",
  status: "Working",
  remarks: "",
};
const emptyPrinter = {
  label: "",
  brand: "",
  model: "",
  connectionType: "Network",
  status: "Working",
  remarks: "",
};
const emptyConn = {
  provider: "Storm Fiber",
  connectionId: "",
  purpose: "",
  status: "Ok",
  pendingDues: false,
  remarks: "",
};

function Section({ icon: Icon, title, children, action }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-brand-500" />
          <h2 className="font-semibold text-ink-900">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500";

export default function BranchForm() {
  // const { id } = useParams();
  // const isEdit = !!id;

  const { id } = useParams();

  const isCopy = window.location.pathname.endsWith("/copy");
  const isEdit = !!id && !isCopy;

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [stations, setStations] = useState([{ ...emptyStation }]);

  console.log(stations, "Stations");

  const [printers, setPrinters] = useState([
    { ...emptyPrinter, label: "Cash Counter Printer" },
    { ...emptyPrinter, label: "Office Printer" },
  ]);
  const [internetConnections, setInternetConnections] = useState([
    { ...emptyConn },
  ]);

  const [camera, setCamera] = useState({
    recordingStatus: "Ok",
    dvrBrand: "",
    remarks: "",
  });
  const [generator, setGenerator] = useState({
    installed: false,
    status: "N/A",
    remarks: "",
  });
  const [googleBusiness, setGoogleBusiness] = useState({
    phoneNumberStatus: "Ok",
    locationVerified: true,
    businessHours: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   if (!isEdit) return;
  //   api.get(`/branches/${id}`).then(({ data }) => {
  //     setName(data.name);
  //     setAddress(data.address || "");
  //     setContactPerson(data.contactPerson || "");
  //     setContactPhone(data.contactPhone || "");
  //     setStations(data.stations.length ? data.stations : [{ ...emptyStation }]);
  //     setPrinters(data.printers.length ? data.printers : [{ ...emptyPrinter }]);
  //     setInternetConnections(
  //       data.internetConnections.length
  //         ? data.internetConnections
  //         : [{ ...emptyConn }],
  //     );
  //     setCamera({
  //       recordingStatus: data.camera?.recordingStatus || "Ok",
  //       dvrBrand: data.camera?.dvrBrand || "",
  //       remarks: data.camera?.remarks || "",
  //     });
  //     setGenerator({
  //       installed: data.generator?.installed || false,
  //       status: data.generator?.status || "N/A",
  //       remarks: data.generator?.remarks || "",
  //     });
  //     setGoogleBusiness({
  //       phoneNumberStatus: data.googleBusiness?.phoneNumberStatus || "Ok",
  //       locationVerified: data.googleBusiness?.locationVerified ?? true,
  //       businessHours: data.googleBusiness?.businessHours || "",
  //       remarks: data.googleBusiness?.remarks || "",
  //     });
  //     setLoading(false);
  //   });
  // }, [id, isEdit]);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/branches/${id}`)
      .then(({ data }) => {
        setName(isCopy ? `${data.name} - Copy` : data.name);
        setAddress(data.address || "");
        setContactPerson(data.contactPerson || "");
        setContactPhone(data.contactPhone || "");

        // Remove MongoDB IDs from copied items
        setStations(
          data.stations?.length
            ? data.stations.map(({ _id, ...station }) => ({
                ...station,
              }))
            : [{ ...emptyStation }],
        );

        setPrinters(
          data.printers?.length
            ? data.printers.map(({ _id, ...printer }) => ({
                ...printer,
              }))
            : [{ ...emptyPrinter }],
        );

        setInternetConnections(
          data.internetConnections?.length
            ? data.internetConnections.map(({ _id, ...connection }) => ({
                ...connection,
              }))
            : [{ ...emptyConn }],
        );

        setCamera({
          recordingStatus: data.camera?.recordingStatus || "Ok",
          dvrBrand: data.camera?.dvrBrand || "",
          remarks: data.camera?.remarks || "",
        });

        setGenerator({
          installed: data.generator?.installed || false,
          status: data.generator?.status || "N/A",
          remarks: data.generator?.remarks || "",
        });

        setGoogleBusiness({
          phoneNumberStatus: data.googleBusiness?.phoneNumberStatus || "Ok",
          locationVerified: data.googleBusiness?.locationVerified ?? true,
          businessHours: data.googleBusiness?.businessHours || "",
          remarks: data.googleBusiness?.remarks || "",
        });

        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load branch.");
        setLoading(false);
      });
  }, [id, isCopy]);

  const updateArrItem = (setter, idx, key, value) =>
    setter((arr) =>
      arr.map((item, i) => (i === idx ? { ...item, [key]: value } : item)),
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name,
      address,
      contactPerson,
      contactPhone,
      stations: stations.filter((s) => s.stationType),
      printers: printers.filter((p) => p.label),
      internetConnections: internetConnections.filter((c) => c.provider),
      camera,
      generator,
      googleBusiness,
    };
    try {
      // if (isEdit) {
      //   await api.put(`/branches/${id}`, payload);
      // } else {
      //   await api.post("/branches", payload);
      // }

      if (isEdit) {
        // Normal Edit
        await api.put(`/branches/${id}`, payload);
      } else {
        // Add OR Copy
        await api.post("/branches", payload);
      }
      navigate("/branches");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save branch");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-slate-400">Loading branch...</p>;

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center gap-3">
        <Link to="/branches" className="p-2 rounded-lg hover:bg-slate-200/60">
          <ArrowLeft size={18} />
        </Link>
        {/* <div>
          <h1 className="text-2xl font-bold text-ink-900">
            {isEdit ? "Edit Branch" : "Add Branch"}
          </h1>
          <p className="text-slate-500 text-sm">
            Enter every system installed at this branch
          </p>
        </div> */}

        <h1 className="text-2xl font-bold text-ink-900">
          {isCopy ? "Copy Branch" : isEdit ? "Edit Branch" : "Add Branch"}
          <p className="text-slate-500 text-sm">
            {isCopy
              ? "Create a new branch using the existing branch details"
              : "Enter every system installed at this branch"}
          </p>
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section icon={MonitorSmartphone} title="Branch Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Branch Name *">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
                placeholder="e.g. Gulberg"
              />
            </Field>
            <Field label="Address">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Branch RM">
              <input
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Branch Contact">
              <input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
        </Section>

        <Section icon={MonitorSmartphone} title="POS / Kitchen Stations">
          <div className="space-y-4">
            {stations.map((s, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-7 gap-3 relative"
              >
                <Field label="Station Type">
                  <select
                    value={s.stationType}
                    onChange={(e) =>
                      updateArrItem(
                        setStations,
                        idx,
                        "stationType",
                        e.target.value,
                      )
                    }
                    className={inputCls}
                  >
                    {STATION_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Brand">
                  <input
                    value={s.brand}
                    onChange={(e) =>
                      updateArrItem(setStations, idx, "brand", e.target.value)
                    }
                    className={inputCls}
                    placeholder="Dell / HP"
                  />
                </Field>
                <Field label="Model">
                  <input
                    value={s.model}
                    onChange={(e) =>
                      updateArrItem(setStations, idx, "model", e.target.value)
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Generation">
                  <input
                    value={s.generation}
                    onChange={(e) =>
                      updateArrItem(
                        setStations,
                        idx,
                        "generation",
                        e.target.value,
                      )
                    }
                    className={inputCls}
                    placeholder="i5 8th Gen"
                  />
                </Field>
                <Field label="RAM (GB)">
                  <input
                    type="text"
                    value={s.ramGb}
                    onChange={(e) =>
                      updateArrItem(setStations, idx, "ramGb", e.target.value)
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="STORAGE">
                  <input
                    type="text"
                    value={s.storage}
                    onChange={(e) =>
                      updateArrItem(setStations, idx, "storage", e.target.value)
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Status">
                  <select
                    value={s.status}
                    onChange={(e) =>
                      updateArrItem(setStations, idx, "status", e.target.value)
                    }
                    className={inputCls}
                  >
                    <option>Working</option>
                    <option>Issue</option>
                    <option>Down</option>
                  </select>
                </Field>
                <div className="md:col-span-5">
                  <Field label="Remarks">
                    <input
                      value={s.remarks}
                      onChange={(e) =>
                        updateArrItem(
                          setStations,
                          idx,
                          "remarks",
                          e.target.value,
                        )
                      }
                      className={inputCls}
                    />
                  </Field>
                </div>
                <div className="flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setStations((arr) => arr.filter((_, i) => i !== idx))
                    }
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 border-slate-200 pt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setStations((s) => [...s, { ...emptyStation }])}
              className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              <Plus size={15} /> Add Station
            </button>
          </div>
        </Section>

        <Section icon={Printer} title="Printers">
          <div className="space-y-4">
            {printers.map((p, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-5 gap-3"
              >
                <Field label="Label">
                  <input
                    value={p.label}
                    onChange={(e) =>
                      updateArrItem(setPrinters, idx, "label", e.target.value)
                    }
                    className={inputCls}
                    placeholder="Cash Counter Printer"
                  />
                </Field>
                <Field label="Brand">
                  <input
                    value={p.brand}
                    onChange={(e) =>
                      updateArrItem(setPrinters, idx, "brand", e.target.value)
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Model">
                  <input
                    value={p.model}
                    onChange={(e) =>
                      updateArrItem(setPrinters, idx, "model", e.target.value)
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Status">
                  <select
                    value={p.status}
                    onChange={(e) =>
                      updateArrItem(setPrinters, idx, "status", e.target.value)
                    }
                    className={inputCls}
                  >
                    <option>Working</option>
                    <option>Issue</option>
                    <option>Down</option>
                  </select>
                </Field>
                <div className="flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setPrinters((arr) => arr.filter((_, i) => i !== idx))
                    }
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 border-slate-200 pt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setPrinters((p) => [...p, { ...emptyPrinter }])}
              className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              <Plus size={15} /> Add Printer
            </button>
          </div>
        </Section>

        <Section icon={Wifi} title="Internet Connections">
          <div className="space-y-4">
            {internetConnections.map((c, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-6 gap-3"
              >
                <Field label="Provider (ISP)">
                  <select
                    value={c.provider}
                    onChange={(e) =>
                      updateArrItem(
                        setInternetConnections,
                        idx,
                        "provider",
                        e.target.value,
                      )
                    }
                    className={inputCls}
                  >
                    {ISP_OPTIONS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Connection ID">
                  <input
                    value={c.connectionId}
                    onChange={(e) =>
                      updateArrItem(
                        setInternetConnections,
                        idx,
                        "connectionId",
                        e.target.value,
                      )
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Purpose">
                  <input
                    value={c.purpose}
                    onChange={(e) =>
                      updateArrItem(
                        setInternetConnections,
                        idx,
                        "purpose",
                        e.target.value,
                      )
                    }
                    className={inputCls}
                    placeholder="POS / CCTV / WiFi"
                  />
                </Field>
                <Field label="Status">
                  <select
                    value={c.status}
                    onChange={(e) =>
                      updateArrItem(
                        setInternetConnections,
                        idx,
                        "status",
                        e.target.value,
                      )
                    }
                    className={inputCls}
                  >
                    <option>Ok</option>
                    <option>Issue</option>
                    <option>Down</option>
                  </select>
                </Field>
                <Field label="Pending Dues">
                  <select
                    value={c.pendingDues ? "yes" : "no"}
                    onChange={(e) =>
                      updateArrItem(
                        setInternetConnections,
                        idx,
                        "pendingDues",
                        e.target.value === "yes",
                      )
                    }
                    className={inputCls}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </Field>
                <div className="flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setInternetConnections((arr) =>
                        arr.filter((_, i) => i !== idx),
                      )
                    }
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 border-slate-200 pt-3 flex justify-end">
            <button
              type="button"
              onClick={() =>
                setInternetConnections((c) => [...c, { ...emptyConn }])
              }
              className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              <Plus size={15} /> Add Connection
            </button>
          </div>
        </Section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Section icon={Camera} title="Camera / DVR">
            <div className="space-y-3">
              <Field label="Recording Status">
                <select
                  value={camera.recordingStatus}
                  onChange={(e) =>
                    setCamera({ ...camera, recordingStatus: e.target.value })
                  }
                  className={inputCls}
                >
                  <option>Ok</option>
                  <option>Issue</option>
                  <option>Off</option>
                </select>
              </Field>
              <Field label="DVR Brand">
                <input
                  value={camera.dvrBrand}
                  onChange={(e) =>
                    setCamera({ ...camera, dvrBrand: e.target.value })
                  }
                  className={inputCls}
                />
              </Field>
              <Field label="Remarks">
                <input
                  value={camera.remarks}
                  onChange={(e) =>
                    setCamera({ ...camera, remarks: e.target.value })
                  }
                  className={inputCls}
                  placeholder="e.g. DinIn Camera Off"
                />
              </Field>
            </div>
          </Section>

          {/* <Section icon={Zap} title="Generator">
            <div className="space-y-3">
              <Field label="Installed?">
                <select
                  value={generator.installed ? 'yes' : 'no'}
                  onChange={(e) => setGenerator({ ...generator, installed: e.target.value === 'yes' })}
                  className={inputCls}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </Field>
              <Field label="Status">
                <select value={generator.status} onChange={(e) => setGenerator({ ...generator, status: e.target.value })} className={inputCls}>
                  <option>N/A</option>
                  <option>Ok</option>
                  <option>Issue</option>
                </select>
              </Field>
              <Field label="Remarks">
                <input value={generator.remarks} onChange={(e) => setGenerator({ ...generator, remarks: e.target.value })} className={inputCls} />
              </Field>
            </div>
          </Section> */}

          <Section icon={Star} title="Google Business">
            <div className="space-y-3">
              <Field label="Phone Number Status">
                <select
                  value={googleBusiness.phoneNumberStatus}
                  onChange={(e) =>
                    setGoogleBusiness({
                      ...googleBusiness,
                      phoneNumberStatus: e.target.value,
                    })
                  }
                  className={inputCls}
                >
                  <option>Ok</option>
                  <option>Duplicate</option>
                  <option>Missing</option>
                </select>
              </Field>
              <Field label="Location Verified">
                <select
                  value={googleBusiness.locationVerified ? "yes" : "no"}
                  onChange={(e) =>
                    setGoogleBusiness({
                      ...googleBusiness,
                      locationVerified: e.target.value === "yes",
                    })
                  }
                  className={inputCls}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </Field>
              <Field label="Business Hours">
                <input
                  value={googleBusiness.businessHours}
                  onChange={(e) =>
                    setGoogleBusiness({
                      ...googleBusiness,
                      businessHours: e.target.value,
                    })
                  }
                  className={inputCls}
                  placeholder="11Am-3Am"
                />
              </Field>
            </div>
          </Section>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            to="/branches"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-200/60"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60"
          >
            <Save size={16} /> {saving ? "Saving..." : "Save Branch"}
          </button>
        </div>
      </form>
    </div>
  );
}
