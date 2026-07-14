import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Loader2,
  RefreshCw,
  Building2,
  CheckCircle2,
} from "lucide-react";

import DashboardShell from "../../../components/DashboardShell";
import {
  Card,
  CardBody,
  Badge,
} from "../../../components/ui";

import { fetchApprovedOrganizations } from "./organizationApi";

export default function ApprovedCompanies() {

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function loadCompanies() {

    try {

      setLoading(true);
      setError("");

      const data =
        await fetchApprovedOrganizations();

      setCompanies(data || []);

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
          "Failed to load approved companies."
      );

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadCompanies();

  }, []);

  const filtered = useMemo(() => {

    const keyword =
      search.trim().toLowerCase();

    if (!keyword) return companies;

    return companies.filter((company) =>

      (company.name || "")
        .toLowerCase()
        .includes(keyword)

      ||

      (company.email || "")
        .toLowerCase()
        .includes(keyword)

      ||

      (company.mobile_no || "")
        .includes(search.trim())

    );

  }, [companies, search]);

  return (

    <DashboardShell
      title="Approved Companies"
      subtitle="Organizations approved by the Super Admin"
    >

      <div className="flex justify-between gap-3 mb-5 flex-col md:flex-row">

        <div className="relative w-full md:w-80">

          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search company..."
            className="
              w-full
              rounded-xl
              border
              border-orbit-border
              bg-orbit-surface2
              py-2.5
              pl-10
              pr-4
            "
          />

        </div>

        <button
          onClick={loadCompanies}
          disabled={loading}
          className="h-[42px] w-[42px] rounded-xl border border-orbit-border bg-orbit-surface2 flex items-center justify-center"
        >

          <RefreshCw
            size={16}
            className={
              loading ? "animate-spin" : ""
            }
          />

        </button>

      </div>

      {error ? (

        <Card>

          <CardBody>

            <div className="py-16 text-center text-red-400">

              {error}

            </div>

          </CardBody>

        </Card>

      ) : loading ? (

        <Card>

          <CardBody>

            <div className="flex items-center justify-center gap-2 py-16 text-slate-400">

              <Loader2
                className="animate-spin"
                size={18}
              />

              Loading approved companies...

            </div>

          </CardBody>

        </Card>

      ) : filtered.length === 0 ? (

        <Card>

          <CardBody>

            <div className="py-16 text-center text-slate-500">

              No approved companies found.

            </div>

          </CardBody>

        </Card>

      ) : (

        <div className="space-y-4">

          {filtered.map((company) => (

            <Card key={company.user_id}>

              <CardBody>

                <div className="flex gap-4">

                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">

                    <Building2
                      size={22}
                      className="text-emerald-400"
                    />

                  </div>

                  <div className="flex-1">

                    <div className="flex items-center justify-between">

                      <div>

                        <h3 className="font-semibold text-slate-100">

                          {company.name}

                        </h3>

                        <p className="text-sm text-slate-500">

                          {company.email}

                        </p>

                        <p className="text-sm text-slate-500">

                          {company.mobile_no}

                        </p>

                      </div>

                      <Badge variant="success">

                        <span className="flex items-center gap-1">

                          <CheckCircle2 size={14} />

                          Approved

                        </span>

                      </Badge>

                    </div>

                  </div>

                </div>

              </CardBody>

            </Card>

          ))}

        </div>

      )}

    </DashboardShell>

  );

}