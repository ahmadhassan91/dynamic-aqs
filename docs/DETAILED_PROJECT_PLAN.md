# Dynamic AQS CRM - Detailed Project Plan

> **Based on:** Front-end Demo + Stakeholder Meetings  
> **Scope:** Residential CRM Only (Commercial deferred)  
> **Key Stakeholders:** Currie (VP Sales & Training), Dan (VP Ops/IT), Steve (President), Michelle (VP BD)

---

## Executive Summary

This plan details 19 sprints (~9.5 months) of development, breaking down each feature into granular sub-tasks based on the demo components and meeting requirements.

### Key Pain Points Addressed (from Meetings)
1. **"How many trainings last month?"** - Currie can't get basic reports without calling everyone
2. **Map My Customer doesn't sync** - TM activities lost, manual data entry
3. **Shopify not B2B friendly** - Dealers struggle with repeat orders
4. **No training tracking** - Cannot mark trainings complete in current CRM
5. **Manual reporting** - Hours spent aggregating data

---

## Phase 1: Foundation (Sprints 1-2) - Month 1

### Sprint 1: Project Setup & Core Infrastructure

#### 1.1 Project Initialization
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Initialize Next.js 14 | Create project structure | `npx create-next-app@14` with TypeScript, App Router | 4 | Project runs locally |
| | Configure Mantine UI | Install @mantine/core, @mantine/hooks, @mantine/dates | 2 | Theme applied globally |
| | Setup Tailwind (optional) | Configure if needed alongside Mantine | 2 | Styles compile correctly |
| | Configure path aliases | Setup @/ imports in tsconfig.json | 1 | Imports work with @ prefix |
| | Setup ESLint/Prettier | Code quality rules, formatting | 2 | Linting passes |

#### 1.2 Database Configuration
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| PostgreSQL Setup | Create database instance | AWS RDS or Azure PostgreSQL | 4 | Connection verified |
| | Configure Prisma ORM | Initialize prisma, configure schema | 4 | Migrations run successfully |
| | Design base schema | Users, Roles, Permissions tables | 8 | ERD approved by team |
| | Setup migrations workflow | Prisma migrate scripts | 2 | Dev/staging/prod migrations |
| | Create seed data scripts | Test data for development | 4 | Consistent dev environment |

#### 1.3 Authentication System
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| NextAuth Setup | Install and configure | next-auth with credentials provider | 4 | Login/logout works |
| | JWT token management | Secure token generation | 4 | Tokens expire correctly |
| | Session management | Server-side session handling | 3 | Sessions persist across pages |
| | Role-based middleware | Protect routes by role | 6 | Unauthorized access blocked |
| | Build login page | UI matching demo AppLayout | 4 | Matches design system |
| | Password reset flow | Email-based reset | 6 | Full reset workflow works |

#### 1.4 Deployment Infrastructure
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Cloud Setup | Provision AWS/Azure resources | VPC, subnets, security groups | 8 | Infrastructure as code |
| | Configure Vercel/custom hosting | Deploy Next.js app | 4 | App accessible via URL |
| | Setup environment variables | Secure secrets management | 2 | No secrets in code |
| | SSL certificate | HTTPS configuration | 2 | Valid SSL certificate |

#### 1.5 CI/CD Pipeline
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| GitHub Actions | Create workflow files | Build, test, deploy stages | 6 | Auto-deploy on main push |
| | Setup branch protection | PR reviews required | 2 | Main branch protected |
| | Configure test automation | Run tests on PR | 4 | Tests block bad merges |
| | Setup staging environment | Preview deployments | 4 | PRs get preview URLs |

---

### Sprint 2: User Management & Customer Foundation

#### 2.1 User Management (Admin Module)
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| User Data Model | Create Prisma schema | id, email, name, role, territory, status | 4 | Schema migrated |
| | Define user roles | TM, RM, VP, BD, Admin | 2 | Roles documented |
| | Create role permissions matrix | CRUD per entity per role | 4 | Matrix approved |
| User List View | Build `SimpleUserManagement.tsx` | Table with search, filter, pagination | 8 | Lists all users correctly |
| | Implement search | By name, email, role | 3 | Search filters instantly |
| | Add role filter dropdown | Filter by TM, RM, VP, etc. | 2 | Filter works correctly |
| | Pagination | 25/50/100 per page options | 2 | Large lists paginate |
| User Forms | Build `UserFormModal.tsx` | Add/Edit user modal | 6 | Create/update users |
| | Territory assignment | Dropdown of territories | 3 | TM assigned to territory |
| | Manager assignment | RM manages multiple TMs | 3 | Hierarchy established |
| | Status toggle | Active/Inactive/Suspended | 2 | Status updates correctly |
| User Import | Build `UserImportModal.tsx` | CSV import for bulk add | 6 | Bulk import works |
| | Validation rules | Check duplicates, required fields | 4 | Bad data rejected |
| | Error reporting | Show which rows failed | 2 | Clear error messages |

#### 2.2 Customer Entity (Residential)
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Customer Data Model | Create Prisma schema | id, name, address, territory, TM, affinityGroup, ownershipGroup, status | 6 | Schema migrated |
| | Address fields | Street, city, state, zip, county | 2 | Address validation |
| | Contact fields | phone, email, website | 2 | Format validation |
| | Assignment fields | territoryId, tmId, rmId | 2 | Foreign keys work |
| | Group fields | affinityGroupId, ownershipGroupId | 2 | Hierarchy links |
| Customer List | Build `CustomerList.tsx` | DataTable with columns | 8 | Displays 1000+ customers |
| | Sortable columns | Name, territory, status, revenue | 3 | Sort ascending/descending |
| | Advanced filters | Status, territory, TM, group | 4 | Multiple filter combo |
| | Quick search | Search name, address | 2 | Instant results |
| | Export to CSV | Download filtered results | 3 | CSV downloads |
| Customer Detail | Build `CustomerDetail.tsx` | Full profile page | 10 | All customer data visible |
| | Contact tab | Primary + additional contacts | 4 | Contact management |
| | Training tab | Training history + scheduled | 6 | **KEY: Training tracking** |
| | Orders tab | Order history from Acumatica | 6 | Read-only orders display |
| | Activities tab | Timeline of all activities | 6 | Chronological view |
| | Notes tab | Customer notes | 3 | Add/edit notes |
| Customer Forms | Build `CustomerFormModal.tsx` | Add/Edit customer modal | 8 | Create/update customers |
| | Territory auto-assignment | Based on state/county | 4 | Auto-assigns to TM |
| | Validation | Required fields, formats | 3 | Invalid data blocked |

---

## Phase 2: Core Residential Features (Sprints 3-6) - Months 2-3

### Sprint 3: Territory & Group Management

#### 3.1 Territory Management
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Territory Data Model | Create Prisma schema | id, name, states, counties, tmId, rmId | 4 | Schema migrated |
| | State/county mapping | Multi-select for geography | 4 | Covers all US states |
| Territory Assignment UI | Build `TerritoryAssignment.tsx` | Drag-drop TM to territory | 8 | TMs assigned visually |
| | Reassignment workflow | Move customers when TM changes | 6 | Customers follow territory |
| | Conflict detection | Warn overlapping territories | 4 | Overlaps flagged |
| Territory Map | Build `InteractiveTerritoryMap.tsx` | US map with territory boundaries | 12 | Map renders territories |
| | Click to drill-down | Click territory → see details | 4 | Drill-down works |
| | Color coding | By performance, TM assignment | 4 | Visual distinction |
| Territory Restructuring | Build `BulkTerritoryOperations.tsx` | Split/merge territories | 8 | Bulk operations work |
| | Impact preview | Show affected customers/orders | 4 | Preview before save |
| Territory Performance | Build `TerritoryPerformanceAnalytics.tsx` | Revenue, training, activity by territory | 8 | **KEY: VP can see all territories** |
| | Compare territories | Side-by-side comparison | 4 | Comparison charts |

#### 3.2 Affinity & Ownership Groups
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Affinity Group Model | Create Prisma schema | id, name, parentId, customers | 4 | Hierarchical structure |
| | Parent-child relationships | Up to 3 levels deep | 3 | Hierarchy validated |
| Ownership Group Model | Create Prisma schema | id, name, parentId, customers | 4 | Same as affinity |
| Group Management UI | Build `AffinityGroupManagement.tsx` | Tree view of groups | 8 | Groups display correctly |
| | Build `OwnershipGroupManagement.tsx` | Same for ownership | 6 | Reuse affinity patterns |
| | Add/edit/delete groups | Modal forms | 4 | CRUD operations work |
| | Assign customers to groups | Drag-drop or dropdown | 6 | Customers assigned |
| Hierarchy Visualization | Build `OrganizationChart.tsx` | Visual org chart | 8 | Tree structure clear |
| | Expand/collapse nodes | Interactive tree | 3 | Navigation intuitive |
| Roll-up Calculations | Implement aggregation logic | Sum child values to parent | 8 | Numbers roll up correctly |
| | Revenue roll-up | Total revenue by group | 4 | Revenue accurate |
| | Training roll-up | Training counts by group | 4 | Training counts accurate |

#### 3.3 Activity Timeline
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Activity Data Model | Create Prisma schema | id, type, customerId, userId, date, notes | 4 | Schema migrated |
| | Activity types | Call, Visit, Email, Training, Meeting | 2 | Types defined |
| Timeline View | Build `InteractionTimeline.tsx` | Chronological activity list | 8 | Timeline renders |
| | Activity icons | Different icons per type | 2 | Visual distinction |
| | Expandable details | Click to see full notes | 3 | Details accessible |
| | Filter by type | Show only calls, visits, etc. | 3 | Filters work |
| Quick Add Activity | Build `CustomerActivities.tsx` | Quick add from customer page | 6 | Add activity inline |
| | Voice note support | Text field, later voice-to-text | 4 | Notes captured |
| | Auto-log call | Click phone number → log call | 4 | Call tracking ready |

---

### Sprint 4: Lead Pipeline & HubSpot Integration

#### 4.1 Lead Pipeline (Michelle's Domain)
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Lead Data Model | Create Prisma schema | id, source, status, stage, company, contact, score | 6 | Schema migrated |
| | Lead sources | HubSpot, Website, Referral, Trade Show | 2 | Sources tracked |
| | Lead stages | New, Contacted, Qualified, Proposal, Closed | 2 | Stages defined |
| Pipeline Board | Build `LeadPipeline.tsx` | Kanban board | 12 | Drag-drop between stages |
| | Stage columns | Configurable stages | 4 | Stages customizable |
| | Card details | Company, contact, value, age | 4 | Key info on cards |
| | Drag-drop | Move leads between stages | 6 | Smooth drag-drop |
| | Stage counts | Number of leads per stage | 2 | Counts accurate |
| Lead Forms | Build `LeadFormModal.tsx` | Add/Edit lead | 8 | CRUD operations work |
| | Build `LeadDetailModal.tsx` | Full lead detail view | 6 | All lead info visible |
| | Source tracking | Auto-set based on import | 3 | Source tracked |
| Lead Conversion | Build `LeadConversionWorkflow.tsx` | Convert lead to customer | 8 | **KEY: Lead → Customer flow** |
| | Auto-populate customer | Pre-fill from lead data | 4 | Data carries over |
| | Conversion confirmation | Review before convert | 3 | No accidental conversions |

#### 4.2 HubSpot Integration
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| HubSpot API Setup | Research HubSpot API | Documentation review | 4 | API understood |
| | OAuth authentication | Setup HubSpot app | 6 | Auth flow works |
| | API rate limiting | Handle 100 req/10sec limit | 3 | No rate limit errors |
| Lead Import Service | Build import service | Fetch leads from HubSpot | 8 | Leads import correctly |
| | Field mapping | Map HubSpot → CRM fields | 6 | **KEY: Michelle's field mapping** |
| | Duplicate detection | Check existing leads | 4 | No duplicates created |
| Scheduled Sync | Cron job for hourly sync | Background worker | 6 | Syncs every hour |
| | Sync status UI | Show last sync time, errors | 4 | Admins can monitor |
| | Manual sync trigger | Button to sync now | 2 | On-demand sync |

#### 4.3 Acumatica Integration Setup
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| API Research | Document Acumatica endpoints | Customer, Order, Invoice APIs | 8 | API docs complete |
| | Authentication setup | OAuth or API key | 6 | Auth works |
| | Build integration service | Abstract API calls | 8 | Service layer created |
| | Error handling | Retry logic, logging | 4 | Errors handled gracefully |
| | Rate limiting | Respect Acumatica limits | 3 | No throttling errors |

---

### Sprint 5: CIS Automation & Acumatica Sync

#### 5.1 Customer Information Sheet (CIS) Automation
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| CIS Email Parser | Build parser service | Extract CIS fields from email | 12 | **KEY: Auto-populate from CIS** |
| | Email connector | Microsoft Graph API or IMAP | 8 | Read CIS emails |
| | Field extraction | Name, address, equipment, etc. | 6 | Fields extracted accurately |
| | Confidence scoring | Flag uncertain extractions | 4 | Low confidence highlighted |
| CIS Review UI | Build `CustomerInformationSheet.tsx` | Review extracted data | 8 | Review before save |
| | Edit inline | Correct parsing errors | 4 | Manual corrections |
| | Approve/reject | Confirm or discard | 2 | Clear workflow |
| Auto Customer Creation | Create customer from CIS | Pre-fill customer form | 6 | Customer created from CIS |
| | Link to lead | Connect to originating lead | 3 | Lead → CIS → Customer |
| CIS Templates | Build template manager | Manage CIS form templates | 6 | Multiple templates supported |

#### 5.2 Acumatica Customer Sync
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Customer Sync | One-way sync Acu → CRM | Import customer master data | 12 | **KEY: Single source of truth** |
| | Field mapping | Map Acumatica → CRM fields | 6 | All fields mapped |
| | Incremental sync | Only changed records | 6 | Efficient syncing |
| | Conflict handling | CRM vs Acu conflicts | 4 | Conflicts resolved |
| Sync Monitoring | Build `DataSynchronizationInterface.tsx` | Monitor sync status | 8 | Sync health visible |
| | Error dashboard | Show failed syncs | 4 | Errors flagged |
| | Manual retry | Retry failed records | 3 | Manual intervention works |

#### 5.3 Lead Scoring (AI)
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Scoring Model | Define scoring factors | Source, engagement, company size | 4 | Factors defined |
| | Build scoring algorithm | Weight factors, calculate score | 8 | Scores calculated |
| | Historical training | Use past conversions | 8 | Model improves over time |
| Lead Analytics | Build `LeadAnalytics.tsx` | Lead performance dashboard | 8 | Analytics visible |
| | Build `ConversionAnalytics.tsx` | Conversion funnel analysis | 6 | Funnel metrics |
| | Score distribution | Show score breakdown | 4 | Score insight |

---

### Sprint 6: Onboarding & Notifications

#### 6.1 Onboarding Workflow
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Workflow Engine | Build step-based engine | Configure multi-step workflows | 12 | Workflows execute |
| | Step definitions | Equipment, Training, Follow-up | 4 | Steps defined |
| | Conditional logic | If X, then skip Y | 6 | Conditions work |
| Onboarding UI | Build `OnboardingWizard.tsx` | Step-by-step wizard | 10 | Wizard navigates correctly |
| | Build `OnboardingWorkflow.tsx` | View all onboardings | 8 | List of active onboardings |
| | Progress tracking | % complete per customer | 4 | Progress visible |
| | Task checklist | Checkable task list | 4 | Tasks markable |
| Onboarding Notifications | Email on step complete | Notify next responsible party | 4 | Emails sent |
| | Overdue alerts | Alert if step overdue | 4 | Alerts trigger |

#### 6.2 Notification System
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Notification Engine | Event-driven architecture | Pub/sub for events | 8 | Events trigger notifications |
| | Notification types | Email, In-app, SMS (optional) | 4 | Types supported |
| | Template system | HTML email templates | 6 | Templates render |
| Notification Service | Build SendGrid/SMTP integration | Send emails | 6 | Emails delivered |
| | Queue management | Process async | 4 | No blocking |
| | Retry logic | Retry failed sends | 3 | Retries work |
| Notification UI | Build notification center | In-app notification list | 8 | Notifications display |
| | Unread badges | Show unread count | 3 | Badge updates |
| | Mark as read | Click to mark read | 2 | Read status works |
| | Preferences | User notification settings | 6 | Users control preferences |

#### 6.3 Order Sync (Acumatica)
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Order Sync | Read-only sync Acu → CRM | Import orders | 12 | **KEY: Orders visible in CRM** |
| | Order history | Show in customer profile | 6 | Orders on customer page |
| | Status tracking | Open, Shipped, Delivered | 4 | Status accurate |
| Order Display | Build `CustomerOrders.tsx` | Order list in customer detail | 8 | Orders display |
| | Order detail | Line items, totals, dates | 6 | Full order visible |
| | Tracking info | Carrier, tracking number | 4 | Tracking links work |

---

## Phase 3: Training Management (Sprints 7-8) - Month 4

> **KEY PRIORITY: This is Currie's #1 pain point - "How many trainings last month?"**

### Sprint 7: Training Scheduling & Calendar

#### 7.1 Training Data Model & Calendar
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Training Data Model | Create Prisma schema | id, type, customerId, trainerId, date, status, notes | 6 | Schema migrated |
| | Training types | Product, Safety, Advanced, etc. | 2 | Types defined |
| | Training status | Scheduled, Completed, Cancelled, No-Show | 2 | Status workflow |
| Training Calendar | Build `TrainingCalendar.tsx` | Full calendar view | 12 | **KEY: Month/week/day views** |
| | Month view | Grid of training sessions | 4 | Month displays |
| | Week view | Detailed weekly schedule | 4 | Week displays |
| | Day view | Hour-by-hour view | 4 | Day displays |
| | Drag to reschedule | Move training to new date | 6 | Drag-drop reschedule |
| | Color by type | Different colors per training type | 3 | Visual distinction |
| | Filter by TM | Show only my trainings | 3 | TM filter works |
| | Filter by customer | Show customer's trainings | 3 | Customer filter works |

#### 7.2 Training Scheduling
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Scheduling Form | Build `TrainingScheduleForm.tsx` | Schedule new training | 10 | **KEY: Schedule training in < 1 min** |
| | Customer selector | Search/select customer | 4 | Customer found quickly |
| | Trainer selector | Assign trainer (TM) | 3 | Trainer assigned |
| | Date/time picker | Select date and time | 3 | Date/time set |
| | Training type | Select type | 2 | Type selected |
| | Notes | Add scheduling notes | 2 | Notes saved |
| Schedule Modal | Build `TrainingScheduleModal.tsx` | Modal wrapper for form | 4 | Modal opens/closes |
| Trainer Availability | Build `TrainerManagement.tsx` | Manage trainer schedules | 8 | Availability tracked |
| | Conflict detection | Warn if double-booked | 4 | Conflicts flagged |
| | Block time | Mark time as unavailable | 4 | Blocked time works |

#### 7.3 Outlook Calendar Integration
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Microsoft Graph Setup | Setup Graph API | Authentication | 6 | Auth works |
| | Calendar permissions | Read/write calendar | 4 | Permissions granted |
| Calendar Sync | Two-way sync | CRM ↔ Outlook calendar | 10 | **KEY: Trainings in Outlook** |
| | Create events | New training → Outlook event | 4 | Events created |
| | Update events | Change training → update event | 4 | Events updated |
| | Delete events | Cancel training → remove event | 3 | Events removed |
| | Incoming events | Outlook event → CRM (optional) | 6 | External events imported |

#### 7.4 Training Completion Tracking
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Completion Form | Build `TrainingCompletion.tsx` | Mark training complete | 8 | **KEY: One-tap complete** |
| | Completion status | Complete, Partial, No-Show | 2 | Status options |
| | Completion notes | What was covered | 3 | Notes captured |
| | Customer sign-off | Optional signature | 4 | Signature captured |
| | Photo upload | Training photos | 4 | Photos attached |
| Completion Tracker | Build `TrainingCompletionTracker.tsx` | Dashboard of completions | 8 | Completion stats visible |
| | By TM | Trainings per TM | 4 | **KEY: Answer "how many trainings?"** |
| | By customer | Training history per customer | 4 | Customer training history |
| | By period | This week/month/quarter/year | 4 | Period filters |

---

### Sprint 8: Training Reports & Certifications

#### 8.1 Training Reports (Currie's Request)
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Training Dashboard | Build `TrainingDashboard.tsx` | Overview dashboard | 10 | **KEY: One-click training stats** |
| | Total trainings this month | Big number widget | 2 | Count accurate |
| | By TM breakdown | Chart by trainer | 4 | By TM visible |
| | By type breakdown | Chart by training type | 4 | By type visible |
| | Trend line | Month-over-month | 4 | Trend visible |
| Training Analytics | Build `TrainingAnalyticsDashboard.tsx` | Deep analytics | 12 | Rich analytics |
| | Completion rate | % scheduled vs completed | 4 | Rate calculated |
| | Average per TM | Trainings per TM avg | 3 | Average shown |
| | Customer coverage | % customers trained | 4 | Coverage metric |
| | No-show rate | % no-shows | 3 | No-show tracked |
| Training Reports | Build `CustomTrainingReports.tsx` | Exportable reports | 8 | Reports export |
| | By TM report | List trainings per TM | 4 | TM report works |
| | By customer report | Training history export | 4 | Customer report works |
| | Export PDF/Excel | Download reports | 4 | Downloads work |

#### 8.2 Trainer Management
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Trainer Profile | Trainer data model | Skills, territories, availability | 4 | Trainer data stored |
| | Trainer list view | List all trainers | 4 | Trainers listed |
| | Trainer detail | Full profile | 4 | Profile complete |
| Trainer Performance | Performance metrics | Trainings completed, ratings | 6 | Metrics calculated |
| | Performance dashboard | Trainer leaderboard | 6 | Leaderboard visible |
| | Customer feedback | Training ratings | 4 | Ratings collected |

#### 8.3 Certification Management
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Certification Model | Create Prisma schema | id, customerId, type, issueDate, expiryDate | 4 | Schema migrated |
| | Cert types | Product, Safety, Advanced | 2 | Types defined |
| Cert Tracking | Build `CertificationManager.tsx` | Track certifications | 8 | Certs tracked |
| | Build `CertificationTracking.tsx` | Customer cert status | 6 | Status visible |
| | Expiration alerts | 30/60/90 day warnings | 4 | Alerts sent |
| | Renewal workflow | Schedule renewal training | 4 | Renewal initiated |

---

## Phase 4: Reporting & Dashboards (Sprints 9-10) - Month 5

### Sprint 9: Report Builder & Core Reports

#### 9.1 Report Engine
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Report Architecture | Design query builder | Dynamic SQL generation | 12 | Queries generate correctly |
| | Report definitions | JSON-based report config | 6 | Reports configurable |
| | Aggregation engine | SUM, AVG, COUNT, GROUP BY | 8 | Aggregations work |
| Report Builder UI | Build `CustomReportBuilder.tsx` | Drag-drop report builder | 12 | **KEY: Custom reports** |
| | Field selector | Choose columns | 4 | Fields selectable |
| | Filter builder | Add conditions | 6 | Filters apply |
| | Grouping | Group by territory, TM, period | 4 | Grouping works |
| | Sorting | Order by column | 2 | Sorting works |
| Report Execution | Execute reports | Run query, return data | 6 | Reports execute |
| | Caching | Cache frequent reports | 4 | Fast repeat runs |
| | Pagination | Large result sets | 3 | Pagination works |

#### 9.2 Visualization & Export
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Visualization | Build `ReportPreview.tsx` | Preview report results | 6 | Preview renders |
| | Table view | Data table | 4 | Table displays |
| | Chart view | Bar, line, pie charts | 8 | Charts render |
| | Build `DashboardWidget.tsx` | Embeddable widgets | 6 | Widgets work |
| Export | Export PDF | PDF generation | 6 | PDFs download |
| | Export Excel | Excel export | 4 | Excel works |
| | Export CSV | CSV export | 2 | CSV works |
| | Scheduled export | Auto-email reports | 6 | Reports emailed |

#### 9.3 Pre-Built Reports
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Sales Reports | Build `SalesReports.tsx` | Standard sales reports | 8 | Sales reports work |
| | TM sales report | Revenue by TM | 4 | **KEY: TM performance** |
| | RM sales report | Revenue by RM (aggregate TMs) | 4 | RM roll-up |
| | Affinity group report | Revenue by affinity group | 4 | Group roll-up |
| | Ownership group report | Revenue by ownership | 4 | Ownership roll-up |
| | YoY comparison | This year vs last year | 6 | YoY accurate |
| Report Templates | Build `ReportTemplates.tsx` | Reusable templates | 6 | Templates save |
| | Save as template | Save current config | 3 | Save works |
| | Load template | Apply saved config | 3 | Load works |

---

### Sprint 10: Role Dashboards & Scheduling

#### 10.1 Role-Based Dashboards
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Executive Dashboard | Build `ExecutiveDashboard.tsx` | VP-level overview | 12 | **KEY: Currie's dashboard** |
| | Total trainings widget | This month trainings | 4 | Count accurate |
| | Revenue widget | Monthly revenue | 4 | Revenue from Acu |
| | TM performance | Leaderboard | 6 | Rankings visible |
| | Territory map | Revenue by territory | 6 | Map renders |
| | Trend charts | Month-over-month | 4 | Trends visible |
| TM Dashboard | TM-specific view | My customers, trainings, activities | 10 | TM sees their data |
| | Today's schedule | Today's trainings/visits | 4 | Schedule visible |
| | My customers | My territory customers | 4 | Customer list |
| | My performance | My metrics | 4 | Self-assessment |
| RM Dashboard | RM-specific view | Team metrics | 10 | RM sees team data |
| | Team leaderboard | TM rankings | 4 | Rankings visible |
| | Team trainings | All TM trainings | 4 | Trainings visible |
| | Territory overview | All territories | 4 | Territories visible |

#### 10.2 Dashboard Customization
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Widget System | Build `DashboardCustomizer.tsx` | Drag-drop widgets | 10 | Widgets movable |
| | Widget library | Available widgets | 6 | Widget options |
| | Layout grid | 12-column grid | 4 | Grid layout |
| | Save layout | Persist user layout | 4 | Layout saves |
| Personalization | User preferences | Dashboard per user | 4 | Per-user config |
| | Default by role | Role-based defaults | 3 | Defaults apply |

#### 10.3 Report Scheduling
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Report Scheduler | Build `ReportScheduler.tsx` | Schedule reports | 8 | Reports scheduled |
| | Daily/weekly/monthly | Recurrence options | 4 | Recurrence works |
| | Recipients | Email list | 3 | Recipients receive |
| | Format selection | PDF/Excel | 2 | Format respected |
| Scheduled Jobs | Background job system | Cron-based execution | 6 | Jobs run on schedule |
| | Job monitoring | Status of scheduled jobs | 4 | Status visible |

---

## Phase 5: Dealer Portal (Sprints 11-14) - Months 6-7

> **KEY: Replace Shopify for B2B dealer ordering**

### Sprint 11: Dealer Authentication & Foundation

#### 11.1 Dealer Authentication
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Dealer User Model | Separate from internal users | dealerId, email, companyId | 4 | Model created |
| Registration | Build `DealerRegistrationForm.tsx` | Dealer self-registration | 8 | Registration works |
| | Company lookup | Find existing dealer | 4 | Company found |
| | Approval workflow | Admin approves new dealers | 6 | Approval required |
| Login | Build `DealerLoginForm.tsx` | Dealer-specific login | 6 | Login works |
| | Separate auth | Different auth provider | 4 | Separate from internal |
| | Session management | Dealer sessions | 3 | Sessions work |
| Dealer Profile | Build `DealerProfileManagement.tsx` | Manage dealer profile | 6 | Profile editable |
| | Company info | Name, address, contacts | 4 | Company info saved |
| | Preferences | Notification preferences | 3 | Preferences saved |

#### 11.2 Dealer Dashboard
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Dealer Dashboard | Build `DealerDashboard.tsx` | Dealer home page | 10 | Dashboard renders |
| | Recent orders | Last 5 orders | 4 | Orders visible |
| | Order status | Pending/shipped/delivered | 4 | Status accurate |
| | Account summary | Credit, balance | 4 | Account info |
| | Quick actions | Reorder, view catalog | 4 | Actions work |
| Dealer Navigation | Build `DealerNavigation.tsx` | Dealer-specific nav | 4 | Navigation works |
| | Catalog link | Product catalog | 2 | Links work |
| | Orders link | Order history | 2 | Links work |
| | Account link | Account management | 2 | Links work |

### Sprint 12: Product Catalog

#### 12.1 Product Catalog
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Product Catalog | Build `ProductCatalog.tsx` | Browse products | 12 | **KEY: Browse catalog** |
| | Grid view | Product cards in grid | 4 | Grid displays |
| | List view | Compact list | 4 | List displays |
| | Category navigation | Browse by category | 4 | Categories work |
| | Search | Search by name, SKU | 4 | Search works |
| Product Search | Search functionality | Full-text search | 6 | Search accurate |
| | Filters | Price, category, availability | 6 | Filters work |
| | Sort | By name, price, popularity | 3 | Sort works |
| Product Details | Build `ProductDetailModal.tsx` | Product detail view | 8 | Details display |
| | Specifications | Detailed specs | 4 | Specs visible |
| | Pricing | Dealer pricing | 4 | Pricing accurate |
| | Availability | Stock status | 4 | Stock accurate |
| | Images | Product images | 4 | Images display |

#### 12.2 Product Features
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Product Comparison | Build `ProductComparison.tsx` | Compare products | 8 | Side-by-side compare |
| | Select products | Add to compare | 3 | Selection works |
| | Compare table | Specs comparison | 4 | Table displays |
| Favorites | Build `ProductFavoritesManager.tsx` | Favorite products | 6 | **KEY: Quick access** |
| | Add to favorites | Heart button | 2 | Add works |
| | Favorites list | View favorites | 3 | List displays |
| Saved Searches | Build `SavedSearchManager.tsx` | Save search criteria | 6 | Searches saved |
| | Save search | Save current filters | 3 | Save works |
| | Load search | Apply saved search | 3 | Load works |
| Quick Search | Build `QuickSearchAccess.tsx` | Quick product lookup | 4 | Fast search |

### Sprint 13: Order Management

#### 13.1 Shopping Cart & Checkout
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Shopping Cart | Build `ShoppingCart.tsx` | Shopping cart | 10 | **KEY: Add to cart** |
| | Add to cart | Add product button | 4 | Products added |
| | Quantity update | Change quantities | 3 | Quantities update |
| | Remove item | Remove from cart | 2 | Items removed |
| | Cart total | Calculate totals | 3 | Totals accurate |
| | Persist cart | Save cart across sessions | 4 | Cart persists |
| Checkout | Checkout workflow | Review → Submit | 8 | Checkout works |
| | Shipping address | Select/add address | 4 | Address works |
| | Order review | Review before submit | 3 | Review step |
| | Order confirmation | Build `OrderConfirmation.tsx` | 6 | Confirmation displayed |
| Quick Order | Build `QuickOrderManager.tsx` | Reorder previous | 8 | **KEY: Repeat orders** |
| | Order history | View past orders | 4 | History visible |
| | Reorder button | One-click reorder | 4 | Reorder works |

#### 13.2 Order History & Tracking
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Order History | Build `OrderHistory.tsx` | View all orders | 8 | Orders listed |
| | Order list | List with status | 4 | List displays |
| | Filter by status | Open, shipped, etc. | 3 | Filters work |
| | Search orders | Find by order # | 3 | Search works |
| Order Tracking | Shipment tracking | Real-time tracking | 8 | **KEY: Track shipments** |
| | Build `ShipmentHistoryTracker.tsx` | Tracking history | 6 | History visible |
| | Carrier integration | Build `ShippingCarrierIntegration.tsx` | 8 | Carrier data |
| | Tracking links | Links to carrier | 3 | Links work |

### Sprint 14: Account Management & Delivery

#### 14.1 Account Management
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Billing | Account statements | View invoices | 6 | Invoices visible |
| | Payment history | Past payments | 6 | Payments listed |
| | Download statements | PDF download | 4 | PDFs download |
| Credit | Credit utilization | Show credit limit | 4 | Credit visible |
| | Credit widget | Visual indicator | 3 | Widget displays |

#### 14.2 Delivery Management
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Delivery Preferences | Build `DeliveryPreferenceManager.tsx` | Manage preferences | 6 | Preferences saved |
| | Default address | Set default shipping | 3 | Default works |
| | Delivery notes | Standing instructions | 3 | Notes saved |
| Delivery Scheduling | Build `DeliveryWindowScheduler.tsx` | Request delivery time | 6 | Window requested |
| | Rescheduling | Build `ShipmentReschedulingManager.tsx` | 6 | Reschedule works |
| Proof of Delivery | Build `ProofOfDeliveryViewer.tsx` | View POD | 4 | POD visible |
| | Signature capture | View signature | 3 | Signature displays |

---

## Phase 6: Mobile App (Sprints 11-15) - Months 6-8

> **KEY: Replace Map My Customer for TM field work**

### Sprint 11-12: Mobile Foundation (Parallel with Dealer Portal)

#### Mobile Foundation
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| React Native Setup | Initialize project | Expo or bare RN | 6 | App builds |
| | Navigation | React Navigation setup | 6 | Navigation works |
| | Authentication | Secure token storage | 8 | Auth works on mobile |
| | API client | REST client for API | 6 | API calls work |
| TM Dashboard | Mobile dashboard | Key metrics | 10 | Dashboard renders |
| | Today's schedule | Today's trainings | 6 | Schedule visible |
| | Quick actions | Quick add activity | 6 | Actions work |

### Sprint 13: Mobile Features

#### TM Mobile Features
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Customer List | Mobile customer list | Search, filter | 8 | Customers listed |
| | Customer detail | View customer | 6 | Details visible |
| Activity Logging | Quick activity add | One-tap activity | 8 | **KEY: Quick logging** |
| | Activity types | Call, visit, training | 4 | Types available |
| Training Completion | Mark complete on mobile | One-tap complete | 8 | **KEY: Mobile complete** |
| | Completion notes | Add notes | 4 | Notes captured |
| | Photo capture | Take training photos | 4 | Photos work |

### Sprint 13-14: Voice Notes

#### Voice-to-Text
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Voice Recording | Record voice notes | Audio capture | 6 | Recording works |
| | Speech-to-text | Convert to text | 8 | **KEY: Voice notes** |
| | Edit transcription | Correct errors | 4 | Editable |
| | Save to activity | Attach to record | 4 | Notes saved |

### Sprint 15: Map & Route Planning

#### Map Integration
| Task | Sub-Task | Details | Hours | Acceptance Criteria |
|------|----------|---------|-------|---------------------|
| Customer Map | Map view of customers | Pins on map | 12 | **KEY: Replace MMC** |
| | Customer pins | Show customers on map | 6 | Pins display |
| | Cluster view | Group nearby pins | 4 | Clusters work |
| Route Planning | Optimized routes | Route optimization | 10 | Routes optimized |
| | Turn-by-turn | Navigation integration | 4 | Nav works |
| Check-in | GPS check-in | Verify location | 6 | Check-in works |
| | Auto-log visit | Log visit on check-in | 4 | Visit logged |

---

## Phase 7: Admin & Quality (Sprints 11+)

### System Health & Monitoring

| Task | Sub-Task | Details | Hours |
|------|----------|---------|-------|
| System Health | Build `SystemHealthMonitor.tsx` | System status dashboard | 10 |
| Integration Status | Build `IntegrationStatusMonitor.tsx` | Integration health | 8 |
| Data Quality | Build `DataQualityDashboard.tsx` | Data quality metrics | 10 |
| User Activity | Build `UserActivityMonitor.tsx` | User activity tracking | 8 |

---

## Sprint Summary

| Sprint | Focus | Key Deliverables |
|--------|-------|------------------|
| 1 | Foundation | Project setup, auth, database |
| 2 | Users & Customers | User management, customer CRUD |
| 3 | Territory & Groups | Territory assignment, group management |
| 4 | Leads & HubSpot | Lead pipeline, HubSpot integration |
| 5 | CIS & Acumatica | CIS automation, customer sync |
| 6 | Onboarding & Notifications | Workflow engine, notification system |
| **7** | **Training Scheduling** | **Calendar, scheduling, Outlook sync** |
| **8** | **Training Reports** | **Completion tracking, reports** |
| 9 | Report Builder | Custom reports, visualizations |
| 10 | Dashboards | Role-based dashboards |
| 11 | Dealer Portal Start | Auth, dashboard, mobile foundation |
| 12 | Product Catalog | Catalog, search, mobile TM features |
| 13 | Dealer Orders | Cart, checkout, voice notes |
| 14 | Dealer Account | Billing, delivery management |
| 15 | Mobile Maps | Map view, route planning, check-in |
| 16-18 | Testing | Unit, integration, E2E testing |
| 18 | Deployment | Production setup, documentation |
| 19 | Training & Support | User training, help desk |

---

## Estimated Story Points by Module

| Module | Story Points | Sprints |
|--------|-------------|---------|
| Core Infrastructure | 50 | 1-2 |
| Residential - Customers | 85 | 2-3 |
| Residential - Territory & Groups | 75 | 3-4 |
| Residential - Leads & CIS | 95 | 4-5 |
| Residential - Onboarding | 60 | 6 |
| **Residential - Training** | **120** | **7-8** |
| Residential - Reporting | 110 | 9-10 |
| Integration - Acumatica | 95 | 4-7 |
| Integration - HubSpot | 35 | 4-5 |
| Integration - Outlook | 40 | 7-8 |
| Dealer Portal | 150 | 11-14 |
| Mobile App | 130 | 11-15 |
| Admin & Quality | 65 | 9-11 |
| Testing & Deployment | 110 | 16-19 |
| **Total** | **~1,220** | **19 Sprints** |

---

## Critical Path

1. **Sprint 1-2:** Foundation must be complete before features
2. **Sprint 4-6:** Acumatica integration blocks order display
3. **Sprint 7-8:** Training features are highest priority per Currie
4. **Sprint 9-10:** Reporting depends on training data
5. **Sprint 11+:** Dealer Portal and Mobile can run in parallel

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Acumatica API complexity | Early research sprint, Dan's involvement |
| Training data migration | Work with current CRM data export |
| Dealer adoption | Gradual rollout, maintain Shopify fallback |
| Mobile platform differences | Expo for cross-platform, or prioritize iOS |
| Outlook integration limits | Microsoft 365 admin approval early |

