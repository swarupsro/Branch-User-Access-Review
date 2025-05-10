import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, Search, Filter, Check, X, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

interface AccessData {
  userId: string;
  userName: string;
  role: string;
  permissions: string[];
  system: string;
  lastReview: string;
  status: string;
  reviewed?: boolean;
  approved?: boolean;
  notes?: string;
}

const ReviewAccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [accessData, setAccessData] = useState<AccessData[]>([]);
  const [filteredData, setFilteredData] = useState<AccessData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterSystem, setFilterSystem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AccessData | null>(null);

  // Get data from location state or use sample data if not available
  useEffect(() => {
    if (location.state?.accessData) {
      const initialData = location.state.accessData.map((item: AccessData) => ({
        ...item,
        reviewed: false,
        approved: true,
        notes: '',
      }));
      setAccessData(initialData);
      setFilteredData(initialData);
    } else {
      // Sample data if no data was uploaded
      const sampleData: AccessData[] = [
        {
          userId: 'U12345',
          userName: 'John Smith',
          role: 'Teller',
          permissions: ['view_accounts', 'process_transactions', 'print_statements'],
          system: 'Core Banking',
          lastReview: '2023-03-15',
          status: 'Active',
          reviewed: false,
          approved: true,
          notes: '',
        },
        {
          userId: 'U67890',
          userName: 'Jane Doe',
          role: 'Loan Officer',
          permissions: ['view_accounts', 'approve_loans', 'credit_check'],
          system: 'Loan System',
          lastReview: '2023-04-20',
          status: 'Active',
          reviewed: false,
          approved: true,
          notes: '',
        },
        {
          userId: 'U24680',
          userName: 'Bob Johnson',
          role: 'Customer Service',
          permissions: ['view_accounts', 'update_customer_info', 'issue_cards'],
          system: 'Core Banking',
          lastReview: '2023-02-10',
          status: 'Active',
          reviewed: false,
          approved: true,
          notes: '',
        },
        {
          userId: 'U13579',
          userName: 'Alice Williams',
          role: 'Branch Teller',
          permissions: ['view_accounts', 'process_transactions', 'cash_handling'],
          system: 'Core Banking',
          lastReview: '2023-05-05',
          status: 'Active',
          reviewed: false,
          approved: true,
          notes: '',
        },
        {
          userId: 'U97531',
          userName: 'Charlie Brown',
          role: 'Investment Advisor',
          permissions: ['view_accounts', 'investment_planning', 'portfolio_management'],
          system: 'Investment Platform',
          lastReview: '2023-01-15',
          status: 'Inactive',
          reviewed: false,
          approved: false,
          notes: '',
        },
      ];
      setAccessData(sampleData);
      setFilteredData(sampleData);
    }
  }, [location.state]);

  // Apply filters and search
  useEffect(() => {
    let result = accessData;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.userId.toLowerCase().includes(term) ||
          item.userName.toLowerCase().includes(term) ||
          item.role.toLowerCase().includes(term)
      );
    }

    if (filterRole) {
      result = result.filter((item) => item.role === filterRole);
    }

    if (filterSystem) {
      result = result.filter((item) => item.system === filterSystem);
    }

    setFilteredData(result);
  }, [searchTerm, filterRole, filterSystem, accessData]);

  // Get unique roles and systems for filters
  const uniqueRoles = [...new Set(accessData.map((item) => item.role))];
  const uniqueSystems = [...new Set(accessData.map((item) => item.system))];

  const handleReviewUser = (user: AccessData) => {
    setSelectedUser(user);
  };

  const handleSaveReview = () => {
    if (!selectedUser) return;

    setAccessData((prevData) =>
      prevData.map((item) =>
        item.userId === selectedUser.userId ? { ...selectedUser, reviewed: true } : item
      )
    );

    setSelectedUser(null);
  };

  const handleApprovalChange = (userId: string, approved: boolean) => {
    if (selectedUser && selectedUser.userId === userId) {
      setSelectedUser({ ...selectedUser, approved });
    } else {
      setAccessData((prevData) =>
        prevData.map((item) =>
          item.userId === userId ? { ...item, approved, reviewed: true } : item
        )
      );
    }
  };

  const handleNotesChange = (userId: string, notes: string) => {
    if (selectedUser && selectedUser.userId === userId) {
      setSelectedUser({ ...selectedUser, notes });
    } else {
      setAccessData((prevData) =>
        prevData.map((item) => (item.userId === userId ? { ...item, notes } : item))
      );
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterRole('');
    setFilterSystem('');
  };

  const handleSubmitReviews = async () => {
    const unreviewed = accessData.filter((item) => !item.reviewed);
    if (unreviewed.length > 0) {
      if (
        !window.confirm(
          `You have ${unreviewed.length} users that haven't been reviewed. Do you want to continue and mark all as reviewed?`
        )
      ) {
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      // Mark all as reviewed
      const finalData = accessData.map((item) => ({
        ...item,
        reviewed: true,
      }));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Log the submission event (in a real app, this would be a server-side audit log)
      console.log(
        `[AUDIT] User ${user?.id} submitted access reviews at ${new Date().toISOString()}`
      );

      setSubmitSuccess(true);
      setAccessData(finalData);

      // Simulate navigation after successful submission
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error submitting reviews:', error);
      setSubmitError('Failed to submit reviews. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reviewProgress = {
    total: accessData.length,
    reviewed: accessData.filter((item) => item.reviewed).length,
    approved: accessData.filter((item) => item.reviewed && item.approved).length,
    rejected: accessData.filter((item) => item.reviewed && !item.approved).length,
  };

  const reviewPercentage = Math.round(
    (reviewProgress.reviewed / reviewProgress.total) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Users size={24} className="text-[#0A2463] mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Review Access Permissions</h1>
          </div>
          <button
            onClick={handleSubmitReviews}
            disabled={isSubmitting || reviewProgress.reviewed === 0 || submitSuccess}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0A2463] hover:bg-[#143594] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A2463] disabled:opacity-50 transition-colors duration-200"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="small" color="#ffffff" />
                <span className="ml-2">Submitting...</span>
              </>
            ) : (
              <>
                <Check size={16} className="mr-2" />
                Submit All Reviews
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {submitSuccess && (
        <div className="rounded-lg bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Submission successful</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>All reviews have been submitted successfully. Redirecting to dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {submitError && (
        <div className="rounded-lg bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Submission failed</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{submitError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Review Progress</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Users size={20} className="text-blue-500 mr-2" />
              <span className="text-sm font-medium text-blue-700">Total Users</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-blue-900">{reviewProgress.total}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle size={20} className="text-green-500 mr-2" />
              <span className="text-sm font-medium text-green-700">Approved</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-green-900">{reviewProgress.approved}</p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <X size={20} className="text-red-500 mr-2" />
              <span className="text-sm font-medium text-red-700">Rejected</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-red-900">{reviewProgress.rejected}</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <Clock size={20} className="text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-yellow-700">Pending</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-yellow-900">
              {reviewProgress.total - reviewProgress.reviewed}
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">{reviewPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#0A2463] h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${reviewPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="relative flex-1 mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-[#0A2463] focus:border-[#0A2463] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search by ID, name, or role"
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-auto">
              <label htmlFor="role-filter" className="sr-only">
                Filter by Role
              </label>
              <select
                id="role-filter"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="focus:ring-[#0A2463] focus:border-[#0A2463] block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">All Roles</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <label htmlFor="system-filter" className="sr-only">
                Filter by System
              </label>
              <select
                id="system-filter"
                value={filterSystem}
                onChange={(e) => setFilterSystem(e.target.value)}
                className="focus:ring-[#0A2463] focus:border-[#0A2463] block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">All Systems</option>
                {uniqueSystems.map((system) => (
                  <option key={system} value={system}>
                    {system}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A2463]"
            >
              <Filter size={16} className="mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Review User Access
                </h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#0A2463] text-white rounded-full mr-3">
                    {selectedUser.userName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">{selectedUser.userName}</h4>
                    <p className="text-sm text-gray-500">ID: {selectedUser.userId}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium">{selectedUser.role}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">System</p>
                    <p className="font-medium">{selectedUser.system}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedUser.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {selectedUser.status}
                      </span>
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Last Review</p>
                    <p className="font-medium">{selectedUser.lastReview}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-md font-medium mb-2">Permissions</h4>
                <div className="bg-gray-50 p-4 rounded">
                  <ul className="space-y-2">
                    {selectedUser.permissions.map((permission, index) => (
                      <li
                        key={index}
                        className="flex items-center py-1 px-2 bg-white border border-gray-200 rounded"
                      >
                        <Shield size={16} className="text-[#0A2463] mr-2" />
                        <span>{permission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-md font-medium mb-2">Review Decision</h4>
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => handleApprovalChange(selectedUser.userId, true)}
                    className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                      selectedUser.approved
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                  >
                    <Check size={16} className="mr-2" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprovalChange(selectedUser.userId, false)}
                    className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                      !selectedUser.approved
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                  >
                    <X size={16} className="mr-2" />
                    Reject
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={selectedUser.notes || ''}
                  onChange={(e) => handleNotesChange(selectedUser.userId, e.target.value)}
                  className="shadow-sm focus:ring-[#0A2463] focus:border-[#0A2463] block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Add any notes about this user's access permissions..."
                ></textarea>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A2463]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReview}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0A2463] hover:bg-[#143594] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A2463]"
              >
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  System
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Permissions
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Review Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No users match the current filters
                  </td>
                </tr>
              ) : (
                filteredData.map((user) => (
                  <tr
                    key={user.userId}
                    className={`hover:bg-gray-50 ${
                      user.reviewed ? 'bg-gray-50 bg-opacity-40' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                          {user.userName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.userName}
                          </div>
                          <div className="text-sm text-gray-500">{user.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.system}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {user.permissions.length > 2 ? (
                          <div>
                            <div className="flex items-center">
                              <Shield size={14} className="text-[#0A2463] mr-1" />
                              <span>{user.permissions[0]}</span>
                            </div>
                            <div className="flex items-center">
                              <Shield size={14} className="text-[#0A2463] mr-1" />
                              <span>{user.permissions[1]}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              +{user.permissions.length - 2} more
                            </div>
                          </div>
                        ) : (
                          user.permissions.map((perm, idx) => (
                            <div key={idx} className="flex items-center">
                              <Shield size={14} className="text-[#0A2463] mr-1" />
                              <span>{perm}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.reviewed ? (
                        <div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.approved
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.approved ? 'Approved' : 'Rejected'}
                          </span>
                          {user.notes && (
                            <div className="text-xs text-gray-500 mt-1">
                              Has notes
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleReviewUser(user)}
                        className="text-[#0A2463] hover:text-[#143594] mr-3"
                      >
                        {user.reviewed ? 'Edit' : 'Review'}
                      </button>
                      <div className="inline-flex rounded-md shadow-sm mt-1">
                        <button
                          type="button"
                          onClick={() => handleApprovalChange(user.userId, true)}
                          className={`px-2 py-1 rounded-l-md text-xs ${
                            user.reviewed && user.approved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprovalChange(user.userId, false)}
                          className={`px-2 py-1 rounded-r-md text-xs ${
                            user.reviewed && !user.approved
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReviewAccessPage;