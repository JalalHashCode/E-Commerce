// *********************
// cart Js
let listProductHTML = document.querySelector('.list-product-items');
// list products json file
let listProducts = [];
let carts = [];
let listCartHtml = document.querySelector('.listCart');
let iconcartSpan = document.querySelector('.header-action-ShopCart span');
let iconcartSpanMobile = document.querySelector('.offcanvas .offcanvas-body .header-action-ShopCart span');
const addDataToHTML = () => {

    listProductHTML.innerHTML = '';
    if (listProducts.length > 0) {

        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('col-lg-4', 'col-md-6','mx-auto' ,'col-10', 'mb-25');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `<div class="product-single-item-style-1">
                <a href="#" class="image img-responsive">
                    <img src="${product.image}" alt="" class="img-fluid">
                    <ul class="tooltip-tag-items">
                        <li class="color-green">20%</li>
                    </ul>
                </a>
                <div class="content">
                    <div class="top">
                        <span class="category">MEN</span>
                        <h4 class="title">
                            <a href="#">${product.name}</a>
                        </h4>
                        <span class="price">${product.price}
                            <del>Rs. 5999</del>
                        </span>
                    </div>
                    <div class="bottom">
                        <ul class="review-star">
                            <li class="fill">
                                <span class="material-icons">star</span>
                            </li>
                            <li class="fill">
                                <span class="material-icons">star</span>
                            </li>
                            <li class="fill">
                                <span class="material-icons">star</span>
                            </li>
                            <li class="fill">
                                <span class="material-icons">star</span>
                            </li>
                            <li class="fill">
                                <span class="material-icons">star_half</span>
                            </li>
                        </ul>
                        <div class="product-event-items ">
                            <button href="#" class="btn fa fa-shopping-cart  cart-btn-s">
                               
                            </button>
                            <a href="#" class="btn wishlist-btn">
                                <span class="material-icons">favorite_border</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>`;

            listProductHTML.appendChild(newProduct);
        });
    }
}


const initApp = () => {
    //get data from json
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            listProducts = data;
            addDataToHTML();
            // get cart from memory
            if (localStorage.getItem('cart')) {
                carts = JSON.parse(localStorage.getItem('cart'));
                addCartToHtml();
            }
        })
}
initApp();

// check if client clicked on cart
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('cart-btn-s') || positionClick.classList.contains('product-event-items cart-btn-s: i')) {
        let product_id = positionClick.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.id;
        addToCart(product_id);
    }

})
// addToCart function

const addToCart = (id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.productid == id);

    if (carts.length <= 0) {
        carts = [{
            productid: id,
            quantity: 1
        }]
    }
    else if (positionThisProductInCart < 0) {
        carts.push({
            productid: id,
            quantity: 1
        });

    } else {
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
    }
   
    addCartToHtml();
    addCartToMemory();
}

const addCartToHtml = () => {
    listCartHtml.innerHTML = '';
    let totalQuantity = 0;
    if (carts.length > 0) {
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;

            let newCart = document.createElement('div');
            newCart.classList.add('cart-product');
            newCart.dataset.id = cart.productid;
            let positionProduct = listProducts.findIndex((value) => value.id == cart.productid);
            let info = listProducts[positionProduct];
            newCart.innerHTML = `
            <div class="cart-product mb-2">
                <div class="product-image"><img src="${info.image}" alt=""></div>

                <div class="product-name">
                ${info.name}
                </div>
                <div class="totalPrice">
                $${info.price * cart.quantity}
                </div>
                <div class="quantity ">
                    <span class="material-icons minus">arrow_left</span>
                    <span class="items">${cart.quantity}</span>
                    <span class="material-icons plus">arrow_right</span>
                </div>
            </div>`;

            listCartHtml.appendChild(newCart);

        });
    }
    iconcartSpan.innerHTML = totalQuantity;
    iconcartSpanMobile.innerHTML = totalQuantity;
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}


listCartHtml.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.
        parentElement.parentElement.dataset.id;
        
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantity(product_id, type);
    }
})

const changeQuantity = (id, type) => {
    
    let positionitemInCart = carts.findIndex((value) => value.productid == id);
    
    if (positionitemInCart >= 0) {
        switch (type) {
            case 'plus':
                carts[positionitemInCart].quantity = carts[positionitemInCart].quantity + 1;
                break;
            default:
                let valueChange = carts[positionitemInCart].quantity - 1;
                if (valueChange > 0) {
                    carts[positionitemInCart].quantity = valueChange;
                }
                else {
                    carts.splice(positionitemInCart, 1);
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHtml(); 

}


