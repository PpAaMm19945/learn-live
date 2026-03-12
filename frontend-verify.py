import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        # Launch browser (use chromium for default headless)
        browser = await p.chromium.launch()
        # Create a mobile context (e.g., iPhone 12 Pro size)
        context = await browser.new_context(
            viewport={'width': 360, 'height': 800},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        )
        page = await context.new_page()

        # Navigate to dashboard
        try:
            await page.goto("http://localhost:8080/narrate/lesson-1", wait_until="networkidle")
            # Wait a moment for any initial react renders
            await page.wait_for_timeout(2000)

            # Take screenshot
            await page.screenshot(path="narrated-lesson-mobile.png")
            print("Screenshot saved to narrated-lesson-mobile.png")
        except Exception as e:
            print(f"Error accessing page: {e}")

        await browser.close()

asyncio.run(run())
