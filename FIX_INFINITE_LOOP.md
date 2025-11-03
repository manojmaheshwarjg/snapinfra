# Fix for React Maximum Update Depth Exceeded

## Root Causes Identified:
1. AppContext value recreated every render
2. Schema updates creating new Date() causing state changes even when data unchanged  
3. ReactFlow position updates triggering on every mouse move
4. useEffect dependencies causing circular updates

## Applied Fixes:

### 1. lib/app-context.tsx
- ✅ Memoized context value
- ✅ Added schema equality check in UPDATE_SCHEMA reducer
- ✅ Guarded initialization with useRef

### 2. components/reactflow/reactflow-schema-editor.tsx  
- ✅ Only update positions on drag end (not during drag)
- ✅ Added schema change detection before syncing nodes

### 3. lib/workspace-context.tsx
- ✅ Memoized context value

All fixes are in place. Clear .next and restart dev server.
