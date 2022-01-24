$(document).ready(function (){
    $('#unit').change(function() {
        var unit = $('#unit').find(':selected').text().toLowerCase();
        $('.q-input').show();
        $('#sample-label').html(`The population is <span class="underline">        </span> after <span class="underline">        </span> ${unit}`)
        $('#sample-time-label').html(unit.substr(0,1).toUpperCase()+unit.substr(1)+':');
    });
    $('#question').change(function() {
        var unit = $('#unit').find(':selected').text().toLowerCase();
        $('.a-input').show();
        if($('#question').find(':selected').text() == 'Population') {
            $('#answer-label').html(`Find the number of ${unit} when the population is <span class="underline">        </span>:`);
        } else {
            $('#answer-label').html(`Find the population when <span class="underline">        </span> ${unit} have passed:`);
        }
    });
    $('.variables').submit(function(e) {
        e.preventDefault();
        solve();
        return false;
    });
});

function onlyNumberKey(evt) {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode >= 44 && ASCIICode <= 57 && ASCIICode != 47 )
        return true;
    return false;
}