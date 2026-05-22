// End-to-end workflow test for HandyHire
// Tests: sign in as client → post job → sign in as worker → submit quote
//        → sign back in as client → accept quote → open chat → send message
//        → sign in as worker → verify chat link appears

const { chromium } = require('playwright');
const path = require('path');

const BASE = 'http://localhost:3000';

async function screenshot(page, name) {
  const dir = path.join(__dirname, 'test-screenshots');
  require('fs').mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${name}.png`), fullPage: false });
  console.log(`  📸 ${name}.png`);
}

async function run() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 300,
    args: ['--window-size=1280,800'],
  });

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  try {
    // ─── Step 1: Sign in as CLIENT ──────────────────────────────────────
    console.log('\n[1/8] Signing in as client…');
    await page.goto(`${BASE}/auth/signin`);
    await page.fill('[name=email]', 'client@test.com');
    await page.fill('[name=password]', 'password');
    await screenshot(page, '01-signin-client');
    await page.click('button[type=submit]');
    await page.waitForURL('**/client/dashboard', { timeout: 10000 });
    console.log('  ✓ Client dashboard reached');
    await screenshot(page, '02-client-dashboard');

    // ─── Step 2: Post a job ─────────────────────────────────────────────
    console.log('\n[2/8] Posting a new job…');
    await page.click('a[href="/client/post-job"]');
    await page.waitForURL('**/client/post-job', { timeout: 8000 });
    await page.fill('[name=title]', 'Fix burst water pipe under sink');
    await page.selectOption('[name=category]', 'Plumbing');
    await page.fill('textarea[name=description]', 'The main pipe under the kitchen sink burst overnight. Water is everywhere. Need someone today who can replace the pipe section and check the rest.');
    await page.fill('[name=budgetMinNgn]', '8000');
    await page.fill('[name=budgetMaxNgn]', '20000');
    // Click urgent radio
    await page.click('label:has(input[name=urgency][value=urgent])');
    // Fill location manually
    await page.fill('[name=location]', 'Wuse II, Abuja');
    await screenshot(page, '03-post-job-form');
    await page.click('button[type=submit]');
    await page.waitForURL('**/client/dashboard', { timeout: 10000 });
    console.log('  ✓ Job posted — redirected to client dashboard');
    await screenshot(page, '04-client-dashboard-after-post');

    // Verify job appears
    const jobTitle = await page.locator('text=Fix burst water pipe under sink').first();
    await jobTitle.waitFor({ timeout: 5000 });
    console.log('  ✓ New job visible in dashboard');

    // ─── Step 3: Sign out and sign in as WORKER ─────────────────────────
    console.log('\n[3/8] Signing in as worker…');
    // Sign out via sidebar button
    await page.click('button:has-text("Sign out")');
    await page.waitForURL('**/', { timeout: 8000 });

    await page.goto(`${BASE}/auth/signin`);
    await page.fill('[name=email]', 'worker@test.com');
    await page.fill('[name=password]', 'password');
    await page.click('button[type=submit]');
    await page.waitForURL('**/worker/dashboard', { timeout: 10000 });
    console.log('  ✓ Worker dashboard reached');
    await screenshot(page, '05-worker-dashboard');

    // ─── Step 4: Verify job feed is visible (worker is verified) ────────
    console.log('\n[4/8] Checking nearby jobs feed…');
    const jobFeed = page.locator('h3:has-text("Nearby jobs")');
    await jobFeed.waitFor({ timeout: 5000 });
    console.log('  ✓ Job feed visible (worker is verified)');

    // ─── Step 5: Submit a quote on the new job ───────────────────────────
    console.log('\n[5/8] Submitting a quote…');
    // Find the new job in the feed and hover to reveal the Quote button
    const newJobItem = page.locator('li').filter({ hasText: 'Fix burst water pipe' }).first();
    await newJobItem.waitFor({ timeout: 5000 });
    await newJobItem.hover();
    const quoteBtn = newJobItem.locator('button:has-text("Quote")');
    await quoteBtn.waitFor({ timeout: 5000 });
    await screenshot(page, '06-worker-job-feed-hover');
    await quoteBtn.click();

    // Modal should open
    const modal = page.locator('[role=dialog]');
    await modal.waitFor({ timeout: 5000 });
    console.log('  ✓ Quote modal opened');
    await screenshot(page, '07-quote-modal');

    await page.fill('[name=amountNgn]', '15000');
    await page.fill('[name=note]', 'I have handled similar pipe replacements many times. I can be there within the hour with all necessary equipment.');
    await screenshot(page, '08-quote-modal-filled');
    await page.click('button:has-text("Send quote")');

    // Modal should close on success
    await modal.waitFor({ state: 'hidden', timeout: 8000 });
    console.log('  ✓ Quote submitted — modal closed');
    await screenshot(page, '09-worker-after-quote');

    // Verify quote appears in QuotesPanel
    const sentQuote = page.locator('text=Fix burst water pipe under sink');
    await sentQuote.first().waitFor({ timeout: 5000 });
    console.log('  ✓ Quote visible in worker\'s active quotes panel');

    // ─── Step 6: Sign back in as CLIENT and accept the quote ─────────────
    console.log('\n[6/8] Accepting the quote as client…');
    await page.click('button:has-text("Sign out")');
    await page.waitForURL('**/', { timeout: 8000 });

    await page.goto(`${BASE}/auth/signin`);
    await page.fill('[name=email]', 'client@test.com');
    await page.fill('[name=password]', 'password');
    await page.click('button[type=submit]');
    await page.waitForURL('**/client/dashboard', { timeout: 10000 });

    // The new job should show in quotes inbox — scroll down to quotes
    await page.waitForTimeout(1000);
    await screenshot(page, '10-client-dashboard-with-quote');

    // Find Accept button for the new quote
    const acceptBtn = page.locator('button:has-text("Accept")').first();
    await acceptBtn.waitFor({ timeout: 8000 });
    console.log('  ✓ New quote visible in QuotesInbox');
    await acceptBtn.click();

    // Wait for refresh + "Accepted" badge to appear
    await page.locator('text=Accepted').first().waitFor({ timeout: 8000 });
    console.log('  ✓ Quote accepted — "Accepted" badge shown');
    await screenshot(page, '11-quote-accepted');

    // ─── Step 7: Open chat with worker ──────────────────────────────────
    console.log('\n[7/8] Opening chat…');
    const openChatLink = page.locator('a:has-text("Open chat")').first();
    await openChatLink.waitFor({ timeout: 5000 });
    await openChatLink.click();
    await page.waitForURL('**/chat/**', { timeout: 8000 });
    console.log('  ✓ Chat page opened');
    await screenshot(page, '12-chat-page');

    // Send a message
    await page.fill('[name=body]', 'Hi! When can you come? It is quite urgent.');
    await screenshot(page, '13-chat-message-typed');
    await page.click('button[aria-label="Send message"]');

    // Message should appear in the thread
    await page.locator('text=Hi! When can you come?').waitFor({ timeout: 6000 });
    console.log('  ✓ Message sent and visible in chat');
    await screenshot(page, '14-chat-message-sent');

    // ─── Step 8: Sign in as worker — verify chat link and reply ──────────
    console.log('\n[8/8] Worker checking chat…');
    await page.click('button:has-text("Sign out")');
    await page.waitForURL('**/', { timeout: 8000 });

    await page.goto(`${BASE}/auth/signin`);
    await page.fill('[name=email]', 'worker@test.com');
    await page.fill('[name=password]', 'password');
    await page.click('button[type=submit]');
    await page.waitForURL('**/worker/dashboard', { timeout: 10000 });
    await screenshot(page, '15-worker-dashboard-after-accept');

    // Should see "Open chat" link in QuotesPanel for accepted quote
    const chatLink = page.locator('a:has-text("Open chat")').first();
    await chatLink.waitFor({ timeout: 6000 });
    console.log('  ✓ Worker can see "Open chat" link on accepted quote');
    await chatLink.click();
    await page.waitForURL('**/chat/**', { timeout: 8000 });

    // Client's message should already be there
    await page.locator('text=Hi! When can you come?').waitFor({ timeout: 6000 });
    console.log('  ✓ Worker sees client message in chat');
    await screenshot(page, '16-worker-in-chat');

    // Worker replies
    await page.fill('[name=body]', "I'll be there in 45 minutes. Please have the water turned off at the mains.");
    await page.click('button[aria-label="Send message"]');
    await page.locator("text=I'll be there in 45 minutes").waitFor({ timeout: 6000 });
    console.log('  ✓ Worker reply sent');
    await screenshot(page, '17-worker-reply-sent');

    console.log('\n✅ FULL WORKFLOW PASSED — all 8 steps completed successfully\n');
    console.log('Screenshots saved to: test-screenshots/');

  } catch (err) {
    console.error('\n❌ TEST FAILED:', err.message);
    await screenshot(page, 'ERROR-state');
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();
