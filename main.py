import time
import pandas as pd
import pyshorteners
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get("https://www.croma.com/?utm_source=google&utm_medium=ps&utm_campaign=sok_search_brand_acq-purebrand&gad_source=1&gclid=Cj0KCQiAsaS7BhDPARIsAAX5cSChfwskoNIyCkxPEsnL7EGGkoww4gvujCuCQLKhXJ6QTevmbCBUg7UaAp4XEALw_wcB")

#Waiting  for the search box and input the search query
searchbox = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, "searchV2"))
)
searchbox.clear()
searchbox.send_keys("LED TV")
searchbox.send_keys(Keys.RETURN)

time.sleep(10)

#initialized lists
led_names = []
led_brand = []
led_prices = []
led_ratings = []
led_desc = []
led_links = []
led_imgurls=[]

shortener = pyshorteners.Shortener()

# Find all products
all_leds = WebDriverWait(driver, 10).until(
    EC.presence_of_all_elements_located((By.XPATH, "//div[@data-testid='product-id']"))
)

# Extract product information
for product in all_leds:
    try:
        # Product Name and Brand
        product_title = product.find_element(By.XPATH, ".//h3[contains(@class, 'product-title')]").text
        led_names.append(product_title)
        led_brand.append(product_title.split()[0])  # Assuming brand is the first word

        # Product Price
        price_element = product.find_element(By.XPATH, ".//span[@class='amount plp-srp-new-amount']").text
        led_prices.append(price_element);
        print(price_element)

        #Product images
        product_img=product.find_element(By.XPATH, ".//div[@class='product-img plp-card-thumbnail plpnewsearch']/img")
        image_url=product_img.get_attribute("src")
        shortened_url=shortener.tinyurl.short(image_url)
        led_imgurls.append(shortened_url)


        # Product Rating
        try:
            rating_element = product.find_element(By.XPATH, ".//span[@class='rating-text']")
            led_ratings.append(rating_element.text if rating_element else "No rating")
        except:
            led_ratings.append("No rating")

        # Product Link
        link_element = product.find_element(By.XPATH, ".//h3[@class='product-title plp-prod-title 999']/a")
        product_url = link_element.get_attribute("href")
        led_links.append(product_url)
    except Exception as e:
        print(f"Error processing product: {e}")

#navigate to each product page to get descriptions
for link in led_links:
    driver.get(link)
    time.sleep(3)  #Allowing the page to load

    try:
        #Product Description
        desc_elements = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, "//div[@class='cp-keyfeature pd-eligibility-wrap']//ul/li"))
        )
        desc_text = " | ".join([desc.text for desc in desc_elements])
        led_desc.append(desc_text)
    except:
        led_desc.append("No description available")

#creating a df
df = pd.DataFrame(zip(led_brand, led_names, led_prices, led_ratings, led_desc,led_imgurls),
                  columns=['brand', 'name', 'price', 'rating', 'description','img_URLs'])

df.to_csv(r"C:\Users\KIIT\Documents\coding\hello world\Croma\directory.csv", index=False)

print("Scraping complete. Data saved to CSV.")
driver.quit()
