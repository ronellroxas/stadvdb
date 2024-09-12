CREATE TABLE `orders` (
  `order_id` VARCHAR(32),
  `order_status` VARCHAR(15),
  `order_purchase_timestamp` DATETIME,
  `order_approved_at` DATETIME,
  `order_delivered_carrier_date` DATETIME,
  `order_delivered_customer_date` DATETIME,
  `order_estimated_delivery_date` DATETIME,
  `payment_sequential` INT,
  `payment_type` VARCHAR(15),
  `payment_installments` INT,
  `payment_value` DOUBLE
);

CREATE TABLE `sellers` (
  `seller_id` VARCHAR(32),
  `seller_zip_code_prefix` INT,
  `seller_city` VARCHAR(50),
  `seller_state` VARCHAR(5),
  PRIMARY KEY (`seller_id`)
);

CREATE TABLE `order_reviews` (
  `review_id` VARCHAR(32),
  `review_score` INT,
  `review_comment_title` VARCHAR(50),
  `review_comment_message` VARCHAR(500),
  `review_creation_date` DATETIME,
  `review_item_timestamp` DATETIME
);

CREATE TABLE `order_customers` (
  `customer_id` VARCHAR(32),
  `customer_zip_code_prefix` INT,
  `customer_city` VARCHAR(50),
  `customer_state` VARCHAR(5),
  PRIMARY KEY (`customer_id`)
);

CREATE TABLE `order_items` (
  `unique_id` INT AUTO_INCREMENT,
  `order_id` VARCHAR(32),
  `order_item_id` VARCHAR(32),
  `product_id` VARCHAR(32),
  `seller_id` VARCHAR(32),
  `review_id` VARCHAR(32),
  `customer_id` VARCHAR(32),
  `shipping_limit_date` DATETIME,
  `price` DOUBLE,
  `freight_value` DOUBLE,
  PRIMARY KEY (`unique_id`)
);

CREATE TABLE `products` (
  `product_id` VARCHAR(32),
  `product_category_name` VARCHAR(50),
  `product_category_name_english` VARCHAR(50),
  `product_name_length` INT,
  `product_description_length` INT,
  `product_photos_qty` INT,
  `product_weight_g` INT,
  `product_length_cm` INT,
  `product_height_cm` INT,
  `product_width_cm` INT,
  PRIMARY KEY (`product_id`)
);


-- ALTER TABLES TO LINK FOREIGN KEYS --

ALTER TABLE ORDER_ITEMS
ADD FOREIGN KEY (`product_id`) REFERENCES products(`product_id`),
ADD FOREIGN KEY (`seller_id`) REFERENCES sellers(`seller_id`),
ADD FOREIGN KEY (`customer_id`) REFERENCES order_customers(`customer_id`);
