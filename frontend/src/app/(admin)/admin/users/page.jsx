"use client";
import axios from "axios";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "@/app/components/modal/Modal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.BACKEND_URL}/api/auth`, {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.BACKEND_URL}/api/auth/user/${selectedUserId}`,
        {
          withCredentials: true,
        }
      );
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((user) => user.id !== selectedUserId));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsModalOpen(false);
      setSelectedUserId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-tr from-gray-100 to-white">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">All Users</h2>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse h-6 bg-gray-300 rounded w-full"
            ></div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="py-4 px-6 text-left text-sm font-semibold">#</th>
                <th className="py-4 px-6 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold">
                  Role
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    <td className="py-5 px-6 text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="py-3 px-6 text-sm font-medium text-gray-800">
                      {user.name}
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="py-3 px-6 text-sm capitalize text-gray-600">
                      {user.role}
                    </td>
                    <td className="py-3 px-6 text-sm">
                      <Trash2
                        size={20}
                        className=" text-black hover:text-red-600 cursor-pointer ml-2 hover:scale-110 transition"
                        onClick={() => confirmDelete(user.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmClass="bg-red-600 hover:bg-red-700 text-white"
      />
    </div>
  );
};

export default Users;
