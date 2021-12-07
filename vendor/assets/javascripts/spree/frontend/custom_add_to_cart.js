//= require spree/api/main
//= require spree/api/storefront/cart

document.addEventListener('turbolinks:load', function () {
  $(document).ready(function () {
    $(".quick-add-cart-button").click(function(){
      var product_summary = $(this).data('product-summary');
      var variant_id = $(this).data('variant-id');
      var variant_summary = $(this).data('variant-summary');

      if (SpreeAPI.orderToken == null){
          SpreeAPI.Storefront.createCartCustom();
      }

      Spree.ensureCart(function() {
        SpreeAPI.Storefront.addToCart(
          variant_id,
          1,
          {},
          function(response) {
            Spree.fetchCart()
          },
          function(error) {
            if (typeof error === 'string' && error !== '') {
              alert(error);
            }
          }
        )
      })
    });
  })
})

SpreeAPI.Storefront.createCartCustom = function (successCallback, failureCallback) {
  fetch(Spree.routes.api_v2_storefront_cart_create, {
      method: 'POST',
      headers: SpreeAPI.prepareHeaders()
  }).then(function (response) {
      switch (response.status) {
          case 422:
              response.json().then(function (json) { failureCallback(json.error) })
              break
          case 500:
              SpreeAPI.handle500error()
              break
          case 201:
              response.json().then(function (json) {
                SpreeAPI.orderToken = json.data.attributes.token
              })
              break
      }
  })
}




