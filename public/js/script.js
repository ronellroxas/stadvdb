$(document).ready(function() {
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
    var queryId = null;
    //selecting query
    $(document).on('click', '.query-box', (event) => {
        var queryBox = $(event)[0].target;
        if (queryBox.className !== 'query-box') {
            queryBox = queryBox.parentElement;
        }

        //get query number (1-7)
        queryId = queryBox.children[0].innerHTML;

        if (queryId) {
            $('#input-header').removeAttr('hidden');
            $('code').html(EMPTY[queryId]);
        } else {
            $('#input-header').attr('hidden', '');
        }
        if (queryId === 'Drill Down' || queryId === 'Dice' || queryId === 'Slice') {
            if (queryId !== 'Slice') {
                $('#month-option').removeAttr('hidden');
            } else {
                $('#month-option').attr('hidden', '');
            }
            $('#year-option').removeAttr('hidden');
        } else {
            $('#month-option').attr('hidden', '');
            $('#year-option').attr('hidden', '');
        }
        if (queryId === 'Dice') {
            $('#state-option').removeAttr('hidden');
        } else {
            $('#state-option').attr('hidden', '');
        }
    });

    $('#state').on('change', function() {
        $('code').html(INPUT[queryId]);
    });

    $('#month').change(function() {
        var month = $('#month').val();
        if (month.includes(',')) {
            var values = month.trim().split(',');
            values.forEach(value => {
                value = parseInt(value);
                if (value < 1 || value > 12 || isNaN(value)) {
                    $('#month').css({ border: '2px solid red' });
                } else {
                    $('#month').css({ border: '' });
                    $('code').html(INPUT[queryId]);
                }
            });

        } else {
            month = parseInt(month);
            if ((month < 1 || month > 12 || isNaN(month)) && month) {
                $('#month').css({ border: '2px solid red' });
            } else {
                $('#month').css({ border: '' });
                $('code').html(INPUT[queryId]);
            }
        }
    });

    $('#year').on('change', function() {
        var year = parseInt($('#year').val());
        if ((year.toString().length != 4 || isNaN(year)) && year) {
            $('#year').css({ border: '2px solid red' });
            $('#submit').attr('disabled', '');
        } else {
            $('#year').css({ border: '' });
            $('code').html(INPUT[queryId]);
        }
    });

    $('#submit').on('click', () => {
        if (validate()) {
            var query = $('code').html();
            query = query.replace(/<br>/g, '');

            //replace input values
            if (query.includes('YEAR_VAL')) {
                year = $('#year').val().trim();
                if (!year) {
                    query = query.replace(/ (AND)+ (\()+YEAR\(o.order_approved_at\) = YEAR_VAL(\))+/g, '');
                } else {
                    query = query.replace(/YEAR_VAL/g, year);
                }
            }
            if (query.includes('MONTH_VAL')) {
                var month = $('#month').val().trim();
                if (!month) {
                    query = query.replace(/AND \(MONTH\(o.order_approved_at\) = MONTH_VAL\)/g, '');
                } else {
                    if (month.includes(',')) {
                        var values = month.split(',');
                        var str = "";
                        values.forEach(entry => {
                            str += entry + ' OR MONTH(o.order_approved_at)= ';
                        });
                        str = str.substr(0, str.length - 31);
                        month = str;
                    }
                    query = query.replace(/MONTH_VAL/g, month);
                }
            }
            if (query.includes('STATE_VAL')) {
                var state = $('#state').val().trim();
                if (!state) {
                    query = query.replace(/\(oc.customer_state = STATE_VAL \) (AND)+ /g, '');
                } else {
                    if (state.includes(',')) {
                        var values = state.split(',');
                        var str = "";
                        values.forEach(entry => {
                            str += "'" + entry + "'" + ' OR oc.customer_state = ';
                        });
                        str = str.substr(0, str.length - 24);
                        console.log(str);
                        state = str;
                    } else {
                        state = "'" + state + "'";
                    }
                    query = query.replace(/STATE_VAL/g, state);
                }
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
                    var message;
                    if (response.err === 'ER_PARSE_ERROR') {
                        message = 'Check SQL syntax.';
                    }
                    if (response.err === 'PROTOCOL_CONNECTION_LOST') {
                        message = 'Connection to database may be unstable or timed out.';
                    }
                    summary.innerHTML = '';
                    pError.innerHTML = 'Error code ' + response.err + ": " + message;
                    return false;
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