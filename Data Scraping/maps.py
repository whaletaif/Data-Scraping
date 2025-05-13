from playwright.sync_api import sync_playwright
from playwright._impl._errors import TimeoutError
import time
import pandas as pd
import datetime
import os
import json

# Function to replace missing values with blanks
def safe_get_text(locator):
    try:
        elements = locator.all()
        if elements:
            return elements[0].inner_text()
        return None
    except:
        return None

# Scraper function
def maps_scraper(keyword, location, limit=None, log_callback=None, proxy=None):
    start_time = datetime.datetime.now()
    if log_callback:
        log_callback("بدأ تشغيل المستخرج, انتظر قليلاً") #Started running scraper. Please wait
    with sync_playwright() as p:
        query = f"{keyword} في {location}"
        # Set proxy if provided
        browser_args = {}
        if proxy:
            browser_args['proxy'] = {'server': proxy}
            if log_callback:
                log_callback("Proxy applied")

        # Launch browser
        browser = p.chromium.launch(headless=True, **browser_args)  # headless=False to show browser
        page = browser.new_page()

        # Go to Google Maps
        try:
            page.goto(f"https://www.google.com/maps/place/{location}?hl=ar", timeout=30000)
        except TimeoutError as e:
            if log_callback:
                log_callback("لديك مشكله في الاتصال بالانترنت, حاول لاحقا") #Slow internet connection. Please try again.
            browser.close()

        # Accept cookies if prompted
        try:
            page.locator("button:has-text('قبول الكل')").click()
            time.sleep(1)
        except:
            pass

        # Perform search
        try:
            page.locator('//input[@id="searchboxinput"]').fill(keyword)
        except TimeoutError as e:
            if log_callback:
                log_callback("لديك مشكله في الاتصال بالانترنت, حاول لاحقا") #Slow internet connection. Please try again.
            browser.close()
        page.keyboard.press("Enter")

        # Wait for results to load
        time.sleep(5)
        try:
            page.hover('//a[contains(@href, "https://www.google.com/maps/place")]')
        except TimeoutError as e:
            if log_callback:
                log_callback("لديك مشكله في الاتصال بالانترنت, حاول لاحقا")#Slow internet connection. Please try again.
            browser.close()

        # Scroll
        for n in range(15):
            page.mouse.wheel(0, 10000)
            time.sleep(2)
        page.wait_for_timeout(3000)

        # Collect results
        try:
            results = page.locator("//a[contains(@href, 'https://www.google.com/maps/place')]").all()
        except TimeoutError as e:
            if log_callback:
                log_callback("لديك مشكله في الاتصال بالانترنت, حاول لاحقا") #Slow internet connection. Please try again.
            browser.close()
        if log_callback:
            log_callback(f"{len(results)} نجح استخراج النتائج, النتائج يعتمد على سرعة اتصال الانترنت") #results found. Number depends on speed of internet connection.
        time.sleep(3)

        # Collect all hrefs from results
        hrefs = []
        hrefs_seen = set()  # To ensure no duplicate results. hrefs are treated as unique
        for i, result in enumerate(results):
            try:
                href = result.get_attribute('href')
                if href and href not in hrefs_seen:
                    hrefs.append(href)
                    hrefs_seen.add(href)
            except Exception as e:
                if log_callback:
                    log_callback(f"خطأ في الحصول على النتائج {i}: {e}") #Error getting href for result
        if log_callback:
            log_callback(f"{len(hrefs)} نتائج غريبه {len(results)-len(hrefs)} تم تجاهل النتائج المكرره ")#unique results found. duplicates ignored.

        # Visit each result
        all_outputs = []
        for i, href in enumerate(hrefs[:limit]):
            try:
                page.goto(href)
                time.sleep(3)

                # Scrape data
                name = page.locator("h1.DUwDvf.lfPIob").inner_text()
                rating = page.locator('xpath=//*[@id="QA0Szd"]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div[1]/div[2]/div/div[1]/div[2]/span[1]/span[1]/span').inner_text()
                #total_reviews = page.locator('xpath=//*[@id="QA0Szd"]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]/div/div[1]/div[2]/div/div[1]/div[2]/span[2]/span/span/span').inner_text()
                address = safe_get_text(page.locator('xpath=//button[@data-item-id="address"]//div[contains(@class, "fontBodyMedium")]'))
                website = safe_get_text(page.locator('xpath=//a[@data-item-id="authority"]//div[contains(@class, "fontBodyMedium")]'))
                phone_number = safe_get_text(page.locator('xpath=//button[contains(@data-item-id, "phone:tel:")]//div[contains(@class, "fontBodyMedium")]'))

                # Compile data
                one_output = {
                    "name": name,
                    "rating": rating,
                    #"total_reviews": total_reviews,
                    "address": address,
                    "website": website,
                    "phone_number": phone_number,
                    "link": href
                    }
                
                # Add data to collection
                all_outputs.append(one_output)

            except TimeoutError:
                if log_callback:
                    log_callback(f"لايمكن تحميل النتائج {i} بسبب اتصال الانترنت لايمكن الوصول الى نتائج{href}.")#Can't load result , due to slow internet connection. Can't reach 
            except Exception as e:
                if log_callback:
                    log_callback(f"خطأ في استخراج النتائج {i}: {e}")#Error extracting result
            
        # Convert data collection to dataframe
        df = pd.DataFrame(all_outputs)
        filename = f"{keyword}_في_{location}"

        # Save as Excel
        output_path_excel = os.path.join('outputs', f'{filename}.xlsx')
        df.to_excel(output_path_excel, index=False)

        # Save as JSON
        output_path_json = os.path.join('outputs', f'{filename}.json')
        with open(output_path_json, 'w', encoding='utf-8') as json_file:
            json.dump(all_outputs, json_file, ensure_ascii=False, indent=4)

        duration = datetime.datetime.now() - start_time
        formatted_duration = str(duration).split('.')[0]
        if log_callback:
            log_callback(f" تم الاستخراج في  {formatted_duration}")#Scraping completed in
        browser.close()
        return {"excel": output_path_excel, "json": output_path_json}

# Inputs example
# scraper(keyword, location, limit)
# keyword = "مستشفى"
# location = "الرياض"
# limit = 20  *Blank for no limit*