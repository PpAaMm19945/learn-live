# Antigravity Task: Rewrite Geographic Image Prompts as Precision Specifications

## Your Mission

You are rewriting the geographic image prompts for the Learn Live African History curriculum. The current prompts are prose-based descriptions that produce geographically inaccurate images when fed to an AI image generator (Google Gemini / NanoBanana). 

**The fix**: Rewrite each geographic prompt as a **structured JSON specification** — the same format used for the project's map specifications, which produced cartographically perfect results.

## Why This Works

The map specification JSONs (see examples below) worked perfectly because they gave the image model:
- Exact `geographic_bounds` (lat/lon bounding box)
- Named features with precise coordinates
- Structured terrain descriptions tied to real geography
- Layered rendering instructions (base terrain → water → features → labels)
- Specific viewing angle and projection context

The current geo prompts fail because they say things like "the Tigris on the left, the Euphrates on the right" — the model guesses and gets it wrong.

## Process — ONE SECTION AT A TIME

**CRITICAL**: Do NOT batch this. Work through ONE geographic image at a time. For each image:

1. **Identify** the geographic region depicted
2. **Deep research** the actual geography:
   - Exact coordinates of every named feature (rivers, mountains, lakes, cities, cataracts)
   - Real elevation contours and terrain types
   - Actual river courses (which direction they flow, where they bend, where tributaries join)
   - Real distances and spatial relationships between features
   - What the terrain actually looks like at ground level (sandstone? basalt? alluvial silt?)
3. **Cross-reference** against the project's existing map specification files (listed below) — extract any coordinates already defined there
4. **Write** the new specification JSON
5. **Self-evaluate**: Could a cartographer verify every coordinate and spatial claim? If not, research deeper.
6. **Present** to me for audit before moving to the next image

## Output Format

For each geographic image, produce a JSON object with this structure:

```json
{
  "filename": "geo_mesopotamia_shinar.jpg",
  "r2Key": "assets/storybook/ch01/geo_mesopotamia_shinar.jpg",
  "imageType": "geographic",
  "chapterSection": "1.1",
  "bandRange": "0-5",
  "aspectRatio": "1:1",
  "size": 1024,
  
  "geographic_specification": {
    "title": "The Plain of Shinar Between the Rivers",
    "viewing_angle": "Elevated panorama looking south from approximately 35°N",
    "geographic_bounds": {
      "north": 35.0,
      "south": 30.0,
      "east": 48.0,
      "west": 40.0
    },
    
    "terrain": [
      {
        "feature": "Plain of Shinar",
        "type": "alluvial_plain",
        "description": "Flat pale tan-ochre alluvial silt, completely flat, no elevation variation",
        "bounds": {"north": 33.5, "south": 31.0, "east": 46.0, "west": 43.5},
        "surface": "dried alluvial silt, cracked clay in dry zones, irrigated strips near rivers"
      },
      {
        "feature": "Zagros Mountains",
        "type": "mountain_range",
        "description": "Faint purple-blue silhouette along eastern horizon",
        "ridge_line_coords": [[35.0, 46.5], [33.5, 47.0], [32.0, 48.0]],
        "peak_elevation": "3000-4000m",
        "visual_treatment": "distant silhouette, purple-blue atmospheric haze"
      }
    ],
    
    "water_bodies": [
      {
        "name": "Tigris River",
        "type": "river",
        "course_coords": [[37.5, 43.0], [36.0, 43.5], [34.5, 44.0], [33.5, 44.2], [31.0, 47.4]],
        "visual": "dark blue-green, wide meanders, banks lined with date palms and reeds",
        "flow_direction": "northwest to southeast",
        "position_in_frame": "left third of image"
      },
      {
        "name": "Euphrates River",
        "type": "river",
        "course_coords": [[38.0, 38.5], [36.5, 39.0], [35.0, 40.0], [34.0, 42.0], [31.0, 47.0]],
        "visual": "dark blue-green, wider and more sluggish than Tigris, papyrus-lined banks",
        "flow_direction": "northwest to southeast",
        "position_in_frame": "right third of image"
      }
    ],
    
    "landmarks": [
      {
        "name": "Ziggurat (Tower of Babel site)",
        "coords": [32.54, 44.42],
        "description": "Seven-tiered ziggurat in deep red-brown fired brick",
        "scale": "small against the vast landscape — emphasizes plain's scale",
        "position_in_frame": "center, slightly right of Euphrates"
      }
    ],
    
    "labels": [
      {"text": "TIGRIS", "position": "along river course, upper third", "style": "clean white Roman capitals"},
      {"text": "EUPHRATES", "position": "along river course, upper third", "style": "clean white Roman capitals"},
      {"text": "PLAIN OF SHINAR", "position": "center of plain", "style": "clean white Roman capitals, larger"}
    ],
    
    "atmosphere": {
      "time_of_day": "late afternoon",
      "sky": "brilliant late-afternoon sky in deep amber and rose with towering cumulus clouds",
      "sky_coverage": "upper half of image",
      "lighting": "warm golden hour light from west"
    }
  },
  
  "style_directive": "Photorealistic raised-relief panorama in the tradition of Heinrich Berann's National Geographic landscape paintings. Museum diorama backdrop quality. Warm earth palette.",
  "negative_prompt": "cartoon, anime, 3D video game terrain, satellite photo, modern cities, political borders, brand logos, callout boxes, annotation arrows, cluttered labels",
  "pedagogical_purpose": "Establishes Babel's location as the launching pad for all African migration"
}
```

## Existing Map Specification Files (Your Coordinate Sources)

These files contain verified coordinates. Use them as primary sources:

| File | Region | Key Coordinates |
|------|--------|----------------|
| `docs/curriculum/history/Maps/map_001_post_babel_dispersion.md` | Mesopotamia → Africa | Babel, Ararat, migration routes |
| `docs/curriculum/history/Maps/map_002_ancient_egypt_overview.md` | Egypt & Nile Delta | Cataracts, Memphis, Thebes |
| `docs/curriculum/history/Maps/map_003_bantu_migration_biblical_model.md` | Sub-Saharan Africa | Migration corridors |
| `docs/curriculum/history/Maps/map_004_north_africa_regional_overview.md` | Libya, Cyrenaica, Atlas | Coastal features |
| `docs/curriculum/history/Maps/map_005_upper_nile_horn_overview.md` | Nubia, Ethiopia, Horn | Cataracts, Kerma, Napata, Meroe |
| `docs/curriculum/history/Maps/map_025_nile_cataracts.md` | Nile cataracts detail | All 6 cataract coordinates |

## The Geographic Images to Rewrite (Chapter 1)

Process these in order, one at a time:

### 1. `geo_mesopotamia_shinar.jpg` (Section 1.1)
Plain of Shinar between Tigris and Euphrates. Ziggurat at center.

### 2. `geo_post_flood_ararat.jpg` (Section 1.1)  
Mt. Ararat looking south toward Fertile Crescent. Lake Van, Lake Urmia visible.

### 3. `geo_migration_routes_africa.jpg` (Section 1.2)
Three migration arrows from Shinar to Africa (Nile Delta, Nubia, Cyrenaica).

### 4. `geo_nile_full_corridor.jpg` (Section 1.4)
Full Nile corridor from Mediterranean to Khartoum. Green ribbon against gold desert.

### 5. `geo_nile_delta_mizraim.jpg` (Section 1.5)
Nile Delta close-up. Damietta/Rosetta branches. Black fertile soil contrast.

### 6. `geo_nubian_nile_cataracts.jpg` (Section 1.5)
Nubian Nile between 1st and 3rd Cataracts. Rocky narrow valley.

### 7. `geo_libya_green_sahara.jpg` (Section 1.5)
North Africa during Green Sahara period (~2200 BC). Savanna where desert is now.

### 8. `geo_east_africa_rift.jpg` (Section 1.5)
East African Rift Valley. Lake Turkana, highlands, Great Rift.

## Research Requirements Per Image

For each image, you MUST research and include:

- [ ] **Bounding box**: Exact lat/lon bounds for the region depicted
- [ ] **River courses**: Real coordinate waypoints (at least 5 points per river)
- [ ] **Mountain positions**: Peak coordinates and ridge lines
- [ ] **Lake positions**: Center coordinates, approximate dimensions
- [ ] **Terrain types**: What the actual surface material/vegetation is in each zone
- [ ] **Elevation data**: Real peak heights, valley depths, relative relief
- [ ] **Viewing angle**: Specific compass direction and altitude of the "camera"
- [ ] **Spatial relationships**: Which feature is left/right/above/below from the viewing angle
- [ ] **Cross-reference**: Pull any matching coordinates from the existing map spec files listed above

## Quality Gate

Before presenting each specification, verify:
1. Every coordinate is real and verifiable on a modern map
2. Rivers flow in the correct direction
3. Mountains are on the correct side of rivers
4. Spatial relationships match the chosen viewing angle
5. The terrain descriptions match real geology (not imagined)
6. Labels are positioned where the features actually are from the viewing angle

## After Chapter 1

Once all 8 Chapter 1 geographic images are audited and approved, we will extend this process to Chapters 2-9. The same methodology applies — one image at a time, deep research, structured JSON, audit before proceeding.

---

**Start with image #1: `geo_mesopotamia_shinar.jpg`. Research the Plain of Shinar deeply, then present your specification.**
