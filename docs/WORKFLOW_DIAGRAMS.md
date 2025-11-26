# Workflow Diagrams - Dynamic AQS CRM

## Residential Lead to Customer Workflow

```mermaid
flowchart TD
    Start([Lead Source]) --> LeadGen[Lead Generated<br/>HubSpot/Website/Trade Show]
    LeadGen --> CRM[Create Lead in CRM]
    CRM --> Assign[Assign to TM/RM]
    Assign --> Discovery[Discovery Call Scheduled]
    
    Discovery --> Qualified{Qualified?}
    Qualified -->|No| Nurture[Lead Nurturing]
    Nurture --> Discovery
    Qualified -->|Yes| SendCIS[Send CIS Document]
    
    SendCIS --> WaitCIS[Wait for CIS Return]
    WaitCIS --> CISReceived[CIS Email Received]
    CISReceived --> AutoParse[Auto-Parse CIS Data]
    AutoParse --> CreateCustomer[Create Customer in CRM]
    
    CreateCustomer --> SyncERP[Sync to Acumatica ERP]
    SyncERP --> Onboarding[Trigger Onboarding Workflow]
    
    Onboarding --> Step1[Step 1: Account Setup]
    Step1 --> Step2[Step 2: Welcome Email]
    Step2 --> Step3[Step 3: Technical Training]
    Step3 --> ScheduleTraining[Schedule Training]
    
    ScheduleTraining --> Training[Training Completed]
    Training --> LogTraining[Log Training in CRM]
    LogTraining --> FirstOrder{First Order<br/>Placed?}
    
    FirstOrder -->|No| FollowUp[Follow-up Tasks]
    FollowUp --> FirstOrder
    FirstOrder -->|Yes| Active[Active Customer]
    
    Active --> Ongoing[Ongoing Relationship<br/>Management]
    
    style LeadGen fill:#e3f2fd
    style CreateCustomer fill:#c8e6c9
    style Training fill:#fff9c4
    style Active fill:#c8e6c9
```

## Residential Training Workflow

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

## Residential Order Workflow

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

## Commercial Opportunity Workflow

```mermaid
flowchart TD
    Start([New Opportunity]) --> Identify[Opportunity Identified]
    Identify --> Source{Source}
    
    Source -->|Rep| RepSource[Manufacturer Rep]
    Source -->|RSM| RSMSource[RSM Discovery]
    Source -->|Engineer| EngSource[Engineer Referral]
    
    RepSource --> CreateOpp[Create Opportunity in CRM]
    RSMSource --> CreateOpp
    EngSource --> CreateOpp
    
    CreateOpp --> Details[Enter Opportunity Details]
    Details --> JobSite[Job Site Information]
    Details --> Stakeholders[Link Stakeholders]
    
    Stakeholders --> LinkEng[Engineering Firm]
    Stakeholders --> LinkRep[Manufacturer Rep]
    Stakeholders --> LinkArch[Architect]
    Stakeholders --> LinkOwner[Building Owner]
    Stakeholders --> LinkCont[Contractor]
    
    LinkEng --> Assign[Assign to RSMs]
    LinkRep --> Assign
    LinkArch --> Assign
    LinkOwner --> Assign
    LinkCont --> Assign
    
    Assign --> Prospect[Phase: Prospect]
    Prospect --> Qualify[Qualification Activities]
    Qualify --> PrelimQuote{Ready for<br/>Prelim Quote?}
    
    PrelimQuote -->|No| MoreInfo[Gather More Info]
    MoreInfo --> Qualify
    PrelimQuote -->|Yes| GenQuote[Generate Quote in<br/>Pricing Tool]
    
    GenQuote --> QuoteSync[Auto-Sync Quote to CRM]
    QuoteSync --> PrelimPhase[Phase: Preliminary Quote]
    PrelimPhase --> Review[Customer Review]
    
    Review --> Feedback{Feedback}
    Feedback -->|Revise| ReviseQuote[Revise Quote]
    ReviseQuote --> GenQuote
    Feedback -->|Positive| FinalQuote[Phase: Final Quote]
    Feedback -->|Lost| Lost[Phase: Lost]
    
    FinalQuote --> Negotiate[Negotiations]
    Negotiate --> POReceived{PO<br/>Received?}
    
    POReceived -->|No| Follow[Follow-up Activities]
    Follow --> POReceived
    POReceived -->|Yes| POPhase[Phase: PO in Hand]
    
    POPhase --> EnterAcu[Enter PO in Acumatica]
    EnterAcu --> SyncPO[Sync PO to CRM]
    SyncPO --> NotifyPO[PO Notifications]
    
    NotifyPO --> NotifyRSMT[Notify Territory RSM]
    NotifyPO --> NotifyRSME[Notify Engineering RSM]
    NotifyPO --> NotifyRep[Notify Rep]
    
    NotifyRSMT --> SetESD[Set Expected Ship Date]
    SetESD --> NotifyESD[ESD Notifications]
    
    NotifyESD --> Manufacture[Manufacturing]
    Manufacture --> Ship[Shipment Complete]
    Ship --> NotifyShip[Shipment Notifications<br/>with Tracking]
    
    NotifyShip --> Won[Phase: Won]
    Won --> FollowUp[Schedule Follow-ups]
    FollowUp --> FU6[6-Month Follow-up]
    FollowUp --> FU12[12-Month Follow-up]
    FollowUp --> FU36[3-Year Follow-up]
    
    style CreateOpp fill:#e3f2fd
    style QuoteSync fill:#c8e6c9
    style POPhase fill:#fff9c4
    style Won fill:#c8e6c9
```

## Commercial Engineer Rating Workflow

```mermaid
flowchart TD
    Start([New Engineer Contact]) --> Create[Create Engineer Contact<br/>in CRM]
    Create --> Initial[Initial Rating: 1-2]
    
    Initial --> Rate1{Current<br/>Rating}
    
    Rate1 -->|1 - Hostile| Activity1[Relationship Building]
    Rate1 -->|2 - Unfavorable| Activity2[Positive Engagement]
    Rate1 -->|3 - Neutral| Activity3[Value Demonstration]
    Rate1 -->|4 - Favorable| Activity4[Deepen Relationship]
    Rate1 -->|5 - Champion| Activity5[Maintain & Expand]
    
    Activity1 --> Interact[Log Interactions]
    Activity2 --> Interact
    Activity3 --> Interact
    Activity4 --> Interact
    Activity5 --> Interact
    
    Interact --> Types{Interaction<br/>Type}
    
    Types -->|Meeting| Meeting[Face-to-Face Meeting]
    Types -->|Call| Call[Phone Call]
    Types -->|Email| Email[Email Exchange]
    Types -->|Event| Event[Lunch & Learn]
    
    Meeting --> VoiceNote[Voice-to-Text Notes<br/>Mobile App]
    Call --> VoiceNote
    Email --> LogEmail[Auto-Log from Outlook]
    Event --> VoiceNote
    
    VoiceNote --> Details[Log Interaction Details]
    LogEmail --> Details
    
    Details --> Outcome[Record Outcome]
    Outcome --> Positive{Positive<br/>Outcome?}
    
    Positive -->|Yes| Consider[Consider Rating Increase]
    Positive -->|No| Monitor[Continue Monitoring]
    
    Consider --> Criteria{Meets<br/>Criteria?}
    Criteria -->|Yes| Increase[Increase Rating]
    Criteria -->|No| Monitor
    
    Increase --> UpdateRating[Update Engineer Rating]
    UpdateRating --> LogChange[Log Rating Change<br/>with Reason]
    LogChange --> Notify[Notify RSM Team]
    
    Notify --> RatingHist[Add to Rating History]
    RatingHist --> Tasks[Generate Follow-up Tasks]
    
    Tasks --> NextLevel{Target<br/>Next Level}
    NextLevel --> Strategy[Strategy for Advancement]
    Strategy --> Interact
    
    Monitor --> Schedule[Schedule Next Interaction]
    Schedule --> Interact
    
    Activity5 --> Spec{Specifying<br/>Projects?}
    Spec -->|Yes| Track[Track Specifications]
    Spec -->|No| Encourage[Encourage Specifications]
    
    Track --> OpptyWon[Link to Won Opportunities]
    Encourage --> Strategy
    
    style Create fill:#e3f2fd
    style UpdateRating fill:#c8e6c9
    style Activity5 fill:#fff9c4
```

## System Integration Architecture

```mermaid
flowchart TB
    subgraph "External Systems"
        ACU[Acumatica ERP<br/>Financial Data]
        SHOP[Shopify<br/>Order Portal]
        HUB[HubSpot<br/>Lead Gen]
        MMC[MapMyCustomers<br/>Field Mapping]
        PRICE[Pricing Tool<br/>Excel + Azure SQL]
        OUT[Microsoft Outlook<br/>Email]
    end
    
    subgraph "Dynamic AQS CRM"
        CORE[Core CRM Database<br/>PostgreSQL]
        API[Integration Layer<br/>API Services]
        
        subgraph "CRM Modules"
            RES[Residential Module]
            COM[Commercial Module]
            TRAIN[Training Module]
            REPORT[Reporting Engine]
        end
    end
    
    subgraph "User Interfaces"
        WEB[Web Application<br/>Next.js]
        MOBILE[Mobile App<br/>React Native]
        DEALER[Dealer Portal]
    end
    
    %% Integrations
    ACU -->|REST API<br/>Read-Only| API
    SHOP -->|Webhooks| API
    HUB -->|REST API<br/>Lead Import| API
    MMC -->|REST API<br/>Activity Sync| API
    PRICE -->|SQL Connection<br/>Quote Import| API
    OUT -->|Graph API<br/>Email Tracking| API
    
    API --> CORE
    
    CORE --> RES
    CORE --> COM
    CORE --> TRAIN
    CORE --> REPORT
    
    RES --> WEB
    COM --> WEB
    TRAIN --> WEB
    REPORT --> WEB
    
    RES --> MOBILE
    TRAIN --> MOBILE
    
    RES --> DEALER
    
    style ACU fill:#e3f2fd
    style CORE fill:#c8e6c9
    style WEB fill:#fff9c4
```

## Notification Flow

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
