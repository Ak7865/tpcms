import {useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import {api} from "./../../services/api";
import { Link } from "lucide-react";
import DashboardShell from "./../../components/DashboardShell";
import {Card,CardBody,Button} from "./../../components/ui";
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  GraduationCap,
  Globe,
  Loader2,
  Save,
} from "lucide-react";


export default function ResumePreview() {
  const navigate = useNavigate();

  const location = useLocation();

  const resumeRef = useRef(null);

  const [downloading, setDownloading] = useState(false);

  const [saving, setSaving] = useState(false);

  const { student, form } = location.state || {};
  function hasValue(value) {
    if (value === null || value === undefined) return false;

    const text = String(value).trim().toLowerCase();

    return (
      text !== "" &&
      text !== "null" &&
      text !== "undefined" &&
      text !== "n/a" &&
      text !== "-"
    );
  }

  if (!student || !form) {
    return (
      <DashboardShell title="Resume Preview">
        <Card>
          <CardBody>
            <div className="space-y-5 text-center">
              <h2 className="text-2xl font-bold">Resume data not found</h2>

              <Button onClick={() => navigate("/student/resume")}>
                Back to Resume Builder
              </Button>
            </div>
          </CardBody>
        </Card>
      </DashboardShell>
    );
  }

 
async function generatePdfBlob(){
  const element = resumeRef.current;
  const canvas= await html2canvas(element,{
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });
  const pdf = new jsPDF({
    orientation: "portrait",
    unit:"mm",
    format: "a4",
  });
  const pdfWidth = 210;
  const pdfHeight = 297;
  const imgWidth=pdfWidth;
  const imgHeight=(canvas.height * imgWidth) / canvas.width;
  const imgData = canvas.toDataURL("image/png");
  let  heightLeft = imgHeight;
  let position = 0;
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }
  return pdf.output("blob");
}  
async function downloadPDF() {
  try{
    setDownloading(true);
    const blob = await generatePdfBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${student.name}_resume.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  } catch(err){
    console.error("Error generating PDF:", err);
    alert("Failed to generate PDF. Please try again.");
  } finally {
    setDownloading(false);
  }
}
async function saveResume() {
  try{
    setSaving(true);
    const blob = await generatePdfBlob();
    const file = new File([blob], `${student.name}_resume.pdf`, { type: "application/pdf" });
    const uploadRes = await api.upload("/uploads/resume", file);
    const resumeUrl = uploadRes.fileUrl || uploadRes?.data?.fileUrl || uploadRes?.fileUrl || uploadRes?.data?.data?.fileUrl;
    if(!resumeUrl){
      throw new Error("Failed to get resume URL from upload response.");
    }
    await api.put("/students/me", { resume_url: resumeUrl });
    student.resume_url = resumeUrl;
    alert("Resume saved successfully!");
  } catch(err){
    console.error("Error saving resume:", err);
    alert(err?.response?.data?.message || "Failed to save resume. Please try again.");
  } finally {
    setSaving(false);
  }
}

  return (
    <DashboardShell title="Resume Preview" subtitle="Professional ATS Resume">
      <div className="no-print mb-6 flex flex-wrap justify-end gap-3">
        <Button
          variant="outline"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>

      <Button
      disabled={downloading}
  icon={downloading?<Loader2 className="animate-spin" size={16}/> : <Download size={16} />}
  onClick={downloadPDF}
>
{downloading ? "Downloading..." : "Download PDF"}
</Button>
<Button
  disabled={saving}
  icon={saving?<Loader2 className="animate-spin" size={16}/> : <Save size={16} />}
  onClick={saveResume}
>
{saving ? "Saving..." : "Save Resume"}


</Button>

      </div>

      <div
        ref={resumeRef}
        className="mx-auto max-w-[850px] bg-white text-black shadow-xl"
      >
        {/* Header */}

        <div className="flex gap-8 border-b p-8">
          <div className="h-36 w-36 overflow-hidden rounded-lg border">
            {student.image_url ? (
              <img
                src={student.image_url}
                alt={student.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-100">
                No Photo
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold">{student.name}</h1>

            <p className="mt-2 text-lg text-gray-600">{student.department}</p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={15} />

                {student.email}
              </div>

              <div className="flex items-center gap-2">
                <Phone size={15} />

                {student.mobile_no}
              </div>

              <div className="flex items-center gap-2">
                <GraduationCap size={15} />

                {student.roll_no}
              </div>

              <div>CGPA : {student.cgpa}</div>
            </div>
          </div>
        </div>

        {/* =====================================
              Career Objective
        ===================================== */}

        <div className="resume-section border-b p-6">
          <h2 className="mb-4 text-xl font-bold border-l-4 border-blue-600 pl-3">
            Career Objective
          </h2>

          <p className="leading-8 text-gray-700">
            {hasValue(form.objective)
              ? form.objective
              : `A highly motivated ${student.department} student currently studying in ${student.semester} Semester with a CGPA of ${student.cgpa}. Passionate about software development, problem solving and continuously learning new technologies. Seeking an opportunity where I can contribute my skills while gaining valuable industry experience.`}
          </p>
        </div>

        {/* =====================================
              Education
        ===================================== */}

        <div className="resume-section border-b p-6">
          <h2 className="mb-4 text-xl font-bold border-l-4 border-blue-600 pl-3">
            Education
          </h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Qualification</th>

                <th className="border p-3 text-left">Details</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border px-3 py-2">Department</td>

                <td className="border px-3 py-2">{student.department}</td>
              </tr>

              <tr>
                <td className="border px-3 py-2">Semester</td>

                <td className="border px-3 py-2">{student.semester}</td>
              </tr>

              <tr>
                <td className="border px-3 py-2">CGPA</td>

                <td className="border px-3 py-2">{student.cgpa}</td>
              </tr>

              <tr>
                <td className="border px-3 py-2">10th Division</td>

                <td className="border px-3 py-2">{student.tenth_division}</td>
              </tr>

              <tr>
                <td className="border px-3 py-2">12th Division</td>

                <td className="border px-3 py-2">{student.twelfth_division}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {hasValue(form.address) && (

  <div className="resume-section border-b p-6">

    <strong>Address:</strong>

    <div className="mt-1 whitespace-pre-wrap">

      {form.address}

    </div>

  </div>

)}

        {/* =====================================
              Skills
        ===================================== */}
        {form.skills.some((skill) => hasValue(skill)) && (
          <div className="resume-section border-b p-6">
            <h2 className="mb-4 text-xl font-bold border-l-4 border-blue-600 pl-3">
              Technical Skills
            </h2>

            <div className="flex flex-wrap gap-3">
              {form.skills
                .filter((skill) => hasValue(skill))
                .map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>
        )}



        {/* =====================================
      Professional Links
===================================== */}

{(
  hasValue(form.github) ||
  hasValue(form.linkedin) ||
  hasValue(form.portfolio)
) && (

  <div className="resume-section border-b p-6">

    <h2 className="mb-4 border-l-4 border-blue-600 pl-3 text-xl font-bold">

      Professional Links

    </h2>

    <div className="mt-6">

      {hasValue(form.github) && (

        <div className="flex items-center gap-3">

          <Link size={18} />

          <span>{form.github}</span>

        </div>

      )}

      {hasValue(form.linkedin) && (

        <div className="flex items-center gap-3">

          <Link size={18} />

          <span>{form.linkedin}</span>

        </div>

      )}

      {hasValue(form.portfolio) && (

        <div className="flex items-center gap-3">

          <Globe size={18} />

          <span>{form.portfolio}</span>

        </div>

      )}

    </div>

  </div>

)}

        {/* =====================================
              Projects
        ===================================== */}
        {form.projects.some((p) => hasValue(p.title) || hasValue(p.description)) && (
          <div className="resume-section border-b p-6">
            <h2 className="mb-4 border-l-4 border-blue-600 pl-3 text-xl font-bold">
              Projects
            </h2>

            <div className="space-y-3">
              {form.projects
                .filter((p) => p.title.trim() || p.description.trim())
                .map((project, index) => (
                  <div key={index} className="rounded-lg border p-5">
                    <h3 className="text-lg font-bold">{project.title}</h3>

                    {project.technology && (
                      <p className="mt-2 text-sm font-medium text-blue-600">
                        Technology : {project.technology}
                      </p>
                    )}

                    <p className="mt-3 leading-7 text-gray-700">
                      {project.description}
                    </p>

                    {(project.github || project.live) && (
                      <div className="mt-4 space-y-2 text-sm">
                        {project.github && (
                          <p>
                            <strong>GitHub :</strong> {project.github}
                          </p>
                        )}

                        {project.live && (
                          <p>
                            <strong>Live :</strong> {project.live}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
        {/* =====================================
              Internship
        ===================================== */}
        {form.internships.some((i) => hasValue(i.company) || hasValue(i.role)) && (
          <div className="resume-section border-b p-6">
            <h2 className="mb-4 border-l-4 border-blue-600 pl-3 text-xl font-bold">
              Internship
            </h2>

            <div className="space-y-3">
              {form.internships
                .filter((i) => hasValue(i.company) || hasValue(i.role))
                .map((item, index) => (
                  <div key={index} className="rounded-lg border p-5">
                    <h3 className="text-lg font-bold">{item.company}</h3>

                    <p className="mt-1 font-medium">{item.role}</p>

                    <p className="text-sm text-gray-500">{item.duration}</p>

                    <p className="mt-3 leading-7 text-gray-700">
                      {item.description}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
{/* =====================================
      Certifications
===================================== */}

{form.certificates.some(
  (c) =>
    hasValue(c.title) ||
    hasValue(c.issuer) ||
    hasValue(c.year)
) && (

  <div className="resume-section border-b p-6">

    <h2 className="mb-4 border-l-4 border-blue-600 pl-3 text-xl font-bold">

      Certifications

    </h2>

    <div className="space-y-5">

      {form.certificates
        .filter(
          (c) =>
            hasValue(c.title) ||
            hasValue(c.issuer) ||
            hasValue(c.year)
        )
        .map((certificate, index) => (

          <div
            key={index}
            className="rounded-lg border p-4"
          >

            {hasValue(certificate.title) && (
              <h3 className="font-semibold">
                {certificate.title}
              </h3>
            )}

            {hasValue(certificate.issuer) && (
              <p className="mt-2 text-sm">
                {certificate.issuer}
              </p>
            )}

            {hasValue(certificate.year) && (
              <p className="text-sm text-gray-500">
                {certificate.year}
              </p>
            )}

          </div>

        ))}

    </div>

  </div>

)}

       

        {/* =====================================
      Languages & Hobbies
===================================== */}

{(hasValue(form.languages) || hasValue(form.hobbies)) && (

  <div className="resume-section p-6">

    <div className="grid gap-6 md:grid-cols-2">

      {hasValue(form.languages) && (

        <div>

          <h2 className="mb-3 border-l-4 border-blue-600 pl-3 text-xl font-bold">

            Languages

          </h2>

          <p className="leading-7 text-gray-700">

            {form.languages}

          </p>

        </div>

      )}

      {hasValue(form.hobbies) && (

        <div>

          <h2 className="mb-3 border-l-4 border-blue-600 pl-3 text-xl font-bold">

            Hobbies

          </h2>

          <p className="leading-7 text-gray-700">

            {form.hobbies}

          </p>

        </div>

      )}

    </div>

  </div>

)}
        {/* =====================================
              Declaration
        ===================================== */}
{form.declaration && (
        <div className="resume-section border-b p-6">
          <h2 className="mb-4 border-l-4 border-blue-600 pl-3 text-xl font-bold">
            Declaration
          </h2>

          <p>
I hereby declare that the information furnished above is true and correct to the best of my knowledge and belief.
</p>
        </div>
)}
        {/* =====================================
              Signature
        ===================================== */}

        <div className="p-8">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">Place</p>

              <p className="mt-3 text-gray-600">___________________</p>
            </div>

            <div className="text-right">
              <p className="font-semibold">Signature</p>

              <p className="mt-5 text-lg font-bold">{student.name}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
