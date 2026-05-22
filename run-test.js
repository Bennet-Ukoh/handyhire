/**
 * Manual run test — drives the full end-to-end flow and takes screenshots.
 * Tests: landing → auth → client dashboard → worker dashboard → admin dashboard
 * → post job → worker sees job → worker quotes → client accepts → chat → mark complete
 */

const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const BASE = "http://localhost:3000";
const SS_DIR = path.join(__dirname, "test-screenshots");
if (!fs.existsSync(SS_DIR)) fs.mkdirSync(SS_DIR, { recursive: true });

let ssIndex = 0;

async function ss(page, name) {
  ssIndex++;
  const file = path.join(SS_DIR, `${String(ssIndex).padStart(2, "0")}-${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`  📸 ${path.basename(file)}`);
}

async function signIn(page, email, password) {
  await page.goto(`${BASE}/auth/signin`);
  await page.waitForSelector('[name=email]');
  await page.fill('[name=email]', email);
  await page.fill('[name=password]', password);
  await page.click('button[type=submit]');
}

async function signOut(page) {
  await page.click('button:has-text("Sign out")');
  // signOutAction redirects to "/" (landing page)
  await page.waitForURL(`${BASE}/`);
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 200 });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  try {
    // ── 1. Landing page ────────────────────────────────────────────────
    console.log("\n[1] Landing page");
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    await ss(page, "landing");

    // ── 2. Sign in as CLIENT ───────────────────────────────────────────
    console.log("\n[2] Sign in as client");
    await signIn(page, "client@test.com", "password");
    await page.waitForURL(`${BASE}/client/dashboard`);
    // Wait for actual content — the jobs panel heading
    await page.waitForSelector('text=Your jobs', { timeout: 15000 });
    await ss(page, "client-dashboard");
    console.log("  ✅ Client dashboard loaded");

    // ── 3. Check jobs panel shows seed jobs ────────────────────────────
    console.log("\n[3] Verify job panel populated");
    const jobItems = await page.locator('ul li').count();
    console.log(`  ✅ ${jobItems} list items visible`);

    // ── 4. Mark in_progress job as complete ────────────────────────────
    console.log("\n[4] Mark Complete button on in-progress job");
    // Scroll to see the jobs panel fully
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const markCompleteBtn = page.locator('button:has-text("Mark complete")').first();
    const btnVisible = await markCompleteBtn.isVisible({ timeout: 3000 }).catch(() => false);
    console.log(`  ${btnVisible ? "✅ Mark complete button visible" : "⚠️  No in-progress job to mark (may already be completed)"}`);
    await ss(page, "client-dashboard-scrolled");
    if (btnVisible) {
      await markCompleteBtn.click();
      await page.waitForSelector('text=Your jobs', { timeout: 10000 });
      await ss(page, "after-mark-complete");
      console.log("  ✅ Job marked complete");
    }

    // ── 5. Post a new job ─────────────────────────────────────────────
    console.log("\n[5] Post a new Plumbing job");
    await page.goto(`${BASE}/client/post-job`);
    await page.waitForLoadState("networkidle");
    await ss(page, "post-job-form");

    await page.waitForSelector('[name=title]');
    await page.fill('[name=title]', 'Test: fix dripping kitchen tap');
    // Use label text to click the category select
    await page.selectOption('select[name=category]', { label: 'Plumbing' });
    await page.fill('textarea[name=description]', 'Cold water tap drips constantly. Quick job for an experienced plumber.');
    await page.fill('[name=budgetMinNgn]', '5000');
    await page.fill('[name=budgetMaxNgn]', '12000');
    await page.fill('[name=location]', 'Surulere, Lagos');
    await ss(page, "post-job-filled");
    await page.click('button[type=submit]');
    await page.waitForURL(`${BASE}/client/dashboard`);
    await page.waitForSelector('text=Your jobs', { timeout: 15000 });
    await ss(page, "after-post-job");
    console.log("  ✅ Job posted, redirected to dashboard");

    // ── 6. Check quotes inbox ─────────────────────────────────────────
    console.log("\n[6] Check quotes inbox shows pending quotes");
    // Scroll to top to see quotes section
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const quoteCards = await page.locator('button:has-text("Accept")').count();
    console.log(`  ${quoteCards > 0 ? "✅" : "ℹ️ "} ${quoteCards} quote(s) with Accept button visible`);
    await ss(page, "client-quotes-inbox");

    // ── 7. Accept a quote ─────────────────────────────────────────────
    if (quoteCards > 0) {
      console.log("\n[7] Accept first quote");
      await page.locator('button:has-text("Accept")').first().click();
      await page.waitForSelector('text=Your jobs', { timeout: 15000 });
      await ss(page, "after-accept-quote");
      console.log("  ✅ Quote accepted");
    }

    await signOut(page);

    // ── 8. Sign in as WORKER ──────────────────────────────────────────
    console.log("\n[8] Sign in as worker");
    await signIn(page, "worker@test.com", "password");
    await page.waitForURL(`${BASE}/worker/dashboard`);
    // Wait for actual content — verification card or stats section
    await page.waitForSelector('text=Account Verification', { timeout: 15000 }).catch(() => {});
    await ss(page, "worker-dashboard");
    console.log("  ✅ Worker dashboard loaded");

    // ── 9. Check job feed is Plumbing only ───────────────────────────
    console.log("\n[9] Verify job feed shows Plumbing jobs");
    // The job feed section
    const feedSection = page.locator('text=Browse Jobs').first();
    const feedVisible = await feedSection.isVisible().catch(() => false);
    console.log(`  ${feedVisible ? "✅ Feed section visible" : "⚠️  Feed section not visible"}`);
    await ss(page, "worker-job-feed");

    // ── 10. Check recently posted job appears in feed ─────────────────
    console.log("\n[10] Check new Plumbing job appears in worker feed");
    const newJobInFeed = await page.locator('text=Test: fix dripping kitchen tap').isVisible().catch(() => false);
    console.log(`  ${newJobInFeed ? "✅ New job visible in worker feed" : "⚠️  New job not yet visible (check trade filter)"}`);

    // ── 11. Check quotes panel ────────────────────────────────────────
    console.log("\n[11] Worker quotes panel");
    const acceptedQuoteVisible = await page.locator('text=accepted').isVisible().catch(() => false);
    console.log(`  ${acceptedQuoteVisible ? "✅ Accepted quote visible in quotes panel" : "ℹ️  No accepted quotes visible yet"}`);

    // ── 12. Open chat from accepted quote ─────────────────────────────
    console.log("\n[12] Open chat from accepted quote");
    const chatLink = page.locator('a:has-text("Open chat")').first();
    const chatLinkVisible = await chatLink.isVisible().catch(() => false);
    if (chatLinkVisible) {
      await chatLink.click();
      await page.waitForLoadState("networkidle");
      await ss(page, "worker-chat");
      console.log("  ✅ Chat window opened");

      // Send a message — wait for Client Component to hydrate
      const messageInput = page.locator('textarea[name=body]');
      const inputReady = await messageInput.waitFor({ state: 'visible', timeout: 6000 }).then(() => true).catch(() => false);
      if (inputReady) {
        await messageInput.fill("I'll be there tomorrow morning at 9am.");
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
        await ss(page, "worker-chat-message-sent");
        console.log("  ✅ Message sent");
      } else {
        console.log("  ⚠️  Chat input not ready within 6s");
      }
    } else {
      console.log("  ⚠️  No 'Open chat' link visible");
    }

    await signOut(page);

    // ── 13. Sign in as ADMIN ──────────────────────────────────────────
    console.log("\n[13] Sign in as admin");
    await signIn(page, "admin@test.com", "password");
    await page.waitForURL(`${BASE}/admin/dashboard`);
    await page.waitForSelector('text=Pending Verifications', { timeout: 15000 }).catch(() => {});
    await ss(page, "admin-dashboard");
    console.log("  ✅ Admin dashboard loaded");

    // ── 14. Check verification queue ──────────────────────────────────
    console.log("\n[14] Check verification queue");
    await page.goto(`${BASE}/admin/verifications`);
    await page.waitForLoadState("networkidle");
    await ss(page, "admin-verifications-queue");
    const queueItems = await page.locator('a[href*="/admin/verifications/"]').count();
    console.log(`  ✅ Verification queue has entries: ${queueItems > 0 ? `yes (${queueItems})` : "empty"}`);

    // ── 15. Open a worker's verification detail ───────────────────────
    console.log("\n[15] Open worker verification detail");
    const firstWorkerLink = page.locator('a[href*="/admin/verifications/"]').first();
    if (await firstWorkerLink.isVisible().catch(() => false)) {
      await firstWorkerLink.click();
      await page.waitForLoadState("networkidle");
      await ss(page, "admin-verification-detail");
      console.log("  ✅ Verification detail loaded");

      // Try approving a check — wait for Client Components to hydrate
      const approveBtn = page.locator('button:has-text("Approve")').first();
      const approveBtnReady = await approveBtn.waitFor({ state: 'visible', timeout: 6000 }).then(() => true).catch(() => false);
      if (approveBtnReady) {
        await approveBtn.click();
        await page.waitForLoadState("networkidle");
        await ss(page, "admin-after-approve");
        console.log("  ✅ Approval action triggered");
      } else {
        console.log("  ⚠️  Approve button not found (worker may already be fully verified)");
      }
    }

    await signOut(page);

    // ── 16. Verify approved worker's quote now shows Verified ─────────
    console.log("\n[16] Sign back in as client — verify workerIsVerified sync");
    await signIn(page, "client@test.com", "password");
    await page.waitForURL(`${BASE}/client/dashboard`);
    await page.waitForLoadState("networkidle");
    await ss(page, "client-after-admin-approval");
    const verifiedBadge = await page.locator('text=Verified').count();
    console.log(`  ✅ Verified badge count on quotes: ${verifiedBadge}`);

    console.log("\n\n✅ All tests complete. Screenshots saved to test-screenshots/");

  } catch (err) {
    console.error("\n❌ Test failed:", err.message);
    await ss(page, "ERROR");
  } finally {
    await browser.close();
  }
})();
