from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        # Mock API responses as per memory instructions
        context = browser.new_context(viewport={'width': 1280, 'height': 800}, record_video_dir="verification/video")

        # Setup dummy auth cookie
        context.add_cookies([{
            'name': 'll_auth_token',
            'value': 'dummy_token',
            'domain': 'localhost',
            'path': '/'
        }])

        page = context.new_page()

        # Mock the current user
        page.route("**/api/auth/me", lambda route: route.fulfill(
            status=200,
            json={"user": {"id": "test_user", "name": "Test User", "role": "learner", "family_id": "test_family"}}
        ))

        # Mock a lesson response with markdown content
        lesson_data = {
            "id": "lesson_1",
            "topic_id": "topic_1",
            "title": "Test Markdown Lesson",
            "narrative": "# This is a Heading 1\n\n## This is a Heading 2\n\nHere is some **bold text** and *italic text*.\n\n- List item 1\n- List item 2\n\n> This is a blockquote.\n\nAnd a paragraph with `inline code`.",
            "key_dates": [],
            "key_figures": [],
            "citations": []
        }
        page.route("**/api/lessons/lesson_1", lambda route: route.fulfill(
            status=200,
            json=lesson_data
        ))

        # Navigate to the lesson view
        page.goto("http://localhost:8080/lessons/lesson_1")

        # Wait for the heading to appear to know it loaded
        page.wait_for_selector("h1:has-text('This is a Heading 1')")

        # Take a screenshot
        os.makedirs("verification", exist_ok=True)
        page.screenshot(path="verification/markdown_render.png")

        page.wait_for_timeout(1000)

        print("Screenshot saved to verification/markdown_render.png")

        context.close()
        browser.close()

if __name__ == "__main__":
    run()
