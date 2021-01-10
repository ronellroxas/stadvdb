$(document).ready(function() {

    const UNOPTIMIZED_QUERY_LIST = [
        "SELECT * FROM (SELECT YEAR(order_delivered_customer_date) 'Year', MONTH(order_delivered_customer_date) 'Month', COUNT(order_delivered_customer_date) 'Orders delivered' FROM orders WHERE YEAR(order_delivered_customer_date) = '2017' GROUP BY YEAR(order_delivered_customer_date), MONTH(order_delivered_customer_date) ORDER BY order_delivered_customer_date) `2017` UNION ALL ( SELECT YEAR(order_delivered_customer_date) 'Year', MONTH(order_delivered_customer_date) 'Month', COUNT(order_delivered_customer_date) 'Orders delivered' FROM orders WHERE YEAR(order_delivered_customer_date) = '2018' GROUP BY YEAR(order_delivered_customer_date), MONTH(order_delivered_customer_date) ORDER BY order_delivered_customer_date );",
        "SELECT YEAR(review_creation_date) 'Year', AVG(review_score) 'Average Score' FROM order_reviews WHERE YEAR(review_creation_date) = '2017' GROUP BY YEAR(review_creation_date) UNION ( SELECT YEAR(review_creation_date) 'Year', AVG(review_score) 'Average Score' FROM order_reviews WHERE YEAR(review_creation_date) = '2018' GROUP BY YEAR(review_creation_date));",
        "SELECT count(o.order_id) as 'Number of orders',c.customer_city as 'City' FROM customers c LEFT JOIN orders o  ON c.customer_id = o.customer_id WHERE YEAR(o.order_approved_at) = YEAR_VAL GROUP BY c.customer_city ORDER BY count(o.order_id) desc LIMIT 5; ",
        'SELECT YEAR(o.order_approved_at) AS "Buy_Year", MONTH(o.order_approved_at) AS "Buy_Month", i.product_id as "Top 5 products" , count(i.product_id) as "Number Sold" FROM orders o CROSS JOIN order_items i  WHERE i.order_id = o.order_id GROUP BY i.product_id, YEAR(o.order_approved_at), MONTH(o.order_approved_at) HAVING Buy_Year = YEAR_VAL AND Buy_Month = MONTH_VAL ORDER BY count(i.product_id) desc, i.product_id asc  LIMIT 5; ',
        "SELECT catname.product_category_name_english 'Category Name', COUNT(oi.order_id) 'Order Count' FROM category_name catname INNER JOIN products pr ON catname.product_category_name=pr.product_category_name JOIN order_items oi ON pr.product_id=oi.product_id GROUP BY catname.product_category_name_english ORDER BY COUNT(oi.order_id) DESC LIMIT 5;",
        'SELECT s.seller_state AS "State", YEAR(o.order_approved_at) AS "Sell_Year", MONTH(o.order_approved_at) AS "Sell_Month", s.seller_id AS "Top 5 Gaining Sellers", SUM(i.price) AS "Total Income" FROM sellers s INNER JOIN order_items i ON s.seller_id = i.seller_id INNER JOIN orders o ON i.order_id = o.order_id  GROUP BY s.seller_id, s.seller_state, YEAR(o.order_approved_at), MONTH(o.order_approved_at) HAVING Sell_Year = 2018 AND Sell_Month = 5 AND State = "SP" ORDER BY SUM(i.price) desc LIMIT 5;',
        "SELECT p.product_category_name as 'Product category name', AVG(ors.review_score) as 'Average review score', COUNT(p.product_category_name) as 'Number of reviews' FROM order_reviews ors JOIN orders o ON ors.order_id = o.order_id JOIN order_items oi ON ors.order_id = oi.order_id JOIN products p ON oi.product_id = p.product_id GROUP BY p.product_category_name ORDER BY AVG(ors.review_score) desc;"
    ]; //QUERY 7 NOT UPDATED

    const OPTIMIZED_QUERY_LIST = [
        "SELECT YEAR(order_delivered_customer_date) 'Year', MONTH(order_delivered_customer_date) 'Month', COUNT(order_delivered_customer_date) 'Orders delivered' FROM orders WHERE YEAR(order_delivered_customer_date) BETWEEN '2017' AND '2018' GROUP BY YEAR(order_delivered_customer_date), MONTH(order_delivered_customer_date) ORDER BY order_delivered_customer_date; ",
        "SELECT YEAR(review_creation_date) 'Year', AVG(review_score) 'Average Score' FROM order_reviews WHERE YEAR(review_creation_date) BETWEEN '2017' AND '2018' GROUP BY YEAR(review_creation_date);",
        "SELECT count(o.order_id) as 'Number of orders',c.customer_city as 'City' FROM customers c INNER JOIN orders o  ON c.customer_id = o.customer_id WHERE YEAR(o.order_approved_at) = YEAR_VAL GROUP BY c.customer_city ORDER BY count(o.order_id) desc LIMIT 5;",
        'SELECT YEAR(o.order_approved_at) AS "Buy_Year", MONTH(o.order_approved_at) AS "Buy_Month", i.product_id as "Top 5 products" , count(i.product_id) as "Number Sold" FROM order_items i INNER JOIN orders o ON i.order_id = o.order_id WHERE YEAR(o.order_approved_at) = YEAR_VAL AND  MONTH(o.order_approved_at) = MONTH_VAL GROUP BY i.product_id ORDER BY count(i.product_id) desc, i.product_id asc  LIMIT 5; ',
        "SELECT catname.product_category_name_english 'Category Name', COUNT(oi.order_id) 'Order Count' FROM category_name catname INNER JOIN products pr ON catname.product_category_name=pr.product_category_name INNER JOIN order_items oi ON pr.product_id=oi.product_id GROUP BY catname.product_category_name_english ORDER BY COUNT(oi.order_id) DESC LIMIT 5; ",
        'SELECT s.seller_state AS "State", YEAR(o.order_approved_at) AS "Sell_Year", MONTH(o.order_approved_at) AS "Sell_Month", s.seller_id AS "Top 5 Gaining Sellers", SUM(i.price) AS "Total Income" FROM sellers s INNER JOIN order_items i ON s.seller_id = i.seller_id INNER JOIN orders o ON i.order_id = o.order_id  WHERE  s.seller_state = "SP" AND YEAR(o.order_approved_at) = 2018 AND MONTH(o.order_approved_at) = 5 GROUP BY s.seller_state, s.seller_id ORDER BY SUM(i.price) desc LIMIT 5;',
        "SELECT cn.product_category_name_english as 'Product category name', AVG(ors.review_score) as 'Average review score'FROM order_reviews ors JOIN orders o ON ors.order_id = o.order_id JOIN order_items oi ON oi.order_id = o.order_id JOIN products p ON oi.product_id = p.product_id JOIN category_name cn ON p.product_category_name = cn.product_category_name GROUP BY p.product_category_name ORDER BY AVG(ors.review_score) descLIMIT 5;"
    ]; //QUERY 7 NOT SURE

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function validate() {
        const query = $('code').html();
        if (query === 'SELECT a query FROM cards;') {
            return false;
        } else {
            return true;
        }
    };

    //selecting query
    $(document).on('click', '.query-box', (event) => {
        var queryBox = $(event)[0].target;
        if (queryBox.className !== 'query-box') {
            queryBox = queryBox.parentElement;
        }

        //get query type (optimized or non)
        const queryType = queryBox.parentElement.children[0].innerHTML;
        //get query number (1-7)
        const queryId = queryBox.children[0].innerHTML.split(" ")[1];

        if (queryType === 'unoptimized queries') {
            $('code').html(UNOPTIMIZED_QUERY_LIST[queryId - 1]);
        } else {
            $('code').html(OPTIMIZED_QUERY_LIST[queryId - 1]);
        }

        if (queryId == 3 || queryId == 4) {
            $('#year-label').removeAttr('hidden');
            $('#year').removeAttr('hidden');
        }
        if (queryId == 4) {
            $('#month-label').removeAttr('hidden');
            $('#month').removeAttr('hidden');
        }
        if (queryId != 3 && queryId != 4) {
            $('#year-label').attr('hidden', '');
            $('#year').attr('hidden', '');
            $('#month-label').attr('hidden', '');
            $('#month').attr('hidden', '');
        }
        if (queryId != 4) {
            $('#month-label').attr('hidden', '');
            $('#month').attr('hidden', '');
        }
    });

    $('#submit').on('click', () => {
        if (validate()) {
            var query = $('code').html();

            //replace input values
            if (query.includes('YEAR_VAL')) {
                query = query.replace("YEAR_VAL", $('#year').val());
            }
            if (query.includes('MONTH_VAL')) {
                query = query.replace("MONTH_VAL", $('#month').val());
            }

            //reset table every query
            document.getElementById('results-table').innerHTML = '<tr class="table-header"></tr>';
            const pError = document.getElementById('error');
            const summary = document.getElementById('result-summary');

            //resets
            pError.innerHTML = '';
            summary.innerHTML = 'Waiting for database.'

            summary.scrollIntoView();
            $.post('/query', { query }, function(response, status) {
                const tableHeader = $('.table-header');
                const tableContent = $('#results-table');

                if (response.err) {
                    pError.innerHTML = response.err;
                }

                //if there are results
                if (response.results.length > 1) {
                    summary.innerHTML = 'Result: ' + response.results.length + " rows x" + response.names.length + ' columns.';

                    //generate table header
                    response.names.forEach(name => {
                        tableHeader.append("<th>" + name + "</th>");
                    });
                    //generate row by row results
                    response.results.forEach(result => {
                        var row = document.createElement('tr');
                        response.names.forEach(name => {
                            let data = document.createElement('td');
                            data.innerHTML = result[name];
                            row.appendChild(data);

                            tableContent.append(row);
                        });
                    });

                } else { //no results
                    tableContent.append("<td>No results found</td>");
                }
            }).always(function() {});

        } else {
            document.getElementById('error').innerHTML = 'Please select a query.';

            async function animation() {
                const cards = document.getElementsByClassName('query-box');
                for (let index = 0; index < cards.length; index++) {
                    cards[index].classList.add('hover');
                    await sleep(100);
                    setTimeout(function() { cards[index].classList.remove('hover') }, 200);
                }
            }

            animation();
        }
    });
});