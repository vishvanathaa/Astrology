/* eslint-env jquery, browser */
$(document).ready(() => {
  function startSpinnerDialog1() {
    var dialog = new BootstrapDialog({
        type: BootstrapDialog.TYPE_DANGER,
        size : BootstrapDialog.SIZE_NORMAL,
        message: 'Please wait, it wil take few seconds to load.',
        title : 'Loading...<i class="fa fa-spinner fa-spin">'
    });
    dialog.setClosable(false);
    dialog.open();
}
 
function startSpinner_o(){
  $('.fa-spinner').addClass('fa-spin');  
}
function stopSpinner1(){
  $('.fa-spinner').removeClass('fa-spin');
  $('.fa-spin').fadeOut(3000);
}

  // Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


 });
