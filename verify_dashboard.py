from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_dashboard(page: Page):
    print("Navigating to dashboard...")
    page.goto("http://localhost:8787")

    # 1. Check Title
    print("Checking title...")
    expect(page).to_have_title("Cloudflare Request Inspector")
    expect(page.get_by_role("heading", name="Request Inspector")).to_be_visible()

    # 2. Check Gridstack
    print("Checking Gridstack...")
    expect(page.locator(".grid-stack")).to_be_visible()

    # 3. Check Widgets
    print("Checking widgets...")
    server_card = page.locator(".grid-stack-item", has_text="Server-Side")
    expect(server_card).to_be_visible()

    headers_card = page.locator(".grid-stack-item", has_text="Request Headers")
    expect(headers_card).to_be_visible()

    # 4. Check Theme Toggle
    print("Checking theme toggle...")
    toggle_btn = page.locator("#theme-toggle")
    expect(toggle_btn).to_be_visible()

    # Click toggle and check class on html (if possible to check raw attribute easily, or check background color change)
    # Default is system, or depends. Let's assume light/dark.
    # We can check if 'dark' class is added to html.

    # Cycle 1: System -> Light (if default was system) or Light -> Dark.
    # The logic: if no storage, click -> light. click -> dark. click -> system.
    toggle_btn.click()
    # Wait a bit for transition
    time.sleep(0.5)

    # Take screenshot of Dashboard
    print("Taking screenshot...")
    page.screenshot(path="/home/jules/verification/dashboard.png")

    # 5. Check Minimize
    print("Checking minimize...")
    # Find minimize button in Headers card
    min_btn = headers_card.locator(".minimize-btn")
    expect(min_btn).to_be_visible()

    content = headers_card.locator(".widget-content")
    expect(content).to_be_visible()

    min_btn.click()
    time.sleep(0.5)
    expect(content).not_to_be_visible()

    print("Taking screenshot after minimize...")
    page.screenshot(path="/home/jules/verification/dashboard_minimized.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_dashboard(page)
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="/home/jules/verification/error.png")
            raise e
        finally:
            browser.close()
