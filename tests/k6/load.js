import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

const BASE = __ENV.BASE_URL || 'http://localhost:8080';

// 409 для бронювання – очікувана відповідь, а не помилка
http.setResponseCallback(http.expectedStatuses({ min: 200, max: 299 }, 409));

const created = new Counter('bookings_created');
const conflicts = new Counter('bookings_conflict');

export const options = {
  scenarios: {
    search: {
      executor: 'ramping-vus',
      exec: 'search',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 20 },
        { duration: '1m', target: 20 },
        { duration: '15s', target: 0 },
      ],
    },
    booking_race: {
      executor: 'shared-iterations',
      exec: 'bookingRace',
      vus: 10,
      iterations: 50,
      maxDuration: '1m',
    },
  },
  thresholds: {
    'http_req_duration{scenario:search}': ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
    // одночасні запити на одне авто та період: успішним може бути не більше одного
    bookings_created: ['count<=1'],
  },
};

const QUERIES = [
  '',
  '?fuel=electric',
  '?lat=50.4501&lng=30.5234&radius=2000',
];

export function search() {
  const q = QUERIES[Math.floor(Math.random() * QUERIES.length)];
  const res = http.get(`${BASE}/api/fleet/cars${q}`);
  check(res, { 'search returns 200': (r) => r.status === 200 });
  sleep(1);
}

export function bookingRace() {
  const payload = JSON.stringify({
    car_id: 3,
    user_id: 1,
    start_at: '2030-01-10T10:00:00Z',
    end_at: '2030-01-12T10:00:00Z',
  });
  const res = http.post(`${BASE}/api/bookings`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (res.status === 201) created.add(1);
  if (res.status === 409) conflicts.add(1);
  check(res, { 'booking is 201 or 409': (r) => r.status === 201 || r.status === 409 });
}
