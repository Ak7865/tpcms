const STORAGE_KEY = 'tpcms_notices'

export function getNotices() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveNotice(notice) {
  const notices = getNotices()
  const entry = {
    notice_id: Date.now(),
    created_at: new Date().toISOString(),
    ...notice,
  }
  notices.unshift(entry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notices))
  return entry
}

export function getNoticesByType(type) {
  return getNotices().filter((n) => n.notice_type === type)
}
