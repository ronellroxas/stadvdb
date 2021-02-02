const EMPTY = { //NO input values
    'Roll-up': "SELECT <br> " +
        "   MONTH(o.order_approved_at) as 'Month', <br> " +
        "   sum(o.payment_value) as 'Total Sales', <br> " +
        "   p.product_category_name as 'Category'  <br> " +
        "FROM <br> " +
        "   order_items i <br> " +
        "INNER JOIN products p ON p.product_id = i.product_id <br> " +
        "INNER JOIN orders o ON o.order_id = i.order_id <br> " +
        "GROUP BY  <br> " +
        "   MONTH(o.order_approved_at), <br> " +
        "   p.product_category_name <br> " +
        "   WITH ROLLUP <br> " +
        "UNION( <br> " +
        "   SELECT  <br> " +
        "       null, <br> " +
        "       sum(o.payment_value) as 'Total Sales', <br> " +
        "       p.product_category_name as 'Category'  <br> " +
        "   FROM <br> " +
        "       order_items i <br> " +
        "   INNER JOIN products p ON p.product_id = i.product_id <br> " +
        "   INNER JOIN orders o ON o.order_id = i.order_id <br> " +
        "   GROUP BY  <br> " +
        "       MONTH(o.order_approved_at), <br> " +
        "       p.product_category_name <br> " +
        "       WITH ROLLUP <br> " +
        ") <br> " +
        "UNION( <br> " +
        "   SELECT  <br> " +
        "       MONTH(o.order_approved_at) as 'Month', <br> " +
        "       sum(o.payment_value) as 'Total Sales', <br> " +
        "       null  <br> " +
        "   FROM <br> " +
        "       order_items i <br> " +
        "   INNER JOIN products p ON p.product_id = i.product_id <br> " +
        "   INNER JOIN orders o ON o.order_id = i.order_id <br> " +
        "   GROUP BY  <br> " +
        "       MONTH(o.order_approved_at), <br> " +
        "       p.product_category_name <br> " +
        "       WITH ROLLUP <br> " +
        ") <br> " +
        "UNION( <br> " +
        "   SELECT  <br> " +
        "       MONTH(o.order_approved_at) as 'Month', <br> " +
        "       sum(o.payment_value) as 'Total Sales', <br> " +
        "       p.product_category_name as 'Category'  <br> " +
        "   FROM <br> " +
        "       order_items i <br> " +
        "   INNER JOIN products p ON p.product_id = i.product_id <br> " +
        "   INNER JOIN orders o ON o.order_id = i.order_id <br> " +
        "   GROUP BY  <br> " +
        "       MONTH(o.order_approved_at), <br> " +
        "       p.product_category_name <br> " +
        "       WITH ROLLUP <br>);  ",
    'Drill Down': "SELECT <br>" +
        "   YEAR(o.order_approved_at) as 'Year', <br>" +
        "   c.customer_state as 'State', o.payment_type as 'Payment_Type', <br>" +
        "   count(o.order_id) as 'Number of orders' <br>" +
        "FROM	<br>" +
        "   order_customers c <br>" +
        "INNER JOIN order_items i ON c.customer_id = i.customer_id <br>" +
        "INNER JOIN orders o ON o.order_id = i.order_id <br>" +
        "GROUP BY <br>" +
        "   YEAR(o.order_approved_at), <br>" +
        "   c.customer_state, <br>" +
        "   o.payment_type WITH ROLLUP <br>" +
        "UNION ( <br>" +
        "   SELECT <br>" +
        "      null, <br>" +
        "      c.customer_state as 'State', <br>" +
        "      o.payment_type as 'Payment_Type', <br>" +
        "      count(o.order_id) as 'Number of orders' <br>" +
        "   FROM <br>" +
        "      order_customers c <br>" +
        "   INNER JOIN order_items i ON c.customer_id = i.customer_id <br>" +
        "   INNER JOIN orders o ON o.order_id = i.order_id <br>" +
        "   GROUP BY <br>" +
        "      c.customer_state, <br>" +
        "      o.payment_type <br>" +
        "      WITH ROLLUP<br>" +
        ") <br>" +
        "UNION ( <br>" +
        "   SELECT <br>" +
        "      YEAR(o.order_approved_at) as 'Year', <br>" +
        "      null, <br>" +
        "      o.payment_type as 'Payment_Type', <br>" +
        "      count(o.order_id) as 'Number of orders' <br>" +
        "   FROM <br>" +
        "      order_customers c <br>" +
        "   INNER JOIN order_items i ON c.customer_id = i.customer_id <br>" +
        "   INNER JOIN orders o ON o.order_id = i.order_id <br>" +
        "   GROUP BY <br>" +
        "      YEAR(o.order_approved_at), <br>" +
        "      o.payment_type <br>" +
        "      WITH ROLLUP<br>" +
        ") <br>" +
        "UNION ( <br>" +
        "   SELECT <br>" +
        "      null, <br>" +
        "      null, <br>" +
        "      o.payment_type as 'Payment_Type', <br>" +
        "      count(o.order_id) as 'Number of orders' <br>" +
        "   FROM <br>" +
        "      order_customers c <br>" +
        "   INNER JOIN order_items i ON c.customer_id = i.customer_id <br>" +
        "   INNER JOIN orders o ON o.order_id = i.order_id <br>" +
        "   GROUP BY <br>" +
        "      o.payment_type <br>" +
        "      WITH ROLLUP<br>" +
        ") <br>" +
        "ORDER BY <br>" +
        "Year DESC, <br>" +
        "State DESC, <br>" +
        "Payment_Type DESC; <br>",
    'Dice': "SELECT  <br> " +
        "    oc.customer_state as 'State',  <br> " +
        "    YEAR(o.order_approved_at) as 'Year',  <br> " +
        "    MONTH(o.order_approved_at) as 'Month', count(o.order_approved_at) as 'Number of orders' <br> " +
        "FROM  <br> " +
        "    order_items oi <br> " +
        "JOIN order_customers oc ON oi.customer_id = oc.customer_id <br> " +
        "JOIN orders o ON oi.order_id = o.order_id <br> " +
        "GROUP BY  <br> " +
        "    oc.customer_state,  <br> " +
        "    YEAR(o.order_approved_at),  <br> " +
        "    MONTH(o.order_approved_at) <br> " +
        "WITH ROLLUP <br> " +
        "UNION <br> " +
        "    SELECT  <br> " +
        "        oc.customer_state as 'State',  <br> " +
        "        null,  <br> " +
        "        MONTH(o.order_approved_at) as 'Month',  <br> " +
        "        count(o.order_approved_at) as 'Number of orders' <br> " +
        "    FROM  <br> " +
        "        order_items oi <br> " +
        "    JOIN order_customers oc ON oi.customer_id = oc.customer_id <br> " +
        "    JOIN orders o ON oi.order_id = o.order_id <br> " +
        "    GROUP BY  <br> " +
        "        oc.customer_state,  <br> " +
        "        MONTH(o.order_approved_at)  <br> " +
        "        WITH ROLLUP <br> " +
        "UNION <br> " +
        "    SELECT  <br> " +
        "        null,  <br> " +
        "        YEAR(o.order_approved_at) as 'Year',  <br> " +
        "        MONTH(o.order_approved_at) as 'Month',  <br> " +
        "        count(o.order_approved_at) as 'Number of orders' <br> " +
        "    FROM  <br> " +
        "        order_items oi <br> " +
        "    JOIN order_customers oc ON oi.customer_id = oc.customer_id  <br> " +
        "    JOIN orders o ON oi.order_id = o.order_id <br> " +
        "    GROUP BY  <br> " +
        "        YEAR(o.order_approved_at),  <br> " +
        "        MONTH(o.order_approved_at) <br> " +
        "        WITH ROLLUP <br> " +
        "UNION <br> " +
        "    SELECT  <br> " +
        "        null,  <br> " +
        "        null,  <br> " +
        "        MONTH(o.order_approved_at) as 'Month',  <br> " +
        "        count(o.order_approved_at) as 'Number of orders' <br> " +
        "    FROM  <br> " +
        "        order_items oi <br> " +
        "    JOIN order_customers oc ON oi.customer_id = oc.customer_id <br> " +
        "    JOIN orders o ON oi.order_id = o.order_id <br> " +
        "    GROUP BY  <br> " +
        "        MONTH(o.order_approved_at) <br> " +
        "        WITH ROLLUP <br> " +
        "ORDER BY  <br> " +
        "    State DESC,  <br> " +
        "    Year DESC,  <br> " +
        "    Month DESC;",
    'Slice': "SELECT  <br> " +
        "    YEAR(o.order_approved_at) as 'Year',  <br> " +
        "    MONTH(o.order_approved_at) as 'Month',  <br> " +
        "    p.product_category_name_english as 'Category',  <br> " +
        "    COUNT(o.order_approved_at) as 'Total orders' <br> " +
        "FROM  <br> " +
        "    order_items oi <br> " +
        "JOIN orders o ON oi.order_id = o.order_id <br> " +
        "JOIN products p ON oi.product_id = p.product_id <br> " +
        "GROUP BY  <br> " +
        "    YEAR(o.order_approved_at),  <br> " +
        "    MONTH(o.order_approved_at),  <br> " +
        "    p.product_category_name_english <br> " +
        "    WITH ROLLUP <br> " +
        "UNION <br> " +
        "    SELECT  <br> " +
        "        YEAR(o.order_approved_at) as 'Year',  <br> " +
        "        null, p.product_category_name_english as 'Category',  <br> " +
        "        COUNT(o.order_approved_at) as 'Total orders' <br> " +
        "    FROM order_items oi <br> " +
        "    JOIN orders o ON oi.order_id = o.order_id <br> " +
        "    JOIN products p ON oi.product_id = p.product_id <br> " +
        "    GROUP BY  <br> " +
        "        YEAR(o.order_approved_at),  <br> " +
        "        p.product_category_name_english <br> " +
        "        WITH ROLLUP <br> " +
        "UNION <br> " +
        "    SELECT  <br> " +
        "        null,  <br> " +
        "        MONTH(o.order_approved_at) as 'Month',  <br> " +
        "        p.product_category_name_english as 'Category',  <br> " +
        "        COUNT(o.order_approved_at) as 'Total orders' <br> " +
        "    FROM order_items oi <br> " +
        "    JOIN orders o ON oi.order_id = o.order_id <br> " +
        "    JOIN products p ON oi.product_id = p.product_id <br> " +
        "    GROUP BY  <br> " +
        "        MONTH(o.order_approved_at),  <br> " +
        "        p.product_category_name_english <br> " +
        "        WITH ROLLUP <br> " +
        "UNION <br> " +
        "    SELECT  <br> " +
        "        null,  <br> " +
        "        null,  <br> " +
        "        p.product_category_name_english as 'Category',  <br> " +
        "        COUNT(o.order_approved_at) as 'Total orders' <br> " +
        "    FROM  <br> " +
        "        order_items oi <br> " +
        "    JOIN orders o ON oi.order_id = o.order_id <br> " +
        "    JOIN products p ON oi.product_id = p.product_id <br> " +
        "    GROUP BY  <br> " +
        "        p.product_category_name_english <br> " +
        "        WITH ROLLUP <br> " +
        "ORDER BY  <br> " +
        "    Year DESC,  <br> " +
        "    Month DESC,  <br> " +
        "    Category DESC; "
}

const INPUT = { //with input values
    'Roll-up': "SELECT <br> " +
        "	MONTH(o.order_approved_at) as 'Month',<br> " +
        "    sum(o.payment_value) as 'Total Sales',<br> " +
        "	p.product_category_name as 'Category'<br> " +
        "FROM<br> " +
        "	order_items i<br> " +
        "INNER JOIN products p ON p.product_id = i.product_id<br> " +
        "INNER JOIN orders o ON o.order_id = i.order_id<br> " +
        "WHERE YEAR(o.order_approved_at) = YEAR_VAL <br> " +
        "GROUP BY <br> " +
        "	MONTH(o.order_approved_at),<br> " +
        "	p.product_category_name<br> " +
        "	WITH ROLLUP<br> " +
        "UNION(<br> " +
        "SELECT <br> " +
        "	null,<br> " +
        "	sum(o.payment_value) as 'Total Sales',<br> " +
        "	p.product_category_name as 'Category'<br> " +
        "FROM<br> " +
        "	order_items i<br> " +
        "INNER JOIN products p ON p.product_id = i.product_id<br> " +
        "INNER JOIN orders o ON o.order_id = i.order_id<br> " +
        "WHERE YEAR(o.order_approved_at) = YEAR_VAL <br> " +
        "GROUP BY <br> " +
        "	MONTH(o.order_approved_at),<br> " +
        "	p.product_category_name<br> " +
        "	WITH ROLLUP<br> " +
        ")<br> " +
        "UNION(<br> " +
        "SELECT <br> " +
        "	MONTH(o.order_approved_at) as 'Month',<br> " +
        "	sum(o.payment_value) as 'Total Sales',<br> " +
        "	null <br> " +
        "FROM<br> " +
        "	order_items i<br> " +
        "INNER JOIN products p ON p.product_id = i.product_id<br> " +
        "INNER JOIN orders o ON o.order_id = i.order_id<br> " +
        "WHERE YEAR(o.order_approved_at) = YEAR_VAL <br> " +
        "GROUP BY <br> " +
        "	MONTH(o.order_approved_at),<br> " +
        "	p.product_category_name<br> " +
        "	WITH ROLLUP<br> " +
        ")<br> " +
        "UNION(<br> " +
        "SELECT <br> " +
        "	MONTH(o.order_approved_at) as 'Month',<br> " +
        "	sum(o.payment_value) as 'Total Sales',<br> " +
        "	p.product_category_name as 'Category' <br> " +
        "FROM<br> " +
        "	order_items i<br> " +
        "INNER JOIN products p ON p.product_id = i.product_id<br> " +
        "INNER JOIN orders o ON o.order_id = i.order_id<br> " +
        "WHERE YEAR(o.order_approved_at) = YEAR_VAL <br> " +
        "GROUP BY <br> " +
        "	MONTH(o.order_approved_at),<br> " +
        "	p.product_category_name<br> " +
        "	WITH ROLLUP<br> " +
        "); ",
    'Drill Down Month': "SELECT <br>" +
        "   MONTH(o.order_approved_at) as 'Month', <br>" +
        "   c.customer_state as 'State', o.payment_type as 'Payment_Type', <br>" +
        "   count(o.order_id) as 'Number of orders' <br>" +
        "FROM	<br>" +
        "   order_customers c <br>" +
        "INNER JOIN order_items i ON c.customer_id = i.customer_id <br>" +
        "INNER JOIN orders o ON o.order_id = i.order_id <br>" +
        "WHERE YEAR(o.order_approved_at) = YEAR_VAL <br> " +
        "GROUP BY <br>" +
        "   MONTH(o.order_approved_at), <br>" +
        "   c.customer_state, <br>" +
        "   o.payment_type WITH ROLLUP <br>" +
        "UNION ( <br>" +
        "   SELECT <br>" +
        "      null, <br>" +
        "      c.customer_state as 'State', <br>" +
        "      o.payment_type as 'Payment_Type', <br>" +
        "      count(o.order_id) as 'Number of orders' <br>" +
        "   FROM <br>" +
        "      order_customers c <br>" +
        "   INNER JOIN order_items i ON c.customer_id = i.customer_id <br>" +
        "   INNER JOIN orders o ON o.order_id = i.order_id <br>" +
        "   WHERE YEAR(o.order_approved_at) = YEAR_VAL <br> " +
        "   GROUP BY <br>" +
        "      c.customer_state, <br>" +
        "      o.payment_type <br>" +
        "      WITH ROLLUP<br>" +
        ") <br>" +
        "UNION ( <br>" +
        "   SELECT <br>" +
        "      MONTH(o.order_approved_at) as 'Month', <br>" +
        "      null, <br>" +
        "      o.payment_type as 'Payment_Type', <br>" +
        "      count(o.order_id) as 'Number of orders' <br>" +
        "   FROM <br>" +
        "      order_customers c <br>" +
        "   INNER JOIN order_items i ON c.customer_id = i.customer_id <br>" +
        "   INNER JOIN orders o ON o.order_id = i.order_id <br>" +
        "   WHERE YEAR(o.order_approved_at) = YEAR_VAL <br> " +
        "   GROUP BY <br>" +
        "      MONTH(o.order_approved_at), <br>" +
        "      o.payment_type <br>" +
        "      WITH ROLLUP<br>" +
        ") <br>" +
        "UNION ( <br>" +
        "   SELECT <br>" +
        "      null, <br>" +
        "      null, <br>" +
        "      o.payment_type as 'Payment_Type', <br>" +
        "      count(o.order_id) as 'Number of orders' <br>" +
        "   FROM <br>" +
        "      order_customers c <br>" +
        "   INNER JOIN order_items i ON c.customer_id = i.customer_id <br>" +
        "   INNER JOIN orders o ON o.order_id = i.order_id <br>" +
        "   WHERE YEAR(o.order_approved_at) = YEAR_VAL <br> " +
        "   GROUP BY <br>" +
        "      o.payment_type <br>" +
        "      WITH ROLLUP<br>" +
        ") <br>" +
        "ORDER BY <br>" +
        "Month DESC, <br>" +
        "State DESC, <br>" +
        "Payment_Type DESC; <br>",


    'Drill Down Day': "SELECT <br>" +
        "   DAY(o.order_approved_at) as 'Day', <br>" +
        "   c.customer_state as 'State', o.payment_type as 'Payment_Type', <br>" +
        "   count(o.order_id) as 'Number of orders' <br>" +
        "FROM	<br>" +
        "   order_customers c <br>" +
        "INNER JOIN order_items i ON c.customer_id = i.customer_id <br>" +
        "INNER JOIN orders o ON o.order_id = i.order_id <br>" +
        "WHERE YEAR(o.order_approved_at) = YEAR_VAL and  MONTH(o.order_approved_at) = MONTH_VAL <br> " +
        "GROUP BY <br>" +
        "   DAY(o.order_approved_at), <br>" +
        "   c.customer_state, <br>" +
        "   o.payment_type WITH ROLLUP <br>" +
        "UNION ( <br>" +
        "   SELECT <br>" +
        "      null, <br>" +
        "      c.customer_state as 'State', <br>" +
        "      o.payment_type as 'Payment_Type', <br>" +
        "      count(o.order_id) as 'Number of orders' <br>" +
        "   FROM <br>" +
        "      order_customers c <br>" +
        "   INNER JOIN order_items i ON c.customer_id = i.customer_id <br>" +
        "   INNER JOIN orders o ON o.order_id = i.order_id <br>" +
        "   WHERE YEAR(o.order_approved_at) = YEAR_VAL and  MONTH(o.order_approved_at) = MONTH_VAL <br> " +
        "   GROUP BY <br>" +
        "      c.customer_state, <br>" +
        "      o.payment_type <br>" +
        "      WITH ROLLUP<br>" +
        ") <br>" +
        "UNION ( <br>" +
        "   SELECT <br>" +
        "      DAY(o.order_approved_at) as 'Day', <br>" +
        "      null, <br>" +
        "      o.payment_type as 'Payment_Type', <br>" +
        "      count(o.order_id) as 'Number of orders' <br>" +
        "   FROM <br>" +
        "      order_customers c <br>" +
        "   INNER JOIN order_items i ON c.customer_id = i.customer_id <br>" +
        "   INNER JOIN orders o ON o.order_id = i.order_id <br>" +
        "   WHERE YEAR(o.order_approved_at) = YEAR_VAL and  MONTH(o.order_approved_at) = MONTH_VAL <br> " +
        "   GROUP BY <br>" +
        "      DAY(o.order_approved_at), <br>" +
        "      o.payment_type <br>" +
        "      WITH ROLLUP<br>" +
        ") <br>" +
        "UNION ( <br>" +
        "   SELECT <br>" +
        "      null, <br>" +
        "      null, <br>" +
        "      o.payment_type as 'Payment_Type', <br>" +
        "      count(o.order_id) as 'Number of orders' <br>" +
        "   FROM <br>" +
        "      order_customers c <br>" +
        "   INNER JOIN order_items i ON c.customer_id = i.customer_id <br>" +
        "   INNER JOIN orders o ON o.order_id = i.order_id <br>" +
        "   WHERE YEAR(o.order_approved_at) = YEAR_VAL and  MONTH(o.order_approved_at) = MONTH_VAL <br> " +
        "   GROUP BY <br>" +
        "      o.payment_type <br>" +
        "      WITH ROLLUP<br>" +
        ") <br>" +
        "ORDER BY <br>" +
        "Day DESC, <br>" +
        "State DESC, <br>" +
        "Payment_Type DESC; <br>",

    "Dice": "SELECT  <br> " +
        "    oc.customer_state as 'State',  <br> " +
        "    YEAR(o.order_approved_at) as 'Year',  <br> " +
        "    MONTH(o.order_approved_at) as 'Month',  <br> " +
        "    count(o.order_approved_at) as 'Number of orders' <br> " +
        "FROM  <br> " +
        "    order_items oi <br> " +
        "JOIN order_customers oc ON oi.customer_id = oc.customer_id <br> " +
        "JOIN orders o ON oi.order_id = o.order_id <br> " +
        "WHERE (oc.customer_state = STATE_VAL ) AND (YEAR(o.order_approved_at) = YEAR_VAL) AND (MONTH(o.order_approved_at) = MONTH_VAL) <br> " +
        "GROUP BY  <br> " +
        "    oc.customer_state,  <br> " +
        "    YEAR(o.order_approved_at),  <br> " +
        "    MONTH(o.order_approved_at) <br> " +
        "    WITH ROLLUP <br> " +
        "UNION <br> " +
        "    SELECT  <br> " +
        "        oc.customer_state as 'State',  <br> " +
        "        null,  <br> " +
        "        MONTH(o.order_approved_at) as 'Month',  <br> " +
        "        count(o.order_approved_at) as 'Number of orders' <br> " +
        "    FROM order_items oi <br> " +
        "    JOIN order_customers oc ON oi.customer_id = oc.customer_id <br> " +
        "    JOIN orders o ON oi.order_id = o.order_id <br> " +
        "    WHERE (oc.customer_state = STATE_VAL ) AND (YEAR(o.order_approved_at) = YEAR_VAL) AND (MONTH(o.order_approved_at) = MONTH_VAL) <br> " +
        "    GROUP BY  <br> " +
        "        oc.customer_state,  <br> " +
        "        MONTH(o.order_approved_at)  <br> " +
        "        WITH ROLLUP <br> " +
        "UNION <br> " +
        "    SELECT  <br> " +
        "        null,  <br> " +
        "        YEAR(o.order_approved_at) as 'Year',  <br> " +
        "        MONTH(o.order_approved_at) as 'Month',  <br> " +
        "        count(o.order_approved_at) as 'Number of orders' <br> " +
        "    FROM  <br> " +
        "        order_items oi <br> " +
        "    JOIN order_customers oc ON oi.customer_id = oc.customer_id  <br> " +
        "    JOIN orders o ON oi.order_id = o.order_id <br> " +
        "    WHERE (oc.customer_state = STATE_VAL ) AND (YEAR(o.order_approved_at) = YEAR_VAL) AND (MONTH(o.order_approved_at) = MONTH_VAL) <br> " +
        "    GROUP BY  <br> " +
        "        YEAR(o.order_approved_at),  <br> " +
        "        MONTH(o.order_approved_at) <br> " +
        "    WITH ROLLUP <br> " +
        "UNION <br> " +
        "    SELECT  <br> " +
        "        null,  <br> " +
        "        null,  <br> " +
        "        MONTH(o.order_approved_at) as 'Month',  <br> " +
        "        count(o.order_approved_at) as 'Number of orders' <br> " +
        "    FROM  <br> " +
        "        order_items oi <br> " +
        "    JOIN order_customers oc ON oi.customer_id = oc.customer_id <br> " +
        "    JOIN orders o ON oi.order_id = o.order_id <br> " +
        "    WHERE (oc.customer_state = STATE_VAL ) AND (YEAR(o.order_approved_at) = YEAR_VAL) AND (MONTH(o.order_approved_at) = MONTH_VAL) <br> " +
        "    GROUP BY  <br> " +
        "        MONTH(o.order_approved_at) <br> " +
        "        WITH ROLLUP <br> " +
        "ORDER BY  <br> " +
        "    State DESC,  <br> " +
        "    Year DESC,  <br> " +
        "    Month DESC; ",
    "Slice": "SELECT  <br> " +
        "    YEAR(o.order_approved_at) as 'Year',  <br> " +
        "    MONTH(o.order_approved_at) as 'Month',  <br> " +
        "    p.product_category_name_english as 'Category',  <br> " +
        "    COUNT(o.order_approved_at) as 'Total orders' <br> " +
        "FROM  <br> " +
        "    order_items oi <br> " +
        "JOIN orders o ON oi.order_id = o.order_id <br> " +
        "JOIN products p ON oi.product_id = p.product_id <br> " +
        "WHERE YEAR(o.order_approved_at) = YEAR_VAL <br> " +
        "GROUP BY  <br> " +
        "    YEAR(o.order_approved_at),  <br> " +
        "    MONTH(o.order_approved_at),  <br> " +
        "    p.product_category_name_english <br> " +
        "    WITH ROLLUP <br> " +
        "UNION <br> " +
        "    SELECT  <br> " +
        "        YEAR(o.order_approved_at) as 'Year',  <br> " +
        "        null, <br> " +
        "        p.product_category_name_english as 'Category',  <br> " +
        "        COUNT(o.order_approved_at) as 'Total orders' <br> " +
        "    FROM  <br> " +
        "        order_items oi <br> " +
        "    JOIN orders o ON oi.order_id = o.order_id <br> " +
        "    JOIN products p ON oi.product_id = p.product_id <br> " +
        "    WHERE YEAR(o.order_approved_at) = YEAR_VAL <br> " +
        "    GROUP BY  <br> " +
        "        YEAR(o.order_approved_at),  <br> " +
        "        p.product_category_name_english <br> " +
        "        WITH ROLLUP <br> " +
        "UNION <br> " +
        "    SELECT  <br> " +
        "        null,  <br> " +
        "        MONTH(o.order_approved_at) as 'Month',  <br> " +
        "        p.product_category_name_english as 'Category',  <br> " +
        "        COUNT(o.order_approved_at) as 'Total orders' <br> " +
        "    FROM  <br> " +
        "        order_items oi <br> " +
        "    JOIN orders o ON oi.order_id = o.order_id <br> " +
        "    JOIN products p ON oi.product_id = p.product_id <br> " +
        "    WHERE YEAR(o.order_approved_at) = YEAR_VAL <br> " +
        "    GROUP BY  <br> " +
        "        MONTH(o.order_approved_at),  <br> " +
        "        p.product_category_name_english <br> " +
        "        WITH ROLLUP <br> " +
        "UNION <br> " +
        "    SELECT  <br> " +
        "        null,  <br> " +
        "        null,  <br> " +
        "        p.product_category_name_english as 'Category',  <br> " +
        "        COUNT(o.order_approved_at) as 'Total orders' <br> " +
        "    FROM  <br> " +
        "        order_items oi <br> " +
        "    JOIN orders o ON oi.order_id = o.order_id <br> " +
        "    JOIN products p ON oi.product_id = p.product_id <br> " +
        "    WHERE YEAR(o.order_approved_at) = YEAR_VAL <br> " +
        "    GROUP BY  <br> " +
        "        p.product_category_name_english <br> " +
        "        WITH ROLLUP <br> " +
        "ORDER BY  <br> " +
        "    Year DESC,  <br> " +
        "    Month DESC,  <br> " +
        "    Category DESC;"


}