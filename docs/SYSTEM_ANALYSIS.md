# Dynamic AQS CRM - Deep System Analysis

## Executive Summary

Based on extensive discussions with stakeholders, this document provides a comprehensive analysis of the current state, pain points, and requirements for the new CRM system.

---

## Current State Analysis

### 1. **Organizational Structure**

#### Leadership
- **C G (VP of Training & Operations - Residential)**
- **Steve (President - Residential Division)**
- **Michelle (VP of Business Development)**
- **Dan (VP of Operations - Company-wide)** - Former IT company experience with CRM development
- **Regional Managers** → Territory Managers → Field Operations Team (16 people)
- **John McNutt** - Director of Training and Implementation

#### Company Scale
- ~100 employees total
- $50M annual revenue
  - ~$40M Residential
  - ~$15M Commercial
- 1,000+ active customers (residential)
- Manufacturing company based in New Jersey

---

### 2. **Current Technology Stack**

| System | Purpose | Issues | Cost |
|--------|---------|--------|------|
| **MS Dynamics CRM** | Current CRM for both divisions | - Inaccurate data<br>- Poor reporting<br>- Naming convention issues<br>- Manual data entry required<br>- Limited functionality | $600K spent on customization<br>+ ongoing per-seat fees<br>+ vendor lock-in |
| **Acumatica** | ERP (launched Jan 1, 2025) | - New system, still learning<br>- No historical data sync<br>- Manual year-over-year reporting | Subscription |
| **QuickBooks** | Legacy financial system | - Still needed for 2024 historical data<br>- Manual export for reports | N/A |
| **Shopify** | Order portal (Residential) | - Integrates with Acumatica<br>- Data sync issues potential | Subscription |
| **HubSpot** | Lead generation & email campaigns | - Manual CIS entry after lead conversion<br>- Potential for replacement | Subscription (Marketing/Sales tiers) |
| **MapMyCustomers** | Field operations mapping app | - Only 16 users (field ops)<br>- Partial team adoption<br>- Only notes sync to CRM<br>- Training completion not tracked | Subscription (~16 seats) |
| **Dropbox** | File storage - central to operations | Active | Subscription |
| **Widen** | Digital asset management (DAM) | Multi-brand asset management | Subscription |
| **Microsoft 365** | Email, Office, potentially SharePoint | Outlook integration needed | Subscription |

**Total Current Spend**: Estimated $50K-100K+ annually on subscriptions + ongoing vendor customization fees

---

### 3. **Critical Pain Points**

#### A. **Data Accuracy & Integration Issues**
1. **Manual Data Entry** (19 hours/week total)
   - Upload/maintain customer lists: 1 hour/week
   - Daily CRM uploads: 10 hours/week
   - Generate TM sales reports: 4 hours/week
   - Update PE groups: 3 hours/week
   - Monthly reports: 1 hour/week

2. **No System Integration**
   - Acumatica ↔ MS Dynamics: ZERO automation
   - Manual number entry creates discrepancies
   - Reports from Dynamics vs Acumatica don't match
   - Historical QuickBooks data manually merged

3. **Inaccurate Reporting**
   - Revenue numbers inconsistent between systems
   - Cannot track trainings completed
   - Cannot run reports on most activities
   - Naming conventions don't match across systems

#### B. **Missing Functionality**
1. **No Automated Notifications**
   - Email-based task management (reply-all threads)
   - No alerts for new orders, CIS submissions, etc.
   - Manual follow-ups required

2. **No Training Tracking**
   - Field team completes trainings but can't report on them
   - MapMyCustomers training checkbox doesn't sync
   - Only free-text notes available
   - VP of Training can't answer "How many trainings last month?"

3. **Limited Workflow Automation**
   - CIS document arrives → manual entry to both ERP & CRM
   - No automated onboarding sequences
   - No re-engagement workflows
   - Manual process tracking

4. **Poor Mobile Experience**
   - MapMyCustomers only for subset of users
   - No voice-to-text note capture for commercial team
   - No app for residential team (outside MMC)

#### C. **Commercial vs Residential Divide**
- **Completely different workflows**
- **Different stakeholders** (engineers, architects, MEPs vs HVAC dealers, affinity groups)
- **Different sales cycles** (long project-based vs relationship/training-based)
- **Currently forced into same CRM** despite different needs

---

## Requirements Analysis

### 1. **Residential Division Requirements**

#### Key Stakeholders
- Territory Managers (TMs)
- Regional Managers (RMs)
- VP of Training (C G)
- VP of Business Development (Michelle)

#### Data Model Requirements

**Core Entities:**
```
Customer (HVAC Dealer)
├── Assigned to: Territory Manager
├── Assigned to: Regional Manager  
├── Member of: Affinity Group (0 or 1)
├── Member of: Ownership Group (0 or 1)
├── Sells: Brand (1)
└── Relationships: Contacts (People)

Affinity Group
├── Parent of: Multiple Customers
└── Roll-up: Sales, Activities

Ownership Group  
├── Parent of: Multiple Customers
└── Roll-up: Sales, Activities

People (Contacts)
├── Work for: Customer
└── Contact History
```

#### Multi-Dimensional Reporting Required
Sales must be tracked and reported by:
1. Territory Manager
2. Regional Manager
3. Affinity Group (with children roll-up)
4. Ownership Group (with children roll-up)
5. Brand
6. Time period (day, week, month, quarter, year)

#### Process Flows Needed

**1. Lead Generation & Onboarding**
```
Lead Source (Website/Trade Show/Campaign - HubSpot)
↓
Discovery Call scheduled
↓
CIS (Customer Information Sheet) sent
↓
CIS returned via email
↓
[AUTOMATED] → Extract data, create customer in CRM
↓
[AUTOMATED] → Push customer to Acumatica ERP
↓
[AUTOMATED] → Trigger onboarding workflow
↓
Onboarding process (automated checkpoints)
↓
Training scheduled
↓
Training completed (tracked in CRM)
↓
Ongoing relationship management
```

**2. Training Schedule & Tracking**
- Schedule trainings with customers
- Track training completion (not just notes)
- Report on trainings by TM, RM, time period
- Link trainings to customer accounts

**3. Order Management**
```
Order placed (Shopify)
↓
[AUTOMATED] → Syncs to Acumatica
↓  
[AUTOMATED] → CRM reflects order data from Acumatica
↓
[AUTOMATED] → Notifications sent to relevant TM/RM
```

#### MapMyCustomers Replacement/Integration
**Current MMC Functionality:**
- Visual map display of customers
- Route planning for the week
- Voice-to-text note transcription
- Check-ins at customer locations

**Decision Needed:**
- **Option A**: Continue using MMC, improve integration
- **Option B**: Build native mobile app with same functionality

**Recommendation**: Start with integration, Phase 2 custom app

---

### 2. **Commercial Division Requirements**

#### Key Stakeholders
- Regional Sales Managers (RSMs)
  - Territory RSM
  - Engineering RSM
- Dan (VP of Operations)

#### Data Model Requirements

**Core Entities with Parent/Child Relationships:**

```
Manufacturer Rep Firm (Parent)
├── Children: Multiple offices (child rep firms)
├── Contacts: Rep Salespeople
├── Relationships: Engineering Firms they work with
├── Properties:
│   ├── Quota (editable)
│   ├── Quotes Current FY / Last FY
│   ├── POs Current FY / Last FY
│   ├── Shipments Current FY / Last FY
│   └── Access Code
└── Roll-up view: All opportunities from children

Rep Salesperson (Contact)
├── Works for: Rep Firm (child office)
├── Works with: Specific Engineering Firms
├── Responsible for: Target Accounts
└── Activity timeline

Engineering Firm (MEP) (Parent)
├── Children: Multiple offices worldwide
├── Contacts: Engineers with ratings (1-5)
│   ├── 1: Doesn't like Dynamic
│   ├── 2: Just met
│   ├── 3: Presented to
│   ├── 4: Has specified
│   └── 5: Specifies a lot
├── Primary Rep Contact
└── Roll-up view: All opportunities from children

Other Contacts (by type)
├── Building Owners
├── Facility Managers
├── Architects
└── ESCOs

Opportunity (Project)
├── Basic Info:
│   ├── Job Site
│   ├── Building Owner
│   ├── Description
│   ├── Current HVAC System
│   └── Notes
├── Market Segment: (Healthcare, Cannabis, University, etc.)
├── Product Interest
├── Players Involved:
│   ├── Building Owner (company + person)
│   ├── Architect (company + person)
│   ├── Engineering Firm (company + person)
│   ├── Mechanical Contractor (company + person)
│   └── Manufacturer Rep (company + person)
├── Sales Funnel Phase:
│   ├── Prospect
│   ├── Preliminary Quote
│   ├── Final Quote
│   └── PO in Hand
└── Financial Data:
    ├── Quote Amount
    ├── PO Amount
    └── Shipped Amount
```

#### Multi-Dimensional Reporting Required
Reports must support:
1. All opportunities by Engineering Firm (Parent)
2. All opportunities by Engineering Firm (Child)
3. All opportunities by Rep Firm
4. All opportunities by Target Accounts (e.g., specific university)
5. All contacts by rating (1-5)
6. All Quotes/POs/Released for Production by RSM
7. Rep Status Report (printable, sendable)
8. Year-over-year comparisons

#### Process Flows Needed

**1. Opportunity Management**
```
New Opportunity identified
↓
Created in CRM with all players
↓
Prospect → Preliminary Quote
↓
[INTEGRATION] → Quote generated in Pricing Tool (Excel + Azure SQL)
↓
[AUTOMATED] → Quote synced to CRM
↓
Preliminary → Final Quote
↓
Final Quote → PO in Hand
↓
[INTEGRATION] → PO entered in Acumatica ERP
↓
[AUTOMATED] → PO synced to CRM
↓
[AUTOMATED] → Email notification to Territory RSM + Engineering RSM
↓
[INTEGRATION] → Expected Ship Date (ESD) set in Acumatica
↓
[AUTOMATED] → ESD email to all RSMs
↓
[INTEGRATION] → Shipment completed in Acumatica
↓
[AUTOMATED] → Shipment notification with tracking to RSMs + Holly
↓
[AUTOMATED] → Opportunity marked "Won" in CRM
↓
[AUTOMATED] → Follow-up reminders (6 months, 1 year, 3 years)
```

**2. Contact Management & Rating System**
- Easy capture of contacts after meetings (lunch & learns, etc.)
- Voice-to-text note entry via mobile app
- Rate each contact 1-5
- Task sales team to move contacts up the scale
- Track interactions and rating changes

**3. Lead Generation**
```
ASHRAE Booth Visitors
↓
Import to CRM
↓
Filter and assign to RSMs

Website Leads
↓
Create in CRM
↓
Assign to RSMs

Marketing Campaigns (HubSpot or alternative)
↓
Import notes to CRM
```

---

### 3. **Universal Requirements (Both Divisions)**

#### Integration Requirements

**Critical Integrations:**
1. **Acumatica ERP** (Highest Priority)
   - **Residential**: Order data flows FROM Acumatica TO CRM
   - **Commercial**: Quote/PO/Shipment data flows FROM Acumatica TO CRM
   - **Goal**: CRM reflects Acumatica as source of truth
   - **No**: CRM does not write financial data back to Acumatica

2. **Shopify** (Residential only)
   - Order placement
   - Already integrates with Acumatica
   - CRM should pull order data from Acumatica (not directly from Shopify)

3. **Email (Microsoft 365 / Outlook)**
   - Track emails sent to customers in CRM
   - Email notifications for workflows
   - Outlook add-in for quick logging

4. **HubSpot** (Potentially replace)
   - Lead capture
   - Email campaigns
   - **Goal**: Evaluate if custom CRM can replace HubSpot functionality

5. **MapMyCustomers** (Residential, potentially replace)
   - **Phase 1**: Integration
   - **Phase 2**: Evaluate custom mobile app

6. **Pricing Tool** (Commercial only)
   - Current: Excel with Visual Basic + Azure MSSQL Database
   - Quote generation flows to CRM
   - May need API development on pricing tool side

#### Notification & Automation Requirements

**Automated Notifications Needed:**

**Residential:**
- New CIS submitted → assigned TM + RM
- New customer onboarded → training team
- Training scheduled → TM + customer
- Order placed → TM + RM
- Order shipped → TM + RM + customer

**Commercial:**
- New opportunity created → Territory RSM + Engineering RSM
- Quote generated → relevant RSMs
- PO received → Territory RSM + Engineering RSM (with job name, customer PO #, rep salesperson)
- ESD entered → All associated RSMs (with job name, customer PO #, ESD, rep salesperson)
- Shipment completed → All RSMs + Holly (with job name, customer PO #, freight company, tracking #, rep salesperson)
- High-profile job → Territory RSM at 6 months, 1 year, 3 years post-shipment

**Notification Channels:**
- Email (primary)
- In-app notifications
- Potentially: SMS/WhatsApp (future consideration)

#### Reporting & Dashboard Requirements

**Key Principle**: "Every data point should be reportable"

**Dashboard Requirements:**
- **Role-based dashboards** (TM, RM, RSM, VP, President)
- **Customizable** (users can arrange their own view)
- **Real-time data** (or near real-time with acceptable lag)
- **Drill-down capability** (click to see details)
- **Export functionality** (PDF, Excel, CSV)

**Report Types Needed:**
1. **Sales Reports**
   - By time period (day, week, month, quarter, year, YoY)
   - By person (TM, RM, RSM)
   - By organization (Affinity Group, Ownership Group, Rep Firm, Engineering Firm)
   - By market segment (Commercial)
   - By product/brand

2. **Activity Reports**
   - Trainings completed (count, by whom, by customer)
   - Customer visits
   - Opportunities by stage
   - Contact interactions

3. **Pipeline Reports** (Commercial)
   - Opportunities by stage
   - Quote → PO conversion rate
   - Average deal size
   - Sales velocity

4. **Performance Reports**
   - Individual TM/RM/RSM performance
   - Team performance
   - Quota attainment (Commercial)

#### Ease of Use Requirements

**"If it's difficult, people won't use it"**

1. **Intuitive Navigation**
   - Simple, clean interface
   - Not cluttered like current MS Dynamics
   - But not too simple (Core Connect was "maybe too simple")

2. **Easy Data Input**
   - Minimal clicks to add information
   - Voice-to-text capability (especially Commercial)
   - Mobile-friendly input
   - Bulk import capabilities
   - Automated data capture where possible

3. **Easy Data Output**
   - One-click reports
   - Save favorite reports
   - Schedule automated reports
   - Share reports easily

4. **Full Adoption Strategy**
   - Training required but should be minimal
   - Intuitive enough for self-discovery
   - Contextual help/tooltips

---

## Proposed Solution Architecture

### Phase 1: Residential CRM (Priority)

**Scope:**
- Focus on residential division needs
- 22 people in residential (16 field ops)
- Prove value before expanding to commercial

**Why Residential First:**
- Clear stakeholder (C G)
- Defined requirements
- Smaller user base
- Opportunity to demonstrate ROI quickly

**Build with future commercial expansion in mind:**
- Shared infrastructure
- Role-based architecture
- Separate workflows per division

### Phase 2: Commercial CRM (Conditional)

**Scope:**
- Commercial division has significantly different needs
- May be separate CRM or extended system

**Decision Point:**
- After Residential Phase 1 success
- Separate discovery workshop with Dan + commercial team

---

## Cost-Benefit Analysis

### Current State Costs

**Direct Costs:**
- MS Dynamics: $600K spent (sunk cost) + $X/seat/month ongoing
- Third-party customization vendor: Ongoing (estimated $50-150K/year)
- HubSpot: Marketing/Sales subscription (estimated $800-3,200/month = $10K-40K/year)
- MapMyCustomers: 16 seats (estimated $50/seat/month = $9,600/year)
- Acumatica: ERP subscription (committed)
- Shopify: Order portal subscription (estimated $2K-10K/year)

**Estimated Total Current CRM Spend**: $100K-250K/year (recurring)

**Indirect Costs:**
- 19 hours/week manual CRM administration = ~$50K/year in labor (at $50/hour loaded cost)
- Lost sales due to poor data/reporting = Unknown but likely significant
- Reduced customer satisfaction due to poor follow-up = Unknown
- Frustrated employees due to unusable system = Morale cost

**Total Current Cost**: $150K-300K+/year

### Proposed Solution Costs

**One-Time Costs:**
- Discovery Workshop: $5,000 (approved)
- Development (Residential): Estimated $75K-150K
- Development (Commercial, if pursued): Estimated $100K-200K
- Data migration: Included in development
- Training: Included in development

**Recurring Costs:**
- Hosting (AWS/Azure): $500-2,000/month = $6K-24K/year
- Maintenance & support: $2K-5K/month = $24K-60K/year
- Continued HubSpot (if not replaced): $10K-40K/year
- Continued MapMyCustomers (if not replaced): $10K/year

**Total Year 1 Cost**: $80K-160K one-time + $40K-135K/year recurring

**Potential Savings:**
- Eliminate MS Dynamics: Save $50K-150K+/year
- Eliminate third-party vendor: Save $50K-150K/year
- Potentially eliminate HubSpot: Save $10K-40K/year
- Potentially eliminate MapMyCustomers: Save $10K/year
- Reduce manual admin from 19hrs/week to ~5hrs/week: Save $35K/year

**Total Potential Annual Savings**: $155K-385K+/year

**ROI**: 
- Break-even: 6-12 months
- Year 2+ savings: $115K-250K+/year
- Intangible benefits: Better data, happier users, increased sales

---

## Risk Analysis

### Technical Risks
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Acumatica integration complexity | High | Medium | Early API exploration, dedicated integration sprint |
| Data migration issues | High | Medium | Phased migration, extensive testing, parallel run |
| Pricing tool integration (Commercial) | Medium | Medium | Optional for Phase 1, deep dive in discovery |
| User adoption resistance | High | Medium | Change management, training, executive sponsorship |
| Mobile app complexity | Medium | Low | Phase 1: integrate MMC, Phase 2: custom app |

### Business Risks
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Competing with Salesforce evaluation | High | High | Demonstrate unique value, faster timeline, lower cost |
| Scope creep | Medium | High | Clear phases, change control process, regular check-ins |
| Key stakeholder departure | High | Low | Documentation, multiple stakeholder buy-in |
| Timeline expectations unrealistic | Medium | Medium | Clear communication, milestone-based approach |

### Competitive Landscape
**Active Evaluations:**
- Salesforce CRM (with third-party customization)
- Acumatica CRM (limited functionality)
- Custom solution (Clustox)

**Advantage:**
- True customization without vendor lock-in
- Lower long-term cost
- Better integration potential
- No per-seat licensing
- Owned asset vs rented

---

## Success Criteria

### Phase 1 (Residential) Success Metrics

**Operational Metrics:**
1. Manual CRM admin reduced from 19 hours/week to <5 hours/week (75% reduction)
2. 100% of trainings tracked and reportable
3. 95%+ accuracy between CRM and Acumatica financial data
4. <24 hour lag for order data sync

**User Adoption Metrics:**
1. 90%+ of residential team actively using CRM daily
2. Average time to complete common tasks reduced by 50%
3. User satisfaction score >4/5

**Business Impact Metrics:**
1. Time to run reports reduced from hours to minutes
2. Management can answer any data question in <5 minutes
3. Measurable improvement in customer follow-up rates
4. ROI break-even achieved within 12 months

### Phase 2 (Commercial) Success Metrics (If Pursued)
- Similar metrics adapted to commercial workflows
- Opportunity pipeline visibility
- Contact rating system in use
- Automated notifications functioning

---

## Timeline Estimate

### Discovery Phase (Current)
- **Week 1-2**: Prep, research, document questions ✓
- **Week 3**: C G + team calls, gather information ✓
- **Week 4**: Dan + commercial team call (if commercial included)
- **Deliverable**: Comprehensive discovery report, scope document, proposal

### Development Phase 1: Residential MVP (Estimated 12-16 weeks)
- **Weeks 1-2**: Architecture, database design, infrastructure setup
- **Weeks 3-4**: Core CRM entities (customers, contacts, accounts)
- **Weeks 5-6**: Acumatica integration
- **Weeks 7-8**: Lead management, onboarding workflows
- **Weeks 9-10**: Training tracking, reporting
- **Weeks 11-12**: Dashboards, notifications, email integration
- **Weeks 13-14**: MapMyCustomers integration
- **Weeks 15-16**: Testing, refinement, deployment, training

### Development Phase 2: Commercial (If Pursued) (Estimated 14-18 weeks)
- Similar sprint structure adapted to commercial needs

---

## Next Steps

### Immediate Actions
1. ✓ Complete residential requirements gathering (C G, Michelle)
2. ⏳ Gather commercial requirements (Dan + commercial team) - If in scope
3. ⏳ Finalize discovery document with all questions answered
4. ⏳ Technical deep dive on Acumatica API
5. ⏳ Technical deep dive on Pricing Tool integration (if commercial)
6. ⏳ Prepare discovery workshop presentation for Dan + stakeholders

### Decision Points
1. **Include Commercial in initial scope?**
   - Pros: Unified vision, enterprise solution, higher value
   - Cons: More complex, longer timeline, higher cost
   - **Recommendation**: Separate discoveries, decide after residential scope clear

2. **Replace HubSpot or integrate?**
   - Decision after discovery based on HubSpot usage depth

3. **Replace MapMyCustomers or integrate?**
   - **Recommendation**: Phase 1 integrate, Phase 2 evaluate custom app

### Week of Nov 11-15
- Ahmad sends enhanced questions to C G
- C G forwards to Dan + Michelle
- Await responses
- Schedule follow-up call with C G (mid-week)

### Week of Nov 18-22
- Review all answers
- Prepare discovery workshop deck
- Schedule Dan introduction call
- Technical exploration of Acumatica

---

## Conclusion

This is a **highly viable project** with:
- ✅ Clear pain points
- ✅ Motivated stakeholders
- ✅ Quantifiable ROI
- ✅ Executive buy-in
- ✅ Competitive urgency (Salesforce evaluation)

**Key to success:**
1. Phased approach (Residential first)
2. Relentless focus on ease of use
3. Solid Acumatica integration
4. Change management and training
5. Clear success metrics

**Differentiation from competitors:**
- Owned asset vs rental
- No vendor lock-in
- True customization
- Lower long-term cost
- Better integration

The company has already spent $600K+ on MS Dynamics customization and is still unhappy. They are open to alternatives. **This is our opportunity to shine.**

---

**Document Version**: 1.0  
**Last Updated**: November 10, 2025  
**Next Review**: After discovery questions answered
