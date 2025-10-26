# IG Career Hub - Design System

## 🎨 Design Philosophy

**Aesthetic:** Ultra-modern, premium SaaS interface inspired by Linear, Notion, and Vercel  
**Theme:** Dark mode with subtle glows and minimal borders  
**Feel:** Professional, organized, empowering  
**Mood:** Sleek, fast, intelligent  

---

## 🎯 Design Principles

1. **Minimalism** - Remove unnecessary elements, focus on content
2. **Clarity** - Information hierarchy should be immediately obvious
3. **Feedback** - Every interaction should have clear visual feedback
4. **Consistency** - Patterns repeat throughout the application
5. **Performance** - Animations should be smooth and purposeful

---

## 🎨 Color Palette

### Primary Colors

```css
/* Teal Accent - Primary brand color */
--primary-teal: #14B8A6;
--primary-teal-dark: #0D9488;
--primary-teal-light: #5EEAD4;

/* Teal with opacity (for overlays) */
--teal-5: rgba(20, 184, 166, 0.05);
--teal-10: rgba(20, 184, 166, 0.1);
--teal-15: rgba(20, 184, 166, 0.15);
--teal-20: rgba(20, 184, 166, 0.2);
--teal-30: rgba(20, 184, 166, 0.3);
```

### Background Colors

```css
/* Pure black base */
--bg-black: #000000;

/* Dark cards and surfaces */
--bg-dark: rgba(10, 14, 26, 0.6);
--bg-darker: rgba(10, 14, 26, 0.8);

/* Subtle overlays */
--overlay-light: rgba(255, 255, 255, 0.02);
--overlay-medium: rgba(255, 255, 255, 0.05);
--overlay-strong: rgba(255, 255, 255, 0.08);
```

### Text Colors

```css
/* White text with varying opacity */
--text-white: #FFFFFF;
--text-primary: rgba(255, 255, 255, 0.95);
--text-secondary: rgba(255, 255, 255, 0.7);
--text-tertiary: rgba(255, 255, 255, 0.5);
--text-disabled: rgba(255, 255, 255, 0.3);
```

### Border Colors

```css
/* Subtle borders */
--border-subtle: rgba(255, 255, 255, 0.06);
--border-medium: rgba(255, 255, 255, 0.1);
--border-strong: rgba(255, 255, 255, 0.15);

/* Teal borders */
--border-teal: rgba(20, 184, 166, 0.2);
--border-teal-strong: rgba(20, 184, 166, 0.4);
```

### Status Colors

```css
/* Success / Active (Green) */
--status-success: #10B981;
--status-success-bg: rgba(16, 185, 129, 0.1);
--status-success-border: rgba(16, 185, 129, 0.3);

/* Warning / Pending (Yellow/Amber) */
--status-warning: #F59E0B;
--status-warning-bg: rgba(245, 158, 11, 0.1);
--status-warning-border: rgba(245, 158, 11, 0.3);

/* Error / Urgent (Red) */
--status-error: #EF4444;
--status-error-bg: rgba(239, 68, 68, 0.1);
--status-error-border: rgba(239, 68, 68, 0.3);

/* Info (Blue) */
--status-info: #3B82F6;
--status-info-bg: rgba(59, 130, 246, 0.1);
--status-info-border: rgba(59, 130, 246, 0.3);
```

### Shadow & Glow Colors

```css
/* Subtle shadows */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.4);

/* Teal glows */
--glow-teal-sm: 0 0 20px rgba(20, 184, 166, 0.1);
--glow-teal-md: 0 0 30px rgba(20, 184, 166, 0.15);
--glow-teal-lg: 0 0 40px rgba(20, 184, 166, 0.2);

/* Button hover glows */
--glow-button: 0 8px 25px rgba(20, 184, 166, 0.3);
```

---

## ✍️ Typography

### Font Family

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Why Inter?**
- Modern geometric sans-serif
- Excellent readability at all sizes
- Professional and clean
- Great number rendering

### Font Weights

```css
--font-light: 300;      /* Large numbers only */
--font-regular: 400;    /* Body text */
--font-medium: 500;     /* Labels, small headings */
--font-semibold: 600;   /* Subheadings, important text */
--font-bold: 700;       /* Headings, emphasis */
--font-extrabold: 800;  /* Large headings, hero text */
```

### Type Scale

```css
/* Display - Hero text */
--text-display: 56px;
--text-display-lh: 1;
--text-display-ls: -2px;
--text-display-weight: 300;

/* Heading 1 */
--text-h1: 32px;
--text-h1-lh: 1.2;
--text-h1-ls: -1px;
--text-h1-weight: 700;

/* Heading 2 */
--text-h2: 24px;
--text-h2-lh: 1.3;
--text-h2-ls: -0.5px;
--text-h2-weight: 700;

/* Heading 3 */
--text-h3: 20px;
--text-h3-lh: 1.4;
--text-h3-ls: -0.3px;
--text-h3-weight: 600;

/* Heading 4 */
--text-h4: 18px;
--text-h4-lh: 1.4;
--text-h4-ls: -0.2px;
--text-h4-weight: 600;

/* Body Large */
--text-lg: 16px;
--text-lg-lh: 1.5;
--text-lg-ls: 0px;
--text-lg-weight: 400;

/* Body Regular */
--text-base: 14px;
--text-base-lh: 1.5;
--text-base-ls: 0px;
--text-base-weight: 400;

/* Body Small */
--text-sm: 13px;
--text-sm-lh: 1.5;
--text-sm-ls: 0px;
--text-sm-weight: 400;

/* Caption */
--text-xs: 12px;
--text-xs-lh: 1.4;
--text-xs-ls: 0px;
--text-xs-weight: 500;

/* Label */
--text-label: 11px;
--text-label-lh: 1.3;
--text-label-ls: 0px;
--text-label-weight: 600;
```

### Letter Spacing

```css
/* Negative tracking for modern feel */
--ls-tight-xl: -2px;    /* Display numbers */
--ls-tight-lg: -1px;    /* Large headings */
--ls-tight-md: -0.5px;  /* Medium headings */
--ls-tight-sm: -0.3px;  /* Small headings */
--ls-tight-xs: -0.2px;  /* Body, buttons */

/* Normal tracking */
--ls-normal: 0px;       /* Default body text */
```

### Font Smoothing

```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

---

## 📏 Spacing System

### Base Unit: 4px

```css
--space-1: 4px;    /* 0.25rem */
--space-2: 8px;    /* 0.5rem */
--space-3: 12px;   /* 0.75rem */
--space-4: 16px;   /* 1rem */
--space-5: 20px;   /* 1.25rem */
--space-6: 24px;   /* 1.5rem */
--space-8: 32px;   /* 2rem */
--space-10: 40px;  /* 2.5rem */
--space-12: 48px;  /* 3rem */
--space-16: 64px;  /* 4rem */
--space-20: 80px;  /* 5rem */
```

### Usage Guidelines

```css
/* Component internal padding */
--padding-xs: var(--space-3);   /* 12px - Dense components */
--padding-sm: var(--space-4);   /* 16px - Standard padding */
--padding-md: var(--space-6);   /* 24px - Comfortable padding */
--padding-lg: var(--space-8);   /* 32px - Spacious padding */
--padding-xl: var(--space-10);  /* 40px - Section padding */

/* Gaps between elements */
--gap-xs: var(--space-2);   /* 8px - Tight spacing */
--gap-sm: var(--space-3);   /* 12px - Small gap */
--gap-md: var(--space-4);   /* 16px - Standard gap */
--gap-lg: var(--space-6);   /* 24px - Large gap */
--gap-xl: var(--space-8);   /* 32px - Section gap */
```

---

## 🔲 Border Radius

```css
--radius-xs: 4px;   /* Small elements */
--radius-sm: 6px;   /* Buttons, inputs */
--radius-md: 8px;   /* Cards, modals */
--radius-lg: 12px;  /* Large cards */
--radius-xl: 16px;  /* Sections */
--radius-2xl: 20px; /* Hero sections */
--radius-full: 9999px; /* Pills, avatars */
```

---

## 🎭 Component Patterns

### Card

```css
.card {
  background: rgba(10, 14, 26, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  padding: 24px;
}

.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  border-color: rgba(20, 184, 166, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(20, 184, 166, 0.15);
}
```

### Button - Primary

```css
.btn-primary {
  background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
  color: white;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: -0.2px;
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(20, 184, 166, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

### Button - Secondary

```css
.btn-secondary {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: -0.2px;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}
```

### Button - Ghost

```css
.btn-ghost {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
}
```

### Input Field

```css
.input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
  padding: 12px 16px;
  border-radius: 10px;
  width: 100%;
  transition: all 0.2s ease;
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.input:focus {
  outline: none;
  border-color: rgba(20, 184, 166, 0.5);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-error {
  border-color: rgba(239, 68, 68, 0.5);
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

### Modal Overlay

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: rgba(10, 14, 26, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
```

### Status Badge

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: -0.1px;
}

.badge-success {
  background: rgba(16, 185, 129, 0.15);
  color: #6EE7B7;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.badge-warning {
  background: rgba(245, 158, 11, 0.15);
  color: #FCD34D;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.badge-error {
  background: rgba(239, 68, 68, 0.15);
  color: #FCA5A5;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
```

### Status Dot

```css
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-dot-green {
  background: #10B981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.status-dot-yellow {
  background: #F59E0B;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
}

.status-dot-red {
  background: #EF4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
}
```

---

## 🎬 Animation & Transitions

### Timing Functions

```css
/* Standard easing (use for most transitions) */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);

/* Smooth entry */
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Smooth exit */
--ease-out: cubic-bezier(0, 0, 0.2, 1);

/* Bouncy */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Duration

```css
--duration-fast: 150ms;     /* Micro-interactions */
--duration-normal: 200ms;   /* Standard transitions */
--duration-slow: 300ms;     /* Complex animations */
--duration-slower: 400ms;   /* Page transitions */
```

### Common Transitions

```css
/* Hover lift */
.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-4px);
}

/* Hover glow */
.hover-glow {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-glow:hover {
  box-shadow: 0 0 30px rgba(20, 184, 166, 0.2);
}

/* Fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Slide in from right */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-in-right {
  animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Pulse (for notifications) */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

## 📐 Layout Grid

### Container

```css
.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 40px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 20px;
  }
}
```

### Grid System

```css
.grid {
  display: grid;
  gap: 24px;
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 1024px) {
  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
  }
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
--screen-sm: 640px;

/* Tablet */
--screen-md: 768px;

/* Laptop */
--screen-lg: 1024px;

/* Desktop */
--screen-xl: 1280px;

/* Large Desktop */
--screen-2xl: 1536px;
```

### Usage

```css
/* Mobile First */
.element {
  padding: 16px;
}

@media (min-width: 768px) {
  .element {
    padding: 24px;
  }
}

@media (min-width: 1024px) {
  .element {
    padding: 32px;
  }
}
```

---

## 🎯 Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
```

---

## 🖼️ Icons

### Icon System

Use **Lucide React** for all icons:
- Consistent stroke width (2px)
- 20px or 24px size
- Neutral color by default
- Teal on hover/active states

```tsx
import { Calendar, Mail, User } from 'lucide-react';

<Calendar className="w-5 h-5 text-white/60" />
```

---

## ♿ Accessibility

### Focus States

```css
/* Visible focus ring */
*:focus-visible {
  outline: 2px solid rgba(20, 184, 166, 0.5);
  outline-offset: 2px;
}

/* Remove default outline */
*:focus {
  outline: none;
}
```

### Skip Links

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary-teal);
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Screen Reader Only

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 🎨 Dark Mode (Always On)

This application is **dark mode only**. No light mode toggle needed.

**Why dark mode only?**
- Premium, professional aesthetic
- Reduces eye strain for long sessions
- Modern SaaS standard
- Consistent brand experience

---

## 📊 Data Visualization

### Progress Bars

```css
.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #14B8A6 0%, #06D6A0 100%);
  border-radius: 2px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Charts (Future)

When adding charts, use:
- Teal for primary data
- White/gray for secondary data
- Subtle gridlines (rgba(255, 255, 255, 0.05))
- Clear labels with adequate contrast

---

## 🚨 Error States

```css
.error-message {
  color: #FCA5A5;
  font-size: 13px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.error-card {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 16px;
}
```

---

## ✅ Success States

```css
.success-message {
  color: #6EE7B7;
  font-size: 13px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.success-card {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  padding: 16px;
}
```

---

## 🔄 Loading States

```css
/* Skeleton loader */
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--primary-teal);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 0.6s linear infinite;
}
```

---

## 🎯 Empty States

```css
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state-icon {
  font-size: 48px;
  opacity: 0.3;
  margin-bottom: 16px;
}

.empty-state-title {
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
}

.empty-state-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 24px;
}
```

---

## 📝 Usage Examples

### Hero Section

```html
<section class="hero">
  <h1 style="
    font-size: 56px;
    font-weight: 300;
    letter-spacing: -2px;
    color: white;
    margin-bottom: 16px;
  ">
    23
  </h1>
  <p style="
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
  ">
    Applications
  </p>
</section>
```

### Card with Hover

```html
<div class="card card-hover" style="
  background: rgba(10, 14, 26, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
">
  Content here
</div>
```

---

## 🎨 Brand Assets

### Logo Usage

- Logo always appears in white on dark backgrounds
- Logo text uses regular weight (400)
- Maintain clear space around logo (equal to logo height)
- Never stretch or distort logo

### Icon

- Teal circular icon
- Can be used standalone
- Maintains brand recognition

---

**Last Updated:** October 26, 2025  
**Version:** 1.0  
**Status:** Complete Design System