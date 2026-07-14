import api from "../../../services/api";

function check(response) {
  if (!response) {
    throw new Error("No response received from server.");
  }

  if (response.success === false) {
    throw new Error(response.message || "Request failed.");
  }

  return response;
}

/* =====================================================
   GET ALL DEPARTMENTS
===================================================== */

export async function fetchDepartments() {
  const res = await api.get("/departments/");

  return check(res).data || [];
}

/* =====================================================
   GET SINGLE DEPARTMENT
===================================================== */

export async function fetchDepartment(departmentId) {
  const departments = await fetchDepartments();

  const department = departments.find(
    (d) =>
      Number(d.department_id) === Number(departmentId)
  );

  if (!department) {
    throw new Error("Department not found.");
  }

  return department;
}

/* =====================================================
   CREATE DEPARTMENT
===================================================== */

export async function createDepartment(payload) {
  const res = await api.post(
    "/departments/register",
    payload
  );

  return check(res).data;
}

/* =====================================================
   UPDATE DEPARTMENT
===================================================== */

export async function updateDepartment(
  departmentId,
  payload
) {
  const res = await api.patch(
    `/departments/${departmentId}`,
    payload
  );

  return check(res).data;
}