$(document).ready(function() {

    const UNOPTIMIZED_QUERY_LIST = [
        "SELECT YEAR(order_delivered_customer_date) 'Year', MONTH(order_delivered_customer_date) 'Month', COUNT(order_delivered_customer_date) 'Orders delivered' FROM orders WHERE YEAR(order_delivered_customer_date) = '2017' GROUP BY YEAR(order_delivered_customer_date), MONTH(order_delivered_customer_date) UNION (SELECT YEAR(order_delivered_customer_date) 'Year', MONTH(order_delivered_customer_date) 'Month', COUNT(order_delivered_customer_date) 'Orders delivered' FROM orders WHERE YEAR(order_delivered_customer_date) = '2018' GROUP BY YEAR(order_delivered_customer_date), MONTH(order_delivered_customer_date));",
        "SELECT YEAR(review_creation_date) 'Year', AVG(review_score) 'Average Score' FROM order_reviews GROUP BY YEAR(review_creation_date);",
        "SELECT count(o.order_id) as 'Number of orders',c.customer_city as 'City' FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_city ORDER BY count(o.order_id) desc LIMIT 5;",
        'SELECT  s.seller_id as "Seller", o.product_id as "Top 5 Products", count(o.product_id) as "Quantity Sold" FROM sellers s LEFT JOIN order_items o ON s.seller_id = o.seller_id WHERE s.seller_id = "391fc6631aebcf3004804e51b40bcf1e" GROUP BY o.seller_id, o.product_id LIMIT 5;',
        "SELECT catname.product_category_name_english 'Category Name', COUNT(oi.order_id) 'Order Count' FROM category_name catname INNER JOIN products pr ON catname.product_category_name=pr.product_category_name JOIN order_items oi ON pr.product_id=oi.product_id GROUP BY catname.product_category_name_english ORDER BY COUNT(oi.order_id) DESC LIMIT 5;",
        'SELECT c.customer_state as "State" , MONTH(o.order_approved_at) as "Month", SUM(i.price) as "Total Sales Price" FROM customers c INNER JOIN orders o on c.customer_id = o.customer_id INNER JOIN order_items i on o.order_id = i.order_id WHERE  YEAR(o.order_approved_at) = 2018 GROUP BY c.customer_state, MONTH(o.order_approved_at) ORDER BY SUM(i.price) desc LIMIT 10;',
        "SELECT p.product_category_name as 'Product category name', AVG(ors.review_score) as 'Average review score', COUNT(p.product_category_name) as 'Number of reviews' FROM order_reviews ors JOIN orders o ON ors.order_id = o.order_id JOIN order_items oi ON ors.order_id = oi.order_id JOIN products p ON oi.product_id = p.product_id GROUP BY p.product_category_name ORDER BY AVG(ors.review_score) desc;"
    ]

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
        }
    });

    $('#submit').on('click', () => {
        const query = $('code').html();
        validate();
        if (validate()) {
            //reset table every query
            document.getElementById('results-table').innerHTML = '<tr class="table-header"></tr>';

            //show modal for loading
            const modal = $('#myModal');
            modal.modal('toggle');
            const pError = document.getElementById('error');
            const summary = document.getElementById('result-summary');

            //resets
            pError.innerHTML = '';
            summary.innerHTML = '';

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

                    modal.modal('toggle');
                } else { //no results
                    tableContent.append("<td>No results found</td>");
                    modal.modal('toggle');
                }
            });

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