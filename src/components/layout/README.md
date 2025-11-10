# Residential Layout Components

This directory contains the standardized layout components for residential CRM pages, implementing consistent navigation, breadcrumbs, and quick actions across all residential modules.

## Components Overview

### 1. PageHeader
Provides consistent page headers with breadcrumbs, titles, and actions.

```tsx
import { PageHeader } from '@/components/layout/PageHeader';

<PageHeader
  title="Customer Details"
  subtitle="View and manage customer information"
  breadcrumbs={[
    { label: 'Dashboard', href: '/' },
    { label: 'Customers', href: '/customers' },
    { label: 'Details', active: true }
  ]}
  actions={[
    {
      id: 'edit',
      label: 'Edit Customer',
      icon: <IconEdit size={16} />,
      onClick: handleEdit,
      priority: 'primary'
    }
  ]}
/>
```

### 2. ResidentialLayout
Wrapper component that provides consistent layout structure.

```tsx
import { ResidentialLayout } from '@/components/layout/ResidentialLayout';

<ResidentialLayout
  header={{
    title: "Customer Management",
    subtitle: "Manage your customer relationships",
    actions: [...]
  }}
>
  <YourPageContent />
</ResidentialLayout>
```

### 3. SimpleResidentialPage
Convenience component for simple pages.

```tsx
import { SimpleResidentialPage } from '@/components/layout/ResidentialLayout';

<SimpleResidentialPage
  title="Lead Onboarding"
  section="leads"
  subsection="Onboarding"
  actions={[...]}
>
  <YourPageContent />
</SimpleResidentialPage>
```

### 4. QuickActions
Responsive action buttons with overflow handling.

```tsx
import { QuickActions, CommonActions } from '@/components/layout/QuickActions';

const actions = [
  CommonActions.customer.call(handleCall),
  CommonActions.customer.email(handleEmail),
  CommonActions.crud.edit('Edit Customer', handleEdit),
];

<QuickActions
  actions={actions}
  maxVisible={3}
  variant="mixed"
/>
```

### 5. NavigationContext
Provides navigation state management.

```tsx
import { useNavigation, useBackNavigation } from '@/components/layout/NavigationContext';

function MyComponent() {
  const { navigationState } = useNavigation();
  const backButton = useBackNavigation();
  
  // Access current section, breadcrumbs, etc.
}
```

## Usage Patterns

### Standard Page Pattern
```tsx
export default function MyResidentialPage() {
  return (
    <SimpleResidentialPage
      title="Page Title"
      subtitle="Page description"
      section="customers" // or 'leads', 'training', etc.
      actions={[
        {
          id: 'primary-action',
          label: 'Primary Action',
          onClick: handlePrimaryAction,
          priority: 'primary',
          variant: 'filled'
        }
      ]}
    >
      <YourPageContent />
    </SimpleResidentialPage>
  );
}
```

### Custom Header Pattern
```tsx
export default function CustomPage() {
  return (
    <ResidentialLayout
      header={{
        title: "Custom Page",
        backButton: { href: '/previous-page' },
        actions: [...],
        children: <CustomHeaderContent />
      }}
    >
      <YourPageContent />
    </ResidentialLayout>
  );
}
```

### Detail Page Pattern
```tsx
export default function DetailPage() {
  return (
    <AppLayout>
      <div className="residential-content-container">
        <PageHeader
          title={item.name}
          subtitle={`ID: ${item.id}`}
          backButton={{
            href: '/items',
            label: 'Back to Items'
          }}
          actions={[
            CommonActions.crud.edit('Edit Item', handleEdit),
            CommonActions.crud.delete('Delete Item', handleDelete)
          ]}
        />
        <YourDetailContent />
      </div>
    </AppLayout>
  );
}
```

## Action Patterns

### Common Action Sets
```tsx
// Customer actions
const customerActions = [
  CommonActions.customer.call(handleCall),
  CommonActions.customer.email(handleEmail),
  CommonActions.customer.schedule(handleSchedule),
];

// CRUD actions
const crudActions = [
  CommonActions.crud.create('New Item', handleCreate),
  CommonActions.crud.edit('Edit Item', handleEdit),
  CommonActions.crud.delete('Delete Item', handleDelete),
];

// Export actions
const exportActions = [
  CommonActions.export.download(handleDownload),
  CommonActions.export.print(handlePrint),
  CommonActions.export.share(handleShare),
];
```

### Custom Actions
```tsx
const customActions = [
  {
    id: 'custom-action',
    label: 'Custom Action',
    icon: <IconCustom size={16} />,
    onClick: handleCustomAction,
    priority: 'secondary',
    variant: 'outline'
  }
];
```

## Responsive Behavior

The components automatically adapt to different screen sizes:

- **Mobile (≤480px)**: Shows 1 action button, rest in overflow menu
- **Tablet (≤768px)**: Shows 3 action buttons, rest in overflow menu  
- **Desktop (≥1024px)**: Shows 5 action buttons, rest in overflow menu

## Navigation Context

The NavigationContext automatically:
- Tracks current section and subsection
- Generates breadcrumbs based on URL
- Provides back navigation helpers
- Maintains navigation state across page changes

## CSS Classes

The components use these CSS classes for styling:
- `.residential-content-container`: Main content container with proper spacing
- Responsive breakpoints are handled automatically
- All components follow Mantine design system

## Migration Guide

To migrate existing pages:

1. Replace manual breadcrumbs with `PageHeader` component
2. Wrap pages with `SimpleResidentialPage` or `ResidentialLayout`
3. Convert action buttons to use `QuickActions` component
4. Remove manual back navigation logic (handled automatically)

## Requirements Addressed

This implementation addresses the following requirements:
- **1.2**: Consistent navigation and layout structure
- **1.3**: Uniform sidebar navigation and breadcrumb patterns  
- **1.4**: Consistent action button placement and styling
- **4.4**: Proper responsive behavior for action buttons