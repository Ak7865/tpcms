import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, RefreshCw } from "lucide-react";

import DashboardShell from "../../../components/DashboardShell";
import { Card, CardBody } from "../../../components/ui";

import CompanyCard from "./CompanyCard";
import RejectRemarkModal from "./RejectRemarkModal";

import {
  fetchPendingOrganizations,
  approveOrganization,
  rejectOrganization,
} from "./organizationApi";

const getCompanyId = (company) => company?.user_id;

export default function ViewCompanies() {
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState(null);

  /* ===========================================
      Load Pending Companies
  =========================================== */

  async function loadCompanies() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchPendingOrganizations();

      setCompanies(data || []);
    } catch (err) {
      console.error(err);

      setCompanies([]);

      setError(err.message || "Unable to load companies.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  /* ===========================================
      Search Filter
  =========================================== */

  const filteredCompanies = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return companies;

    return companies.filter(
      (company) =>
        (company.name || "").toLowerCase().includes(keyword) ||
        (company.email || "").toLowerCase().includes(keyword) ||
        (company.mobile_no || "").includes(search.trim()) ||
        (company.remarks || "").toLowerCase().includes(keyword),
    );
  }, [companies, search]);
  /* ===========================================
      Approve Company
  =========================================== */

  async function handleApprove(company) {
    const id = getCompanyId(company);

    if (!id) return;

    try {
      setActionLoading(id);

      await approveOrganization(id);

      await loadCompanies();
    } catch (err) {
      console.error(err);

      alert(err.message || "Unable to approve company.");
    } finally {
      setActionLoading(null);
    }
  }

  /* ===========================================
      Reject Company
  =========================================== */

  async function handleReject(remarks) {
    if (!selectedCompany) return;

    const id = getCompanyId(selectedCompany);

    if (!id) return;

    try {
      setActionLoading(id);

      await rejectOrganization(id, remarks);

      setShowRejectModal(false);

      setSelectedCompany(null);

      await loadCompanies();
    } catch (err) {
      console.error(err);

      alert(err.message || "Unable to reject company.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <DashboardShell
      title="Pending Companies"
      subtitle="Approve or reject organization registration requests"
    >
      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}

        <div className="relative w-full lg:w-96">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, email or mobile..."
            className="
              w-full
              rounded-xl
              border
              border-orbit-border
              bg-orbit-surface2
              py-2.5
              pl-10
              pr-4
              text-sm
              text-slate-200
              placeholder:text-slate-500
              outline-none
              focus:border-orbit-primary
            "
          />
        </div>

        {/* Refresh */}

        <button
          type="button"
          onClick={loadCompanies}
          disabled={loading}
          title="Refresh"
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-orbit-border
            bg-orbit-surface2
            transition
            hover:bg-orbit-surface
            disabled:opacity-50
          "
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      {/* Error */}

      {error ? (
        <Card>
          <CardBody>
            <div className="py-16 text-center text-red-400">{error}</div>
          </CardBody>
        </Card>
      ) : loading ? (
        <Card>
          <CardBody>
            <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
              <Loader2 size={20} className="animate-spin" />
              Loading pending companies...
            </div>
          </CardBody>
        </Card>
      ) : filteredCompanies.length === 0 ? (
        <Card>
          <CardBody>
            <div className="py-16 text-center text-slate-500">
              {search.trim()
                ? "No companies match your search."
                : "No pending company requests found."}
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={getCompanyId(company)}
              company={company}
              tab="pending"
              loading={actionLoading === getCompanyId(company)}
              onApprove={handleApprove}
              onReject={(selectedCompany) => {
                setSelectedCompany(selectedCompany);

                setShowRejectModal(true);
              }}
            />
          ))}
        </div>
      )}

      <RejectRemarkModal
        open={showRejectModal}
        company={selectedCompany}
        loading={actionLoading === selectedCompany?.user_id}
        onClose={() => {
          setShowRejectModal(false);

          setSelectedCompany(null);
        }}
        onConfirm={handleReject}
      />
    </DashboardShell>
  );
}
