const Extraload = require('extraload');
const fs = require('fs');
require('dotenv').config();
//initialize variable for holding extracted data
var data = {
    'CATEGORY_NAME': [],
    'CUSTOMERS': [],
    'ORDERS': [],
    'ORDER_ITEMS': [],
    'ORDER_REVIEWS': [],
    'PRODUCTS': [],
    'SELLERS': []
}


/** 
 * Promise for loading one csv file.
 * Surrounded in a promise to return an array of rows from csv files.  
 */
const readPromise = (file) => {
    return new Promise((resolve, reject) => {
        var temp = [];
        Extraload.csvStream({ file })
            //reads data in csv one by one then push to temp array
            .on('data', (row) => {
                temp.push(row);
            })
            //returns array filled with csv data
            .on('end', () => {
                resolve(temp);
            });
    });
}

//Start of ETL Process. Surround in async to run sequentially and remove callbacks
async function ETL() {
    /**
     * EXTRACT PROCESS:
     * Extracts the data from each .csv file in the data/cleaned folder
     */
    console.log('EXTRACTING:');
    console.log("category_name");
    data['CATEGORY_NAME'] = await readPromise('./data/cleaned/CATEGORY_NAME.csv');
    console.log("customers");
    data['CUSTOMERS'] = await readPromise('./data/cleaned/CUSTOMERS.csv');
    console.log("orders");
    data['ORDERS'] = await readPromise('./data/cleaned/ORDERS.csv');
    console.log("order_items");
    data['ORDER_ITEMS'] = await readPromise('./data/cleaned/ORDER_ITEMS.csv');
    console.log("order_reviews");
    data['ORDER_REVIEWS'] = await readPromise('./data/cleaned/ORDER_REVIEWS.csv');
    console.log("products");
    data['PRODUCTS'] = await readPromise('./data/cleaned/PRODUCTS.csv');
    console.log("sellers");
    data['SELLERS'] = await readPromise('./data/cleaned/SELLERS.csv');

    /**
     * TRANSFORM PROCESS:
     * Transforms the extracted data to fit new data models
     */
    console.log('\nTRANSFORMING:');

    console.log('products');
    //Merge sellers and category_name
    data.PRODUCTS.forEach((product) => {
        product.product_category_name_english = null; //initialize field
        data.CATEGORY_NAME.forEach((category) => {
            if (product.product_category_name === category.product_category_name) {
                product.product_category_name_english = category.product_category_name_english;

            }
        });
    });

    console.log('order_items and review_id');
    //Save review_id into order_items table by matching order_id
    data.ORDER_ITEMS.forEach((item) => {
        item.review_id = null; //initialize field
        data.ORDER_REVIEWS.forEach((review) => {
            if (item.order_id === review.order_id) {
                item.review_id = review.review_id;
            }
        });
    });

    //Save customer_id into order_items by matching with order table's order_id
    console.log('order_items and customer_id');
    data.ORDER_ITEMS.forEach((item) => {
        item.customer_id = null; //initialize field
        data.ORDERS.forEach((order) => {
            if (item.order_id === order.order_id) {
                item.customer_id = order.customer_id;
            }
        });
    });

    console.log('orders');
    //Remove customer_id in order table 
    data.ORDERS.forEach(order => {
        delete order.customer_id;
    });

    console.log('order_reviews');
    //Remove order_id in order_reviews table
    data.ORDER_REVIEWS.forEach(review => {
        delete review.order_id;
    });

    console.log('customers');
    //Remove customer_unique_id in customers table
    data.CUSTOMERS.forEach(customer => {
        delete customer.customer_unique_id;
    });

    /**
     * LOAD PROCESS:
     * Loads the transformed data into the database.
     */

    console.log("\nLOADING:");

    console.log("Connecting to database");
    //connect to localhost
    const connection = Extraload.mysql({
        host: process.env.ETL_HOST,
        user: process.env.ETL_USER,
        password: process.env.ETL_PASS,
        database: process.env.ETL_DB,
        charset: 'utf8mb4'
    });

    //disable foreign key checks for loading data
    connection.query('SET FOREIGN_KEY_CHECKS=0', (err, res) => {
        if (err) throw err;

        console.log('Disabled foreign key checks.');
    });

    //load order_items to database
    var insertItemsQuery = 'INSERT INTO `order_items`(order_id, order_item_id, product_id, seller_id, review_id, customer_id, shipping_limit_date, price, freight_value) VALUES ';

    console.log('\nGenerating order_items table INSERT query string');
    // Generates a query string to load data into order_customers table with one query
    data.ORDER_ITEMS.forEach(item => {
        var formatString = '("' + item.order_id + '", "' + item.order_item_id + '", "' + item.product_id + '", "' + item.seller_id + '", "' + item.review_id + '", "' + item.customer_id + '", "' + item.shipping_limit_date + '", ' + item.price + ', ' + item.freight_value + '), ';
        insertItemsQuery += formatString;
    });
    insertItemsQuery = insertItemsQuery.substr(0, insertItemsQuery.length - 2) + ";";

    //Run generated query string
    console.log('Running INSERT query into order_items table');
    connection.query(insertItemsQuery, (err, res) => {
        if (err) throw err;

        if (res) {
            console.log('order_items done!');
        }
    });


    //load Seller data to database
    var insertSellerQuery = 'INSERT INTO `sellers` VALUES ';

    console.log('\nGenerating sellers table INSERT query string');
    //Generates a query string to load data into sellers table with one query
    data.SELLERS.forEach(seller => {
        var formatString = JSON.stringify(seller).replace('{', '(').replace('}', ')').replace(/"\w+":/g, '');
        insertSellerQuery += formatString + ', ';
    });
    insertSellerQuery = insertSellerQuery.substr(0, insertSellerQuery.length - 2) + ";";

    //Run generated query string
    console.log('Running INSERT query into sellers table');
    connection.query(insertSellerQuery, (err, res) => {
        if (err) throw err;

        if (res) {
            console.log('Sellers done!');
        }
    });

    //load order_customers to database
    var insertCustomerQuery = 'INSERT INTO `order_customers` VALUES ';

    console.log('\nGenerating customers table INSERT query string');
    //Generates a query string to load data into order_customers table with one query
    data.CUSTOMERS.forEach(customer => {
        var formatString = '("' + customer.customer_id + '", ' + customer.customer_zip_code_prefix + ', "' + customer.customer_city + '", "' + customer.customer_state + '"), ';
        insertCustomerQuery += formatString;
    });
    insertCustomerQuery = insertCustomerQuery.substr(0, insertCustomerQuery.length - 2) + ";";

    //Run generated query string
    console.log('Running INSERT query into order_customers table');
    connection.query(insertCustomerQuery, (err, res) => {
        if (err) throw err;

        if (res) {
            console.log('Customers done!');
        }
    });


    //load order_reviews to database
    var inserReviewQuery = 'INSERT INTO `order_reviews` VALUES ';

    console.log('\nGenerating reviews table INSERT query string');
    //Generates a query string to load data into order_customers table with one query
    data.ORDER_REVIEWS.forEach(review => {
        var formatString = JSON.stringify(review).replace('{', '(').replace('}', ')').replace(/"\w+":/g, '') + ', ';
        inserReviewQuery += formatString;
    });
    inserReviewQuery = inserReviewQuery.substr(0, inserReviewQuery.length - 2) + ";";

    //Run generated query string
    console.log('Running INSERT query into order_reviews table');
    connection.query(inserReviewQuery, (err, res) => {
        if (err) throw err;

        if (res) {
            console.log('Reviews done!');
        }
    });

    //load order_customers to database
    var insertProductsQuery = 'INSERT INTO `products` (product_id, product_category_name, product_name_length, product_description_length, product_photos_qty, product_weight_g, product_length_cm, product_height_cm, product_width_cm, product_category_name_english) VALUES ';

    console.log('\nGenerating products table INSERT query string');
    //Generates a query string to load data into products table with one query
    data.PRODUCTS.forEach(product => {
        var formatString = JSON.stringify(product).replace('{', '(').replace('}', ')').replace(/"\w+":/g, '') + ', '
        insertProductsQuery += formatString;
    });
    insertProductsQuery = insertProductsQuery.substr(0, insertProductsQuery.length - 2) + ";";

    //Run generated query string
    console.log('Running INSERT query into products table');
    connection.query(insertProductsQuery, (err, res) => {
        if (err) throw err;

        if (res) {
            console.log('Products done!');
        }
    });

    //load orders to database
    var insertOrderQuery = 'INSERT INTO `orders` VALUES ';


    console.log('\nGenerating orders table INSERT query string');
    //Generates a query string to load data into products table with one query
    data.ORDERS.forEach(order => {
        var formatString = JSON.stringify(order).replace('{', '(').replace('}', ')').replace(/"\w+":/g, '') + ', '
        insertOrderQuery += formatString;
    });
    insertOrderQuery = insertOrderQuery.substr(0, insertOrderQuery.length - 2) + ";";

    //Run generated query string
    console.log('Running INSERT query into orders table');
    connection.query(insertOrderQuery, (err, res) => {
        if (err) throw err;

        if (res) {
            console.log('orders done!');
        }
    });

    //Re-enable foreign key check after loading data
    connection.query('SET FOREIGN_KEY_CHECKS=1', (err, res) => {
        if (err) throw err;

        if (res) {
            console.log('RE-enabled foreign keys. ETL done!');
        }
    });
    connection.end((err) => {
        if (err) console.log('error closing connection');
        else console.log('Closed database connection.');
    });
}

ETL();