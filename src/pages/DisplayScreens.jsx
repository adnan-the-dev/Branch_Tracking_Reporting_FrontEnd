import React, { useState } from "react";
import { Plus, Pencil, Trash2, Monitor, X } from "lucide-react";

const DisplayScreens = () => {
  const [screens, setScreens] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    url: "",
    location: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    if (editingId) {
      setScreens((prev) =>
        prev.map((screen) =>
          screen.id === editingId
            ? {
                ...screen,
                ...form,
              }
            : screen
        )
      );
    } else {
      setScreens((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...form,
        },
      ]);
    }

    closeModal();
  };

  const handleEdit = (screen) => {
    setEditingId(screen.id);

    setForm({
      name: screen.name,
      url: screen.url,
      location: screen.location,
    });

    setShowModal(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this screen?"
    );

    if (!confirmDelete) return;

    setScreens((prev) => prev.filter((screen) => screen.id !== id));
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);

    setForm({
      name: "",
      url: "",
      location: "",
    });
  };

  return (
    <div className="min-h-screen p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Display Screens</h1>
          <p className="text-sm text-gray-400 mt-1">
            Add and manage your display screens
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl
          bg-purple-600 hover:bg-purple-700 transition-all duration-200
          shadow-lg shadow-purple-600/20"
        >
          <Plus size={18} />
          Add Screen
        </button>
      </div>

      {/* Screens */}
      {screens.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20
          rounded-2xl bg-white/10 backdrop-blur-lg
          border border-white/20"
        >
          <Monitor size={50} className="text-gray-500 mb-4" />

          <h3 className="text-lg font-semibold text-gray-300">
            No Screens Added
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Click "Add Screen" to create your first display screen.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {screens.map((screen) => (
            <div
              key={screen.id}
              className="rounded-2xl bg-white/10 backdrop-blur-lg
              border border-white/20 p-5
              hover:bg-white/[0.13] transition-all duration-200"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div
                  className="w-11 h-11 rounded-xl
                  bg-purple-600/20 flex items-center justify-center"
                >
                  <Monitor className="text-purple-400" size={22} />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(screen)}
                    className="p-2 rounded-lg bg-white/10
                    hover:bg-purple-600/30 transition"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(screen.id)}
                    className="p-2 rounded-lg bg-white/10
                    hover:bg-red-500/30 text-red-400 transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold truncate">
                  {screen.name}
                </h3>

                {screen.location && (
                  <p className="text-sm text-gray-400 mt-2">
                    {screen.location}
                  </p>
                )}

                {screen.url && (
                  <div className="mt-3 px-3 py-2 rounded-lg bg-black/20">
                    <p className="text-xs text-gray-400 truncate">
                      {screen.url}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
          bg-black/70 backdrop-blur-sm px-4"
        >
          <div
            className="w-full max-w-md rounded-2xl
            bg-[#17121f] border border-white/20
            shadow-2xl"
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between
              px-6 py-4 border-b border-white/10"
            >
              <div>
                <h2 className="text-xl font-semibold">
                  {editingId ? "Edit Screen" : "Add Screen"}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Enter display screen details
                </p>
              </div>

              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Screen Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Pizza Display"
                  className="w-full px-4 py-3 rounded-xl
                  bg-white/5 border border-white/10
                  text-white placeholder-gray-500
                  outline-none focus:border-purple-500"
                  required
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Screen URL
                </label>

                <input
                  type="text"
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  placeholder="https://pos.example.com/display"
                  className="w-full px-4 py-3 rounded-xl
                  bg-white/5 border border-white/10
                  text-white placeholder-gray-500
                  outline-none focus:border-purple-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Main Branch"
                  className="w-full px-4 py-3 rounded-xl
                  bg-white/5 border border-white/10
                  text-white placeholder-gray-500
                  outline-none focus:border-purple-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl
                  bg-white/10 hover:bg-white/15 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl
                  bg-purple-600 hover:bg-purple-700
                  transition"
                >
                  {editingId ? "Update Screen" : "Add Screen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayScreens;