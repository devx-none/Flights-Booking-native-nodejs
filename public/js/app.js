// Calcul total price
var checkboxes = document.querySelectorAll("input[type=checkbox]");
var price = document.querySelector('#price');
checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
    if(this.checked) {
        
       let total = parseInt(price.value) + parseInt(checkbox.value)
       price.value =total ;
    }else if(!this.checked) {
        let total = parseInt(price.value) - parseInt(checkbox.value)
        price.value =total ;
    }
     });
    });

   var TypeFilight = document.querySelector('#oneway');
   TypeFilight.addEventListener('change', function() {
     
       document.querySelector('.date_return').style.display = 'none';

   });
   var TypeFilight = document.querySelector('#round');
   TypeFilight.addEventListener('change', function() {
       document.querySelector('.date_return').style.display = 'block';

   });

   