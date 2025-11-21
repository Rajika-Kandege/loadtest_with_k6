import http from 'k6/http';
import { check } from 'k6';

export let options = {
  scenarios: {
    webhook_highnote_test: {
      executor: 'constant-arrival-rate',
      rate: 2,           // 100 requests per minute
      timeUnit: '1m',
      duration: '2m',      // run for 5 minutes
      preAllocatedVUs: 5, // pre-allocate 20 virtual users
      maxVUs: 5,
    },
  },
};

export default function () {
  const url = 'https://api.staging.useferry.com/webhooks/highnote';

  const payload = JSON.stringify({
    data: {
      node: {
        __typename: "NotificationEvent",
        createdAt: "2022-03-31T21:21:39.732Z",
        id: "NOTIFICATION_EVENT_ID",
        name: "ACH_EXTERNALLY_INITIATED_DEPOSIT_RECEIVED",
        node: {
          typename: "AchExternallyInitatedDepositProcessedEvent",
          amount: {
            __typename: "Amount",
            value: 68000,
            currencyCode: "USD",
            decimalPlaces: 2
          },
          companyEntryDescription: "TestDesc",
          companyIdentifier: "TestID",
          companyName: "TestName",
          createdAt: "2025-10-30T12:18:09.201Z",
          financialAccountId: "ac_og2223e95d6672774b59bcfdb4ee0d73caa2",
          id: "ee_2203z8wwux78368qnvd1sb97l4iri6m9ag",
          transactionId: "eftet_92053a18e390471e8403a86923f5fb4c",
          settlementDate: "2022-07-28T00:00:00.000Z",
          transferStatus: {
            __typename: "NonFailureACHTransferStatus",
            status: "PROCESSING"
          }
        }
      },
      extensions: {
        signatureTimestamp: 1648761700155
      }
    }
  });

  const headers = {
    'Content-Type': 'application/json',
    'highnote-signature': '42d91f37dc6be8b54a39df6ff525eaaa0fcb4788dbef9f533a319f9e1399ab05',
    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Imp3ay10ZXN0LWVhYmFmN2QzLTY2OGUtNGE2MC1hNzkwLTIxOWIzNWUyZGYxZSIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsicHJvamVjdC10ZXN0LTc4YzZmNzgwLTY1YjItNDk2Yi04OTdhLWVmZDQ4NjRmNWRlNCJdLCJleHAiOjE3NjM3MDU4MTAsImh0dHBzOi8vc3R5dGNoLmNvbS9zZXNzaW9uIjp7ImlkIjoic2Vzc2lvbi10ZXN0LWQ0N2ZiYjBkLTZlYmEtNGJjOC1iMTY0LTE5YmVjMGY2OGVhNSIsInN0YXJ0ZWRfYXQiOiIyMDI1LTExLTIxVDA2OjExOjQ5WiIsImxhc3RfYWNjZXNzZWRfYXQiOiIyMDI1LTExLTIxVDA2OjExOjUwWiIsImV4cGlyZXNfYXQiOiIyMDI1LTExLTIxVDA3OjExOjUwWiIsImF0dHJpYnV0ZXMiOnsidXNlcl9hZ2VudCI6IiIsImlwX2FkZHJlc3MiOiIifSwiYXV0aGVudGljYXRpb25fZmFjdG9ycyI6W3sidHlwZSI6Im90cCIsImRlbGl2ZXJ5X21ldGhvZCI6ImVtYWlsIiwibGFzdF9hdXRoZW50aWNhdGVkX2F0IjoiMjAyNS0xMS0yMVQwNjoxMTo0OVoiLCJlbWFpbF9mYWN0b3IiOnsiZW1haWxfaWQiOiJlbWFpbC10ZXN0LTdmMjZjMGEzLTA0NGItNGU2OS1hYzMzLTE1ODc3YmUzM2ZmMiIsImVtYWlsX2FkZHJlc3MiOiJjaGFsYW5pK2NhcmQrMjRAdXNlZmVycnkuY29tIn19XSwicm9sZXMiOlsic3R5dGNoX3VzZXIiXX0sImlhdCI6MTc2MzcwNTUxMCwiaXNzIjoic3R5dGNoLmNvbS9wcm9qZWN0LXRlc3QtNzhjNmY3ODAtNjViMi00OTZiLTg5N2EtZWZkNDg2NGY1ZGU0IiwibmJmIjoxNzYzNzA1NTEwLCJzdWIiOiJ1c2VyLXRlc3QtODMzNzQ1MTUtOGQ5OS00YzZmLWE1NDYtODgxMTE4NjE4MzkwIn0.SfHKdtSaQTNx8Ry2NOpJ-NU5nq1l42SiS9WqaJGItbUfVrgql1AcCbn3zm2Uh9MWo2MCQEq6BKvaGw_o_MctPjBcZuwz-1MtrWVVicXlxMQIRl4xLiGs1U29EGlCQbRhpyGXNtUqQs8dPUmPEK3VyQa2cO7IXtSAts_x5A3EjcPzVXf29ul3tD7WxxBVVkXppdACdAi6XRYDS0232UJvN_GvMxSEvBTE-RvNIcE4d-bmbL5Uuw6tlReLcSTNXBdVSRYvd_tRPEH-qLfjYWcqLqKTyr9zPxLUogNYN3dhqhuIKI92SF4pyUmE7-Jp0lCTUhFR3ih___xxv7aNdxqNrQ'
  };

  const res = http.post(url, payload, { headers });

  const ok = check(res, {
    'status is 200': (r) => r.status === 200,
    'status is 429 (rate limited)': (r) => r.status === 429,
    'response time < 5000ms': (r) => r.timings.duration < 5000,
  });

  if (!ok) {
    console.log(`Request failed. Status: ${res.status}. Body: ${res.body || 'null'}`);
  }
}
