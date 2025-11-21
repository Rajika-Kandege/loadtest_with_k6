# k6 Load Testing

This project uses [k6](https://k6.io/) for load testing to validate performance and reliability.  

---

## 📦 Installation

Install k6 as a development dependency via **npm**:

```bash
npm install --save-dev k6

▶️ Running a Test

npx k6 run loadtest.js

## Payday Transfer Load Test

Authentication needs to be renewed every time when executing the script is executed
It is possible to upgrade the script by adding a json file with multiple datasets for multiple users
Right now, the script is written to do the payday settlement only for one user

