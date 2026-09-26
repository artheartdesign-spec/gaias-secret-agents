# Classroom pilot: launch status

26 September 2026

This draft adds `/for-teachers.html` and the standalone free four-page Year 1 classroom PDF at `/downloads/GSA_Operation_Look_Closer_Classroom_Pilot.pdf`.

The lesson has a teacher briefing, 45-minute proposed timing, a 19 pt student field report (one per pair), an indoor alternative, selected curriculum connections and free classroom copying permission. It does not reproduce paid-kit sheets or create a new numbered monthly mission.

## Before public launch

- Configure a teacher-specific Brevo form using the existing main contact audience. Preserve parent interests; tag/segment teacher interest separately.
- Do not reuse the family form unchanged: its delivery/redirect is for The Nature Signal, not the classroom pack.
- Separate requested pack delivery from optional consent to teaching resources and offers. Test success, failure, repeat-contact and unsubscribe behaviour.
- Confirm the published contact address receives replies.
- The current draft uses a direct PDF link and honest mailto volunteer/feedback links as a functional pilot fallback. It does not capture emails or create contacts. Keep the public launch blocked until the chosen delivery/capture route is tested.
- Browser rendering and mobile interaction checks remain to be run in a browser-equipped environment; the local runtime did not include a Chromium executable. Static links and script syntax were checked; the PDF was rendered and visually inspected.
- After activation and deployment, verify the live download, add the For Teachers navigation link and sitemap entry, and remove noindex when ready for indexing.

No teacher outreach has been sent. No A$49 product has been listed or sold. A separate classroom edition and its final licence must be complete before charging. The family Starter Kit should not be assumed to carry classroom copying permission.

## Measurement

The page uses the existing `gsaTrack` event helper for `gsa_classroom_pilot_download_click` and `gsa_teacher_trial_email_click`. These are click events only, not confirmed signups, lesson completions or sales. Do not put teacher names/emails or student information in events. Analytics destination connection remains separately unverified.

Keep participant contact details and completed trial records private; never commit them to this public repository.

## Source

QCAA's Year 1 Science Australian Curriculum v9.0 reference, checked 26 September 2026:
https://www.qcaa.qld.edu.au/downloads/aciqv9/science/curriculum/ac9_science_yr1_as_cd_alignment.pdf

Suggested links: AC9S1U01 and selected observation/communication elements of AC9S1I03 and AC9S1I06. The pack explains limits of coverage and does not claim ACARA endorsement.
