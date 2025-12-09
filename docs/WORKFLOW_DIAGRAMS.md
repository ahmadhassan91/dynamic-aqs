# Workflow Diagrams - Dynamic AQS CRM


### Core Pain Points to Solve
1. **"How many trainings did we do?"** — Currently requires calling each TM individually
2. **Manual data entry** — CIS forms, order tracking, activity logging
3. **Report accuracy** — Dynamics CRM doesn't match Acumatica numbers
4. **No unified calendar** — Can't see where trainers are scheduled
5. **Outlook not integrated** — Emails/calls not auto-tracked to CRM
6. **Shopify limitations** — B2C platform forced to work for B2B

### Key Integrations Required
| System | Integration Type | Priority |
|--------|-----------------|----------|
| **Acumatica ERP** | 2-way sync (financial data, orders, inventory) | Critical |
| **Outlook 365** | Graph API (emails, calendar, contacts auto-sync) | High |
| **HubSpot** | Lead sync (incoming leads → CRM) | High |
| **Widen/S3** | Asset management with single-source sync | Medium |

### Mobile App Requirements (Replace Map My Customer)
- Voice-to-text: *"I just met with Mark Santos..."* → auto-populates record
- Training scheduling and completion tracking
- Customer visit logging with photos
- Offline capability for field work
- Route planning / territory map

---

## Business Objectives & Value Proposition

### Strategic Business Objectives

```mermaid
mindmap
  root((Dynamic AQS<br/>Business Goals))
    Operational Excellence
      Real-time Reporting
      Eliminate Manual Entry
      Unified Data Source
    Revenue Growth
      Faster Dealer Onboarding
      Better Lead Conversion
      Improved Sales Visibility
    Cost Reduction
      Replace Legacy Dynamics CRM
      Eliminate Tool Fragmentation
      Reduce Admin Overhead
    Customer Experience
      B2B Dealer Portal
      Real-time Order Tracking
      Self-service Account Access
```

### Value Chain: Objectives → Features → Outcomes

```mermaid
flowchart LR
    subgraph OBJ ["🎯 Business Objectives"]
        O1[Accurate Reporting]
        O2[Sales Productivity]
        O3[Cost Reduction]
        O4[Customer Experience]
    end
    
    subgraph PAIN ["❌ Current Pain Points"]
        P1["'Call each TM for training count'"]
        P2["Manual data entry everywhere"]
        P3["High cost on Dynamics CRM"]
        P4["Shopify = B2C for B2B"]
    end
    
    subgraph FEAT ["✅ CRM Features"]
        F1[Unified Dashboard<br/>+ One-Click Reports]
        F2[Mobile App<br/>+ Voice-to-Text]
        F3[Custom Platform<br/>You Own It]
        F4[Dealer Portal<br/>B2B Native]
    end
    
    subgraph VALUE ["💰 Value Delivered"]
        V1["Hours → Seconds<br/>for Reports"]
        V2["Time Saved<br/>per TM"]
        V3["No Vendor Lock-in<br/>Lower TCO"]
        V4["Majority of Sales<br/>Better Experience"]
    end
    
    O1 --> P1 --> F1 --> V1
    O2 --> P2 --> F2 --> V2
    O3 --> P3 --> F3 --> V3
    O4 --> P4 --> F4 --> V4
```

### Value-Driven Core Features

#### 1. Unified Reporting Dashboard
```mermaid
flowchart TB
    subgraph BEFORE ["❌ Before: Manual Aggregation"]
        Q1["'How many trainings<br/>last month?'"]
        Q1 --> Call1[Call TM #1]
        Q1 --> Call2[Call TM #2]
        Q1 --> Call3[Call TM #3]
        Q1 --> Call16[Call TM #16...]
        Call1 --> Excel[Manual Excel<br/>Compilation]
        Call2 --> Excel
        Call3 --> Excel
        Call16 --> Excel
        Excel --> Report[Report Ready<br/>⏱️ Hours/Days]
    end
    
    subgraph AFTER ["✅ After: One-Click Reports"]
        Q2["'How many trainings<br/>last month?'"]
        Q2 --> Click[Click Dashboard]
        Click --> Auto[Auto-Generated<br/>Real-Time Data]
        Auto --> Report2[Report Ready<br/>⏱️ Seconds]
    end
    
    style BEFORE fill:#ffebee
    style AFTER fill:#e8f5e9
    style Report fill:#ffcdd2
    style Report2 fill:#c8e6c9
```

**Value:** Executive decisions made in seconds, not days.

---

#### 2. Acumatica Integration (Single Source of Truth)
```mermaid
flowchart TB
    subgraph BEFORE ["❌ Before: Data Discrepancies"]
        ACU1[(Acumatica<br/>Source Data)]
        DYN1[(Dynamics CRM<br/>Different Data)]
        MANUAL["Manual Entry<br/>= Human Error"]
        ACU1 -.->|Manual Copy| MANUAL
        MANUAL -.->|Delayed| DYN1
        DIFF["❓ Which is correct?<br/>Data mismatch!"]
    end
    
    subgraph AFTER ["✅ After: Automatic Sync"]
        ACU2[(Acumatica<br/>Source of Truth)]
        CRM2[(Custom CRM<br/>Reflects Data)]
        ACU2 <-->|2-Way API Sync| CRM2
        MATCH["✓ Always Accurate<br/>Real-Time Match"]
    end
    
    style BEFORE fill:#ffebee
    style AFTER fill:#e8f5e9
    style DIFF fill:#ffcdd2
    style MATCH fill:#c8e6c9
```

**Value:** Eliminate data discrepancies. Reports you can trust.

---

#### 3. Mobile App with Voice-to-Text
```mermaid
flowchart TB
    subgraph BEFORE ["❌ Before: End-of-Day Data Entry"]
        Visit1[Customer Visit 9am]
        Visit2[Customer Visit 11am]
        Visit3[Training 2pm]
        Visit4[Customer Visit 4pm]
        Evening[Evening: Hours<br/>typing notes into CRM]
        
        Visit1 --> Evening
        Visit2 --> Evening
        Visit3 --> Evening
        Visit4 --> Evening
        
        Forget["Details Forgotten<br/>Incomplete Records"]
    end
    
    subgraph AFTER ["✅ After: Voice Capture in Car"]
        V1[Customer Visit 9am]
        Voice1["🎤 'Just met with John at<br/>ABC HVAC, discussed...'"]
        Auto1[Auto-populates CRM]
        
        V1 --> Voice1 --> Auto1
        
        Save["Hours Saved Daily<br/>Complete, Accurate Data"]
    end
    
    style BEFORE fill:#ffebee
    style AFTER fill:#e8f5e9
    style Forget fill:#ffcdd2
    style Save fill:#c8e6c9
```

**Value:** Significant time saved per TM — more time for selling.

---

#### 4. Dealer Portal (Replaces Shopify)
```mermaid
flowchart TB
    subgraph BEFORE ["❌ Before: Shopify B2C Limitations"]
        Shop[Shopify]
        B2C["Built for B2C<br/>Not B2B"]
        Pain1["No quick reorder"]
        Pain2["Poor account visibility"]
        Pain3["No credit limit display"]
        Pain4["No TM relationship"]
        
        Shop --> B2C
        B2C --> Pain1
        B2C --> Pain2
        B2C --> Pain3
        B2C --> Pain4
    end
    
    subgraph AFTER ["✅ After: Custom Dealer Portal"]
        Portal[Dealer Portal]
        B2B["Built for B2B"]
        Feat1["✓ One-click reorder"]
        Feat2["✓ Real-time tracking"]
        Feat3["✓ Credit & statements"]
        Feat4["✓ Assigned TM visible"]
        
        Portal --> B2B
        B2B --> Feat1
        B2B --> Feat2
        B2B --> Feat3
        B2B --> Feat4
    end
    
    style BEFORE fill:#ffebee
    style AFTER fill:#e8f5e9
    style B2C fill:#ffcdd2
    style B2B fill:#c8e6c9
```

**Value:** Majority of residential sales get a better experience.

---

#### 5. Training Calendar & Tracking
```mermaid
flowchart TB
    subgraph BEFORE ["❌ Before: No Visibility"]
        Q["Where are our trainers<br/>today/this week?"]
        Nobody["🤷 Nobody knows<br/>without calling around"]
        NoTrack["Training completed?<br/>Only in notes (maybe)"]
    end
    
    subgraph AFTER ["✅ After: Unified Training System"]
        Cal["Centralized Calendar<br/>Visible to All"]
        Sched["Anyone can see:<br/>• Who's training where<br/>• Available slots<br/>• Historical data"]
        Track["Training marked complete<br/>→ Auto-updates reports"]
        
        Cal --> Sched --> Track
    end
    
    style BEFORE fill:#ffebee
    style AFTER fill:#e8f5e9
    style Nobody fill:#ffcdd2
    style Cal fill:#c8e6c9
```

**Value:** "How many trainings this quarter?" answered instantly.

---

### ROI Summary

```mermaid
flowchart TB
    subgraph COSTS ["💸 Current Costs (Eliminated/Reduced)"]
        C1["Dynamics CRM: High customization costs"]
        C2["Salesforce consideration: Vendor lock-in"]
        C3["Manual admin: Hours/week per manager"]
        C4["Map My Customer: Subscription fees"]
        C5["Data errors: Unmeasurable impact"]
    end
    
    subgraph GAINS ["📈 Gains from Custom CRM"]
        G1["Own the asset (depreciable)"]
        G2["No vendor lock-in"]
        G3["Tailored to YOUR workflows"]
        G4["Time savings → More selling"]
        G5["Accurate data → Better decisions"]
    end
    
    COSTS --> TRANSFORM["Custom CRM<br/>Investment"]
    TRANSFORM --> GAINS
    
    style COSTS fill:#ffebee
    style GAINS fill:#e8f5e9
    style TRANSFORM fill:#e3f2fd
```

| Category | Before | After | Value |
|----------|--------|-------|-------|
| **Reporting Time** | Hours/Days | Seconds | Executive agility |
| **TM Admin Work** | Hours/day | Minutes | More time for selling |
| **Data Accuracy** | Variance issues | Real-time sync | Trust in numbers |
| **Tool Ownership** | Renting | Owning | Capitalize asset |
| **Dealer Experience** | B2C workaround | B2B native | Better experience |
| **Training Visibility** | None | Complete | Operational control |

---

## Residential Dealer Workflow - As-Is
*Current process highlighting manual data entry and disconnected systems.*

```mermaid
flowchart TD
    %% Personas as Swimlanes
    subgraph TM ["Territory Manager (TM)"]
        Discovery[Discovery Call Scheduled]
        SendCIS[CIS Sent to Prospect]
        Voice["Voice Notes System<br/>(Separate App)"]
        TrainSched[Training Scheduled]
        TrainComp[Training Completed]
    end

    subgraph Admin ["Internal Sales / Admin"]
        ReturnCIS["CIS Returned via Email<br/>(PDF/Attachments)"]
        ManualCRM["Manual Entry to CRM<br/>(MS Dynamics)"]
        ManualERP["Manual Entry to ERP<br/>(Acumatica)"]
    end

    subgraph RSM ["Regional Manager (RSM)"]
        ManualReport[Receives Manual Reports]
        EmailTask[Receives Email Tasks]
    end

    subgraph Systems ["Disconnected Systems"]
        Source([New Dealer Leads<br/>Affinity Groups, Web])
        Shopify[Shopify Order]
        AcuOrder[Order in Acumatica]
        Map[MapMyCustomers App]
    end

    %% Flow
    Source --> Discovery
    Discovery --> SendCIS
    SendCIS --> ReturnCIS
    
    %% Pain Point: Manual Entry
    ReturnCIS -.->|Manual Typing| ManualCRM
    ManualCRM -.->|Double Entry| ManualERP
    
    style ManualCRM stroke:#ff0000,stroke-width:4px,stroke-dasharray: 5 5,fill:#ffcdd2
    style ManualERP stroke:#ff0000,stroke-width:4px,stroke-dasharray: 5 5,fill:#ffcdd2
    
    %% Field Ops
    ManualCRM --> Map
    Map --> Voice
    ManualCRM --> TrainSched
    TrainSched --> TrainComp
    
    %% Order Flow
    Shopify --> AcuOrder
    
    %% Reporting Pain Points
    AcuOrder -.->|Manual Export| ManualReport
    TrainComp -.->|Free-text Email| ManualReport
    Voice -.->|Text Only Email| ManualReport
    
    %% Tasking Pain Point
    AcuOrder -.->|Reply All Thread| EmailTask
    
    style Voice stroke:#ff0000,stroke-width:2px,stroke-dasharray: 5 5
    style TrainComp stroke:#ff0000,stroke-width:2px,stroke-dasharray: 5 5
    style EmailTask stroke:#ff0000,stroke-width:2px,stroke-dasharray: 5 5
    style ManualReport stroke:#ff0000,stroke-width:2px,stroke-dasharray: 5 5
```

## Residential Training Workflow (Target State)

```mermaid
flowchart TD
    Start([Training Request]) --> Source{Training<br/>Source}
    
    Source -->|Customer Request| CustomerReq[Customer Requests Training]
    Source -->|TM Initiated| TMInit[TM Schedules Proactive Training]
    Source -->|Onboarding| OnboardReq[Onboarding Workflow Trigger]
    
    CustomerReq --> CheckCal[Check TM Calendar]
    TMInit --> CheckCal
    OnboardReq --> CheckCal
    
    CheckCal --> Schedule[Schedule Training<br/>in CRM Calendar]
    Schedule --> SyncOutlook[Sync to Outlook Calendar]
    SyncOutlook --> Notify[Send Notifications]
    
    Notify --> NotifyTM[Notify TM]
    Notify --> NotifyCustomer[Notify Customer]
    Notify --> NotifyRM[Notify RM]
    
    NotifyTM --> DayBefore[Day Before Reminder]
    DayBefore --> Conduct[Conduct Training]
    
    Conduct --> Complete[Mark Training Complete<br/>in CRM]
    Complete --> LogDetails[Log Training Details]
    LogDetails --> AddNotes[Add Notes & Outcomes]
    AddNotes --> LinkCustomer[Link to Customer Record]
    
    LinkCustomer --> UpdateMetrics[Update TM/RM Metrics]
    UpdateMetrics --> Reports[Available in Reports]
    
    Reports --> TMReport[TM Training Report]
    Reports --> RMReport[RM Team Report]
    Reports --> VPReport[VP Executive Report]
    
    style Schedule fill:#e3f2fd
    style Complete fill:#c8e6c9
    style Reports fill:#fff9c4
```

## Residential Order Workflow (Target State)

```mermaid
flowchart TD
    Start([Order Placed]) --> Shopify[Order via Shopify Portal]
    Shopify --> ShopifyAcu[Auto-Sync to Acumatica]
    ShopifyAcu --> AcuProcess[Acumatica Processes Order]
    
    AcuProcess --> SyncCRM[Sync Order Data to CRM]
    SyncCRM --> NotifyStart[Trigger Notifications]
    
    NotifyStart --> NotifyTM[Notify Territory Manager]
    NotifyStart --> NotifyRM[Notify Regional Manager]
    
    NotifyTM --> TMDash[Update TM Dashboard]
    NotifyRM --> RMDash[Update RM Dashboard]
    
    TMDash --> CustomerView[Customer Record Updated]
    RMDash --> CustomerView
    
    AcuProcess --> Fulfill[Order Fulfillment]
    Fulfill --> Ship[Order Shipped]
    Ship --> Tracking[Tracking Number Generated]
    
    Tracking --> SyncTrack[Sync Tracking to CRM]
    SyncTrack --> NotifyShip[Shipment Notifications]
    
    NotifyShip --> NotifyTM2[Notify TM with Tracking]
    NotifyShip --> NotifyRM2[Notify RM with Tracking]
    NotifyShip --> NotifyCustomer[Notify Customer with Tracking]
    
    NotifyCustomer --> Delivered[Order Delivered]
    Delivered --> UpdateRev[Update Revenue Reports]
    
    style Shopify fill:#e3f2fd
    style SyncCRM fill:#c8e6c9
    style NotifyShip fill:#fff9c4
```

## System Integration Architecture - Current As-Is
*Current state showing siloed systems and manual data bridges.*

```mermaid
flowchart TB
    subgraph Siloed_Systems ["Current State: Disconnected / Siloed Systems"]
        ACU["Acumatica ERP<br/>(Financials & Orders)"]
        CRM["MS Dynamics CRM<br/>(Customer Records)"]
        PRICE["Pricing Tool<br/>(Excel + SQL)"]
        MMC["MapMyCustomers<br/>(Field Routes)"]
        SHOP["Shopify<br/>(Res. Orders)"]
        OUT["Outlook<br/>(Email & Calendar)"]
        DROPBOX["Dropbox<br/>(File Sharing)"]
        WIDEN["Widen DAM<br/>(Marketing Assets)"]
    end
    
    %% Manual Connections
    CRM -.->|Manual Entry| ACU
    ACU -.->|Manual Entry| CRM
    
    PRICE -.->|Sync Batch?| CRM
    
    SHOP -->|Auto Sync| ACU
    
    MMC -.->|No Sync| CRM
    MMC -.->|No Sync| ACU
    
    OUT -.->|Manual Copy/Paste| CRM
    
    DROPBOX -.->|Manual Download| TM
    WIDEN -.->|Manual Download| TM
    
    %% Pain Points Highlight
    style CRM stroke:#ff0000,stroke-width:2px,stroke-dasharray: 5 5
    style ACU stroke:#ff0000,stroke-width:2px,stroke-dasharray: 5 5
    style DROPBOX stroke:#ff0000,stroke-width:2px,stroke-dasharray: 5 5
    style WIDEN stroke:#ff0000,stroke-width:2px,stroke-dasharray: 5 5
    
    subgraph Users ["User Access Points"]
        TM[Territory Manager]
        Rep[Manufacturer Rep]
        Admin[Internal Sales]
    end
    
    TM --> MMC
    TM --> OUT
    TM -.->|Limited Access| CRM
    
    Rep --> PRICE
    Rep -.->|Limited/No Access| CRM
    
    Admin --> ACU
    Admin --> CRM
    Admin --> SHOP
```

## System Integration Architecture (Target State)
*Unified platform with API-driven integrations and centralized data.*

**Asset Management Requirement (per Dan):** *"What Widen does is very unique. Being able to update a document in one place, and wherever it resides it updates."* — Target solution must preserve this single-source sync capability.

```mermaid
flowchart TB
    subgraph "External Systems"
        ACU[Acumatica ERP]
        HUB[HubSpot]
        PRICE[Pricing Tool<br/>+ Driveworks/SolidWorks]
        OUT[Outlook 365]
    end
    
    subgraph "Dynamic AQS Platform (Target)"
        API[API Integration Layer]
        CORE[(Unified CRM Database)]
        
        subgraph "Asset Management"
            DAM[Digital Asset Manager<br/>Widen API or Custom]
            S3[(S3 / Cloud Storage)]
        end
        
        subgraph Apps
            WEB[Web Application<br/>Next.js]
            MOBILE[Mobile App<br/>React Native]
            DEALER[Dealer Portal<br/>Replaces Shopify]
        end
    end
    
    %% External Integrations
    ACU <-->|2-Way Sync| API
    HUB -->|Lead Sync| API
    PRICE -->|Specs & Pricing| API
    OUT <-->|Graph API| API
    
    %% Asset Management Flow
    DAM <-->|Single-Source Sync| S3
    API <--> DAM
    
    %% Internal Flow
    API <--> CORE
    WEB <--> API
    MOBILE <--> API
    DEALER <-->|Orders & Data| API
    
    %% Styling
    style API fill:#e3f2fd
    style CORE fill:#c8e6c9
    style DAM fill:#fff3e0
    style S3 fill:#fff3e0
    style WEB fill:#fff9c4
    style MOBILE fill:#fff9c4
    style DEALER fill:#fff9c4
```

## Notification Flow (Target State)

```mermaid
flowchart TD
    Start([System Event]) --> Event{Event Type}
    
    Event -->|Order| OrderEvent[New Order]
    Event -->|Training| TrainingEvent[Training Scheduled]
    Event -->|CIS| CISEvent[CIS Received]
    Event -->|PO| POEvent[PO Received]
    Event -->|Ship| ShipEvent[Shipment Complete]
    
    OrderEvent --> NotifyEngine[Notification Engine]
    TrainingEvent --> NotifyEngine
    CISEvent --> NotifyEngine
    POEvent --> NotifyEngine
    ShipEvent --> NotifyEngine
    
    NotifyEngine --> DetermineRecip[Determine Recipients]
    DetermineRecip --> CheckPrefs[Check User Preferences]
    
    CheckPrefs --> Channels{Notification<br/>Channels}
    
    Channels -->|Email| EmailServ[Email Service<br/>SendGrid]
    Channels -->|In-App| InApp[In-App Notification]
    Channels -->|SMS| SMS[SMS Service<br/>Optional]
    
    EmailServ --> Queue[Notification Queue]
    InApp --> Queue
    SMS --> Queue
    
    Queue --> Send[Send Notifications]
    Send --> Log[Log Notification]
    Log --> Track[Track Delivery]
    
    Track --> Success{Delivered?}
    Success -->|Yes| Mark[Mark as Sent]
    Success -->|No| Retry[Retry Logic]
    
    Retry --> Attempts{Max<br/>Attempts?}
    Attempts -->|No| Send
    Attempts -->|Yes| Error[Log Error]
    
    Mark --> InAppBadge[Update In-App Badge Count]
    InAppBadge --> UserDash[User Dashboard Refresh]
    
    style NotifyEngine fill:#e3f2fd
    style Send fill:#c8e6c9
    style UserDash fill:#fff9c4
```

---

## Consignment Tracking Workflow (Target State)
*Tracking consignment inventory at dealer locations with audit reconciliation.*

> **Current Pain Point:** Consignment tracking is done via shared Dropbox spreadsheet. Multiple users editing causes corruption, no visibility into audit status, and manual tracking of PO submissions for missing items.

```mermaid
flowchart TD
    subgraph Setup ["Consignment Setup"]
        NewLoc([New Consignment<br/>Location Request])
        NewLoc --> Create[Create Location<br/>in CRM]
        Create --> AssignTM[Assign Territory<br/>Manager]
        AssignTM --> SetSchedule[Set Audit<br/>Schedule]
        SetSchedule --> LinkCustomer[Link to Customer<br/>Account]
    end
    
    subgraph AuditCycle ["Audit Cycle"]
        Due([Audit Due Date<br/>Approaching])
        Due --> Alert[Alert TM:<br/>Audit Due]
        Alert --> Schedule[Schedule Audit<br/>On-Site or Remote]
        Schedule --> SyncCal[Sync to<br/>Outlook Calendar]
        
        SyncCal --> Conduct[Conduct<br/>Inventory Audit]
        Conduct --> LogResult[Log Audit<br/>Results in CRM]
    end
    
    subgraph Outcome ["Audit Outcome"]
        LogResult --> Check{Reconciled?}
        
        Check -->|Yes| Reconciled[Mark as<br/>Reconciled]
        Reconciled --> NextCycle[Schedule Next<br/>Audit Cycle]
        
        Check -->|No| Discrepancy[Mark as<br/>Discrepancy]
        Discrepancy --> LogReason[Log Reason:<br/>Items Missing]
        LogReason --> RequestPO[Request PO<br/>from Location]
    end
    
    subgraph FollowUp ["Follow-up Process"]
        RequestPO --> WaitPO[Status:<br/>Waiting for PO]
        WaitPO --> AlertFollowUp[Alert TM:<br/>Follow-up Required]
        AlertFollowUp --> POReceived{PO<br/>Received?}
        
        POReceived -->|Yes| ClosePO[Mark PO<br/>Received]
        ClosePO --> NextCycle
        
        POReceived -->|No| Escalate[Continue<br/>Follow-up]
        Escalate --> AlertFollowUp
    end
    
    subgraph Dashboard ["Management Dashboard"]
        NextCycle --> UpdateDash[Update<br/>Dashboard]
        UpdateDash --> Metrics[Show Metrics:<br/>• Total Locations<br/>• Audits Pending<br/>• Discrepancies<br/>• POs Outstanding]
    end
    
    style NewLoc fill:#e3f2fd
    style Alert fill:#fff3e0
    style Reconciled fill:#c8e6c9
    style Discrepancy fill:#ffcdd2
    style WaitPO fill:#fff9c4
    style Metrics fill:#e3f2fd
```

### Consignment Data Model

| Entity | Key Fields | Description |
|--------|------------|-------------|
| **Consignment Location** | Warehouse ID, TM, Customer ID, Inception Date | Physical location with consignment inventory |
| **Warehouse Manager** | Name, Email, Phone | Contact at the consignment location |
| **Reconciliation Cycle** | Audit Due, Status, Outcome, Activity | One audit period (quarterly) |
| **Audit Result** | Reconciled/Discrepancy, Reason, PO Status | Result of a single audit |

### Alert Triggers

| Trigger | Alert Type | Recipient |
|---------|------------|-----------|
| Audit due in 14 days | Reminder | TM |
| Audit due in 7 days | Warning | TM, RD |
| Audit overdue | Urgent | TM, RD |
| PO outstanding > 30 days | Follow-up | TM |
| Discrepancy rate high | Management | RD, VP |
