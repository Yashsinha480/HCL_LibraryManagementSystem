import api from "./api";

export const borrowBook = async (payload) => {
  const response = await api.post("/borrow", payload);
  return response.data.data;
};

export const returnBook = async (payload) => {
  const response = await api.post("/borrow/return", payload);
  return response.data.data;
};

export const fetchStudentBorrowedBooks = async () => {
  const response = await api.get("/student/borrowed-books");
  return response.data.data;
};

export const fetchStudentDueBooks = async () => {
  const response = await api.get("/student/due-books");
  return response.data.data;
};

export const fetchAdminBorrowedBooks = async () => {
  const response = await api.get("/admin/borrowed-books");
  return response.data.data;
};

export const fetchStudents = async () => {
  const response = await api.get("/admin/users");
  return response.data.data;
};

export const reviewStudent = async (id, status) => {
  const response = await api.patch(`/admin/users/${id}/status`, { status });
  return response.data.data;
};
