import api from "../../../services/api";

/* ============================================================
   COMMON RESPONSE HANDLER
============================================================ */

const check = (response) => {
  if (!response) {
    throw new Error("No response from server.");
  }

  if (response.success === false) {
    let message = "Request failed";

    if (Array.isArray(response.errors)) {
      message = response.errors
        .map((e) => e.message || e)
        .join(", ");
    } else if (typeof response.errors === "string") {
      message = response.errors;
    } else if (typeof response.message === "string") {
      message = response.message;
    }

    throw new Error(message);
  }

  return response;
};

/* ============================================================
   NORMALIZE DATA
============================================================ */

const normalizeOrganization = (organization) => ({
  ...organization,

  email:
    organization.email ||
    organization.user_table?.email ||
    "",

  mobile_no:
    organization.mobile_no ||
    organization.user_table?.mobile_no ||
    "",

  remarks:
    organization.remarks || "",
});

const normalizeOrganizations = (organizations = []) =>
  organizations.map(normalizeOrganization);

/* ============================================================
   GET ORGANIZATIONS
============================================================ */

/**
 * Pending Companies
 */

export async function fetchPendingOrganizations() {
  const res = await api.get(
    "/organizations?status=pending"
  );

  return normalizeOrganizations(
    check(res).data || []
  );
}

/**
 * Approved Companies
 */

export async function fetchApprovedOrganizations() {
  const res = await api.get(
    "/organizations?status=approved"
  );

  return normalizeOrganizations(
    check(res).data || []
  );
}

/**
 * Rejected Companies
 */

export async function fetchRejectedOrganizations() {
  const res = await api.get(
    "/organizations?status=rejected"
  );

  return normalizeOrganizations(
    check(res).data || []
  );
}

/* ============================================================
   APPROVE ORGANIZATION
============================================================ */

export async function approveOrganization(userId) {
  const res = await api.patch(
    `/organizations/${userId}/status`,
    {
      approval_id: 2,
    }
  );

  return check(res).data;
}

/* ============================================================
   REJECT ORGANIZATION
============================================================ */

export async function rejectOrganization(
  userId,
  remarks
) {
  const res = await api.patch(
    `/organizations/${userId}/status`,
    {
      approval_id: 3,
      remarks,
    }
  );

  return check(res).data;
}

/* ============================================================
   OPTIONAL HELPERS
============================================================ */

/**
 * Reload companies by status
 */

export async function fetchOrganizations(status) {
  switch (status) {
    case "approved":
      return fetchApprovedOrganizations();

    case "rejected":
      return fetchRejectedOrganizations();

    case "pending":
    default:
      return fetchPendingOrganizations();
  }
}