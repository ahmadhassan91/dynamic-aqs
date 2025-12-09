# Dynamic AQS CRM - 4-Week Discovery Roadmap

## Executive Summary

This document outlines a **4-week lean discovery phase** to capture all requirements for the Dynamic AQS CRM project. The discovery follows software industry best practices with a structured approach:

- **8 Sessions Total** (2 per week)
- **60-90 minutes per session**
- **Progressive depth**: Executive → Operational → Field → Validation

---

## Discovery Philosophy

### Lean Discovery Principles
1. **Start with "Why"** - Understand business objectives before features
2. **Top-Down Validation** - Executive alignment → Manager details → User validation
3. **Show, Don't Tell** - Use prototype/wireframes to validate understanding
4. **Document Everything** - Session recordings, notes, action items
5. **Validate Assumptions** - Our USER_PERSONAS.md contains many assumptions marked with ⚠️

### Discovery Goals
| Goal | Deliverable |
|------|-------------|
| Validate personas & workflows | Updated USER_PERSONAS.md |
| Document integrations | Technical Architecture Doc |
| Prioritize features | MoSCoW Feature Matrix |
| Understand data flows | Data Model Diagram |
| Define success metrics | KPI Dashboard Requirements |
| Identify risks | Risk Register |

---

## Stakeholder Mapping

### Primary Stakeholders (Must Attend)

| Stakeholder | Role | Why Needed | Sessions |
|-------------|------|------------|----------|
| **Currie** | VP Training & Operations | Primary sponsor, owns TMs/RMs, training focus | Week 1, 2, 4 |
| **Dan** | VP Operations (Corporate) | IT strategy, integrations, commercial side | Week 1, 3 |
| **Steve** | President - Residential | Executive sign-off, strategic direction | Week 1 |
| **John McNutt** | Dir. Operations & Integration | System integrations, Acumatica, technical | Week 2, 3 |

### Secondary Stakeholders (By Topic)

| Stakeholder | Role | Why Needed | Sessions |
|-------------|------|------------|----------|
| **Michelle** | VP Business Development | Dealer onboarding, lead management | Week 2 |
| **Adrian** | Dir. Strategic Partnerships | Partner workflows, affinity groups | Week 2 |
| **Regional Director (Don)** | Regional Director - East | Team management, reporting needs | Week 2 |
| **Territory Manager (x2)** | Field Operations | Daily workflow validation, mobile app | Week 3 |
| **Dealer (x1-2)** | External Customer | Portal requirements validation | Week 3 |

### RACI Matrix

```
R = Responsible (Does the work)
A = Accountable (Final decision)
C = Consulted (Provides input)
I = Informed (Kept updated)
```

| Decision Area | Currie | Dan | Steve | John | Michelle | TM |
|---------------|--------|-----|-------|------|----------|-----|
| Overall CRM Scope | A | C | A | C | I | I |
| Residential Workflows | A | I | C | C | C | R |
| Commercial Workflows | C | A | I | R | I | I |
| Integrations (Acumatica) | C | A | I | R | I | I |
| Mobile App Features | A | C | I | C | I | R |
| Dealer Portal | C | C | A | C | A | I |
| Training Module | A | I | C | C | C | R |
| Reporting/KPIs | A | A | C | R | C | I |

---

## Week-by-Week Discovery Plan

### 📅 WEEK 1: Strategic Alignment & Vision

**Theme:** *"Understand the WHY before the WHAT"*

#### Session 1: Executive Vision & Pain Points
**Duration:** 90 minutes  
**Day:** Monday or Tuesday  

**Attendees:**
| Must Have | Nice to Have |
|-----------|--------------|
| Steve (President) | Duke/Marty (Owners) |
| Currie (VP Training) | |
| Dan (VP Operations) | |

**Agenda:**
| Time | Topic | Facilitator Notes |
|------|-------|-------------------|
| 0-10 | Welcome & introductions | Set expectations, recording consent |
| 10-30 | Business objectives deep-dive | What does success look like in 12 months? |
| 30-50 | Current pain points | Validate: Reporting, manual entry, tool fragmentation |
| 50-70 | Strategic priorities | What's the #1 thing this CRM must solve? |
| 70-85 | Org structure & decision flow | Validate our org chart, approval chains |
| 85-90 | Wrap-up & next steps | Assign homework if needed |

**Key Questions:**
1. What are the top 3 business problems this CRM must solve?
2. How do you measure success today? What metrics are missing?
3. Why now? What's driving the urgency?
4. What's the risk if we don't change?
5. Who are the change champions vs. resistors?
6. Budget/timeline expectations?

**Deliverables:**
- [ ] Business Objectives Document
- [ ] Success Criteria Definition
- [ ] Validated Org Chart

---

#### Session 2: Current State System Landscape
**Duration:** 90 minutes  
**Day:** Thursday or Friday  

**Attendees:**
| Must Have | Nice to Have |
|-----------|--------------|
| Dan (VP Operations) | IT Support Staff |
| John McNutt (Dir. Ops) | |
| Currie (VP Training) | |

**Agenda:**
| Time | Topic | Facilitator Notes |
|------|-------|-------------------|
| 0-10 | Recap from Session 1 | Align on objectives |
| 10-35 | Current systems inventory | Walk through each tool |
| 35-55 | Integration pain points | What breaks? What's manual? |
| 55-75 | Data flow mapping | Where does data originate? Where does it go? |
| 75-85 | Technical constraints | Security, compliance, hosting preferences |
| 85-90 | Wrap-up | Schedule technical deep-dive |

**Systems to Cover:**
| System | Owner | Discussion Points |
|--------|-------|-------------------|
| Dynamics 365 CRM | Dan | What works? What doesn't? Why leaving? |
| Acumatica ERP | John | Financial data, orders, inventory sync |
| Map My Customer | Currie | Mobile usage, what's missing? |
| Shopify | Michelle | B2B limitations, dealer feedback |
| Outlook 365 | Dan | Email/calendar sync requirements |
| HubSpot | Michelle | Lead source, what data comes in? |
| Widen/Dropbox | Marketing | Asset management pain points |

**Key Questions:**
1. Walk us through a typical order from lead → delivery
2. Where do you spend the most time on manual data entry?
3. What reports take hours that should take minutes?
4. What data do you NOT trust in the current system?
5. What's your single source of truth today?

**Deliverables:**
- [ ] Current Systems Map
- [ ] Integration Requirements Matrix
- [ ] Data Trust Audit

---

### 📅 WEEK 2: Operational Deep-Dive

**Theme:** *"Understand how managers run the business"*

#### Session 3: Sales & Training Operations
**Duration:** 90 minutes  
**Day:** Monday or Tuesday  

**Attendees:**
| Must Have | Nice to Have |
|-----------|--------------|
| Currie (VP Training) | Training Coordinator |
| Regional Director (Don) | |
| John McNutt | |

**Agenda:**
| Time | Topic | Facilitator Notes |
|------|-------|-------------------|
| 0-10 | Week 1 recap | Share preliminary findings |
| 10-30 | Territory management workflow | How are territories assigned? How do they change? |
| 30-50 | Training workflow deep-dive | Scheduling → Delivery → Tracking → Reporting |
| 50-70 | KPI & reporting requirements | What reports do you run weekly/monthly/quarterly? |
| 70-85 | Manager pain points | What takes too long? What's frustrating? |
| 85-90 | Wrap-up | Prep for dealer/field sessions |

**Process Mapping:**
```
Training Workflow to Validate:
1. How is training scheduled today?
2. Who decides which customer gets trained?
3. How is training completion recorded?
4. How does Currie get "trainings this month" number?
5. How are training materials distributed?
```

**Key Questions:**
1. Walk through scheduling a training from request to completion
2. How do you currently track TM performance?
3. What would a "perfect" training report look like?
4. How do you handle trainer certifications/compliance?
5. What visibility do RMs have into their team's activities?

**Deliverables:**
- [ ] Training Workflow Diagram (validated)
- [ ] KPI Requirements Document
- [ ] Report Templates Wishlist

---

#### Session 4: Business Development & Partnerships
**Duration:** 60 minutes  
**Day:** Thursday or Friday  

**Attendees:**
| Must Have | Nice to Have |
|-----------|--------------|
| Michelle (VP Bus Dev) | |
| Adrian (Dir. Partnerships) | |
| Currie (optional) | |

**Agenda:**
| Time | Topic | Facilitator Notes |
|------|-------|-------------------|
| 0-10 | Context setting | Share Week 1-2 learnings |
| 10-25 | Lead-to-customer journey | HubSpot → CRM → Dealer flow |
| 25-40 | Dealer onboarding process | What steps? What documents? Timeline? |
| 40-55 | Affinity groups & partnerships | How are these structured? Special pricing? |
| 55-60 | Wrap-up | |

**Key Questions:**
1. Walk through a new dealer from first contact to first order
2. What information do you need from a new dealer?
3. How long does onboarding typically take? What slows it down?
4. How do affinity groups work? Any special CRM requirements?
5. What dealer communications are manual today?

**Deliverables:**
- [ ] Lead-to-Customer Journey Map
- [ ] Dealer Onboarding Checklist
- [ ] Partnership/Affinity Group Structure

---

### 📅 WEEK 3: Field Operations & User Validation

**Theme:** *"Validate with the people who use it daily"*

#### Session 5: Territory Manager Day-in-Life
**Duration:** 90 minutes  
**Day:** Monday or Tuesday  

**Attendees:**
| Must Have | Nice to Have |
|-----------|--------------|
| Territory Manager #1 | Currie (observer) |
| Territory Manager #2 | Regional Director (observer) |

**Agenda:**
| Time | Topic | Facilitator Notes |
|------|-------|-------------------|
| 0-10 | Introductions | Make TMs comfortable, explain purpose |
| 10-35 | Morning routine | What do you do first? What tools do you open? |
| 35-55 | Field activities | Walk through a typical customer visit |
| 55-75 | End of day | How do you log activities? What takes longest? |
| 75-85 | Mobile app wishlist | Show prototype, gather feedback |
| 85-90 | Wrap-up | |

**Day-in-Life Template:**
```
MORNING (7-9 AM)
- First thing you do?
- How do you plan your day?
- How do you know which customers to visit?

FIELD WORK (9 AM - 4 PM)
- How many customers/day?
- What do you do at each visit?
- How do you log notes/activities?
- How do you complete a training?

EVENING (4-6 PM)
- What admin work do you do?
- How long does data entry take?
- What do you wish was automated?
```

**Key Questions:**
1. Walk through yesterday from start to finish
2. What's the most frustrating part of your day?
3. If you had a magic wand, what would you automate?
4. How do you currently log a training completion?
5. Do you use MapMyCustomer? What works/doesn't work?
6. Show mobile prototype: What's missing? What's confusing?

**Deliverables:**
- [ ] TM Day-in-Life Journey Map (validated)
- [ ] Mobile App Feature Prioritization
- [ ] Pain Points Ranked by Frequency

---

#### Session 6: Dealer Portal & Customer Experience
**Duration:** 60-90 minutes  
**Day:** Thursday or Friday  

**Attendees:**
| Must Have | Nice to Have |
|-----------|--------------|
| Dealer Representative (1-2) | Michelle (observer) |
| Territory Manager (their TM) | John McNutt |

**Agenda:**
| Time | Topic | Facilitator Notes |
|------|-------|-------------------|
| 0-10 | Introductions | Thank dealer for time, explain purpose |
| 10-30 | Current ordering process | Walk through placing an order today |
| 30-50 | Pain points with current portal | What's frustrating? What's missing? |
| 50-70 | Show dealer portal prototype | Gather feedback on proposed design |
| 70-85 | Wishlist prioritization | If you could have 3 things, what would they be? |
| 85-90 | Wrap-up | |

**Key Questions:**
1. Walk through placing a typical order
2. How often do you reorder the same products?
3. What information do you need that's hard to find?
4. How do you track your shipments today?
5. What would make you use the portal more vs. calling your TM?
6. Show prototype: What's missing? What's confusing?

**Deliverables:**
- [ ] Dealer Journey Map
- [ ] Portal Feature Prioritization
- [ ] Dealer Feedback Summary

---

### 📅 WEEK 4: Synthesis & Validation

**Theme:** *"Confirm we heard correctly"*

#### Session 7: Technical Architecture Review
**Duration:** 90 minutes  
**Day:** Monday or Tuesday  

**Attendees:**
| Must Have | Nice to Have |
|-----------|--------------|
| Dan (VP Operations) | Dev Team Lead |
| John McNutt | |
| Currie (optional) | |

**Agenda:**
| Time | Topic | Facilitator Notes |
|------|-------|-------------------|
| 0-10 | Discovery summary | Key findings from Weeks 1-3 |
| 10-30 | Proposed architecture | Present integration approach |
| 30-50 | Acumatica deep-dive | API capabilities, data mapping |
| 50-70 | Security & compliance | Data handling, authentication |
| 70-85 | Technical risks & dependencies | What could go wrong? |
| 85-90 | Wrap-up | |

**Technical Topics:**
| Topic | Questions |
|-------|-----------|
| Acumatica API | REST/SOAP? Rate limits? Real-time or batch? |
| Authentication | SSO? Azure AD? Existing identity provider? |
| Data Sync | Bi-directional? Conflict resolution? Audit trail? |
| Offline/Mobile | What needs to work offline? Sync strategy? |
| Reporting | BI tool integration? Export formats? |

**Deliverables:**
- [ ] Integration Architecture Diagram
- [ ] API Requirements Document
- [ ] Technical Risk Register

---

#### Session 8: Discovery Findings & Prioritization
**Duration:** 90 minutes  
**Day:** Thursday or Friday  

**Attendees:**
| Must Have | Nice to Have |
|-----------|--------------|
| Currie (VP Training) | Steve (President) |
| Dan (VP Operations) | Michelle (VP Bus Dev) |
| John McNutt | |

**Agenda:**
| Time | Topic | Facilitator Notes |
|------|-------|-------------------|
| 0-15 | Discovery summary presentation | Visual overview of all findings |
| 15-35 | Validated personas & workflows | Show updated diagrams |
| 35-55 | Feature prioritization (MoSCoW) | Interactive prioritization exercise |
| 55-70 | Proposed roadmap | Phase 1, 2, 3 recommendations |
| 70-85 | Open questions & decisions needed | Resolve outstanding items |
| 85-90 | Next steps & sign-off | Agree on SOW approach |

**MoSCoW Prioritization Exercise:**
```
MUST HAVE (Phase 1 - MVP)
- [ ] Training tracking & reporting
- [ ] Mobile app for TMs
- [ ] Basic order visibility

SHOULD HAVE (Phase 2)
- [ ] Dealer portal
- [ ] Acumatica integration
- [ ] Advanced reporting

COULD HAVE (Phase 3)
- [ ] AI features (voice-to-text, predictive)
- [ ] Advanced analytics
- [ ] Commercial module

WON'T HAVE (Out of Scope)
- [ ] Items explicitly excluded
```

**Deliverables:**
- [ ] Final Discovery Report
- [ ] Prioritized Feature Backlog
- [ ] Proposed Project Roadmap
- [ ] Risk Register with Mitigations

---

## Discovery Artifacts Checklist

### Documents to Produce

| Artifact | Created In | Owner | Status |
|----------|-----------|-------|--------|
| Business Objectives Document | Week 1 | PM | ⬜ |
| Current Systems Map | Week 1 | Tech Lead | ⬜ |
| Integration Requirements Matrix | Week 1 | Tech Lead | ⬜ |
| Training Workflow Diagram | Week 2 | BA | ⬜ |
| KPI Requirements Document | Week 2 | BA | ⬜ |
| Lead-to-Customer Journey Map | Week 2 | BA | ⬜ |
| TM Day-in-Life Journey | Week 3 | UX | ⬜ |
| Mobile App Feature List | Week 3 | UX | ⬜ |
| Dealer Portal Requirements | Week 3 | BA | ⬜ |
| Integration Architecture Diagram | Week 4 | Tech Lead | ⬜ |
| Final Discovery Report | Week 4 | PM | ⬜ |
| Prioritized Feature Backlog | Week 4 | PM | ⬜ |

### Assumptions to Validate

From our current USER_PERSONAS.md, these assumptions need validation:

| Assumption | Validate With | Session |
|------------|---------------|---------|
| TMs do 3-5 customer visits/day | Territory Managers | Week 3, Session 5 |
| Evening admin takes 1-2 hours | Territory Managers | Week 3, Session 5 |
| Training completion is manual | Currie, TMs | Week 2, 3 |
| MapMyCustomer notes don't sync | TMs | Week 3, Session 5 |
| Dealers want quick reorder | Dealers | Week 3, Session 6 |
| Reports take hours to compile | Currie, RMs | Week 1, 2 |

---

## Session Logistics Template

### Pre-Session Checklist
- [ ] Calendar invites sent (2 weeks ahead)
- [ ] Agenda shared (3 days ahead)
- [ ] Recording consent obtained
- [ ] Screen share/prototype ready
- [ ] Note-taker assigned
- [ ] Backup contact if someone drops

### During Session
- [ ] Start recording
- [ ] Introductions & ground rules
- [ ] Recap previous session (if applicable)
- [ ] Follow agenda but allow flexibility
- [ ] Capture action items in real-time
- [ ] Time-check at midpoint

### Post-Session (Within 24 Hours)
- [ ] Send thank-you email
- [ ] Share session notes
- [ ] Update assumptions log
- [ ] Update artifact documents
- [ ] Schedule any follow-ups needed

---

## Risk Register (Discovery Phase)

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Key stakeholder unavailable | Medium | High | Identify backup, pre-read materials |
| Conflicting requirements | High | Medium | Escalate to Steve/Dan for decision |
| Technical unknowns (Acumatica) | Medium | High | Early technical session, API exploration |
| Scope creep during discovery | High | Medium | Strict agenda, parking lot for future items |
| Assumptions prove wrong | Medium | High | Validate early, adjust approach |

---

## Appendix: Question Bank by Stakeholder

### Executive Level (Steve, Dan)
1. What does success look like in 12 months?
2. What keeps you up at night regarding current systems?
3. How do you make strategic decisions today? What data is missing?
4. What's the budget envelope for this project?
5. Who needs to be involved in final sign-off?

### Operational Level (Currie, Michelle, John)
1. Walk through your typical week - what reports do you run?
2. What takes too long that should be automated?
3. How do you measure your team's performance?
4. What data do you need that you can't get today?
5. If you could fix one thing tomorrow, what would it be?

### Field Level (TMs, RMs)
1. Walk through yesterday from morning to evening
2. How do you plan your route?
3. What's the most frustrating part of your job?
4. How long does admin work take you?
5. What would you do with an extra hour per day?

### External (Dealers)
1. How often do you place orders?
2. What information do you need that's hard to find?
3. How do you prefer to communicate with your TM?
4. What would make the ordering process easier?
5. What other vendor portals do you like? Why?

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 9, 2025 | Discovery Team | Initial roadmap created |

