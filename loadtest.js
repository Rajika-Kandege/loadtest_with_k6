// 
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  scenarios: {
    single_user_rate_test: {
      executor: 'constant-arrival-rate',
      rate: 1000,           // 100 requests per minute
      timeUnit: '1m',      // per minute
      duration: '10m',      // for 1 minute
      preAllocatedVUs: 50,  // use only 1 VU (single user)
      maxVUs: 100,           // maximum 1 VU
    },
  },
};

export default function () {
  const url = 'https://api.staging.useferry.com/api/astra/instant-transfer-debit-mode';
  
  const payload = JSON.stringify({
    destinationId: '9256180e-048b-4b0b-a08b-ad849466d20e',
    amount: 1900,
  });
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Imp3ay10ZXN0LWU0NmFkYzFmLWQzMTQtNGM0NC04ZjRhLTAzM2IxN2I5MmZiZSIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsicHJvamVjdC10ZXN0LTc4YzZmNzgwLTY1YjItNDk2Yi04OTdhLWVmZDQ4NjRmNWRlNCJdLCJleHAiOjE3NTEyOTE3NjYsImh0dHBzOi8vc3R5dGNoLmNvbS9zZXNzaW9uIjp7ImlkIjoic2Vzc2lvbi10ZXN0LWNkYThmOThkLWExYmQtNDQ5NC04YWZjLTNhNWUxNTA0OTc3MiIsInN0YXJ0ZWRfYXQiOiIyMDI1LTA2LTMwVDEzOjUwOjU5WiIsImxhc3RfYWNjZXNzZWRfYXQiOiIyMDI1LTA2LTMwVDEzOjUxOjA2WiIsImV4cGlyZXNfYXQiOiIyMDI1LTA2LTMwVDE0OjUxOjAwWiIsImF0dHJpYnV0ZXMiOnsidXNlcl9hZ2VudCI6IiIsImlwX2FkZHJlc3MiOiIifSwiYXV0aGVudGljYXRpb25fZmFjdG9ycyI6W3sidHlwZSI6Im90cCIsImRlbGl2ZXJ5X21ldGhvZCI6ImVtYWlsIiwibGFzdF9hdXRoZW50aWNhdGVkX2F0IjoiMjAyNS0wNi0zMFQxMzo1MDo1OVoiLCJlbWFpbF9mYWN0b3IiOnsiZW1haWxfaWQiOiJlbWFpbC10ZXN0LWY5MDEwMzdlLTJkMDMtNDViNy1iYTdlLTVhN2QwMzEzNTQ0MSIsImVtYWlsX2FkZHJlc3MiOiJsb2dpbnBob25lQHlvcG1haWwuY29tIn19XX0sImlhdCI6MTc1MTI5MTQ2NiwiaXNzIjoic3R5dGNoLmNvbS9wcm9qZWN0LXRlc3QtNzhjNmY3ODAtNjViMi00OTZiLTg5N2EtZWZkNDg2NGY1ZGU0IiwibmJmIjoxNzUxMjkxNDY2LCJzdWIiOiJ1c2VyLXRlc3QtYzg2MjRjYTgtYjhmMS00Mjk4LWE1NDgtOTlkNmNkM2ZkYWE0In0.RTPP2zINF01upCgYqVErJkzsUyUYKKQnuX4oDAqbBFs8trtTirRk-Ur-3-zWy86FNlsCEooZ8shKoMiS3nXNGmm46QB3i3TC7d0ME7cwRL2cIQTbv_F0aAbZouuO3oSFjv-9EyVG8doLuO1k70TKVR5zCszweKbO6JvPQN56ogrNd3fkawUfRUwgV7geibYVdIjzzz2AYonP_vYtcuv8Ka2MdFoV8j6Vv-UVEJyLuhKtGicYapQO5_oEWZ9a9lDrLpwi8tFkRWHctCQc-aC59ALAOFIKFXW0oF0Avmu0kLJt2UTyQyhZk3eikoyUVeCchdAoJykkLoLeoU2DmiJTcw',
    'Origin': 'https://web.staging.useferry.com',
    'Referer': 'https://web.staging.useferry.com/',
  };

  const res = http.post(url, payload, { headers });
  
  const ok = check(res, {
    'status is 200': (r) => r.status === 200,
    'status is 429 (rate limited)': (r) => r.status === 429,
    'response time < 5000ms': (r) => r.timings.duration < 5000,
  });

  if (res.status !== 200) {
    console.log(`Request failed. Status: ${res.status}. Body: ${res.body || 'null'}`);
  } else if (res.status === 429) {
    console.log(`Rate limited! Status: ${res.status}. Body: ${res.body || 'null'}`);
  }
  // Remove sleep for single user rate testing
  // sleep(0.01); // Not needed with constant-arrival-rate
}
