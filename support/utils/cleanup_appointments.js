// -----------------------------------
// Cleanup Script for Appointments & Breaks
// -----------------------------------

// Import necessary GraphQL cleanup functions
// Note: delete_breaks.js is ES module with default export, others are CommonJS
import deleteBreaks from "../graphQL/functions/delete_breaks.js";
// CommonJS files - import as default and destructure
import deleteUnpaidAppointmentsModule from "../graphQL/functions/delete_unpaid_appointments.js";
import deletePaidAppointmentsModule from "../graphQL/functions/delete_paid_appointments.js";

const { deleteUnpaidAppointments } = deleteUnpaidAppointmentsModule;
const { deletePaidAppointments } = deletePaidAppointmentsModule;

// Get environment from command line argument
const env = process.argv[2];

/**
 * Cleanup all paid appointments for the given environment.
 */
async function cleanupPaidAppointments() {
  await deletePaidAppointments(env);
  console.log("Paid appointments cleanup completed.");
}

/**
 * Cleanup all unpaid appointments for the given environment.
 */
async function cleanupUnpaidAppointments() {
  await deleteUnpaidAppointments(env);
  console.log("Unpaid appointments cleanup completed.");
}

/**
 * Cleanup all breaks for the given environment.
 */
async function cleanupBreaks() {
  await deleteBreaks(env);
  console.log("Breaks cleanup completed.");
}

/**
 * Main cleanup sequence:
 * Cleanup breaks
 */
async function runCleanup() {
  try {
    await cleanupUnpaidAppointments();
    await cleanupBreaks();
    await cleanupPaidAppointments();
    console.log("All cleanup tasks completed successfully.");
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

// Execute the cleanup
runCleanup();
