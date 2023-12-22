const fs = require('fs');
const axios = require('axios');
const cron = require('node-cron');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const tokenFilePath = './token.txt';
const qrCode = require('qrcode-terminal');
const QrCodeReader = require('qrcode-reader');
const Jimp = require('jimp');
require('dotenv').config();
const config = {
    token: process.env.TOKEN,
    email: process.env.EMAIL,
    userId: parseInt(process.env.USER_ID),
    serverId: parseInt(process.env.SERVER_ID),
}
console.log(config);

const getTokenFromFile = (filePath) => {
    try {
        // const token = fs.readFileSync(filePath, 'utf-8').trim();
        const token = config.token;
        return token;
    } catch (err) {
        console.error('Error reading token file:', err);
        return null;
    }
}

const updateTokenFile = (filePath, newToken) => {
    try {
        fs.writeFileSync(filePath, newToken);
        console.log('Token updated in file:', newToken);
    } catch (err) {
        console.error('Error updating token file:', err);
    }
}

const refreshToken = async () => {
    const token = getTokenFromFile(tokenFilePath);

    if (refreshToken) {
        try {
            const response = await axios.post('https://api.mobapay.com/account/refresh', null, {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "no-cache",
                "did": "df175d0ef98d07c794ce9a79088f84c3",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "x-token": token
            });

            const newAccessToken = response.data.token;
            console.log(refreshToken, newAccessToken)
            updateTokenFile(tokenFilePath, newAccessToken);
        } catch (error) {
            console.error('Error refreshing token:', error.message);
        }
    } else {
        console.error('Refresh token not found or empty in the file.');
    }
}

const getInfo = async () => {
    const token = getTokenFromFile(tokenFilePath);

    if (token) {
        try {
            const response = await axios.get('https://api.mobapay.com/account/info', {
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'en-US,en;q=0.9',
                    'cache-control': 'no-cache',
                    'content-type': 'application/json;charset=UTF-8',
                    'did': 'df175d0ef98d07c794ce9a79088f84c3',
                    'pragma': 'no-cache',
                    origin: 'https://www.mobapay.com',
                    ReferenceError: 'https://www.mobapay.com/',
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Mobapay/1.0.0 Chrome/96.0.4664.45 Electron/13.5.2 Safari/537.36',
                    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'x-token': token,
                    'Referer': 'https://www.mobapay.com/',
                    'Referrer-Policy': 'strict-origin-when-cross-origin'
                }
            });

            console.log(response.data);
        } catch (error) {
            console.error('Error making API request:', error.message);
        }
    } else {
        console.error('Token not found or empty in the file.');
    }
}

const placeOrder = async () => {
    console.log('Placing order...');
    const mobile_emulation = {
        "deviceMetrics": { "width": 375, "height": 812, "pixelRatio": 3.0 },
        "userAgent": "Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19"
    }
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments('--headless');
    chromeOptions.addArguments('--disable-gpu');
    chromeOptions.addArguments('--no-sandbox');
    chromeOptions.addArguments('--disable-dev-shm-usage');
    chromeOptions.setMobileEmulation({width: 375, height: 812, pixelRatio: 3.0});
    const driver = await new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build();
    try {
        const token = getTokenFromFile(tokenFilePath);

        const response = await axios.post('https://api.mobapay.com/pay/order', {
            app_id: 100000,
            user_id: config.userId,
            server_id: config.serverId,
            email: config.email,
            shop_id: 1001,
            amount_pay: 141000,
            currency_code: 'IDR',
            country_code: 'ID',
            goods_id: 48,
            num: 1,
            pay_channel_sub_id: 10118,
            price_pay: 141000,
            coupon_id: '',
            lang: 'id',
            network: '',
            net: '',
            terminal_type: 'WEB',
        }, {
            headers: {
                'authority': 'api.mobapay.com',
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en-US,en;q=0.9',
                'cache-control': 'no-cache',
                'content-type': 'application/json;charset=UTF-8',
                'did': 'df175d0ef98d07c794ce9a79088f84c3',
                'origin': 'https://www.mobapay.com',
                'pragma': 'no-cache',
                'referer': 'https://www.mobapay.com/',
                'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'x-token': token
            }
        });

        console.log(response.data)

        if(!response.data.data) {
            console.log('Error placing order:', response.data.message);
            await driver.quit();
            return 0;
        }

        const orderId = response.data.data.order_id;
        const paymentReturn = await axios.post('https://api.mobapay.com/pay/order/payment', {
            net: '',
            network: '',
            order_id: orderId,
            return_url: 'https://www.mobapay.com/order?' + orderId,
            terminal_type: 'WEB',
        })
        const paymentUrl = paymentReturn.data.data.payment_url;
        if(paymentUrl.startsWith('https://airtime.codapayments.com')) {
            console.log('Payment URL:', paymentUrl);
            await driver.get(paymentUrl);
            // xpath => /html/body/div[3]/div/div[6]/div[2]/div/img
            // xpath => //*[@id="qrcode"]/img
            await driver.wait(webdriver.until.elementsLocated(webdriver.By.id('qrcode')), 10000);
            await driver.sleep(3000);
            // await driver.wait(webdriver.until.elementLocated(webdriver.By.xpath('//*[@id="qrcode"]/img')), 10000)
            // await driver.wait(webdriver.until.elementLocated(webdriver.By.xpath('/html/body/div[3]/div/div[6]/div[3]/div/button')), 10000);
            const qrCodeImageUrl = await driver.findElement(webdriver.By.xpath('//*[@id="qrcode"]/img')).getAttribute('src');
            console.log('qrCodeImageUrl:', qrCodeImageUrl);
            const getQrCode = await axios.get(qrCodeImageUrl, {responseType: 'arraybuffer'});
            // qrCode.generate(qrCodeImageUrl, {small: true});
            fs.writeFileSync('./qr.png', getQrCode.data);
            const image = await Jimp.read('./qr.png');
            const qrCodeReader = new QrCodeReader();
            const result = await new Promise((resolve, reject) => {
                qrCodeReader.callback = (err, result) => err != null ? reject(err) : resolve(result);
                qrCodeReader.decode(image.bitmap);
            });
            qrCode.generate(result.result, { small: true });
            
            // await driver.findElement(webdriver.By.xpath('/html/body/div[3]/div/div[6]/div[3]/div/button')).click();
            // await driver.switchTo().window(driver.getWindowHandles()[1]);
            await driver.takeScreenshot().then(
                function(image, err) {
                    require('fs').writeFile('./ss.png', image, 'base64', function(err) {
                        if(err) console.log(err);
                    });
                }
            );
        } else {
            console.log('Payment URL:', paymentUrl);
            await driver.get(paymentUrl);
            // xpath => /html/body/div/div/div[2]/div/div[3]/div/img
            // xpath => //*[@id="root"]/div/div[2]/div/div[3]/div/img
            await driver.wait(webdriver.until.elementLocated(webdriver.By.xpath('//*[@id="root"]/div/div[2]/div/div[3]/div/img')), 10000);
            await driver.sleep(3000);
            const qrCodeImageUrl = await driver.findElement(webdriver.By.xpath('//*[@id="root"]/div/div[2]/div/div[3]/div/img')).getAttribute('src');
            console.log('qr code image url:',qrCodeImageUrl)
            const getQrCode = await axios.get(qrCodeImageUrl, {responseType: 'arraybuffer'});
            // qrCode.generate(qrCodeImageUrl, {small: true});
            fs.writeFileSync('./qr.png', getQrCode.data);
            const image = await Jimp.read('./qr.png');
            const qrCodeReader = new QrCodeReader();
            const result = await new Promise((resolve, reject) => {
                qrCodeReader.callback = (err, result) => err != null ? reject(err) : resolve(result);
                qrCodeReader.decode(image.bitmap);
            });
            qrCode.generate(result.result, { small: true });
            
            await driver.takeScreenshot().then(
                function(image, err) {
                    require('fs').writeFile('./ss.png', image, 'base64', function(err) {
                        if(err) console.log(err);
                    });
                }
            );
        }
        
        await driver.quit();
        return 1;
        
    } catch (error) {
        console.error('Error placing order:', error.message);
    }
};


const setupCronJobs = () => {
    // Setiap 1 menit, panggil fungsi refreshToken
    cron.schedule('*/5 * * * *', getInfo);

    // Setiap 1 jam, panggil fungsi getInfo
    cron.schedule('0 * * * *', placeOrder);
}

// Ambil token dari file saat pertama kali dijalankan
(async () => {
    try {
        const token = getTokenFromFile(tokenFilePath);
        if (token) {
            console.log('Initial token:', token);
            console.log('Getting account info...');
            await getInfo();
            // console.log('Refreshing token...');
            // await refreshToken(); // masih error :(
            await placeOrder();
            // console.log('Starting cron job...');
            // setupCronJobs();
        } else {
            console.error('Initial token not found or empty. Exiting...');
            await driver.quit();
            process.exit(1);
        }
    } catch (error) {
        console.error('Error:', error);
    }
})()
