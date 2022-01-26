$(document).ready(function () {
    changeTheme();
    $('#unit').change(function() {
        var unit = $('#unit').find(':selected').text().toLowerCase();
        $('#sample-label').html(`The population is <span class="underline">        </span> after <span class="underline">        </span> ${unit}`)
        $('#sample-time-label').html(unit.substring(0,1).toUpperCase()+unit.substring(1)+':');
        if($('#question').find(':selected').text() == 'Population') {
            $('#arg-label').html(`Find the number of ${unit} when the population is <span class="underline">        </span>:`);
        } else {
            $('#arg-label').html(`Find the population when <span class="underline">        </span> ${unit} have passed:`);
        }
    });
    $('#sample-time').change(function() {
        $(this).val(parseInt($(this).val()));
        if($(this).val().length > 6) {
            $(this).val($(this).val().substring(0, 6));
        }
        if(parseInt($(this).val()) > 999999) {
            $(this).val('999999');
        }
    });
    $('#arg').change(function() {
        $(this).val(parseInt($(this).val()));
        if($(this).val().length > 6) {
            $(this).val($(this).val().substring(0, 6));
        }
        if(parseInt($(this).val()) > 999999) {
            $(this).val('999999');
        }
    });
    $('#initial').change(function() {
        $(this).val(parseInt($(this).val()));
        if($(this).val().length > 6) {
            $(this).val($(this).val().substring(0, 6));
        }
        if(parseInt($(this).val()) > 999997) {
            $(this).val('999997');
        }
        $('#sample-pop').attr('min', String(parseInt($('#initial').val())+1));
        $('#capacity').attr('min', String(parseInt($('#sample-pop').val())+1));
        if($('#initial').val() == null || $('#initial').val() == '' || $('#sample-pop').val() == null || $('#sample-pop').val() == '') {
            $('#capacity').prop('disabled', true);
        } else {
            $('#capacity').prop('disabled', false);
            if ($('#sample-pop').val() != null && $('#sample-pop').val() != '' && parseInt($('#initial').val()) >= parseInt($('#sample-pop').val())) {
                $('#sample-pop').val(parseInt($('#initial').val())+1);
            }
            if($('#capacity').val() != null && $('#capacity').val() != '' && parseInt($('#sample-pop').val()) >= parseInt($('#capacity').val())) {
                $('#capacity').val(parseInt($('#sample-pop').val())+1);
            }
        }
    });
    $('#sample-pop').change(function() {
        $(this).val(parseInt($(this).val()));
        if($(this).val().length > 6) {
            $(this).val($(this).val().substring(0, 6));
        }
        if(parseInt($(this).val()) > 999998) {
            $(this).val(999998);
        }
        $('#capacity').attr('min', String(parseInt($('#sample-pop').val())+1));
        if($('#initial').val() == null || $('#initial').val() == '' || $('#sample-pop').val() == null || $('#sample-pop').val() == '') {
            $('#capacity').prop('disabled', true);
        } else {
            $('#capacity').prop('disabled', false);
            if ($('#sample-pop').val() != null && $('#sample-pop').val() != '' && parseInt($('#initial').val()) >= parseInt($('#sample-pop').val())) {
                $('#sample-pop').val(parseInt($('#initial').val())+1);
            }
            if($('#capacity').val() != null && $('#capacity').val() != '' && parseInt($('#sample-pop').val()) >= parseInt($('#capacity').val())) {
                $('#capacity').val(parseInt($('#sample-pop').val())+1);
            }
        }
    });
    $('#capacity').change(function() {
        $(this).val(parseInt($(this).val()));
        if($(this).val().length > 6) {
            $(this).val($(this).val().substring(0, 6));
        }
        if(parseInt($(this).val()) > 999999) {
            $(this).val('999999');
        }
        if($('#capacity').val() != null && $('#capacity').val() != '' && parseInt($('#sample-pop').val()) >= parseInt($('#capacity').val())) {
            $('#capacity').val(parseInt($('#sample-pop').val())+1);
        }
    });
    $('#question').change(function() {
        var unit = $('#unit').find(':selected').text().toLowerCase();
        if (unit == 'select an option') {
            unit = 'time units'
        }
        $('.a-input').show();
        if($('#question').find(':selected').text() == 'Population') {
            $('#arg-label').html(`Find the number of ${unit} when the population is <span class="underline">        </span>:`);
        } else {
            $('#arg-label').html(`Find the population when <span class="underline">        </span> ${unit} have passed:`);
        }
    });
    $('.variables').submit(function(e) {
        e.preventDefault();
        solve(Object.fromEntries(new FormData(e.target).entries()));
        return false;
    });
});

function onlyNumberKey(evt) {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode >= 48 && ASCIICode <= 57)
        return true;
    return false;
}

function changeTheme() {
    $(':root').css('--theme', $('#theme').val());
    var rgb = hexToRgb($('#theme').val());
    if (rgb != null) {
        var hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
        if (hsv[2] > 0.5) {
            $(':root').css('--bg', '#202124');
            $(':root').css('--bgtr', '#2021247F');
            $(':root').css('--disabled', '#484a517F');
        } else {
            $(':root').css('--bg', '#ffffff');
            $(':root').css('--bgtr', '#ffffff7F');
            $(':root').css('--disabled', '#d9d9d97F');
            
        }
    }
}

function hexToRgb(h) {
    let r = 0, g = 0, b = 0;
  
    if (h.length == 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        b = "0x" + h[3] + h[3];
    } else if (h.length == 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + h[6];
    }
    
    return [ +r, +g, +b ];
  }

  function rgbToHsv(r, g, b) {
    r /= 255, g /= 255, b /= 255;
  
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;
  
    var d = max - min;
    s = max == 0 ? 0 : d / max;
  
    if (max == min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
  
    return [ h, s, v ];
}