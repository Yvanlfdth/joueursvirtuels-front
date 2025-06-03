# Conventions and Organization of the `shared/` Folder

This document describes the best practices and conventions adopted for organizing the `src/app/shared/` folder in this Angular project (standalone mode).

---

## Recommended Folder Structure

```
shared/
├── pipes/
│   ├── _shared-pipes.ts          # Aggregator for standalone pipes
│   ├── limit-to.pipe.ts
│   └── truncate.pipe.ts
├── services/
│   ├── _shared-services.ts       # Aggregator exporting services
│   ├── _UtilsService.service.ts  # Global utility service
│   ├── alert.service.ts
│   └── ...
├── ui/
│   ├── _shared-ui.ts             # Aggregator for standalone UI components
│   └── spinner.component.ts
```

---

## Aggregator File Naming

- Aggregator files start with an underscore `_` to keep them visible at the top of the list.
- No numbers used to keep alphabetical ordering simple.
- Examples:  
  - `_shared-pipes.ts`  
  - `_shared-services.ts`  
  - `_shared-ui.ts`

---

## Utility Services

- Global or important utility services also start with `_` and have clear names, e.g. `_UtilsService.service.ts`
- These files appear just after the aggregator files in the folder.

---

## Why These Conventions?

- **Visibility:** Important files are easy to find quickly.  
- **Clarity:** File names reflect their role and purpose.  
- **Simplicity:** No numbers, natural alphabetical order.  
- **Maintainability:** Helps project evolution and onboarding new developers.

---

## Usage in the Project

- Import pipes and UI components via aggregator files in `shared-imports.ts`.  
- Services are injected through Angular DI (`providedIn: 'root'`).  
- Example import in a standalone component:

```ts
import { SHARED_IMPORTS } from '@app/shared/shared-imports';

@Component({
  standalone: true,
  imports: [CommonModule, ...SHARED_IMPORTS],
  // ...
})
export class ExampleComponent {}
```

---

## Notes

- These conventions are specific to this project and may be adjusted as needed.  
- Please follow this organization to maintain consistency.

---
