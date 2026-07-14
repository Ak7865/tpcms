/**
 * Builds a simple HTML resume from student profile data and returns a data URL.
 * Stored in resume_url so applications don't require manual CV upload.
 */
export function generateResumeDataUrl(profile, meta = {}) {
  const {
    name = 'Student',
    roll_no = '',
    email = '',
    mobile_no = '',
    cgpa = '',
    age = '',
    has_backlog = false,
    image_url = '',
  } = profile || {}

  const dept =
    meta.departments?.[profile?.department_id] ||
    profile?.department_table?.dept_name ||
    ''
  const semester =
    meta.semesters?.[profile?.semester_id] ||
    profile?.semester_table?.semester ||
    ''
  const gender =
    meta.genders?.[profile?.gender_id] || profile?.gender_table?.gender || ''
  const category =
    meta.categories?.[profile?.category_id] ||
    profile?.category_table?.category ||
    ''
  const tenth =
    meta.divisions?.[profile?.tenth_divison_id || profile?.tenth_division_id] || ''
  const twelfth = meta.divisions?.[profile?.twelfth_division_id] || ''
  const skills = (meta.skillLabels || []).filter(Boolean)

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Resume - ${name}</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; color: #111; line-height: 1.5; }
  h1 { margin: 0 0 4px; font-size: 28px; }
  .sub { color: #555; margin-bottom: 20px; }
  .photo { width: 96px; height: 96px; border-radius: 8px; object-fit: cover; float: right; }
  section { margin-top: 24px; }
  h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
  .skills span { display: inline-block; background: #eef2ff; color: #3730a3; padding: 4px 10px; border-radius: 999px; margin: 0 6px 6px 0; font-size: 12px; }
</style></head><body>
  ${image_url ? `<img class="photo" src="${image_url}" alt="Profile" />` : ''}
  <h1>${name}</h1>
  <div class="sub">${roll_no}${dept ? ` • ${dept}` : ''}${semester ? ` • ${semester}` : ''}</div>
  <div class="grid">
    <div><strong>Email:</strong> ${email}</div>
    <div><strong>Mobile:</strong> ${mobile_no}</div>
    <div><strong>CGPA:</strong> ${cgpa}</div>
    <div><strong>Age:</strong> ${age}</div>
    <div><strong>Gender:</strong> ${gender}</div>
    <div><strong>Category:</strong> ${category}</div>
    <div><strong>10th Division:</strong> ${tenth}</div>
    <div><strong>12th Division:</strong> ${twelfth}</div>
    <div><strong>Backlog:</strong> ${has_backlog ? 'Yes' : 'No'}</div>
  </div>
  ${skills.length ? `<section><h2>Skills</h2><div class="skills">${skills.map((s) => `<span>${s}</span>`).join('')}</div></section>` : ''}
  <section><h2>Academic Summary</h2>
    <p>Student at ${dept || 'the institution'} pursuing ${semester || 'current semester'} with CGPA ${cgpa || 'N/A'}.</p>
  </section>
</body></html>`

  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
}
