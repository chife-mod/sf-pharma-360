<!-- Provenance: Consilium research (Gemini), 2026-06-03.
     Session: oz/consilium/sessions/2026-06-03-research-responsive-filter-sidebar-ux/
     Implemented in: components/v2/{dashboard,toolbar,filter-panel}.tsx + app/dols/v2.css -->


# UX Research Report: Responsive Filter Sidebar Patterns for B2B Dashboards

**Date:** June 3, 2026  
**Subject:** Transitioning a Faceted Filter Sidebar from Desktop to Mobile  
**Target Product:** Pharma Analytics Dashboard (KOL Directory)

---

## 1. Dominant Responsive Patterns

When a persistent desktop sidebar (the "Left-Rail") becomes unsustainable due to viewport narrowing, four dominant patterns emerge.

| Pattern | Behavior | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **Off-Canvas Drawer** | Slides in from the side (usually left), partially overlaying content. | Familiar; preserves vertical scroll state of the main list. | Can feel cramped on small mobile screens. |
| **Full-Screen Modal** | Covers the entire viewport when triggered. | Best for 8+ facets; provides maximum space for long accordion lists. | Completely breaks context; user cannot see the results list updating. |
| **Bottom Sheet** | Slides up from the bottom (standard Material 3). | High thumb-reachability; feel "native" on mobile. | Not ideal for many accordions (8-9) as it requires excessive internal scrolling. |
| **Collapsible Mini-Bar** | Sidebar collapses to icons-only (rail) on tablet. | Saves space while keeping filters one click away. | Icons alone often fail to communicate complex pharma facets (e.g., "Specialty"). |

**Verdict:** For **8–9 faceted accordions**, the **Full-Screen Modal** (Mobile) and **Off-Canvas Drawer** (Tablet) are the industry standards for complex B2B data [1][5].

---

## 2. Breakpoints & Transitions

Modern layouts typically use **three Window Size Classes** (inspired by Material Design 3 and Salesforce SLDS) [2][4]:

*   **Desktop (> 1024px):** **Persistent Sidebar.** The 2-pane layout remains. The sidebar is sticky while the card grid scrolls.
*   **Tablet (768px – 1024px):** **Collapsible Sidebar / Side Sheet.** The sidebar is hidden by default. A "Filters" toggle pushes the content or overlays it. *Note: If the card grid is 3-columns, it often drops to 2-columns here.*
*   **Mobile (< 768px):** **Triggered Modal.** The sidebar is completely removed from the layout flow. Filters are accessed via a floating or header-docked "Filter" button.

---

## 3. Trigger UI & Active State Management

Hiding the sidebar creates a "hidden state" problem: users forget which filters are active.

*   **The Trigger:** A button labeled **"Filters"** is superior to a lone icon (like a funnel) for B2B usability [1].
*   **The Badge:** If filters are active, the trigger button MUST display a **count badge** (e.g., "Filters (3)").
*   **Filter Chips (Pills):** On Tablet/Mobile, applied filters should be surfaced as **removable chips** in a horizontal-scroll row above the card grid. This allows users to clear specific facets without reopening the modal [2][5].

---

## 4. Component Choice: Drawer vs. Modal vs. Bottom Sheet

For a directory with **8–9 faceted accordions**:

*   **Tablet (Drawer/Side Sheet):** Recommended. It allows a "split-view" feel where the user can see the drawer and a portion of the cards simultaneously.
*   **Mobile (Full-Screen Modal):** **Best Choice.** Accordions (Audience Size, Specialty, etc.) take up significant vertical space. A bottom sheet would feel like "scrolling within a scroll." A full-screen modal provides the necessary canvas for the 8-9 categories and their internal checkboxes [3][5].

---

## 5. Real-Product Benchmarks

| Company | Sector | Pattern Used | Logic |
| :--- | :--- | :--- | :--- |
| **Salesforce** | B2B/SaaS | Full-screen Modal | "Batch" processing; select all, then hit "Apply." |
| **Mixpanel** | Analytics | Collapsible Top-Bar | Filters reflow into a "More" dropdown on mobile. |
| **LinkedIn** | Directory | Sticky Chips + Modal | Chips for quick toggles (Remote, Date); Modal for deep "All Filters." |
| **Airbnb** | Travel | Full-Screen Modal | Progressive disclosure; uses a "View [X] stays" button. |
| **ASOS / Amazon** | E-com | Drawer / Side Tray | Amazon uses **Live Update**; ASOS uses **Apply Button**. |
| **Linear** | B2B/SaaS | Modular Reflow | Filters are pinned to the top; stack vertically on narrow views. |

---

## 6. Interaction Logic: "Apply" vs. "Live-Update"

*   **Live-Update (Amazon):** Results refresh every time a checkbox is tapped.
    *   *Best for:* Fast APIs and small datasets where users only select 1-2 filters.
*   **Apply Button (IKEA/Booking):** User selects multiple facets, then hits a button to refresh.
    *   *Best for:* Mobile devices (saves data/battery) and **Complex Facets (8-9)**. It prevents the "jumpy" feeling of the list refreshing 9 times while the user is still in the menu [1][6].

**The Gold Standard:** Use an **Apply Button with a Dynamic Count** (e.g., "Show 42 Physicians"). This gives the user feedback that the filter *will* work without the performance cost of a full reload [6].

---

## 7. Recommendation for Pharma Analytics Dashboard

For a directory of 234 KOLs with 8–9 facets, I recommend the **"Adaptive Drawer-to-Modal"** pattern:

1.  **Desktop (>1024px):** Keep the persistent left sidebar. Use **Live Update** here as the screen real estate and processing power allow for it.
2.  **Tablet (768px-1024px):** Collapse the sidebar into a **triggered Off-Canvas Drawer**. Show **Filter Chips** above the card grid to maintain visibility of active states.
3.  **Mobile (<768px):** Use a **Full-Screen Modal** triggered by a "Filters" button with a count badge. 
    *   **Crucial:** Inside the mobile modal, use an **"Apply" button** at the bottom (sticky) that displays the resulting count (e.g., "Apply: 12 Results").
    *   **Why:** 8-9 accordions are too many for a bottom sheet. Live-updating on mobile while selecting multiple pharma specialties will feel sluggish and disorienting.

---

### Sources
*   [1] **Nielsen Norman Group (NN/g):** *Faceted Search: Best Practices* ([Link](https://www.nngroup.com/articles/faceted-search/))
*   [2] **Material Design 3 (M3):** *Search & Filtering Patterns* ([Link](https://m3.material.io/patterns/search/))
*   [3] **Baymard Institute:** *Mobile Faceted Search UX* ([Link](https://baymard.com/blog/mobile-faceted-search))
*   [4] **Salesforce SLDS:** *Filtering Patterns* ([Link](https://www.lightningdesignsystem.com/patterns/rules-filters-logic/))
*   [5] **UX Planet:** *Responsive Data Dashboards* (2024 Research)
*   [6] **Baymard Institute:** *The 'Apply' Button vs. 'Live Update'* ([Link](https://baymard.com/blog/apply-vs-live-update))
