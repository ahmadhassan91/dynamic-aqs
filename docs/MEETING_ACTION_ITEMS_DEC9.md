# Meeting Action Items - December 9, 2025
## Pre-Demo Alignment Call with Currie

---

## Meeting Summary

### Attendees Tomorrow (Demo Call)
| Name | Title | Focus Areas |
|------|-------|-------------|
| **Michelle** | VP of Business Development | Reports, Lead Management |
| **Adrian** | Director of Strategic Partnerships | Partnerships |
| **Don** | Regional Director (East) | Territory Manager oversight, field operations |
| **John McNutt** | Director of Operations & Business Integration | Operations, system integration |
| **Marty** (possibly) | Owner | Direct, decision-maker |

### Key Takeaways from Call

1. **Commercial is OUT for now** — Focus 100% on Residential
2. **Consignment Module is CRITICAL** — New priority, must be showcased
3. **Dashboard naming** — Current "Dashboard" should be renamed; real dashboard = graphical reports
4. **Territory Management** — Should include Training under it
5. **Digital Asset Management** — Searchable, shareable assets (replace Dropbox/Widen pain)
6. **Kanban drag-drop** — Will be a "wow moment" for leads pipeline
7. **Notifications/Alerts** — Order frequency alerts, consignment tracking alerts
8. **No specific figures** — Remove dollar amounts, percentages from docs

---

## Action Items

### 🔴 CRITICAL - Before Tomorrow's Demo

#### 1. Rename "Dashboard" → More Appropriate Name
**Current:** Dashboard shows a table of contents  
**Expected:** Dashboard = graphical reports, charts, KPIs

**Options:**
- Rename current "Dashboard" → "Home" or "Navigation"
- Create actual Dashboard with graphs/charts
- OR keep current but introduce it correctly in demo

#### 2. Build Consignment Module (POC)
Based on CSV data structure, create basic consignment tracking:

**Data Fields Identified:**
| Field | Description |
|-------|-------------|
| TM | Territory Manager |
| SE # | Service Experts Number |
| Description | Location name |
| Warehouse ID | Unique ID (e.g., C-SE-AUSTI) |
| Inception Date | When consignment started |
| WH | Warehouse type (HN, FB, PR) |
| Type | SE (Service Experts), ASV (Aire Serv), OTH |
| CID | Customer ID |
| City, State | Location |
| WM | Warehouse Manager |
| Email | Contact email |
| Cell | Contact phone |
| **Reconciliation Fields:** |
| Audit Due Date | When audit is due |
| Scheduled Audit Date | When audit scheduled |
| Actual Audit Date | When audit completed |
| Status | Pending, Completed |
| Audit Type | On-Site, Remote |
| Audit Results Returned | Form Completed, Waiting for Reply |
| Outcome | Reconciled, Discrepancy |
| Reason | Items Missing, etc. |
| Activity | PO's Submitted, Waiting for PO, Rcvd PO |
| Action | Follow-up, No Further Action |
| Form | Form reference |
| Last Contact | Date |
| Contacted By | Person |

**Module Features:**
- Consignment Locations Board (list view)
- Location Detail Page
- Inventory Reconciliation Tracking (multiple cycles)
- Status indicators (color-coded)
- Alerts for overdue audits
- Link to Customer Account

#### 3. Move Training Under Territory Management
Per Currie's feedback, Training should be part of Territory Management module.

#### 4. Update Navigation Order
- Move Residential up
- De-emphasize Commercial (or hide)
- Add Consignment module

---

### 🟡 PRESENTATION UPDATES

#### Slides to Keep (Minimal)
1. Clustox intro (1 slide max)
2. What we know about Dynamic (1 slide)
3. Pain points (1 slide with bullet points)
4. Current systems ecosystem (1 slide - visual only)
5. Demo

#### Presentation Tips from Currie
- **Don't read slides** — speak to high points only
- **Less words, more bullets**
- **Get to demo fast** — everyone wants to see it
- **Emphasize:** User experience, efficiency, less frustration
- **Boxes should be same size** (visual symmetry)

#### Discovery Workshop Slide Updates
- Reduce phases (already covered some)
- Add: Duration per phase (60-90 min calls)
- Add: Number of calls per phase
- Add: Who needs to be on each call

---

### 🟢 DOCUMENTATION UPDATES (Post-Demo)

#### Update USER_PERSONAS.md
- Fix Currie spelling
- Dan = Corporate VP of Operations (not residential specific)
- Regional Managers → Regional Directors (title change)
- Add John McNutt: Director of Operations & Business Integration
- Steve = President of Residential (Michelle & Currie report to him)

#### Update WORKFLOW_DIAGRAMS.md
- ✅ Commercial sections removed
- ✅ Specific dollar figures removed
- Add consignment workflow diagram

#### New Document: CONSIGNMENT_MODULE.md
Create detailed spec for consignment tracking module.

---

## Consignment Module Specification

### Overview
Track consignment inventory at dealer locations. Pain point: Currently tracked via shared Dropbox spreadsheet that gets corrupted/messed up.

### User Stories

**As a Territory Manager, I want to:**
- See all consignment locations in my territory
- Know when audits are due
- Log audit results (reconciled or discrepancy)
- Track PO submissions for missing items
- Get alerts for overdue audits

**As a Regional Director, I want to:**
- See all consignment locations across my region
- Dashboard showing audit status (completed, pending, overdue)
- Track which TMs have outstanding follow-ups

**As Admin, I want to:**
- See company-wide consignment overview
- Export reports
- Manage consignment program enrollment

### Data Model

```
ConsignmentLocation {
  id: string
  territoryManagerId: string
  serviceExpertsNumber: string?
  description: string
  warehouseId: string (unique)
  inceptionDate: date
  warehouseType: enum (HN, FB, PR)
  locationType: enum (SE, ASV, OTH)
  customerId: string (FK to Customer)
  city: string
  state: string
  warehouseManager: {
    name: string
    email: string
    phone: string
  }
  reconciliations: ReconciliationCycle[]
  status: enum (Active, Inactive, Pending)
  createdAt: timestamp
  updatedAt: timestamp
}

ReconciliationCycle {
  id: string
  cycleNumber: int
  auditDueDate: date
  scheduledAuditDate: date?
  actualAuditDate: date?
  status: enum (Scheduled, Pending, Completed, Overdue)
  auditType: enum (On-Site, Remote)
  resultsReturned: enum (Form Completed, Waiting for Reply)
  outcome: enum (Reconciled, Discrepancy, Pending)
  reason: string? (Items Missing, etc.)
  activity: enum (PO Submitted, Waiting for PO, Rcvd PO, N/A)
  action: enum (Follow-up, No Further Action)
  formReference: string?
  lastContactDate: date?
  contactedBy: string?
  notes: string?
}
```

### UI Mockup Plan

#### 1. Consignment Dashboard
- Summary cards: Total Locations, Audits Due This Week, Overdue, Pending POs
- Map view of consignment locations
- Recent activity feed

#### 2. Consignment Locations List
- Filterable by: TM, Status, Warehouse Type, State
- Columns: Location, TM, Next Audit Due, Status, Last Audit Outcome
- Quick actions: View, Schedule Audit, Log Result

#### 3. Location Detail Page
- Location info card
- Customer link
- Warehouse manager contact
- Reconciliation history (timeline)
- Schedule new audit button
- Log audit results form

#### 4. Audit Form
- Audit type (On-Site/Remote)
- Outcome (Reconciled/Discrepancy)
- If discrepancy: Reason, Items missing
- Activity tracking
- Next action required
- Notes

---

## Technical Implementation Plan

### Phase 1: Basic Consignment Module (For Demo)
**Timeline: Today**

1. Create `/src/app/consignment/` folder structure
2. Add navigation item
3. Build basic list view with mock data from CSV
4. Build detail page skeleton
5. Add to sidebar navigation

### Phase 2: Full Implementation (Post-Demo)
**Timeline: During development sprints**

1. Database schema
2. API endpoints
3. Full CRUD operations
4. Alerts/notifications integration
5. Reporting integration
6. Customer record integration

---

## Demo Flow for Tomorrow

### Suggested Order (per Currie)
1. **Brief Intro** (3-5 min)
   - Clustox credibility (1 slide)
   - What we know about Dynamic (1 slide)
   - Pain points summary (1 slide)

2. **Demo** (40-45 min)
   - Home/Navigation overview
   - **Dashboard** (graphical reports) — Michelle will love this
   - **Leads Pipeline** — show Kanban drag-drop (wow moment)
   - **Territory Management**
     - Account Management
     - Training (within territory)
   - **Consignment** (NEW) — very relevant, current pain
   - **Digital Asset Management** — searchable, shareable
   - **Notifications & Alerts** — order frequency, consignment alerts

3. **Next Steps** (5-10 min)
   - Discovery workshop phases
   - Timeline expectations
   - Q&A

### Key Demo Talking Points
- "Everything is customizable"
- "This is based on limited information we've gathered"
- "The final product will look different based on your input"
- Emphasize: **User experience**, **efficiency**, **less frustration**
- AI capabilities (prediction, trends, forecasting)

---

## Budget Discussion Notes (If Asked)

Currie's guidance:
- He told stakeholders: "Several hundred thousand dollars"
- He wants us to quote around $275K
- He'll tell them ~$350K (to exceed expectations)
- Timeline: ~5-6 months realistic, tell them 8 months for beta

**DO NOT volunteer specific numbers tomorrow.** If asked, defer to Currie or say "We'll finalize during discovery."

---

## Post-Meeting Tasks

1. ✅ Send updated workflow diagrams to Currie
2. ✅ Make persona corrections (spelling, titles, org structure)
3. ⏳ Build consignment module POC
4. ⏳ Update presentation slides
5. ⏳ Send Currie final materials for review today

---

## Files to Create/Update

| File | Action | Priority |
|------|--------|----------|
| `/src/app/consignment/page.tsx` | Create | 🔴 Critical |
| `/src/app/consignment/[id]/page.tsx` | Create | 🔴 Critical |
| `/src/components/consignment/*` | Create | 🔴 Critical |
| `/docs/CONSIGNMENT_MODULE.md` | Create | 🟡 Medium |
| `/docs/USER_PERSONAS.md` | Update titles | 🟡 Medium |
| `/docs/WORKFLOW_DIAGRAMS.md` | Add consignment flow | 🟡 Medium |
| Presentation slides | Trim down | 🔴 Critical |
