from playwright.sync_api import sync_playwright

def verify_band5(page):
    # Setup mock data for learner and auth
    page.goto('http://localhost:8083')

    # Mock network responses to bypass API checks
    page.route("**/api/auth/session", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"user": {"id": "test-user", "role": "family"}}'
    ))
    page.route("**/api/family*", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"id": "test-family", "name": "Test Family"}'
    ))
    page.route("**/api/progress*", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"success": true}'
    ))

    # Set mock localStorage for Zustand
    page.evaluate("""
        localStorage.setItem('learner-storage', JSON.stringify({
            state: { activeLearnerId: 'learner1', activeLearnerBand: 5 },
            version: 0
        }));
        localStorage.setItem('auth-storage', JSON.stringify({
            state: {
                isAuthenticated: true,
                hasFamily: true,
                currentTopicId: 'history-1'
            },
            version: 0
        }));
    """)

    # Navigate directly to the lesson player for Chapter 1
    page.goto('http://localhost:8083/play/ch01')

    # Wait for the player to load and stabilize
    page.wait_for_timeout(5000)

    # Take a screenshot of the main player view
    page.screenshot(path='/app/verification/band5_lesson.png')
    page.wait_for_timeout(1000)

    # Click to start lesson if necessary
    try:
        page.mouse.click(500, 500)
        page.wait_for_timeout(2000)
        page.screenshot(path='/app/verification/band5_lesson_started.png')
    except:
        pass

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="/app/verification/video")
        page = context.new_page()
        try:
            verify_band5(page)
        finally:
            context.close()
            browser.close()
