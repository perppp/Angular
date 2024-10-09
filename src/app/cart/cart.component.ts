import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { CartService } from '../cart.service';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Coupon {
  code: string;
  discount: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  products: Product[] = [];
  totalPrice: number = 0;
  couponCode: string = '';
  discount: number = 0;

  newProduct: Product = { id: 0, name: '', price: 0, quantity: 1 };

  coupons: Coupon[] = [
    { code: 'SAVE10', discount: 10 },
    { code: 'SAVE20', discount: 20 }
  ];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getProducts().subscribe(products => {
      this.products = products;
      this.calculateTotal();
    });
  }

  addProduct() {
    if (this.newProduct.name && this.newProduct.price > 0) {
      this.newProduct.id = Date.now();
      this.cartService.addProduct({ ...this.newProduct });
      this.newProduct = { id: 0, name: '', price: 0, quantity: 1 };
      this.calculateTotal();
    }
  }

  removeProduct(productId: number) {
    this.cartService.removeProduct(productId);
    this.calculateTotal();
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateProductQuantity(productId, quantity);
    this.calculateTotal();
  }

  applyCoupon() {
    const coupon = this.coupons.find(c => c.code === this.couponCode);
    this.discount = coupon ? coupon.discount : 0;
    this.calculateTotal();
  }

  private calculateTotal() {
    const subtotal = this.cartService.getTotalPrice();
    this.totalPrice = subtotal - (subtotal * this.discount / 100);
  }
}
