# IG Career Hub - Component Specifications

## 📦 Component Library Structure

All components follow this organization:

```
src/components/
├── ui/                  # Base UI components (buttons, inputs, etc.)
├── dashboard/           # Dashboard-specific components
├── applications/        # Application management components
├── auth/               # Authentication components
└── shared/             # Shared across multiple sections
```

---

## 🎨 Base UI Components

### Button (`src/components/ui/Button.tsx`)

**Purpose:** Reusable button component with multiple variants

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

**Implementation:**
```tsx
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  children,
  onClick,
  type = 'button',
  className = ''
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-gradient-to-br from-primary-teal to-primary-teal-dark text-white hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(20,184,166,0.3)]',
    secondary: 'bg-white/5 border border-white/10 text-white/90 hover:bg-white/10 hover:border-white/20',
    ghost: 'bg-transparent text-white/70 hover:bg-white/5 hover:text-white/90',
    danger: 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
  };
  
  const sizes = {
    sm: 'text-sm px-3 py-2',
    md: 'text-sm px-6 py-3',
    lg: 'text-base px-8 py-4'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon}
      {children}
    </button>
  );
}
```

**Usage:**
```tsx
<Button variant="primary" onClick={handleSubmit}>
  Save Application
</Button>

<Button variant="secondary" icon={<Plus />} loading={isLoading}>
  Add New
</Button>
```

---

### Input (`src/components/ui/Input.tsx`)

**Purpose:** Text input field with label and error states

**Props:**
```typescript
interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'date';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  className?: string;
}
```

**Implementation:**
```tsx
export function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  autoFocus = false,
  className = ''
}: InputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white/70">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
        className={`
          w-full px-4 py-3 rounded-lg
          bg-white/5 border text-white
          placeholder:text-white/40
          focus:outline-none focus:border-primary-teal/50 focus:bg-white/10
          focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          ${error ? 'border-red-500/50' : 'border-white/10'}
        `}
      />
      
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
```

---

### Modal (`src/components/ui/Modal.tsx`)

**Purpose:** Reusable modal/dialog component

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}
```

**Implementation:**
```tsx
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  showCloseButton = true
}: ModalProps) {
  if (!isOpen) return null;
  
  const maxWidths = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className={`bg-[rgba(10,14,26,0.95)] border border-white/10 rounded-2xl p-8 ${maxWidths[maxWidth]} w-full max-h-[90vh] overflow-y-auto shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-6">
            {title && (
              <h2 className="text-2xl font-bold text-white">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
```

---

### Card (`src/components/ui/Card.tsx`)

**Purpose:** Container component with consistent styling

**Props:**
```typescript
interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  onClick?: () => void;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}
```

**Implementation:**
```tsx
export function Card({
  children,
  hover = false,
  onClick,
  className = '',
  padding = 'md'
}: CardProps) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  return (
    <div
      onClick={onClick}
      className={`
        bg-[rgba(10,14,26,0.6)] border border-white/10 rounded-2xl
        backdrop-blur-xl
        ${paddings[padding]}
        ${hover ? 'transition-all duration-300 hover:border-primary-teal/30 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(20,184,166,0.15)] cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
```

---

### Select (`src/components/ui/Select.tsx`)

**Purpose:** Dropdown select component

**Props:**
```typescript
interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
}
```

**Implementation:**
```tsx
export function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  required = false,
  className = ''
}: SelectProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white/70">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`
          w-full px-4 py-3 rounded-lg
          bg-white/5 border text-white
          focus:outline-none focus:border-primary-teal/50 focus:bg-white/10
          focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)]
          transition-all duration-200
          ${error ? 'border-red-500/50' : 'border-white/10'}
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
```

---

### LoadingSpinner (`src/components/ui/LoadingSpinner.tsx`)

**Purpose:** Loading indicator

**Props:**
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Implementation:**
```tsx
export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };
  
  return (
    <div
      className={`
        ${sizes[size]}
        border-white/20 border-t-primary-teal rounded-full
        animate-spin
        ${className}
      `}
    />
  );
}
```

---

## 📊 Dashboard Components

### StatsOverview (`src/components/dashboard/StatsOverview.tsx`)

**Purpose:** Display key metrics banner

**Props:**
```typescript
interface StatsOverviewProps {
  totalApplications: number;
  totalInterviews: number;
  totalOffers: number;
  weeklyGoal: number;
  currentWeekApplications: number;
  responseRate: number;
}
```

**Implementation:**
```tsx
export function StatsOverview({
  totalApplications,
  totalInterviews,
  totalOffers,
  weeklyGoal,
  currentWeekApplications,
  responseRate
}: StatsOverviewProps) {
  const goalPercentage = Math.min((currentWeekApplications / weeklyGoal) * 100, 100);
  
  return (
    <Card className="mb-8 border-2 border-primary-teal/20 shadow-[0_0_40px_rgba(20,184,166,0.05)]">
      <div className="flex items-center gap-3 mb-8">
        <Target className="w-5 h-5 text-primary-teal" />
        <h2 className="text-lg font-semibold text-white/90">Your Journey at a Glance</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-primary-teal/50 to-transparent" />
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard number={totalApplications} label="Applications" />
        <StatCard number={totalInterviews} label="Interviews" />
        <StatCard number={totalOffers} label="Offers" />
      </div>
      
      {/* Progress Section */}
      <div className="pt-8 border-t border-white/5">
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-teal to-primary-teal-light rounded-full transition-all duration-1000"
                style={{ width: `${goalPercentage}%` }}
              />
            </div>
            <p className="text-sm text-white/50">
              {goalPercentage}% to weekly goal ({currentWeekApplications} of {weeklyGoal} applications)
            </p>
          </div>
          
          {/* Response Rate */}
          <p className="text-sm text-white/70">
            Response Rate: {responseRate}% 
            <span className="text-green-400 ml-2">↑ {responseRate - 15}% vs industry avg</span>
          </p>
        </div>
      </div>
    </Card>
  );
}

function StatCard({ number, label }: { number: number; label: string }) {
  return (
    <div>
      <div className="text-5xl font-light text-white mb-2 tracking-tight">
        {number}
      </div>
      <div className="text-sm text-white/50">{label}</div>
    </div>
  );
}
```

---

### KanbanBoard (`src/components/dashboard/KanbanBoard.tsx`)

**Purpose:** Drag-and-drop pipeline view

**Props:**
```typescript
interface KanbanBoardProps {
  applications: Application[];
  onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void;
  onEdit: (application: Application) => void;
  onDelete: (applicationId: string) => void;
}
```

**Key Features:**
- Drag and drop functionality
- 4 columns: Applied, Phone Screen, Interview, Offer
- Color-coded status indicators
- Quick action buttons

**Implementation:** (See PHASE-1-MVP.md for full implementation)

---

### ApplicationCard (`src/components/dashboard/ApplicationCard.tsx`)

**Purpose:** Individual application card in Kanban

**Props:**
```typescript
interface ApplicationCardProps {
  application: Application;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}
```

**Implementation:**
```tsx
export function ApplicationCard({
  application,
  onEdit,
  onDelete,
  isDragging = false
}: ApplicationCardProps) {
  const daysAgo = Math.floor(
    (Date.now() - new Date(application.date_applied).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const statusColor = daysAgo < 5 ? 'green' : daysAgo < 10 ? 'yellow' : 'red';
  
  return (
    <Card
      padding="sm"
      hover={!isDragging}
      className={`mb-3 cursor-move ${isDragging ? 'opacity-50' : ''}`}
    >
      {/* Company & Role */}
      <h3 className="font-semibold text-white mb-1">{application.company_name}</h3>
      <p className="text-sm text-white/50 mb-3">{application.position_title}</p>
      
      {/* Date */}
      <p className="text-xs text-white/40 mb-3">{daysAgo} days ago</p>
      
      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors"
        >
          <Edit2 className="w-4 h-4 text-white/60" />
        </button>
        <button
          onClick={onDelete}
          className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4 text-white/60 hover:text-red-400" />
        </button>
      </div>
      
      {/* Status Indicator */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
        <div className={`w-1.5 h-1.5 rounded-full status-dot-${statusColor}`} />
        <span className="text-xs text-white/50">
          {statusColor === 'green' ? 'Active' : statusColor === 'yellow' ? 'Pending' : 'Stale'}
        </span>
      </div>
    </Card>
  );
}
```

---

### ToolGrid (`src/components/dashboard/ToolGrid.tsx`)

**Purpose:** Display 6 tool launcher tiles

**Props:**
```typescript
interface ToolGridProps {
  onToolClick?: (toolName: string) => void;
}
```

**Implementation:**
```tsx
const TOOLS = [
  {
    name: 'Resume Analyzer',
    icon: '📄',
    description: 'Check your ATS score',
    url: process.env.NEXT_PUBLIC_RESUME_ANALYZER_URL
  },
  {
    name: 'Cover Letter Generator',
    icon: '✉️',
    description: 'Write compelling letters',
    url: process.env.NEXT_PUBLIC_COVER_LETTER_URL
  },
  {
    name: 'Interview Coach',
    icon: '🎤',
    description: 'Practice live interviews',
    url: process.env.NEXT_PUBLIC_INTERVIEW_COACH_URL
  },
  {
    name: 'Oracle PRO',
    icon: '🔮',
    description: 'Generate questions',
    url: process.env.NEXT_PUBLIC_ORACLE_PRO_URL
  },
  {
    name: 'Hidden Job Boards',
    icon: '🔍',
    description: 'Find niche boards',
    url: process.env.NEXT_PUBLIC_HIDDEN_BOARDS_URL
  },
  {
    name: 'Career Coach',
    icon: '💬',
    description: 'Get AI advice',
    url: process.env.NEXT_PUBLIC_CAREER_COACH_URL
  }
];

export function ToolGrid({ onToolClick }: ToolGridProps) {
  const handleToolClick = (tool: typeof TOOLS[0]) => {
    window.open(tool.url, '_blank');
    onToolClick?.(tool.name);
  };
  
  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold text-white/90 mb-6 flex items-center gap-2">
        <Wrench className="w-5 h-5 text-primary-teal" />
        Your Toolkit
      </h2>
      
      <div className="grid grid-cols-3 gap-5">
        {TOOLS.map((tool) => (
          <Card
            key={tool.name}
            hover
            onClick={() => handleToolClick(tool)}
            className="h-44 flex flex-col items-center justify-center text-center"
          >
            <div className="text-4xl mb-4 filter grayscale-[30%]">{tool.icon}</div>
            <h3 className="text-base font-semibold text-white mb-2">{tool.name}</h3>
            <p className="text-sm text-white/50">{tool.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 📝 Application Management Components

### AddApplicationModal (`src/components/applications/AddApplicationModal.tsx`)

**Purpose:** Form to add new application

**Props:**
```typescript
interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
}
```

**Form Fields:**
- Company Name* (required)
- Position Title* (required)
- Job URL
- Location
- Remote Type (dropdown)
- Date Applied (date picker, default today)
- Source
- Notes (textarea)

**Validation:**
- Company name: min 2 chars, max 100 chars
- Position title: min 2 chars, max 100 chars
- Job URL: valid URL format (if provided)
- Date: cannot be in future

---

### EditApplicationModal (`src/components/applications/EditApplicationModal.tsx`)

**Purpose:** Edit existing application

**Props:**
```typescript
interface EditApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  onSubmit: (updates: Partial<Application>) => Promise<void>;
}
```

**Same form as Add, but pre-filled with existing data**

---

### DeleteConfirmModal (`src/components/applications/DeleteConfirmModal.tsx`)

**Purpose:** Confirm before deleting

**Props:**
```typescript
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companyName: string;
}
```

**Implementation:**
```tsx
export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  companyName
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" title="Delete Application?">
      <p className="text-white/70 mb-6">
        Are you sure you want to delete your application to{' '}
        <span className="text-white font-semibold">{companyName}</span>?
        This action cannot be undone.
      </p>
      
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete Application
        </Button>
      </div>
    </Modal>
  );
}
```

---

## 🔐 Authentication Components

### LoginForm (`src/components/auth/LoginForm.tsx`)

**Purpose:** Email/password login

**Fields:**
- Email* (email validation)
- Password* (min 8 chars)
- Remember Me (checkbox)

**Features:**
- Show/hide password toggle
- "Forgot password?" link
- Loading state during submission
- Error display

---

### SignupForm (`src/components/auth/SignupForm.tsx`)

**Purpose:** Create new account

**Fields:**
- Full Name*
- Email* (email validation)
- Password* (min 8 chars, strength indicator)
- Confirm Password* (must match)

**Features:**
- Real-time password strength indicator
- Password match validation
- Loading state during submission
- Error display

---

## 🎯 Shared Components

### Header (`src/components/shared/Header.tsx`)

**Purpose:** Top navigation bar

**Features:**
- Logo (links to dashboard)
- Notifications bell (with badge count)
- Settings icon
- User menu dropdown

**Implementation:**
```tsx
export function Header() {
  const { user, signOut } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 bg-[rgba(10,14,26,0.8)] backdrop-blur-xl border-b border-white/5">
      <div className="max-w-[1600px] mx-auto px-8 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="text-xl font-normal text-white hover:text-primary-teal transition-colors">
          IG Career Hub
        </Link>
        
        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-primary-teal/10 border border-white/10 hover:border-primary-teal/30 rounded-lg transition-all">
            <Bell className="w-5 h-5 text-white/60" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
              3
            </span>
          </button>
          
          {/* Settings */}
          <button className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all">
            <Settings className="w-5 h-5 text-white/60" />
          </button>
          
          {/* User Menu */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-primary-teal/10 border border-white/10 hover:border-primary-teal/30 rounded-lg cursor-pointer transition-all">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-teal to-primary-teal-dark rounded-full flex items-center justify-center text-sm font-bold">
              {user?.full_name?.[0] || 'U'}
            </div>
            <span className="text-sm font-medium text-white/90">{user?.full_name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
```

---

## 📋 Component Checklist

Before marking a component complete, verify:

- [ ] TypeScript types defined
- [ ] Props interface exported
- [ ] Handles loading states
- [ ] Handles error states
- [ ] Handles empty states
- [ ] Accessible (keyboard nav, ARIA labels)
- [ ] Responsive design
- [ ] Follows design system
- [ ] Smooth animations
- [ ] Proper error handling

---

**Last Updated:** October 26, 2025  
**Version:** 1.0  
**Status:** Complete Component Specifications