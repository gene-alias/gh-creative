# Earth geometry provenance

Natural Earth, public domain. Retrieved 2026-09-14.

- Land: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_land.geojson
- Borders: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_boundary_lines_land.geojson
- Cities: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_populated_places.geojson
- Dataset: https://www.naturalearthdata.com/

Derived by scripts/build-earth.py: simplified 0.1-degree vector lines, densified to a maximum 2-degree segment, land-masked equal-area points and original city coordinates. Output coordinates quantised to 0.01 degrees. Boundaries follow Natural Earth's de facto defaults. City intensity is illustrative, not measured satellite night illumination.
