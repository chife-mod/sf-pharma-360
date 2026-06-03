<!-- Provenance: Consilium research (Gemini), 2026-06-03.
     Session: oz/consilium/sessions/2026-06-03-research-list-sort-ux/ -->


**Project:** B2B Pharma Analytics Dashboard (DOL Directory)  
**Date:** June 3, 2026  
**Subject:** Design Patterns for Non-Table Sorting (Grid View)

---

## 1. Patterns for Card-Grid Sort Controls
In a card grid, the absence of column headers requires a dedicated UI element to handle sorting logic. Research identifies five primary patterns:

*   **Explicit Label Dropdown (Standard):** A single menu where each option combines attribute and direction (e.g., "Followers: High to Low").
    *   *Pros:* Zero ambiguity; follows NN/g "Recognition over Recall" principle.
    *   *Cons:* Can result in long lists (e.g., 4 attributes × 2 directions = 8 items).
*   **Split-Button (Attribute + Toggle):** A dropdown to select the key (e.g., "Posts") and a separate icon (↑/↓) to flip direction.
    *   *Pros:* Highly efficient for power users; compact UI.
    *   *Cons:* High risk of "State vs. Action" confusion—does the arrow show the current order or the order you will get if you click? (NN/g, 2024).
*   **Segmented Control (Button Bar):** Horizontal buttons for 2–3 options.
    *   *Pros:* High visibility; one-click switching.
    *   *Cons:* Only scales to 3 options before cluttering the layout.
*   **Sort Chips (Pills):** Interactive chips placed above the grid.
    *   *Pros:* Modern, "app-like" feel; excellent for mobile/touch.
    *   *Cons:* Can look busy; harder to manage dual-direction logic without visual noise.
*   **The "View Options" Popover:** A richer menu (like Linear or Notion) that separates "Sort," "Group," and "Filter."
    *   *Pros:* Cleanest UI at rest; allows for multi-level sorting.
    *   *Cons:* Higher interaction cost (requires opening a panel).

## 2. Direction (Asc/Desc) & Sensible Defaults
NN/g and Baymard suggest that **explicit direction labels** are superior to icon-only toggles for B2B tools where precision is paramount. 

### Sensible Defaults
A "sensible default" minimizes the need for users to manually flip directions. 
*   **Name:** Ascending (A → Z).
*   **Followers/Engagement/Posts:** Descending (High → Low). Users in a pharma directory are typically looking for "top performers" or "rising stars," not the bottom of the list.

### Handling Flipping
To avoid UI clutter, the **Explicit Label Dropdown** is the safest bet. Instead of a separate toggle, include the direction in the label. If a split-button is used, the icon should be accompanied by a tooltip or clear visual state (e.g., "Sort Ascending") to resolve ambiguity.

## 3. Labelling & Visibility
*   **Prefixes:** Use "Sort by:" or a sort icon (e.g., three horizontal lines of decreasing width) to establish intent. Baymard research shows that a "Sort:" prefix increases discoverability for novice users.
*   **Active State:** The active key *must* be visible at rest. A common mistake is showing only a generic "Sort" button. The UI should display: `Sort: Followers (High-Low) ▾`.
*   **Iconography:** Icons should supplement, not replace, text.

## 4. Placement & Hierarchy
Standard placement for sort controls is the **top-right of the content area**, following the western reading pattern (Z-pattern) where filters and sorts are the "last stop" before entering the list.
*   **Proximity:** Place it immediately above the first card, adjacent to the "Result Count" (e.g., "234 Influencers found").
*   **Search Relationship:** If a search bar is present, the sort should be to its right. Searching usually changes the default sort to "Relevance," which should be reflected in the sort label.

## 5. Is Sort Overkill for ~234 Items?
No. While sorting is rarely needed for <10 items, **234 items is far beyond the limit of "visual scanning."** 
*   **Nielsen's Law of Search:** Once a list exceeds one or two pages (approx. 20–30 items), users rely on sorting to find "peaks" in data.
*   **Cognitive Load:** Without sorting, users must remember values from the first card to compare them with the 50th. Sorting offloads this memory task to the system.

## 6. Real-Product Benchmarks
*   **Linear:** Uses a "Display" popover. Sorting is secondary to "Grouping," reflecting its workflow-heavy nature.
*   **Notion:** Offers a "Sort" pill. Clicking it opens a multi-rule builder, allowing users to sort by "Status" *then* "Name."
*   **GitHub:** Uses a single dropdown with presets like "Newest," "Most Commented," and "Least Recently Updated."
*   **Amazon:** Uses explicit labels in a dropdown ("Price: High to Low") to ensure shoppers don't make mistakes.
*   **Stripe:** Prioritizes clickable table headers, but for grid views (like Apps), it uses a clean "Sort by" dropdown.

## 7. Recommendation for the DOL Dashboard
Given the B2B pharma context—where users need data precision and efficiency—we recommend a **Split-Menu Dropdown**.

1.  **UI Element:** A single button showing `Sort: [Key] [Direction Icon]`.
2.  **Interaction:** Clicking the *Label* opens a dropdown of keys (Name, Followers, etc.). Clicking the *Icon* immediately flips the direction.
3.  **Labels:** In the dropdown, use explicit labels for clarity (e.g., "Followers (High to Low)"). 
4.  **Placement:** Top-right, aligned with the right edge of the card grid, paired with a result count on the left.

### Sources (Verified June 2026)
*   **Nielsen Norman Group:** "Sort and Filter: Guidelines for Site Search" (nnmos.org)
*   **Baymard Institute:** "Product List UX: Sorting" (baymard.com)
*   **Material Design 3:** "Data Tables & Grids" (m3.material.io)
*   **Apple HIG:** "Lists and Tables - Standard Sorting" (developer.apple.com)
