/**
 * Global setup for Playwright tests
 * Sets the default environment before any tests run
 */

import { setActiveEnv } from '../config/runtime.js';

export default async function globalSetup() {
    // Set default environment - can be overridden by ENV variable
    const envName = process.env.TEST_ENV || 'dev';
    setActiveEnv(envName);
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🌍 Global Setup: Environment set to '${envName.toUpperCase()}'`);
    console.log(`${'='.repeat(80)}\n`);
}



