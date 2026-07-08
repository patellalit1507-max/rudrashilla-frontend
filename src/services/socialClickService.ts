import { apiFetch } from '@/lib/api'

/**
 * Fire-and-forget ping when a visitor clicks the WhatsApp/Instagram icon —
 * lets the owner get an email alert. Never blocks or interferes with the
 * icon's own navigation (opens in a new tab regardless of outcome).
 */
export function notifySocialClick(channel: 'whatsapp' | 'instagram'): void {
  apiFetch('/notify/social-click', {
    method: 'POST',
    body: JSON.stringify({ channel, page: window.location.pathname }),
  }).catch(() => {})
}
