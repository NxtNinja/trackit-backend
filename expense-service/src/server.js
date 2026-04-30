require("dotenv").config();
const app = require("./app");
require("./cron/recurring.cron");

const PORT = process.env.PORT || 4001;

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Expense service running on port ${PORT} (localhost only)`);
});
