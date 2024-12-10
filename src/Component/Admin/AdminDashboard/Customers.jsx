/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useGetAllUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '../../../redux/api/UserApi';
import { useCreateUserMutation } from '../../../redux/api/UserApi';
import { FaEdit, FaTrash, FaSearch, FaUserPlus, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const Customers = () => {
  const { data: users, isLoading, isError } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [createUser] = useCreateUserMutation();
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    gender: 'male',
    bio: '',
    profileImage: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const handleDelete = async (id) => {
    try {
      await deleteUser(id).unwrap();
      toast.success('User deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete user');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ 
        id: editingUser.id,
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        status: editingUser.status,
        phoneNumber: editingUser.phoneNumber,
        address: editingUser.address,
        dateOfBirth: editingUser.dateOfBirth,
        gender: editingUser.gender,
        bio: editingUser.bio,
        profileImage: editingUser.profileImage,
        needsPasswordChange: editingUser.needsPasswordChange
      }).unwrap();
      setShowEditModal(false);
      setEditingUser(null);
      toast.success('User updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update user');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
  
      await createUser(newUser).unwrap();
      setShowAddModal(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'user',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
        gender: 'male',
        bio: '',
        profileImage: ''
      });
      toast.success('User created successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create user');
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleShowDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleEditClick = (user) => {
    setEditingUser({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || 'male',
      bio: user.bio || '',
      profileImage: user.profileImage || '',
      needsPasswordChange: user.needsPasswordChange
    });
    setShowEditModal(true);
  };

  const filteredUsers = users?.data?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header setShowAddModal={setShowAddModal} />
        <SearchFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
        />
        <UserTable 
          users={filteredUsers}
          handleShowDetails={handleShowDetails}
          handleEditClick={handleEditClick}
          handleDelete={handleDelete}
        />
        <AddUserModal 
          show={showAddModal}
          setShow={setShowAddModal}
          newUser={newUser}
          setNewUser={setNewUser}
          handleAddUser={handleAddUser}
        />
        <EditUserModal
          show={showEditModal}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          setShow={setShowEditModal}
          handleUpdate={handleUpdate}
        />
        <UserDetailsModal
          show={showDetailsModal}
          setShow={setShowDetailsModal}
          user={selectedUser}
        />
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ErrorMessage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
      <div className="text-red-500 text-center">
        <FaInfoCircle className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
        <p className="text-gray-600">Unable to fetch user data. Please try again later.</p>
      </div>
    </div>
  </div>
);

const Header = ({ setShowAddModal }) => (
  <div className="flex justify-between items-center">
    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
      Customer Management
    </h1>
    <button
      onClick={() => setShowAddModal(true)}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:opacity-90 transition-all transform hover:scale-105"
    >
      <FaUserPlus />
      Add Customer
    </button>
  </div>
);

const SearchFilter = ({ searchTerm, setSearchTerm, filterRole, setFilterRole }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 bg-transparent"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <div className="flex items-center gap-4">
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent"
        >
          <option value="all">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
      </div>
    </div>
  </div>
);

const UserTable = ({ users, handleShowDetails, handleEditClick, handleDelete }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700">
            <th className="px-6 py-4 text-left font-semibold text-sm text-gray-600 dark:text-gray-200 w-1/4">User</th>
            <th className="px-6 py-4 text-left font-semibold text-sm text-gray-600 dark:text-gray-200 w-1/4">Email</th>
            <th className="px-6 py-4 text-left font-semibold text-sm text-gray-600 dark:text-gray-200 w-1/6">Role</th>
            <th className="px-6 py-4 text-left font-semibold text-sm text-gray-600 dark:text-gray-200 w-1/6">Status</th>
            <th className="px-6 py-4 text-left font-semibold text-sm text-gray-600 dark:text-gray-200 w-1/6">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          <AnimatePresence>
            {users?.map((user) => (
              <UserRow 
                key={user._id}
                user={user}
                handleShowDetails={handleShowDetails}
                handleEditClick={handleEditClick}
                handleDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  </div>
);

const UserRow = ({ user, handleShowDetails, handleEditClick, handleDelete }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
  >
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-3">
        {user.profileImage ? (
          <img 
            src={user.profileImage} 
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
            {user.name[0].toUpperCase()}
          </div>
        )}
        <span className="truncate">{user.name}</span>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="truncate">{user.email}</span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${
        user.role === 'admin' 
          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
      }`}>
        {user.role}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${
        user.status === 'active'
          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
      }`}>
        {user.status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex gap-2">
        <button
          onClick={() => handleShowDetails(user)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          title="View Details"
        >
          <FaInfoCircle className="text-gray-500 w-4 h-4" />
        </button>
        <button
          onClick={() => handleEditClick(user)}
          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition-colors"
          title="Edit User"
        >
          <FaEdit className="text-blue-500 w-4 h-4" />
        </button>
        <button
          onClick={() => handleDelete(user._id)}
          className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors"
          title="Delete User"
        >
          <FaTrash className="text-red-500 w-4 h-4" />
        </button>
      </div>
    </td>
  </motion.tr>
);

const AddUserModal = ({ show, setShow, newUser, setNewUser, handleAddUser }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-2xl mx-4">
        <h2 className="text-2xl font-bold mb-6">Add New Customer</h2>
        <form onSubmit={handleAddUser} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Phone Number</label>
              <input
                type="tel"
                value={newUser.phoneNumber}
                onChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
              />
            </div>
            <div>
              <label className="block mb-2">Address</label>
              <input
                type="text"
                value={newUser.address}
                onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
              />
            </div>
            <div>
              <label className="block mb-2">Date of Birth</label>
              <input
                type="date"
                value={newUser.dateOfBirth}
                onChange={(e) => setNewUser({...newUser, dateOfBirth: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
              />
            </div>
            <div>
              <label className="block mb-2">Gender</label>
              <select
                value={newUser.gender}
                onChange={(e) => setNewUser({...newUser, gender: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block mb-2">Bio</label>
              <textarea
                value={newUser.bio}
                onChange={(e) => setNewUser({...newUser, bio: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
                rows={3}
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-2">Profile Image URL</label>
              <input
                type="url"
                value={newUser.profileImage}
                onChange={(e) => setNewUser({...newUser, profileImage: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => setShow(false)}
              className="px-6 py-2 rounded-xl border-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl"
            >
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditUserModal = ({ show, editingUser, setEditingUser, setShow, handleUpdate }) => {
  if (!show || !editingUser) return null;

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      setShow(false);
      setEditingUser(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleClickOutside}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-2xl mx-4">
        <h2 className="text-2xl font-bold mb-6">Edit Customer</h2>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">Name</label>
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Role</label>
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Status</label>
              <select
                value={editingUser.status}
                onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
              >
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Phone Number</label>
              <input
                type="tel"
                value={editingUser.phoneNumber}
                onChange={(e) => setEditingUser({...editingUser, phoneNumber: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
              />
            </div>
            <div>
              <label className="block mb-2">Address</label>
              <input
                type="text"
                value={editingUser.address}
                onChange={(e) => setEditingUser({...editingUser, address: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
              />
            </div>
            <div>
              <label className="block mb-2">Date of Birth</label>
              <input
                type="date"
                value={editingUser.dateOfBirth}
                onChange={(e) => setEditingUser({...editingUser, dateOfBirth: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
              />
            </div>
            <div>
              <label className="block mb-2">Gender</label>
              <select
                value={editingUser.gender}
                onChange={(e) => setEditingUser({...editingUser, gender: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block mb-2">Bio</label>
              <textarea
                value={editingUser.bio}
                onChange={(e) => setEditingUser({...editingUser, bio: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
                rows={3}
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-2">Profile Image URL</label>
              <input
                type="url"
                value={editingUser.profileImage}
                onChange={(e) => setEditingUser({...editingUser, profileImage: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border-2"
              />
            </div>
            <div>
              <label className="block mb-2">Password Change Required</label>
              <select
                value={editingUser.needsPasswordChange.toString()}
                onChange={(e) => setEditingUser({...editingUser, needsPasswordChange: e.target.value === 'true'})}
                className="w-full px-4 py-2 rounded-xl border-2"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => {
                setShow(false);
                setEditingUser(null);
              }}
              className="px-6 py-2 rounded-xl border-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl"
            >
              Update Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserDetailsModal = ({ show, setShow, user }) => {
  if (!show || !user) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">User Details</h2>
          <button
            onClick={() => setShow(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            {user.profileImage ? (
              <img 
                src={user.profileImage}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {user.name[0].toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Role</p>
              <p className="font-medium">{user.role}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <p className="font-medium">{user.status}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Phone Number</p>
              <p className="font-medium">{user.phoneNumber || 'Not provided'}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Gender</p>
              <p className="font-medium">{user.gender || 'Not specified'}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
              <p className="font-medium">
                {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Last Login</p>
              <p className="font-medium">
                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
              </p>
            </div>
            <div className="col-span-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="font-medium">{user.address || 'Not provided'}</p>
            </div>
            <div className="col-span-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Bio</p>
              <p className="font-medium">{user.bio || 'No bio provided'}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Joined Date</p>
              <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Last Updated</p>
              <p className="font-medium">{new Date(user.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => setShow(false)}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Customers;
