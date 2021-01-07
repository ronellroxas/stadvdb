$(document).ready(function() {

    function validate() {
        var textbox = $('#query');

        if (textbox.val() !== "") {
            textbox.css('border', '');
            return true;
        } else {
            textbox.css('border', '2px solid #fd3c3c');
            return false;
        }
    };

    $('#submit').on('click', () => {
        const query = $('#query').val();
        if (validate()) {
            //reset table every query
            document.getElementById('results-table').innerHTML = '<tr class="table-header"></tr>';


            //show modal for loading
            const modal = $('#myModal');
            modal.modal('toggle');
            const pError = document.getElementById('error');
            const summary = document.getElementById('result-summary');

            $.ajax({
                type: "POST",
                url: "/query",
                data: { query },
                success: (response) => {
                    const tableHeader = $('.table-header');
                    const tableContent = $('#results-table');

                    modal.modal('toggle');

                    //if there are errors
                    if (response.err) {
                        modal.modal('toggle');
                        summary.innerHTML = '';
                        pError.innerHTML = response.err;
                        return false;
                    }

                    //if there are results
                    if (response.results.length > 1) {
                        pError.innerHTML = '';
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
                }
            });
        }
        return false;
    });
});