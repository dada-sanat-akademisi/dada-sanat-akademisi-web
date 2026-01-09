# Hydration Warnings - Documentation

## Justified Suppressions

### Body Element (`app/layout.tsx`)

**Location**: `<body suppressHydrationWarning>`

**Reason**: Browser extensions (e.g., ColorZilla, password managers, ad blockers) inject attributes into the `<body>` element that don't exist in the server-rendered HTML. This causes React hydration warnings.

**Examples of injected attributes**:
- `cz-shortcut-listen` (ColorZilla extension)
- `data-new-gr-c-s-check-loaded` (Grammarly)
- `data-lastpass-icon-root` (LastPass)
- Various ad blocker attributes

**Why this is justified**:
1. **External cause**: We cannot control browser extensions
2. **No functional impact**: These attributes don't affect our app's functionality
3. **Common practice**: This is a well-documented Next.js pattern for handling extension-injected attributes
4. **Limited scope**: Only applied to `<body>`, not globally

**Reference**: 
- [Next.js Documentation on suppressHydrationWarning](https://nextjs.org/docs/api-reference/react-dom#suppresshydrationwarning)
- [React GitHub Issue #11156](https://github.com/facebook/react/issues/11156)

---

## Policy

**Rule**: Only suppress hydration warnings when:
1. The cause is external (browser extensions, third-party scripts)
2. It doesn't affect functionality
3. It's documented with justification
4. The scope is limited (not global)

**Never suppress**:
- Warnings caused by our own code
- Warnings that indicate actual bugs
- Warnings that affect functionality

---

**Last Updated**: 2024-01-XX

