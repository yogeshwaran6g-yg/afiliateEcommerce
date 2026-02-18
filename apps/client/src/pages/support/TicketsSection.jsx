import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ticketService from "../../services/ticketService";
import { toast } from "react-toastify";

const TicketsSection = () => {
  const [tickets, setTickets] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    description: "",
    attachments: [],
  });

  // View Modal State
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800";
      case "IN_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const fetchTickets = async () => {
    try {
      const data = await ticketService.getMyTickets();
      // data is expected to be the response body.
      // Based on controller: rtnRes(res, 200, "Tickets fetched successfully", tickets);
      // So data.data should be the array if axios interceptor returns response.data

      // Let's check ticketService.js again.
      // It returns axiosInstance.get(...).
      // Axios interceptor returns response.data.
      // So the object returned is { success: true, message: "...", data: [...] }

      if (data.success && Array.isArray(data.data)) {
        setTickets(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const openModal = () => setModalIsOpen(true);

  const closeModal = () => {
    setModalIsOpen(false);
    setFormData({
      subject: "",
      category: "",
      description: "",
      attachments: [],
    });
  };

  const openViewModal = (ticket) => {
    setSelectedTicket(ticket);
    setViewModalIsOpen(true);
  };

  const closeViewModal = () => {
    setViewModalIsOpen(false);
    setSelectedTicket(null);
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles],
    }));
  };

  const removeAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("subject", formData.subject);
      submitData.append("category", formData.category);
      submitData.append("description", formData.description);

      formData.attachments.forEach((file) => {
        submitData.append("attachments", file);
      });

      await ticketService.createTicket(submitData);
      toast.success("Ticket submitted successfully!");
      closeModal();
      fetchTickets();
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast.error("Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      padding: "0",
      maxWidth: "500px",
      width: "90%",
      maxHeight: "90vh",
      overflowY: "auto",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            Support Tickets
          </h2>
          <button
            onClick={openModal}
            className="text-primary font-semibold text-sm hover:underline"
          >
            New Ticket
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                  Subject
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase hidden md:table-cell">
                  Description
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase hidden md:table-cell">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">
                  View
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-xs md:text-sm font-semibold text-primary">
                    {ticket.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs md:text-sm font-medium text-slate-900">
                      {ticket.subject}
                    </div>
                    <div className="text-[10px] md:text-xs text-slate-400">
                      {new Date(
                        ticket.updated_at || ticket.created_at,
                      ).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell max-w-[200px] truncate text-slate-600 text-xs md:text-sm">
                    {ticket.description}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold ${getStatusColor(ticket.status)}`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openViewModal(ticket)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        visibility
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Create New Support Ticket"
      >
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Create New Support Ticket
            </h3>
            <button
              onClick={closeModal}
              className="text-slate-500 hover:text-slate-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleTextChange}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="subject"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleTextChange}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              >
                <option value="" disabled>
                  Select category
                </option>
                <option value="ORDER">Order</option>
                <option value="PAYMENT">Payment</option>
                <option value="WALLET">Wallet</option>
                <option value="ACCOUNT">Account</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleTextChange}
                required
                rows={6}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="describe"
              />
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Attachments (optional)
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
              />

              {formData.attachments.length > 0 && (
                <div className="mt-3 space-y-2 text-sm">
                  {formData.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded border border-slate-200"
                    >
                      <span className="truncate max-w-[300px]">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-800 ml-3 text-xs font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 mt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* View Ticket Modal */}
      <Modal
        isOpen={viewModalIsOpen}
        onRequestClose={closeViewModal}
        style={customStyles}
        contentLabel="View Ticket Details"
      >
        <div className="flex flex-col h-full max-h-[90vh]">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                confirmation_number
              </span>
              Ticket Details
            </h3>
            <button
              onClick={closeViewModal}
              className="text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1 hover:bg-slate-200"
            >
              <span className="material-symbols-outlined text-xl block">
                close
              </span>
            </button>
          </div>

          {selectedTicket && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Header Info */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    {selectedTicket.subject}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        category
                      </span>
                      Category: {selectedTicket.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        calendar_today
                      </span>
                      {new Date(selectedTicket.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(selectedTicket.status)}`}
                >
                  {selectedTicket.status}
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full"></div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                  Description
                </h4>
                <div className="bg-slate-50 rounded-xl p-4 text-slate-700 text-sm leading-relaxed border border-slate-100">
                  {selectedTicket.description}
                </div>
              </div>

              {/* Attachments / Images */}
              {selectedTicket.image && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      attachment
                    </span>
                    Attachment
                  </h4>
                  <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${selectedTicket.image}`}
                      alt="Ticket Attachment"
                      className="w-full h-auto object-contain max-h-[400px]"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=Image+Not+Found";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
            <button
              onClick={closeViewModal}
              className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TicketsSection;
