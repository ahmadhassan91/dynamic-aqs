# Dynamic AQS CRM - Visual Quick Reference

## System Overview Map

```mermaid
mindmap
  root((Dynamic AQS CRM))
    Residential Division
      Customer Management
        Territory Assignment
        Affinity Groups
        Ownership Groups
      Lead Management
        HubSpot Integration
        CIS Automation
        Onboarding Workflow
      Training Management
        Scheduling
        Completion Tracking
        Certification
      Reporting
        TM Reports
        RM Reports
        VP Dashboards
    Commercial Division
      Opportunity Management
        Pipeline Kanban
        Stakeholder Linking
        Quote Integration
      Contact Management
        Engineer Database
        1-5 Star Rating
        Interaction Timeline
      Organization Hierarchy
        Rep Firms
        Engineering Firms
        Parent-Child Rollup
      Commercial Reporting
        RSM Dashboards
        Rep Performance
        Pipeline Analytics
    Integrations
      Acumatica ERP
        Customer Sync
        Order Sync
        Financial Sync
      Email Outlook
        Email Tracking
        Calendar Sync
      HubSpot
        Lead Import
      MapMyCustomers
        Activity Sync
      Pricing Tool
        Quote Import
    Cross-Cutting
      Notifications
        Email Alerts
        In-App Notifications
        Automated Workflows
      Mobile App
        iOS Android
        Voice Notes
        Quick Logging
      Dealer Portal
        Product Catalog
        Order Management
        Account Info
      Admin
        User Management
        System Health
        Data Quality
```

## Technology Stack

```mermaid
graph TB
    subgraph "Frontend"
        A[Next.js 14 App Router]
        B[TypeScript]
        C[Mantine UI v7]
        D[Tabler Icons]
    end
    
    subgraph "Backend"
        E[Next.js API Routes]
        F[PostgreSQL]
        G[Prisma ORM]
        H[NextAuth.js]
    end
    
    subgraph "Mobile"
        I[React Native]
        J[React Navigation]
    end
    
    subgraph "Infrastructure"
        K[AWS/Azure]
        L[Docker]
        M[CI/CD GitHub Actions]
    end
    
    A --> E
    E --> F
    F --> G
    E --> H
    
    style A fill:#61dafb
    style F fill:#336791
    style I fill:#61dafb
    style K fill:#FF9900
```

## Sprint Timeline Gantt

```mermaid
gantt
    title Dynamic AQS CRM Development Timeline
    dateFormat  YYYY-MM-DD
    section Foundation
    Infrastructure Setup           :2025-01-06, 2w
    Auth & Database               :2025-01-20, 2w
    
    section Residential Core
    Customer & Territory          :2025-02-03, 2w
    Lead & CIS Automation        :2025-02-17, 4w
    Training Management          :2025-03-17, 4w
    
    section Integrations
    Acumatica Integration        :2025-02-17, 6w
    Email & HubSpot              :2025-03-31, 4w
    
    section Residential Advanced
    Reporting Engine             :2025-04-14, 4w
    Dashboards                   :2025-05-12, 2w
    
    section Dealer Portal
    Dealer Foundation            :2025-05-26, 6w
    
    section Commercial
    Opportunity Management       :2025-07-07, 4w
    Contact & Org Management     :2025-08-04, 4w
    
    section Finalization
    Testing & QA                 :2025-09-01, 4w
    Deployment & Training        :2025-09-29, 2w
```

## User Access Hierarchy

```mermaid
graph TD
    A[System Admin<br/>Full Access] --> B[VP Operations - Dan<br/>Company-wide View]
    
    B --> C[VP Training - C G<br/>Residential Division]
    B --> D[VP Business Dev - Michelle<br/>Lead Generation]
    
    C --> E[Regional Managers<br/>Team Data]
    E --> F[Territory Managers<br/>Own Territory]
    
    B --> G[RSM - Territory<br/>Rep Management]
    B --> H[RSM - Engineering<br/>Engineer Management]
    
    F --> I[Dealers<br/>Own Account Only]
    G --> J[Manufacturer Reps<br/>Own Data]
    H --> K[Engineer Contacts<br/>Limited Access]
    
    style A fill:#ff6b6b
    style B fill:#4ecdc4
    style C fill:#45b7d1
    style D fill:#45b7d1
    style E fill:#96ceb4
    style F fill:#dfe6e9
    style G fill:#ffeaa7
    style H fill:#ffeaa7
```

## Data Flow Architecture

```mermaid
flowchart LR
    subgraph "External Sources"
        A1[HubSpot<br/>Leads]
        A2[CIS Email<br/>Customer Info]
        A3[Shopify<br/>Orders]
    end
    
    subgraph "CRM Processing"
        B1[Lead<br/>Management]
        B2[Customer<br/>Creation]
        B3[Order<br/>Processing]
    end
    
    subgraph "Acumatica ERP"
        C1[Customer<br/>Master]
        C2[Order<br/>Master]
        C3[Financial<br/>Data]
    end
    
    subgraph "CRM Database"
        D1[Customers]
        D2[Activities]
        D3[Reports]
    end
    
    A1 --> B1
    A2 --> B2
    A3 --> B3
    
    B2 --> C1
    B3 --> C2
    
    C1 -.Sync.-> D1
    C2 -.Sync.-> D1
    C3 -.Sync.-> D3
    
    B1 --> D1
    D1 --> D2
    D2 --> D3
    
    style C1 fill:#e3f2fd
    style C2 fill:#e3f2fd
    style C3 fill:#e3f2fd
    style D1 fill:#c8e6c9
    style D3 fill:#fff9c4
```

## Module Dependency Map

```mermaid
graph TD
    CORE[Core Infrastructure<br/>Sprint 1-2] --> RES_CUST[Residential Customer<br/>Sprint 2-3]
    CORE --> TERR[Territory Mgmt<br/>Sprint 2-3]
    CORE --> ACU[Acumatica Integration<br/>Sprint 4-7]
    
    RES_CUST --> LEAD[Lead Management<br/>Sprint 4-5]
    RES_CUST --> TRAIN[Training Mgmt<br/>Sprint 7-8]
    
    LEAD --> CIS[CIS Automation<br/>Sprint 5]
    CIS --> ONBOARD[Onboarding<br/>Sprint 6]
    
    TRAIN --> CERT[Certification<br/>Sprint 8]
    
    ACU --> ORDER[Order Sync<br/>Sprint 6]
    ACU --> FIN[Financial Sync<br/>Sprint 6-7]
    
    RES_CUST --> REPORT[Reporting Engine<br/>Sprint 9-10]
    TERR --> REPORT
    TRAIN --> REPORT
    ORDER --> REPORT
    FIN --> REPORT
    
    REPORT --> DASH[Dashboards<br/>Sprint 10-11]
    
    CORE --> COMM[Commercial CRM<br/>Sprint 15-18]
    COMM --> COMM_REP[Commercial Reports<br/>Sprint 17-18]
    
    CORE --> DEALER[Dealer Portal<br/>Sprint 11-14]
    CORE --> MOBILE[Mobile App<br/>Sprint 11-15]
    
    style CORE fill:#e3f2fd
    style ACU fill:#ffebee
    style REPORT fill:#fff9c4
    style DASH fill:#c8e6c9
    style COMM fill:#fce4ec
```

## Key Metrics Dashboard Concept

```mermaid
graph TB
    subgraph "Territory Manager Dashboard"
        TM1[My Customers<br/>125 Active]
        TM2[This Month<br/>12 Trainings]
        TM3[This Quarter<br/>$245K Revenue]
        TM4[This Week<br/>15 Activities]
    end
    
    subgraph "Regional Manager Dashboard"
        RM1[Team Performance<br/>4 TMs]
        RM2[Territory Health<br/>85% Active]
        RM3[Team Revenue<br/>$1.2M YTD]
        RM4[Training Completion<br/>92%]
    end
    
    subgraph "VP Executive Dashboard"
        VP1[Division Revenue<br/>$40M Annual]
        VP2[Customer Count<br/>1,247 Active]
        VP3[Training KPI<br/>156 This Month]
        VP4[Pipeline Health<br/>$8.5M]
    end
    
    subgraph "RSM Commercial Dashboard"
        RSM1[Pipeline Value<br/>$12M]
        RSM2[Active Opps<br/>45]
        RSM3[Win Rate<br/>62%]
        RSM4[Engineer Ratings<br/>Avg 3.8/5]
    end
    
    style TM1 fill:#e3f2fd
    style RM1 fill:#fff9c4
    style VP1 fill:#c8e6c9
    style RSM1 fill:#fce4ec
```

## Priority Matrix

```mermaid
quadrantChart
    title Feature Priority Matrix
    x-axis Low Impact --> High Impact
    y-axis Low Effort --> High Effort
    quadrant-1 Do Later
    quadrant-2 Quick Wins
    quadrant-3 Fill Ins
    quadrant-4 Major Projects
    
    Acumatica Integration: [0.9, 0.8]
    Training Tracking: [0.85, 0.3]
    Lead Management: [0.8, 0.5]
    Mobile App: [0.75, 0.7]
    Dealer Portal: [0.6, 0.6]
    Report Builder: [0.85, 0.6]
    AI Lead Scoring: [0.5, 0.7]
    MapMyCustomers Alt: [0.4, 0.8]
    Email Integration: [0.7, 0.4]
    Notifications: [0.8, 0.3]
```

## Cost Savings Comparison

```mermaid
pie title Annual Cost Comparison
    "Current MS Dynamics" : 150
    "Third-party Vendor" : 100
    "Other Subscriptions" : 50
    "Custom CRM (Proposed)" : 60
```

## Development Team Structure

```mermaid
graph TB
    PM[Project Manager<br/>Oversees delivery]
    
    FE1[Frontend Lead<br/>Next.js React]
    FE2[Frontend Dev<br/>UI Components]
    FE3[Frontend Dev<br/>Mobile RN]
    
    BE1[Backend Lead<br/>APIs Database]
    BE2[Backend Dev<br/>Integrations]
    
    QA[QA Engineer<br/>Testing]
    
    UX[UX Designer<br/>Design System]
    
    PM --> FE1
    PM --> BE1
    PM --> QA
    PM --> UX
    
    FE1 --> FE2
    FE1 --> FE3
    
    BE1 --> BE2
    
    style PM fill:#ff6b6b
    style FE1 fill:#4ecdc4
    style BE1 fill:#45b7d1
    style QA fill:#ffeaa7
    style UX fill:#dfe6e9
```

---

## 📊 Quick Stats

| Metric | Value |
|--------|-------|
| **Total Modules** | 15 |
| **Total Story Points** | 1,800+ |
| **Sprints** | 19 (38 weeks) |
| **User Personas** | 11 |
| **External Integrations** | 6 |
| **Expected Team Size** | 5-7 developers |
| **Estimated Cost Savings** | $115K-250K/year |
| **ROI Timeframe** | 6-12 months |

---

## 🎯 Success Criteria

```mermaid
graph LR
    A[Manual Work<br/>19 hrs/week] -->|89% Reduction| B[Manual Work<br/>2 hrs/week]
    C[Training Tracking<br/>0%] -->|100% Tracked| D[Training Tracking<br/>100%]
    E[Data Accuracy<br/>75%] -->|+20%| F[Data Accuracy<br/>95%]
    G[Report Time<br/>Hours] -->|99.5% Faster| H[Report Time<br/>Seconds]
    
    style B fill:#c8e6c9
    style D fill:#c8e6c9
    style F fill:#c8e6c9
    style H fill:#c8e6c9
```

---

**For complete details, see:**
- `PROJECT_BREAKDOWN.csv` - Full task breakdown
- `USER_PERSONAS.md` - Detailed personas
- `WORKFLOW_DIAGRAMS.md` - Process flows
- `PROJECT_DOCUMENTATION_MASTER.md` - Master index
