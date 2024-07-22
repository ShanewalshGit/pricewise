import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractPrice } from "../utils";

export async function scrapeAmazonProduct(url: string) {
    if(!url) return;

    // BrightData Proxy configuration
    const username = String(process.env.BRIGHTDATA_USERNAME);
    const password = String(process.env.BRIGHTDATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;

    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    }

    try {
        // Fetch the product page
        const response = await axios.get(url, options);
        const $ = cheerio.load(response.data);

        // Extract the product details
        const title = $('#productTitle').text().trim();
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
        );

        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('a-size-base.a-color-base')
        );

        const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

        const images = 
            $('#imgBlkFront').attr('data-a-dynamic-image') || 
            $('#landingImage').attr('data-a-dynamic-image') || 
            '{}'

        const imageUrls = Object.keys(JSON.parse(images));

        const currency = extractCurrency($('.a-price-symbol'));

        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");

        //console.log("title: ", title, "currentPrice: ", currentPrice, "originalPrice: ", originalPrice, "outOfStock: ", outOfStock, "imageUrls: ", imageUrls, "currency: ", currency, "discountRate: ", discountRate);

        // Construct data object with scraped data
        const data = {
            url,
            currency: currency || '$',
            image: imageUrls[0],
            title,
            currentPrice: Number(currentPrice),
            originalPrice: Number(originalPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            cateogry: 'category',
            reviewsCount: 100,
            stars: 4.5,
        }
    
    } catch (error: any) {
        throw new Error(`Failed to scrape Amazon product: ${error.message}`);
    }
}