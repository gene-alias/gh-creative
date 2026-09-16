import * as THREE from 'three';
import earth from './earth-data.json';

/** Longitude zero faces +Z; east is +X and north is +Y. No map projection distortion. */
export function geographicPosition(longitude: number, latitude: number): [number, number, number] {
  const lon = longitude * Math.PI / 180;
  const lat = latitude * Math.PI / 180;
  return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
}

function geometry(coordinates: number[], count = coordinates.length / 2) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let index = 0; index < count; index++) {
    positions.set(geographicPosition(coordinates[index * 2] / 100, coordinates[index * 2 + 1] / 100), index * 3);
    seeds[index] = ((index * 37) % 101) / 101;
  }
  const result = new THREE.BufferGeometry();
  result.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  result.setAttribute('aDirection', new THREE.BufferAttribute(positions.slice(), 3));
  result.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  return result;
}
export function makeEarthGeometry(particleCount: number) {
  return {
    coast: geometry(earth.coast), borders: geometry(earth.borders), cities: geometry(earth.cities),
    land: geometry(earth.land, Math.min(earth.land.length / 2, Math.max(2000, Math.round(particleCount)))),
  };
}
