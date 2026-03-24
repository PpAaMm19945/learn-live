from playwright.sync_api import sync_playwright
import time
import os

def verify_feature():
    os.makedirs("/app/verification/video", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="/app/verification/video")
        page = context.new_page()
        try:
            # We must mock API requests to bypass auth since just localStorage isn't enough
            def handle_route(route):
                if '/api/' in route.request.url:
                    if 'auth/session' in route.request.url:
                        route.fulfill(status=200, content_type="application/json", body='{"user": {"id": "user-1", "email": "test@example.com"}, "session": {"access_token": "fake"}}')
                    elif 'family' in route.request.url:
                        route.fulfill(status=200, content_type="application/json", body='{"id": "family-1", "name": "Test Family", "learners": [{"id": "learner-1", "name": "Test Learner", "band": 0}], "owner_id": "user-1", "invite_code": "123"}')
                    else:
                        route.fulfill(status=200, content_type="application/json", body='{}')
                else:
                    route.continue_()

            page.route("**/*", handle_route)

            # Set localStorage to mock learner state
            page.goto("http://localhost:8083")
            page.evaluate("""
                document.cookie = "session=fake-session-cookie; path=/;";
            """)
            page.evaluate("""
                localStorage.setItem('auth-storage', JSON.stringify({
                    state: {
                        user: { id: 'user-1', email: 'test@example.com' },
                        session: { access_token: 'fake-token' },
                        isLoading: false
                    },
                    version: 1
                }));
                localStorage.setItem('learner-storage', JSON.stringify({
                    state: {
                        activeLearnerId: 'learner-1',
                        activeLearnerName: 'Test Learner',
                        activeLearnerBand: 0,
                        hasFamily: true,
                        currentTopicId: 'history',
                        completedLessons: []
                    },
                    version: 1
                }));
            """)

            # Navigate to Chapter 1
            page.goto("http://localhost:8083/play/ch01")

            page.wait_for_timeout(2000)

            # Take a screenshot to see what's wrong
            page.screenshot(path="/app/verification/error_state.png")

            # Wait for StorybookPlayer to load
            page.wait_for_selector("h2", timeout=10000)

            # Take a screenshot
            page.screenshot(path="/app/verification/band0_storybook.png")

            # Click a few times to advance
            for i in range(3):
                page.mouse.click(500, 500)
                page.wait_for_timeout(1000)

            page.screenshot(path="/app/verification/band0_storybook_advanced.png")

            # Switch to band 1
            page.evaluate("""
                localStorage.setItem('learner-storage', JSON.stringify({
                    state: {
                        activeLearnerId: 'learner-1',
                        activeLearnerName: 'Test Learner',
                        activeLearnerBand: 1,
                        hasFamily: true,
                        currentTopicId: 'history',
                        completedLessons: []
                    },
                    version: 1
                }));
            """)

            page.reload()
            page.wait_for_timeout(1000)
            page.goto("http://localhost:8083/play/ch01")
            page.wait_for_timeout(1000)

            # Wait for StorybookPlayer to load
            page.wait_for_selector("h2", timeout=10000)

            # Take a screenshot
            page.screenshot(path="/app/verification/band1_storybook.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            context.close()
            browser.close()

if __name__ == "__main__":
    verify_feature()