const cron = require("node-cron");
const recurringRepo = require("../repositories/recurring.repository");
const transactionRepo = require("../repositories/transaction.repository");

const shouldRun = (rule) => {
  const now = new Date();

  const lastRun = rule.last_run
    ? new Date(rule.last_run)
    : new Date(rule.start_date);

  if (rule.frequency === "daily") {
    const nextRun = new Date(lastRun);
    nextRun.setDate(nextRun.getDate() + 1);
    return now >= nextRun;
  }

  if (rule.frequency === "weekly") {
    const nextRun = new Date(lastRun);
    nextRun.setDate(nextRun.getDate() + 7);
    return now >= nextRun;
  }

  if (rule.frequency === "monthly") {
    const nextRun = new Date(lastRun);
    nextRun.setMonth(nextRun.getMonth() + 1);
    return now >= nextRun;
  }

  return false;
};

const pool = require("../config/db");

const runRecurringJobs = async () => {
  console.log(`[${new Date().toISOString()}] Running recurring job...`);

  try {
    const rules = await recurringRepo.getActiveRecurring();

    for (const rule of rules) {
      if (shouldRun(rule)) {
        console.log(`Processing rule ${rule.id} for user ${rule.user_id}...`);
        
        const client = await pool.connect();
        try {
          await client.query("BEGIN");

          await transactionRepo.createFromRecurring({
            userId: rule.user_id,
            type: rule.type,
            amount: rule.amount,
            categoryId: rule.category_id,
            description: rule.description,
            date: new Date(),
            recurringId: rule.id,
          }, client);

          await recurringRepo.updateLastRun(rule.id, client);

          await client.query("COMMIT");
          console.log(`Successfully processed rule ${rule.id}`);
        } catch (err) {
          await client.query("ROLLBACK");
          console.error(`Error processing recurring rule ${rule.id}:`, err.message);
        } finally {
          client.release();
        }
      }
    }
  } catch (err) {
    console.error("Critical error in recurring job runner:", err.message);
  }
};

// run every day at midnight
cron.schedule("0 0 * * *", runRecurringJobs);

module.exports = runRecurringJobs;