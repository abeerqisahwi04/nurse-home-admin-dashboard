import { useState } from "react";
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

const mockTransactions = [
  {
    transactionId: "TXN001234",
    bookingId: "BK2025001",
    patientName: "John Smith",
    nurseName: "Nurse Emily Chen",
    serviceName: "Home Care",
    totalAmount: 120,
    platformCommission: 18,
    nurseAmount: 102,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    transactionDate: "2026-04-02 10:30 AM",
  },
  {
    transactionId: "TXN001235",
    bookingId: "BK2025002",
    patientName: "Sarah Johnson",
    nurseName: "Nurse David Lee",
    serviceName: "Wound Care",
    totalAmount: 80,
    platformCommission: 12,
    nurseAmount: 68,
    paymentStatus: "Paid",
    paymentMethod: "PayPal",
    transactionDate: "2026-04-02 09:15 AM",
  },
  {
    transactionId: "TXN001236",
    bookingId: "BK2025003",
    patientName: "Michael Brown",
    nurseName: "Nurse Sarah Wilson",
    serviceName: "IV Therapy",
    totalAmount: 150,
    platformCommission: 22.5,
    nurseAmount: 127.5,
    paymentStatus: "Pending",
    paymentMethod: "Bank Transfer",
    transactionDate: "2026-04-02 08:45 AM",
  },
  {
    transactionId: "TXN001237",
    bookingId: "BK2025004",
    patientName: "Emma Davis",
    nurseName: "Nurse Robert Kim",
    serviceName: "Physical Therapy",
    totalAmount: 100,
    platformCommission: 15,
    nurseAmount: 85,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    transactionDate: "2026-04-01 05:20 PM",
  },
  {
    transactionId: "TXN001238",
    bookingId: "BK2025005",
    patientName: "James Wilson",
    nurseName: "Nurse Jessica Martinez",
    serviceName: "Post-Surgery Care",
    totalAmount: 200,
    platformCommission: 30,
    nurseAmount: 170,
    paymentStatus: "Refunded",
    paymentMethod: "Credit Card",
    transactionDate: "2026-04-01 03:10 PM",
  },
  {
    transactionId: "TXN001239",
    bookingId: "BK2025006",
    patientName: "Olivia Taylor",
    nurseName: "Nurse Daniel Chen",
    serviceName: "Home Care",
    totalAmount: 120,
    platformCommission: 18,
    nurseAmount: 102,
    paymentStatus: "Failed",
    paymentMethod: "Credit Card",
    transactionDate: "2026-04-01 02:30 PM",
  },
];

const recentActivity = [
  {
    description: "Payment received for Booking #BK2025001",
    amount: "+$120.00",
    time: "5 mins ago",
    type: "credit",
  },
  {
    description: "Commission earned from Transaction #TXN001234",
    amount: "+$18.00",
    time: "5 mins ago",
    type: "credit",
  },
  {
    description: "Payout to Nurse Emily Chen",
    amount: "-$102.00",
    time: "10 mins ago",
    type: "debit",
  },
  {
    description: "Refund issued for Booking #BK2025005",
    amount: "-$200.00",
    time: "2 hours ago",
    type: "debit",
  },
];

export default function PaymentTransactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const getStatusBadge = (status) => {
    const styles = {
      Paid: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Refunded: "bg-blue-100 text-blue-800",
      Failed: "bg-red-100 text-red-800",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.transactionId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.nurseName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || transaction.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = mockTransactions
    .filter((transaction) => transaction.paymentStatus === "Paid")
    .reduce((sum, transaction) => sum + transaction.totalAmount, 0);

  const totalCommission = mockTransactions
    .filter((transaction) => transaction.paymentStatus === "Paid")
    .reduce((sum, transaction) => sum + transaction.platformCommission, 0);

  const totalNursePayouts = mockTransactions
    .filter((transaction) => transaction.paymentStatus === "Paid")
    .reduce((sum, transaction) => sum + transaction.nurseAmount, 0);

  const totalRefunded = mockTransactions
    .filter((transaction) => transaction.paymentStatus === "Refunded")
    .reduce((sum, transaction) => sum + transaction.totalAmount, 0);

  const totalPending = mockTransactions
    .filter((transaction) => transaction.paymentStatus === "Pending")
    .reduce((sum, transaction) => sum + transaction.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-[#1F7A8C]/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#1F7A8C]" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
          <h3 className="text-gray-800">${totalRevenue.toFixed(2)}</h3>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">Platform Commission</p>
          <h3 className="text-gray-800">${totalCommission.toFixed(2)}</h3>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">Nurse Payouts</p>
          <h3 className="text-gray-800">${totalNursePayouts.toFixed(2)}</h3>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <RefreshCcw className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">Refunded Transactions</p>
          <h3 className="text-gray-800">${totalRefunded.toFixed(2)}</h3>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">Pending Payments</p>
          <h3 className="text-gray-800">${totalPending.toFixed(2)}</h3>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search by Transaction ID, Booking ID, Patient, or Nurse..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />

              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white appearance-none cursor-pointer"
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

            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-800">All Transactions</h3>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredTransactions.length} of {mockTransactions.length}{" "}
            transactions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Nurse
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Nurse Amount
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.transactionId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {transaction.transactionId}
                  </td>

                  <td className="px-6 py-4 text-sm text-[#1F7A8C]">
                    {transaction.bookingId}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-800">
                    {transaction.patientName}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-800">
                    {transaction.nurseName}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {transaction.serviceName}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-800">
                    ${transaction.totalAmount.toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-sm text-green-600">
                    ${transaction.platformCommission.toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-800">
                    ${transaction.nurseAmount.toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    {getStatusBadge(transaction.paymentStatus)}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {transaction.paymentMethod}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {transaction.transactionDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500">
              No transactions found matching your criteria
            </p>
          </div>
        )}
      </div>

      {/* Recent Financial Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-800 mb-4">Recent Financial Activity</h3>

        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "credit" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>

                <div>
                  <p className="text-sm text-gray-800">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>

              <span
                className={`text-sm ${
                  activity.type === "credit" ? "text-green-600" : "text-red-600"
                }`}
              >
                {activity.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
