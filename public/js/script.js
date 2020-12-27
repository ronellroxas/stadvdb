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
        console.log('click');

        const query = $('#query').val();
        if (validate()) {
            //reset table every query
            document.getElementById('results-table').innerHTML = '<tr class="table-header"></tr>';


            //show modal for loading
            const modal = $('#mymodal');
            modal.modal('toggle');

            $.ajax({
                type: "POST",
                url: "/query",
                data: { query },
                success: (response) => {
                    const tableHeader = $('.table-header');
                    const tableContent = $('#results-table');

                    modal.modal('toggle');

                    //if there are results
                    if (response.results.length > 1) {
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