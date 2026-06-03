<!-- Provenance: Consilium research (Gemini), 2026-06-03.
     Session: oz/consilium/sessions/2026-06-03-research-responsive-dashboard-topnav/ -->

# Responsive Navigation Strategy: Pharma 360 Dashboard
**Date:** June 3, 2026
**Subject:** Responsive Collapse Strategy for Dual-Pill Top Navigation

This report outlines the progressive-collapse strategy for the Pharma 360 analytics dashboard, transitioning from a high-density desktop "two-pill" header to a functional mobile interface.

---

### 1. Dominant Responsive Top-Nav Patterns
The choice of pattern depends on the density of the information architecture (IA).

*   **Priority+ (Overflow Menu):** Progressively hides items into a "More ⋯" menu as space shrinks.
    *   *Pros:* High discoverability; keeps high-value links visible.
    *   *Cons:* Can feel cluttered if not carefully prioritized.
*   **Hamburger → Drawer:** Hides all navigation behind a single trigger.
    *   *Pros:* Maximizes content space; standard mobile convention.
    *   *Cons:* Increases interaction cost; "out of sight, out of mind" (NNg [1]).
*   **Label → Icon Collapse:** Text labels disappear, leaving only icons.
    *   *Pros:* Saves significant horizontal space without hiding the link.
    *   *Cons:* Requires highly recognizable iconography (Material Design 3 [2]).
*   **Bottom Navigation (Mobile):** Moves 3–5 primary actions to a bottom bar.
    *   *Pros:* High ergonomic reachability (Apple HIG [3]).
    *   *Cons:* Reduces vertical viewport for data tables/charts.

---

### 2. The Shedding Hierarchy (Order of Operations)
To prevent "pill collision," elements must be shed in a principled order based on utility-to-space ratio.

1.  **Tighten Gaps:** Reduce padding between pills and internal elements (e.g., from 16px to 8px).
2.  **Shed Secondary Metadata:** Drop the user’s **Role** text; keep only the **Name**.
3.  **Collapse Labels to Icons:** Remove "Pharma Media," "DOLs," and "Reports" text, relying on established icons (if they exist) or moving them to the next step.
4.  **Utility Icon Consolidation:** Move **Settings** and **Notifications** into the **User/Avatar** menu or an overflow menu.
5.  **Search Transformation:** Collapse the search bar/field into a single **Search Icon**.
6.  **The "Big Merge":** Move all primary nav links (**Pharma Media · DOLs · Reports**) into a Hamburger/More menu.
7.  **Final Metadata Shed:** Remove the user’s **Name**, leaving only the **Avatar**.

---

### 3. Breakpoints & Transitions
While fluid design is ideal, these pixel ranges serve as "trigger zones" for structural changes.

*   **Desktop ( > 1280px):** Full view. Both pills floating with maximum spacing.
*   **Small Desktop / Tablet Landscape (1024px – 1280px):** Tighten gaps. Drop "Role" text. Search collapses to icon-only (expandable on click).
*   **Tablet Portrait (768px – 1024px):** **Nav links** move to the left-side hamburger. The left pill now contains only [Logo + Hamburger]. The right pill contains [Search icon + Avatar].
*   **Mobile ( < 768px):** Pills merge into a single top bar or two minimal "floating" buttons. Only the **Logo**, **Search Icon**, and **Hamburger** (containing Profile/Nav/Settings) remain.

---

### 4. The Menu Trigger & Search
*   **Trigger:** Use a **Hamburger** (three lines) for the primary navigation drawer (Left) and the **Avatar** as the trigger for account/utility actions (Right).
*   **Search:** In a pharma dashboard, search is a "Power Action."
    *   **Desktop:** Visible input field.
    *   **Mobile:** Magnifying glass icon in the top-right. Tapping it should trigger a full-screen "Command Palette" style overlay (similar to Stripe or Linear).

---

### 5. What Must Always Stay Visible
According to NNg and Material Design standards, the following are "Non-Negotiable Anchors":
*   **Logo (Pharma 360 mark):** For brand identity and "Home" functionality.
*   **Avatar:** For user context and "Who am I?" verification.
*   **Primary Menu Trigger:** To ensure no user gets "trapped" in a view.

---

### 6. Concrete Real-Product Benchmarking

| Product | Responsive Pattern | Search Handling |
| :--- | :--- | :--- |
| **Linear** | Side-nav hides to Hamburger. Top-bar actions move to a bottom sheet. | Prominent icon; CMD+K focus. |
| **Stripe** | Priority+ links move to Hamburger. Profile stays in menu. | Global search icon expands to full-width. |
| **Vercel** | Breadcrumbs act as nav; tabs scroll horizontally or overflow. | Magnifying glass icon on mobile. |
| **GitHub** | Primary nav (Pull Requests, etc.) folds into a left Hamburger. | Search input becomes an icon. |
| **Salesforce** | Navigation "Items" move into a "More" dropdown before going to mobile menu. | Global search bar is persistent. |

---

### 7. Recommendation: The "Progressive Pill" Plan
For your specific **two-pill** design, I recommend a three-step collapse that preserves the "glass pill" aesthetic as long as possible.

#### **Step 1: The Utility Shed (at ~1100px)**
*   **Action:** Remove the vertical divider and the 3 utility icons (**Search, Notifications, Settings**) from the right pill. 
*   **Relocation:** Move **Settings** and **Notifications** into a dropdown menu under the **Avatar**. Transform **Search** into a single icon placed immediately to the left of the Avatar.
*   **Result:** Right pill is now smaller: `[Search Icon] [Name] [Avatar]`.

#### **Step 2: The Nav Collapse (at ~900px)**
*   **Action:** Remove the horizontal nav links (**Pharma Media, DOLs, Reports**) from the left pill.
*   **Relocation:** Place a **Hamburger icon** to the right of the Logo.
*   **Result:** Left pill is now smaller: `[Logo Mark] [Wordmark] [Hamburger]`.

#### **Step 3: The Mobile Merge (at ~600px)**
*   **Action:** Drop the **Wordmark** and the user **Name**.
*   **Result:** You are left with two floating "Mini-Pills":
    *   **LEFT:** `[Logo Mark] [Hamburger]`
    *   **RIGHT:** `[Search Icon] [Avatar]`
*   *Note:* This maintains the "dual-pill" brand identity even on small screens, which is unique and visually striking for a pharma product.

---

### Sources
*   **[1] Nielsen Norman Group:** "The Hamburger Menu: Why You Should (and Shouldn't) Use It."
*   **[2] Material Design 3:** "Adaptive Layouts" & "Top App Bar."
*   **[3] Apple HIG:** "Tab Bars" and "Sidebars."
*   **[4] Smashing Magazine:** "The Priority+ Navigation Pattern."
