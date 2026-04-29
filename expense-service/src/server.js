require("dotenv").config();
const app = require("./app");
require("./cron/recurring.cron");

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Expense service running on port ${PORT}`);
});
