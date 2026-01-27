# Zoom Scale Guide for War Room Map

## How Zoom Works

The zoom factor is calculated as: **2^(scale - 1)**

This means each scale level doubles the zoom from the previous level.

## Zoom Scale Values to Try

| Scale | Zoom Factor | View Level | Best For |
|-------|------------|------------|----------|
| **1** | 1x (2^0) | Entire world view | Overview of all locations |
| **2** | 2x (2^1) | Continental view | See multiple countries |
| **3** | 4x (2^2) | Country level | See entire country |
| **4** | 8x (2^3) | Regional view | See state/province |
| **5** | 16x (2^4) | State/Province | **DEFAULT** - Good general view |
| **6** | 32x (2^5) | Large city area | See city and surroundings |
| **7** | 64x (2^6) | City level | See city boundaries |
| **8** | 128x (2^7) | City district | See city districts |
| **9** | 256x (2^8) | Neighborhood | See neighborhoods |
| **10** | 512x (2^9) | Street level | **RECOMMENDED** - Clear marker view |
| **11** | 1024x (2^10) | Close street | Very close to marker |
| **12** | 2048x (2^11) | Very high zoom | **CURRENT** - Maximum detail |
| **13** | 4096x (2^12) | Extreme zoom | May be too close |
| **14** | 8192x (2^13) | Maximum practical | Very close, may lose context |
| **15** | 16384x (2^14) | Maximum zoom | Too close, not recommended |

## Recommended Settings

### For Activity Log Clicks (Company Name)
- **Recommended**: `10-12`
- **Smooth**: `8-10`
- **Maximum Detail**: `12-14`

### For Map Marker Clicks
- **Recommended**: `10-12`
- **Smooth**: `8-10`
- **Maximum Detail**: `12-14`

### For Default Zoom
- **Recommended**: `5-7`
- **Wide View**: `3-5`
- **Close View**: `7-9`

## Where to Change Zoom Values

### 1. Activity Log Click Zoom
**File**: `war-room.component.ts`
- **Line ~130**: `map.zoomToCompany(companyId, 12);` ← Change `12` here
- **Line ~152**: `mapRetry.zoomToCompany(companyId, 12);` ← Change `12` here

### 2. Map Marker Click Zoom
**File**: `war-room-map.component.ts`
- **Line ~280**: `this.zoomToLocation(..., 12);` ← Change `12` here (jsVectorMap handler)
- **Line ~637**: `this.zoomToLocation(..., 12);` ← Change `12` here (direct click)

### 3. Default Zoom Scale
**File**: `war-room-map.component.ts`
- **Line ~943**: `zoomToCompany(..., zoomScale: number = 12)` ← Change default `12` here
- **Line ~714**: `zoomToLocation(..., scale: number = 5)` ← Change default `5` here

## Quick Test Values

Try these specific values to see the difference:

```typescript
// Subtle zoom - good for smooth transitions
map.zoomToCompany(companyId, 8);

// Balanced zoom - recommended for most use cases
map.zoomToCompany(companyId, 10);

// High zoom - current setting, shows marker clearly
map.zoomToCompany(companyId, 12);

// Maximum zoom - very close, may be too much
map.zoomToCompany(companyId, 14);
```

## Tips

1. **Start with 10**: Good balance between detail and context
2. **Use 12 for emphasis**: When you want to really focus on a location
3. **Avoid above 14**: May zoom too close and lose map context
4. **Test different values**: Each map may need different zoom levels
5. **Consider animation**: Higher zoom values may need longer animation times
