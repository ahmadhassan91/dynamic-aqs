# Dynamic AQS CRM - Master Documentation Index

**Project:** Custom CRM for Dynamic AQS  
**Client:** Dynamic AQS (Commercial & Residential HVAC)  
**Generated:** November 26, 2025

---

## 📚 Documentation Files

### 1. **PROJECT_BREAKDOWN.csv** 
Complete project breakdown with 300+ tasks

**Columns:**
- Module
- Epic
- Story
- Task
- Dependencies
- Story Points (Fibonacci: 1, 2, 3, 5, 8, 13, 21)
- Sprint (19 sprints total)
- Priority (P0, P1, P2)
- Notes

**Usage:** Import into Jira, Azure DevOps, or Excel for project management

---

### 2. **USER_PERSONAS.md**
Detailed user personas with Mermaid diagrams

**Contains:**
- 11 distinct user personas
- Persona relationship maps
- Access level matrix
- User journey maps
- Goals, pain points, activities for each persona

**Personas Included:**
1. Territory Manager (TM) - 16 users
2. Regional Manager (RM) - 5-6 users
3. VP Training & Operations (C G)
4. VP Business Development (Michelle)
5. VP Operations (Dan)
6. RSM - Territory (Commercial)
7. RSM - Engineering (Commercial)
8. Manufacturer Rep (External)
9. Engineer Contact (External)
10. Dealer/Customer (External)
11. System Administrator

---

### 3. **WORKFLOW_DIAGRAMS.md**
Comprehensive Mermaid flow diagrams

**Contains:**
1. **Residential Lead to Customer Workflow**
   - HubSpot → CIS → Customer Creation → Onboarding
   
2. **Residential Training Workflow**
   - Scheduling → Execution → Completion → Reporting
   
3. **Residential Order Workflow**
   - Shopify → Acumatica → CRM → Notifications
   
4. **Commercial Opportunity Workflow**
   - Prospect → Quote → PO → Shipment → Follow-up
   
5. **Commercial Engineer Rating Workflow**
   - Contact → Interactions → Rating Changes → 5-Star System
   
6. **System Integration Architecture**
   - All external system integrations
   
7. **Notification Flow**
   - Event-driven notification system

---

## 📊 Project Statistics

### Total Breakdown
- **Modules:** 15 major modules
- **Epics:** 85+ epics
- **Stories:** 200+ stories
- **Tasks:** 300+ tasks
- **Sprints:** 19 sprints
- **Duration:** ~38 weeks (9.5 months)
- **Total Story Points:** 1,800+ points

### Module Distribution

| Module | Story Points | Sprints | Priority |
|--------|--------------|---------|----------|
| Core Infrastructure | 89 | 1-2 | P0 |
| Residential CRM | 520 | 2-11 | P0 |
| Commercial CRM | 380 | 15-18 | P0 |
| Integrations | 285 | 4-10 | P0 |
| Dealer Portal | 120 | 11-14 | P1 |
| Mobile App | 155 | 11-15 | P1 |
| Admin & Support | 125 | 2-19 | P0/P1 |
| Testing & Deployment | 126 | 16-19 | P0 |

---

## 🎯 Sprint Planning

### Phase 1: Foundation (Sprints 1-3)
- Core infrastructure
- Database setup
- Authentication
- Customer & territory basics

### Phase 2: Residential Core (Sprints 4-8)
- Lead management
- CIS automation
- Onboarding workflows
- Training scheduling and tracking

### Phase 3: Residential Advanced (Sprints 9-11)
- Reporting engine
- Dashboards
- Dealer portal foundation
- Mobile app foundation

### Phase 4: Integrations (Sprints 4-11 ongoing)
- Acumatica (Priority 1)
- Email/Outlook
- HubSpot
- MapMyCustomers

### Phase 5: Commercial CRM (Sprints 15-18)
- Opportunity management
- Engineer database
- Organization hierarchy
- Rep management
- Commercial reporting

### Phase 6: Polish & Deploy (Sprints 18-19)
- Testing (unit, integration, E2E)
- Performance optimization
- Production deployment
- User training
- Support setup

---

## 🔄 User Flows Summary

### Residential Flows

**Lead → Customer (Primary Flow)**
```
Lead Gen → Discovery Call → CIS Email → Auto-Parse → 
Create Customer → Sync Acumatica → Onboarding → 
Training → First Order → Active Customer
```

**Training Flow**
```
Request → Schedule → Calendar Sync → Notifications → 
Conduct → Complete → Log → Reports
```

**Order Flow**
```
Shopify Order → Acumatica → CRM Sync → Notifications → 
Fulfillment → Shipment → Tracking → Delivered
```

### Commercial Flows

**Opportunity Flow**
```
Identify → Create Opp → Link Stakeholders → 
Prospect → Prelim Quote → Final Quote → PO → 
Manufacturing → Shipment → Won → Follow-ups
```

**Engineer Rating Flow**
```
New Contact → Initial Rating (1-2) → Interactions → 
Positive Outcomes → Rating Increase → Target 5-Star → 
Specification Wins
```

---

## 👥 User Persona Quick Reference

### Residential Division (22 Users)

**Territory Manager (16)** - Field Operations
- Pain: Can't track trainings, manual reports
- Need: Mobile app, training tracking, quick logging

**Regional Manager (5-6)** - Team Management
- Pain: No team reports, manual aggregation
- Need: Team dashboards, roll-up reporting

**VP Training (1)** - Executive
- Pain: Can't answer "how many trainings?"
- Need: Executive dashboards, one-click reports

### Commercial Division (10-15 Users)

**RSM - Territory (2-3)** - Rep Management
- Pain: No rep tracking, manual notes
- Need: Pipeline visibility, mobile voice notes

**RSM - Engineering (2-3)** - Engineer Relationships
- Pain: Can't track rating changes
- Need: 1-5 rating system, interaction timeline

---

## 🔌 Integration Priority Matrix

| Integration | Priority | Sprint | Complexity | Notes |
|-------------|----------|--------|------------|-------|
| **Acumatica ERP** | P0 | 4-7 | High | Critical - source of truth for financials |
| **Email/Outlook** | P0 | 6, 8-9 | Medium | Track emails, calendar sync |
| **HubSpot** | P1 | 4-5 | Medium | Lead import, may replace later |
| **Shopify** | P1 | 9 | Low | Already integrates with Acumatica |
| **MapMyCustomers** | P1 | 7-8 | Medium | Phase 1: integrate, Phase 2: replace |
| **Pricing Tool** | P0 | 16 | High | Commercial only - Excel + Azure SQL |

---

## 📈 Story Point Distribution

### By Priority
- **P0 (Critical):** 1,200 points (~67%)
- **P1 (Important):** 450 points (~25%)
- **P2 (Nice-to-have):** 150 points (~8%)

### By Sprint
- **Early Sprints (1-5):** 450 points (Foundation)
- **Mid Sprints (6-14):** 850 points (Core Features)
- **Late Sprints (15-19):** 500 points (Commercial + Polish)

### Velocity Assumption
- **Team Size:** 5-7 developers
- **Sprint Length:** 2 weeks
- **Target Velocity:** 80-100 points/sprint
- **Actual Duration:** Depends on team capacity

---

## 🎨 Mermaid Diagram Usage

All diagrams in this documentation use Mermaid syntax and can be:

1. **Viewed in GitHub** - Auto-renders Mermaid
2. **Viewed in VSCode** - Install Mermaid Preview extension
3. **Exported to Images** - Use Mermaid Live Editor (mermaid.live)
4. **Embedded in Confluence** - Use Mermaid macro
5. **Used in Presentations** - Export as SVG/PNG

### Example - Viewing in VSCode:
```bash
# Install extension
code --install-extension bierner.markdown-mermaid

# Open file
code docs/WORKFLOW_DIAGRAMS.md

# Preview: Cmd+Shift+V (Mac) or Ctrl+Shift+V (Windows)
```

---

## 📋 CSV Usage Guide

### Import to Jira

1. **Prepare CSV:**
   - Open PROJECT_BREAKDOWN.csv
   - Map columns to Jira fields

2. **Import Steps:**
   ```
   Jira → Settings → System → External System Import → CSV
   Select file → Map fields:
   - Module → Component
   - Epic → Epic Link
   - Story → Summary
   - Task → Description
   - Story_Points → Story Points
   - Sprint → Sprint
   - Priority → Priority
   ```

3. **Create Epics First:**
   - Filter CSV for unique Epics
   - Import as Epic issue type
   - Then import Stories linking to Epics

### Import to Azure DevOps

1. **Use Excel:**
   - Open CSV in Excel
   - Save as .xlsx
   
2. **Import to Azure:**
   ```
   Boards → Backlogs → Import Work Items
   Select Excel file → Map columns:
   - Module → Area Path
   - Epic → Epic
   - Story → User Story
   - Task → Task
   - Sprint → Iteration Path
   ```

### Import to Excel/Google Sheets

1. **Pivot Tables:**
   - By Module → See story points per module
   - By Sprint → See sprint capacity
   - By Priority → See what's critical

2. **Charts:**
   - Burndown chart (story points by sprint)
   - Pie chart (points by module)
   - Gantt chart (sprints timeline)

---

## 🚀 Quick Start Guide

### For Project Managers
1. Review `PROJECT_BREAKDOWN.csv`
2. Import to project management tool
3. Review `docs/WORKFLOW_DIAGRAMS.md` for flows
4. Assign team members based on `docs/USER_PERSONAS.md`

### For Developers
1. Review technical architecture in workflow diagrams
2. Check dependencies in CSV
3. Start with Sprint 1 tasks
4. Follow integration priority matrix

### For Stakeholders
1. Review user personas to see who benefits
2. Check workflow diagrams to understand processes
3. Review CSV for timeline and scope
4. Focus on P0 items for MVP

---

## 📞 Support & Questions

**Documentation Issues:** Check GitHub Issues  
**Project Questions:** Contact Project Lead  
**Technical Questions:** Contact Tech Lead

---

## 🔄 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-26 | AI Assistant | Initial comprehensive documentation |

---

## 📝 Notes

- All story points use Fibonacci sequence (1, 2, 3, 5, 8, 13, 21)
- Sprints are 2-week iterations
- Priority: P0 = Must Have, P1 = Should Have, P2 = Nice to Have
- Dependencies listed are task-level, not epic-level
- Actual sprint dates TBD based on team availability

---

**End of Master Documentation**
