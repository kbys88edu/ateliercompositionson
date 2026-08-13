# Final Analytics Audit

Date: 2026-08-13

## Required Events

The following event hooks remain present:

| Event | Purpose |
| --- | --- |
| `hero_booking_click` | Primary hero consultation action |
| `booking_section_view` | French booking-section visibility |
| `booking_page_click` | Final French booking action |
| `pricing_section_view` | French format/pricing visibility |
| `gumroad_product_click` | Paid resource outbound click |
| `resource_free_pdf_click` | Free PDF download |
| `email_contact_click` | Canonical email contact click |

## Deduplication

- Explicit email links use `email_contact_click` plus `data-cta-location`.
- `assets/js/acs-tracking.js` treats the canonical event as authoritative and avoids sending the same canonical event twice for one click.
- Resource links remain outside the global outbound-click binding and are handled by their dedicated resource listener, preserving the existing no-double-send boundary.
- Legacy `contact_click` remains only as the generic contact/form fallback in the shared tracker, not as an explicit email-link event.
- No scoped page uses `data-track="click_email_contact"`.

## Locations Added or Retained

- `ja_final_section`
- `ja_mail_feedback`
- `ja_terms`
- `fr_booking_note`
- `fr_hidden_contact`
- `fr_hidden_contact_copy`

## Validation

Automated contracts verify the required names and the JavaScript click-path behavior. The complete 82-test suite passes. Live GA4 DebugView was not available in the local environment, so production ingestion and consent-state behavior remain deployment checks.
