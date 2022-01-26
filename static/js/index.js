$(document).ready(function () {
    changeTheme();
    $('#unit').change(function() {
        var unit = $('#unit').find(':selected').text().toLowerCase();
        $('#sample-label').html(`The population is <span class="underline">        </span> after <span class="underline">        </span> ${unit}`)
        $('#sample-time-label').html(unit.substr(0,1).toUpperCase()+unit.substr(1)+':');
        if($('#question').find(':selected').text() == 'Population') {
            $('#arg-label').html(`Find the number of ${unit} when the population is <span class="underline">        </span>:`);
        } else {
            $('#arg-label').html(`Find the population when <span class="underline">        </span> ${unit} have passed:`);
        }
    });
    $('#initial').change(function() {
        $('#capacity').attr('min', String(parseInt($('#initial').val())+1));
    });
    $('#question').change(function() {
        var unit = $('#unit').find(':selected').text().toLowerCase();
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
        var hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        if (hsl[2] > 0.5) {
            $(':root').css('--bg', '#202124');
        } else {
            $(':root').css('--bg', '#ffffff');
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

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
  
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
  
    if (max == min) {
        h = s = 0;
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
    
        h /= 6;
    }
  
    return [ h, s, l ];
  }