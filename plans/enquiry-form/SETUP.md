# Enquiry form → Google Sheet: setup (James, ~10 minutes, once)

Why a Google Sheet: your Google Drive is connected to Claude, so the
**dispatcher agent can read enquiries directly** — the ops team stops being
blind to what comes in. Free, nothing to host, no third party.

1. Go to [sheets.google.com](https://sheets.google.com) → new blank sheet →
   name it **Kerb2Kerb enquiries**.
2. In the sheet: **Extensions → Apps Script**. Delete the sample code, paste
   the whole of `Code.gs` (next to this file). Enquiries are emailed to
   `james@kerb2kerb.co.uk` (your Namecheap Private Email mailbox — log in at
   privateemail.com); change `NOTIFY_EMAIL` at the top if you'd rather they
   went elsewhere. **Save** (disk icon).
3. **Deploy → New deployment** → gear icon → *Web app*.
   - Description: `enquiries`
   - Execute as: **Me**
   - Who has access: **Anyone** (this is what lets the public website post
     to it — it only ever *appends* rows; it can't read or delete anything).
   - **Deploy**. Google will ask you to authorise the script (your account →
     "Advanced" → "Go to … (unsafe)" → Allow — that warning appears for every
     personal script; it's your own code).
4. Copy the **Web app URL** it shows (ends in `/exec`). Send it to me — it
   goes into the site as `ENQUIRY_ENDPOINT`, and the form switches from the
   WhatsApp fallback to posting rows into your sheet.
5. Test: open the URL in a browser — it should show `{"ok":true,...}`.

The sheet's first row (headers) is created automatically on the first
enquiry. Don't rename the tab (`Enquiries`) or the script won't find it.
