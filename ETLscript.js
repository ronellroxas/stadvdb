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
    console.log('sellers');
    //Merge sellers and category_name
    data.PRODUCTS.forEach((product) => {
        data.CATEGORY_NAME.forEach((category) => {
            if (product.product_category_name === category.product_category_name) {
                product.product_category_name_english = category.product_category_name_english;

            }
        });
    });

    console.log('order_items and review_id');
    //Save review_id into order_items table by matching order_id
    data.ORDER_ITEMS.forEach((item) => {
        data.ORDER_REVIEWS.forEach((review) => {
            if (item.order_id === review.order_id) {
                item.review_id = review.review_id;
            }
        });
    });

    //Save customer_id into order_items by matching with order table's order_id
    console.log('order_items and customer_id');
    data.ORDER_ITEMS.forEach((item) => {
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
    const connection = Extraload.mysql(process.env.LOCAL_ETL);

    //load Seller data to database
    var insertSellerQuery = 'INSERT INTO `sellers` VALUES ';

    console.log('Generating sellers table INSERT query string');
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
    });

    //load order_customers to database
    var insertCustomerQuery = 'INSERT INTO `order_customers` VALUES ';

    console.log('Generating customers table INSERT query string');
    //Generates a query string to load data into order_customers table with one query
    data.CUSTOMERS.forEach(customer => {

    });
}

ETL();