import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "./../components/DashboardShell";
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
} from "./../components/ui";
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  Globe,
  Plus,
  Trash2,
  Eye,
  Loader2,
  Link,
} from "lucide-react";
import { api } from "./../services/api";

const SECTION =
  "mb-5 flex items-center gap-2 border-b border-orbit-border pb-2 text-sm font-semibold text-slate-300";

export default function Resume() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [student, setStudent] = useState(null);

  const [form, setForm] = useState({

    objective: "",

    address: "",

    github: "",

    linkedin: "",

    portfolio: "",

    languages: "",

    hobbies: "",

    declaration: true,

    skills: [""],

    projects: [
      {
        title: "",
        technology: "",
        description: "",
        github: "",
        live: "",
      },
    ],

    internships: [
      {
        company: "",
        role: "",
        duration: "",
        description: "",
      },
    ],

    certificates: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],

  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {

    try {

      setLoading(true);

      const res = await api.get("/students/me");

      setStudent(res.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }

  function update(field) {

    return (e) => {

      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

    };

  }

  function addSkill() {

    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }));

  }

  function removeSkill(index) {

    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));

  }

  function changeSkill(index, value) {

    const list = [...form.skills];

    list[index] = value;

    setForm((prev) => ({
      ...prev,
      skills: list,
    }));

  }
    /* =====================================
      Projects
  ===================================== */

  function addProject() {

    setForm((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: "",
          technology: "",
          description: "",
          github: "",
          live: "",
        },
      ],
    }));

  }

  function removeProject(index) {

    setForm((prev) => ({
      ...prev,
      projects: prev.projects.filter(
        (_, i) => i !== index
      ),
    }));

  }

  function updateProject(index, field, value) {

    const list = [...form.projects];

    list[index][field] = value;

    setForm((prev) => ({
      ...prev,
      projects: list,
    }));

  }

  /* =====================================
      Internships
  ===================================== */

  function addInternship() {

    setForm((prev) => ({
      ...prev,
      internships: [
        ...prev.internships,
        {
          company: "",
          role: "",
          duration: "",
          description: "",
        },
      ],
    }));

  }

  function removeInternship(index) {

    setForm((prev) => ({
      ...prev,
      internships: prev.internships.filter(
        (_, i) => i !== index
      ),
    }));

  }

  function updateInternship(
    index,
    field,
    value
  ) {

    const list = [...form.internships];

    list[index][field] = value;

    setForm((prev) => ({
      ...prev,
      internships: list,
    }));

  }

  /* =====================================
      Certificates
  ===================================== */

  function addCertificate() {

    setForm((prev) => ({
      ...prev,
      certificates: [
        ...prev.certificates,
        {
          title: "",
          issuer: "",
          year: "",
        },
      ],
    }));

  }

  function removeCertificate(index) {

    setForm((prev) => ({
      ...prev,
      certificates:
        prev.certificates.filter(
          (_, i) => i !== index
        ),
    }));

  }

  function updateCertificate(
    index,
    field,
    value
  ) {

    const list = [...form.certificates];

    list[index][field] = value;

    setForm((prev) => ({
      ...prev,
      certificates: list,
    }));

  }

  /* =====================================
      Preview Resume
  ===================================== */

  function previewResume() {

    navigate("/student/resume-preview", {
      state: {
        student,
        form,
      },
    });

  }

  /* =====================================
      Loading
  ===================================== */

  if (loading) {

    return (

      <DashboardShell
        title="Resume Builder"
      >

        <div className="flex h-[60vh] items-center justify-center">

          <Loader2
            size={40}
            className="animate-spin"
          />

        </div>

      </DashboardShell>

    );

  }

  /* =====================================
      JSX
  ===================================== */

  return (

    <DashboardShell
      title="Resume Builder"
      subtitle="Create Professional Resume"
    >

      <div className="space-y-6">

        {/* =====================================
            Student Information
        ===================================== */}

        <Card>

          <CardBody>

            <p className={SECTION}>

              <User size={16} />

              Basic Information

            </p>

            <div className="grid gap-5 md:grid-cols-2">

              <Input
                label="Full Name"
                value={student?.name || ""}
                disabled
              />

              <Input
                label="Roll Number"
                value={student?.roll_no || ""}
                disabled
              />

              <Input
                label="Email"
                value={student?.email || ""}
                disabled
              />

              <Input
                label="Mobile"
                value={student?.mobile_no || ""}
                disabled
              />

              <Input
                label="Department"
                value={student?.department || ""}
                disabled
              />

              <Input
                label="Semester"
                value={student?.semester || ""}
                disabled
              />

              <Input
                label="CGPA"
                value={student?.cgpa || ""}
                disabled
              />

              <Input
                label="Category"
                value={student?.category || ""}
                disabled
              />

              <Input
                label="Gender"
                value={student?.gender || ""}
                disabled
              />

              <Input
                label="10th Division"
                value={student?.tenth_division || ""}
                disabled
              />

              <Input
                label="12th Division"
                value={student?.twelfth_division || ""}
                disabled
              />

              <Input
                label="Date of Birth"
                value={
                  student?.date_of_birth
                    ? new Date(
                        student.date_of_birth
                      ).toLocaleDateString()
                    : ""
                }
                disabled
              />

            </div>

          </CardBody>

        </Card>
                {/* =====================================
              Career Objective
        ===================================== */}

        <Card>

          <CardBody>

            <p className={SECTION}>

              <GraduationCap size={16} />

              Career Objective

            </p>

            <Textarea
              rows={5}
              placeholder="Write your career objective..."
              value={form.objective}
              onChange={update("objective")}
            />

          </CardBody>

        </Card>

        {/* =====================================
              Contact & Social Links
        ===================================== */}

        <Card>

          <CardBody>

            <p className={SECTION}>

              <Globe size={16} />

              Contact & Social Links

            </p>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
  <label className="mb-2 block text-sm font-medium text-black">
    Permanent Address
  </label>

  <textarea
    rows={3}
    placeholder="Enter your complete address"
    value={form.address}
    onChange={update("address")}
    className="w-full rounded-lg border border-gray-300 p-3 text-black"
  />
</div>

              <div className="space-y-5">

                <Input
                  label="GitHub"
                  placeholder="https://github.com/username"
                  value={form.github}
                  onChange={update("github")}
                  icon={<Link size={18} />}
                />

                <Input
                  label="LinkedIn"
                  placeholder="https://linkedin.com/in/username"
                  value={form.linkedin}
                  onChange={update("linkedin")}
                  icon={<Link size={18} />}
                />

                <Input
                  label="Portfolio"
                  placeholder="https://yourportfolio.com"
                  value={form.portfolio}
                  onChange={update("portfolio")}
                />

              </div>

            </div>

          </CardBody>

        </Card>

        {/* =====================================
              Technical Skills
        ===================================== */}

        <Card>

          <CardBody>

            <div className="mb-5 flex items-center justify-between">

              <p className={SECTION.replace("mb-5","mb-0")}>

                <GraduationCap size={16} />

                Technical Skills

              </p>

              <Button
                type="button"
                size="sm"
                icon={<Plus size={16} />}
                onClick={addSkill}
              >

                Add Skill

              </Button>

            </div>

            <div className="space-y-4">

              {form.skills.map((skill, index) => (

                <div
                  key={index}
                  className="flex gap-3"
                >

                  <Input
                    placeholder="React JS"
                    value={skill}
                    onChange={(e)=>
                      changeSkill(
                        index,
                        e.target.value
                      )
                    }
                  />

                  {form.skills.length > 1 && (

                    <Button
                      type="button"
                      variant="danger"
                      icon={<Trash2 size={16} />}
                      onClick={() =>
                        removeSkill(index)
                      }
                    />

                  )}

                </div>

              ))}

            </div>

          </CardBody>

        </Card>

        {/* =====================================
              Projects
        ===================================== */}

        <Card>

          <CardBody>

            <div className="mb-5 flex items-center justify-between">

              <p className={SECTION.replace("mb-5","mb-0")}>

                <Briefcase size={16} />

                Projects

              </p>

              <Button
                type="button"
                size="sm"
                icon={<Plus size={16} />}
                onClick={addProject}
              >

                Add Project

              </Button>

            </div>

            <div className="space-y-6">

              {form.projects.map((project,index)=>(

                <div
                  key={index}
                  className="rounded-xl border border-orbit-border p-5 space-y-4"
                >

                  <div className="flex justify-between">

                    <h3 className="font-semibold">

                      Project {index+1}

                    </h3>

                    {form.projects.length>1 && (

                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={15}/>}
                        onClick={()=>removeProject(index)}
                      />

                    )}

                  </div>

                  <Input
                    label="Project Title"
                    value={project.title}
                    onChange={(e)=>
                      updateProject(
                        index,
                        "title",
                        e.target.value
                      )
                    }
                  />

                  <Input
                    label="Technology Used"
                    value={project.technology}
                    onChange={(e)=>
                      updateProject(
                        index,
                        "technology",
                        e.target.value
                      )
                    }
                  />

                  <Textarea
                    rows={4}
                    label="Description"
                    value={project.description}
                    onChange={(e)=>
                      updateProject(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                  />

                  <Input
                    label="GitHub URL"
                    value={project.github}
                    onChange={(e)=>
                      updateProject(
                        index,
                        "github",
                        e.target.value
                      )
                    }
                  />

                  <Input
                    label="Live URL"
                    value={project.live}
                    onChange={(e)=>
                      updateProject(
                        index,
                        "live",
                        e.target.value
                      )
                    }
                  />

                </div>

              ))}

            </div>

          </CardBody>

        </Card>
                {/* =====================================
              Internships
        ===================================== */}

        <Card>

          <CardBody>

            <div className="mb-5 flex items-center justify-between">

              <p className={SECTION.replace("mb-5","mb-0")}>

                <Briefcase size={16} />

                Internship

              </p>

              <Button
                type="button"
                size="sm"
                icon={<Plus size={16} />}
                onClick={addInternship}
              >

                Add Internship

              </Button>

            </div>

            <div className="space-y-6">

              {form.internships.map((item,index)=>(

                <div
                  key={index}
                  className="rounded-xl border border-orbit-border p-5 space-y-4"
                >

                  <div className="flex justify-between">

                    <h3 className="font-semibold">

                      Internship {index+1}

                    </h3>

                    {form.internships.length>1 && (

                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={15}/>}
                        onClick={()=>
                          removeInternship(index)
                        }
                      />

                    )}

                  </div>

                  <Input
                    label="Company"
                    value={item.company}
                    onChange={(e)=>
                      updateInternship(
                        index,
                        "company",
                        e.target.value
                      )
                    }
                  />

                  <Input
                    label="Role"
                    value={item.role}
                    onChange={(e)=>
                      updateInternship(
                        index,
                        "role",
                        e.target.value
                      )
                    }
                  />

                  <Input
                    label="Duration"
                    placeholder="Jan 2025 - Mar 2025"
                    value={item.duration}
                    onChange={(e)=>
                      updateInternship(
                        index,
                        "duration",
                        e.target.value
                      )
                    }
                  />

                  <Textarea
                    rows={4}
                    label="Description"
                    value={item.description}
                    onChange={(e)=>
                      updateInternship(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                  />

                </div>

              ))}

            </div>

          </CardBody>

        </Card>

        {/* =====================================
              Certificates
        ===================================== */}

        <Card>

          <CardBody>

            <div className="mb-5 flex items-center justify-between">

              <p className={SECTION.replace("mb-5","mb-0")}>

                <Award size={16} />

                Certificates

              </p>

              <Button
                type="button"
                size="sm"
                icon={<Plus size={16} />}
                onClick={addCertificate}
              >

                Add Certificate

              </Button>

            </div>

            <div className="space-y-6">

              {form.certificates.map((item,index)=>(

                <div
                  key={index}
                  className="rounded-xl border border-orbit-border p-5 space-y-4"
                >

                  <div className="flex justify-between">

                    <h3 className="font-semibold">

                      Certificate {index+1}

                    </h3>

                    {form.certificates.length>1 && (

                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={15}/>}
                        onClick={()=>
                          removeCertificate(index)
                        }
                      />

                    )}

                  </div>

                  <Input
                    label="Certificate Name"
                    value={item.title}
                    onChange={(e)=>
                      updateCertificate(
                        index,
                        "title",
                        e.target.value
                      )
                    }
                  />

                  <Input
                    label="Issued By"
                    value={item.issuer}
                    onChange={(e)=>
                      updateCertificate(
                        index,
                        "issuer",
                        e.target.value
                      )
                    }
                  />

                  <Input
                    label="Year"
                    value={item.year}
                    onChange={(e)=>
                      updateCertificate(
                        index,
                        "year",
                        e.target.value
                      )
                    }
                  />

                </div>

              ))}

            </div>

          </CardBody>

        </Card>
                {/* =====================================
              Additional Information
        ===================================== */}

        <Card>

          <CardBody>

            <p className={SECTION}>

              <Globe size={16} />

              Additional Information

            </p>

            <div className="grid gap-5 md:grid-cols-2">

              <Input
                label="Languages"
                placeholder="English, Hindi, Bengali"
                value={form.languages}
                onChange={update("languages")}
              />

              <Input
                label="Hobbies"
                placeholder="Coding, Reading, Cricket"
                value={form.hobbies}
                onChange={update("hobbies")}
              />

            </div>

          </CardBody>

        </Card>

        {/* =====================================
              Declaration
        ===================================== */}

        <Card>

          <CardBody>

            <label className="flex items-start gap-3">

              <input
                type="checkbox"
                checked={form.declaration}
                onChange={(e)=>
                  setForm(prev=>({
                    ...prev,
                    declaration:e.target.checked,
                  }))
                }
              />

              <span className="text-sm leading-6">

                I hereby declare that all the
                information furnished above is
                true and correct to the best of
                my knowledge.

              </span>

            </label>

          </CardBody>

        </Card>

        {/* =====================================
              Footer Buttons
        ===================================== */}

        <div className="flex flex-col gap-4 md:flex-row md:justify-end">

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >

            Cancel

          </Button>

          <Button
            type="button"
            variant="outline"
            icon={<Eye size={16} />}
            onClick={previewResume}
          >

            Preview Resume

          </Button>

        </div>

      </div>

    </DashboardShell>

  );

}