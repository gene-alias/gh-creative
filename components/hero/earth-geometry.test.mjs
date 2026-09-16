import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
const earth = JSON.parse(readFileSync(new URL('./earth-data.json', import.meta.url)));
function near(field, lon, lat, distance) {
  for (let i = 0; i < earth[field].length; i += 2) {
    if (Math.hypot(earth[field][i] / 100 - lon, earth[field][i + 1] / 100 - lat) < distance) return true;
  }
  return false;
}
test('real land samples cover all continents including Antarctica and Australia', () => {
  for (const [lon,lat] of [[-100,40],[-60,-10],[15,50],[20,5],[100,40],[135,-25],[0,-85]]) assert.ok(near('land',lon,lat,3), `${lon},${lat}`);
  for (const [lon,lat] of [[-140,0],[-30,0],[80,-30]]) assert.equal(near('land',lon,lat,3),false);
});
test('city lights include actual Melbourne, London, Tokyo and New York locations', () => {
  for (const [lon,lat] of [[144.96,-37.81],[-0.13,51.5],[139.69,35.69],[-74,40.71]]) assert.ok(near('cities',lon,lat,.2));
});
test('coordinates stay within longitude/latitude bounds and lines are paired segments', () => {
  for (const coordinates of Object.values(earth)) {
    for (let i=0;i<coordinates.length;i+=2) {
      assert.ok(Math.abs(coordinates[i])<=18000);
      assert.ok(Math.abs(coordinates[i+1])<=9000);
    }
  }
  assert.equal(earth.coast.length%4,0);
  assert.equal(earth.borders.length%4,0);
});
