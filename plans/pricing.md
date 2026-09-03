# Kerb2Kerb launch pricing — September 2026

Every price here sits **above your cost floor** and **inside the Southampton
market range**, priced to win a first booking rather than maximise margin.
Raise after the first 5–10 jobs and a couple of reviews.

## 1. Your cost floor (the numbers every price is checked against)

Assumptions — correct these and I'll rerun:

| Input | Assumed | Source / note |
|---|---|---|
| Diesel | 184p/litre | UK average, early Sept 2026 ([Fuel Finder](https://www.fuel-finder.uk/uk-fuel-price-index)) |
| Van economy | ~42 mpg | 2019 Citroën Dispatch (BlueHDi); real-world estimate — a fuel receipt + odometer check will pin it |
| Fuel cost | **£0.20/mile** | 184p × 4.546 ÷ 42 |
| Wear, tyres, servicing | £0.12/mile | standard van rule of thumb |
| Insurance (GIT + hire & reward) | ~£0.22/mile | assumes ~£1,800/yr over ~8,000 business miles — tell me the real premium |
| **All-in running cost** | **~£0.54/mile** | every price in this sheet was set against £0.58, so each carries a little more margin than stated |
| Your time | **£20/hour** | floor, not target — below this you're better off on Flex |

Every job is a **round trip** for you, so cost = (one-way miles × 2 × £0.58) + (hours × £20). That's the floor. A job priced under it loses money even before you've counted the phone calls.

## 2. Market check (what Southampton customers currently pay)

- Man & van: **£30–55/hr, avg ~£40**, nearly everyone has a **2-hour minimum** (£60–110 for the smallest job); typical small local job £48–130 ([howmuchshoulditcost](https://howmuchshoulditcost.co.uk/man-and-van/southampton/), [AnyVan](https://www.anyvan.com/man-and-van/man-and-van-southampton), [Hello Vans](https://hellovans.com/man-with-a-van/southampton/))
- Student moves: 1-bed flat £250–400 via removal firms; man-and-van from £35–45/hr ([Giant Van](https://www.giantvan.com/student-removals/university-of-southampton), [TowManVan](https://www.towmanvan.co.uk/man-and-van-southampton))
- Cruise terminal, local: taxi £8–18 from Central station, £15–22 from the airport — that's a *car with a boot*, not a van ([londonairport-taxi](https://londonairport-taxi.com/taxi-fare-southampton-train-station-to-cruise-terminal))
- Heathrow ↔ Southampton cruise, private: **£150 saloon → £200 minibus**, fixed price ([BA Transfer](https://batransfer.com/heathrow-airport-to-southampton-cruise-terminal))
- Same-day courier van: **£30–40 minimum, £1.10–1.70/mile** ([Dispatchit](https://www.dispatchit-couriers.co.uk/7/Courier-Rates/), [Speedy](https://speedysamedaycourier.com/best-same-day-courier-in-southampton/), [Taylor's](https://taylorscourierservice.com/services/van-courier/southampton))

## 3. The prices

### For the calculator (callout + per-mile, one-way miles)

| Job type | Callout | Per mile | Minimum | Examples |
|---|---|---|---|---|
| **Cruise port transfer** | **£20** | **£1.20** | £25 | SO14–SO19 → terminal ≈ £25–30 · Eastleigh/Totton ≈ £32 · Fareham ≈ £35 · Portsmouth/Winchester ≈ £42–45 |
| **Airport run** | **£25** | **£1.90** | £35 | Southampton Airport ≈ £35 · Bournemouth ≈ £80 · **London airports are fixed-price, not per-mile: Heathrow £245 / Gatwick £265** (see long-distance rule below) |
| **Luggage / parcel** | **£20** | **£1.20** | £25 | across the city ≈ £25–30 · Portsmouth ≈ £45 |

Why airport per-mile is higher: a Heathrow run is 150 miles and ~3.5 hours of your day *round trip* — the floor alone is ~£157. Passenger transfers charge £150–200 for a car; you're carrying bags only, so £165 for up to 6 cases is fair and easy to say. (For local airport/cruise bag runs, the per-bag rule below applies instead.)

### Per bag or per journey? (cruise & airport — luggage only, never passengers)

**Kerb2Kerb carries luggage and goods only. No passenger ever rides in the
van.** The customer travels separately; their bags meet them at the terminal
(or come home from it). That's the same model as [AirPortr](https://airportr.com/en/see-prices/)
(£35+/bag) — you're the local, cheaper, same-person version of it. It also
means no private-hire licence question: hire & reward + goods-in-transit
cover is the right insurance, and the site already says so.

| Job | How to price | Numbers |
|---|---|---|
| **Local luggage run** (≤ 15 miles: home/hotel → cruise terminal or Southampton Airport, halls → home, anywhere in the city) | **Per bag.** Prices *higher* than a mileage rate on small runs, and it's how customers think about bags. **£12 per bag, £30 minimum.** A large box or awkward item counts as a bag. | 2 bags £30 · 4 bags £48 · 6 bags £72. Floor for a 5-mile run is ~£21. |
| **Long-distance luggage run** (Heathrow / Gatwick / London ↔ Southampton) | **Per journey, not per bag** — the cost is the 150-mile round trip, not the bags. **£245 Heathrow / £265 Gatwick, up to 6 bags, +£5 each after.** | A London run is ~4 hours; if it displaces an Amazon Flex day (£172) the price must clear £172 + ~£87 running cost ≈ £260. £245/£265 always beats the alternative, and London→cruise passengers already pay £150–200 for a car *without* luggage. |

Rule of thumb: **under 15 miles, count the bags; over 15 miles, price the
journey.** The calculator's callout + per-mile is the *journey* price — use
it for distance runs and full van-loads; for local bag runs, quote per bag.

The calculator has no bag-count field, so per-bag quotes are done by hand for
now. If it comes up often, a "number of bags" input is a small job for the
dev pipeline later — not this month.

### Quoted by hand (not in the calculator)

| Job type | Price | Floor check |
|---|---|---|
| **Student halls move-in** (the headline this month) | **£35 flat** anywhere in Southampton, one van-load, you help carry. From outside the city: **+£1.20/mile** (Winchester ≈ +£15, Portsmouth ≈ +£25, Bournemouth ≈ +£35) | ~45 min + 10 mi ≈ £21 — fine, and it undercuts every 2-hour-minimum competitor (£60+) |
| **Home & office removals** | **£35/hour, 2-hour minimum (£70)**, +£1.20/mile beyond 10 miles. Quote a fixed price after a photo of the load. | £40/hr market avg; you're just under, still £15/hr over floor after running costs |
| **Priority business courier** (same-day) | **£35 minimum + £1.50/mile** one-way | 20-mile job = £65 vs ~£43 floor; sits inside the £30–40 min / £1.10–1.70 range |

### Edge rules the quote tool enforces (decided 2026-09-03 after testing)

- **Student £35 flat needs BOTH ends inside Southampton** (SO14–SO19). A
  Southampton family sending their kid to Portsmouth or Winchester halls
  is a 40-mile round trip — it's £35 + £1.20/mile for the leg outside the
  city, not £35.
- **Bag count is capped at 40** in the tool; more than that is a
  hand-quote ("WhatsApp me"). Stops nonsense like 99,999 bags = £1.2m.
- **Service radius is 25 miles from Southampton centre** for pricing;
  beyond that the tool says "outside my usual area — WhatsApp me". London
  airport runs are the exception (fixed price, pickup within 25 miles).
- **The 15-mile cliff is deliberate**: under 15 miles you pay per bag; over
  it you pay the journey price regardless of bags (20 bags from Portsmouth
  = £43). If that ever feels wrong on a real job, quote by hand.

### Rules that keep it simple on WhatsApp

- **Quote a single number, not a formula.** Use the table to work it out, send "£35, door to door, that's everything."
- **No VAT** — you're under the threshold, so prices are what the customer pays. Say so if asked; it's a selling point vs. firms quoting +VAT.
- **Waiting time**: first 15 min free, then £10 per 15 min. Only matters for cruise/airport — mention it up front, never spring it.
- **Cash or bank transfer on completion** for now. No deposits until you've got a no-show problem.
- **First 10 jobs**: after each one, ask for a review. That's worth more than an extra £5 on the price.

## 4. Copy-paste quote lines

- Student: *"£35 door to door anywhere in Southampton, I'll help carry, one van-load. Just text me the day and time."*
- Cruise (city, luggage only): *"£12 a case, £30 minimum. I collect from your door and your bags are at the terminal before you are — you travel light. I'll message when they're dropped."*
- Heathrow (luggage only): *"£245 fixed for up to 6 bags, door to terminal. You travel however you like; your luggage is waiting for you. No meters, no surprises."*

**The opportunity-cost rule (James, 2026-09-03):** any job that takes most of a day has to beat a Flex day — **£172 + running costs** — or it's not worth doing. Local jobs fit around shifts so this doesn't apply to them; London runs do.

**Payment**: bank transfer or cash on completion. Add a SumUp/Stripe card link after ~10 jobs; no deposits until no-shows are a real problem.
- Courier: *"£35 minimum then £1.50 a mile, same day, one driver the whole way. Send me the postcodes and I'll give you the exact number."*

## 5. When to raise

- After **5 completed jobs + 2 reviews**: student flat £35 → £45, cruise callout £20 → £25.
- After **the first repeat customer**: airport per-mile £1.90 → £2.10 (Heathrow ≈ £180).
- Removals to £40/hr once you're turning work away.
