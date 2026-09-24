# Starter Kit post-purchase setup

The website now contains:

https://gaiassecretagents.com/starter-kit-confirmed.html

Use this as the post-purchase destination when Gumroad access is available.

Recommended tagged redirect:

https://gaiassecretagents.com/starter-kit-confirmed.html?utm_source=gumroad&utm_medium=post_purchase&utm_campaign=starter_kit_purchase

## Important measurement note

A visit to this page is a **post-purchase-page view**, not an authoritative purchase record.

The page emits:

`gsa_post_purchase_page_view`

Do not rename that event to `purchase` unless purchase confirmation is coming from Gumroad itself, a webhook, or another trusted transaction source.

## Intended customer journey

Purchase completed → purchase download supplied → recruitment confirmation page → grown-up preparation → child receives classified file → Starter Kit induction → Mission 01.

The paid PDF must not be placed on a public website URL merely to make the redirect easier.
