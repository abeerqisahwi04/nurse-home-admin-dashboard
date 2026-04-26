import { useEffect, useMemo, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  RefreshCcw,
  Clock,
  Search,
  Filter,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getPaymentTransactions } from "../../services/paymentService";

const COMMISSION_RATE = 0.15;

export default function PaymentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  async function loadTransactions() {
    try {
      setLoading(true);
      const data = await getPaymentTransactions();
      setTransactions(data);
    } catch (err) {
      alert(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      transaction.transactionId?.toLowerCase().includes(search) ||
      transaction.patientName?.toLowerCase().includes(search) ||
      transaction.nurseName?.toLowerCase().includes(search) ||
      transaction.service?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totals = useMemo(() => {
    const paid = transactions.filter((t) => t.status === "Paid");
    const refunded = transactions.filter((t) => t.status === "Refunded");
    const pending = transactions.filter((t) => t.status === "Pending");

    const totalRevenue = paid.reduce((sum, t) => sum + Number(t.totalAmount || 0), 0);
    const totalCommission = totalRevenue * COMMISSION_RATE;
    const totalNursePayouts = totalRevenue - totalCommission;
    const totalRefunded = refunded.reduce((sum, t) => sum + Number(t.totalAmount || 0), 0);
    const totalPending = pending.reduce((sum, t) => sum + Number(t.totalAmount || 0), 0);

    return {
      totalRevenue,
      totalCommission,
      totalNursePayouts,
      totalRefunded,
      totalPending,
    };
  }, [transactions]);

  const getStatusBadge = (status) => {
    const styles = {
      Paid: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Refunded: "bg-blue-100 text-blue-800",
      Failed: "bg-red-100 text-red-800",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs ${styles[status] || "bg-gray-100 text-gray-700"}`}>
        {status}
      </span>
    );
  };

  function formatMoney(value) {
    return `$${Number(value || 0).toFixed(2)}`;
  }

  function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  }

  function exportPdf() {
    const doc = new jsPDF();

    doc.text("Payment Transactions Report", 14, 15);

    autoTable(doc, {
      startY: 22,
      head: [[
        "Transaction ID",
        "Patient",
        "Nurse",
        "Service",
        "Amount",
        "Commission",
        "Nurse Amount",
        "Status",
        "Method",
        "Date",
      ]],
      body: filteredTransactions.map((t) => {
        const amount = Number(t.totalAmount || 0);
        const commission = amount * COMMISSION_RATE;
        const nurseAmount = amount - commission;

        return [
          t.transactionId,
          t.patientName,
          t.nurseName,
          t.service,
          formatMoney(amount),
          formatMoney(commission),
          formatMoney(nurseAmount),
          t.status,
          t.paymentMethod,
          formatDate(t.date),
        ];
      }),
    });

    doc.save("payment-transactions.pdf");
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <SummaryCard title="Total Revenue" value={formatMoney(totals.totalRevenue)} icon={DollarSign} iconClass="text-[#1F7A8C]" bgClass="bg-[#1F7A8C]/10" />
        <SummaryCard title="Platform Commission" value={formatMoney(totals.totalCommission)} icon={TrendingUp} iconClass="text-green-600" bgClass="bg-green-100" />
        <SummaryCard title="Nurse Payouts" value={formatMoney(totals.totalNursePayouts)} icon={Users} iconClass="text-blue-600" bgClass="bg-blue-100" />
        <SummaryCard title="Refunded Transactions" value={formatMoney(totals.totalRefunded)} icon={RefreshCcw} iconClass="text-purple-600" bgClass="bg-purple-100" />
        <SummaryCard title="Pending Payments" value={formatMoney(totals.totalPending)} icon={Clock} iconClass="text-yellow-600" bgClass="bg-yellow-100" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Transaction ID, Patient, Nurse, or Service..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <button
              onClick={exportPdf}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-800">All Transactions</h3>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Patient</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Nurse</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Service</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Commission</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Nurse Amount</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-6 py-6 text-center text-sm text-gray-500">
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-6 text-center text-sm text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => {
                  const amount = Number(transaction.totalAmount || 0);
                  const commission = amount * COMMISSION_RATE;
                  const nurseAmount = amount - commission;

                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-800">{transaction.transactionId}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{transaction.patientName}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{transaction.nurseName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{transaction.service}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{formatMoney(amount)}</td>
                      <td className="px-6 py-4 text-sm text-green-600">{formatMoney(commission)}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{formatMoney(nurseAmount)}</td>
                      <td className="px-6 py-4">{getStatusBadge(transaction.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{transaction.paymentMethod}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(transaction.date)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, iconClass, bgClass }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 ${bgClass} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconClass}`} />
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-1">{title}</p>
      <h3 className="text-gray-800">{value}</h3>
    </div>
  );
}