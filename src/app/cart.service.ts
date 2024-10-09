import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private productsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  
  constructor() {
    const initialProducts: Product[] = [
      { id: 1, name: 'Fexsacmeli', price: 100, quantity: 1 },
      { id: 2, name: 'Yursasmeni', price: 150, quantity: 1 },
    ];
    this.productsSubject.next(initialProducts);
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  addProduct(product: Product): void {
    const currentProducts = this.productsSubject.getValue();
    currentProducts.push(product);
    this.productsSubject.next(currentProducts);
  }

  removeProduct(productId: number): void {
    const currentProducts = this.productsSubject.getValue();
    const updatedProducts = currentProducts.filter(product => product.id !== productId);
    this.productsSubject.next(updatedProducts);
  }

  updateProductQuantity(productId: number, quantity: number): void {
    const currentProducts = this.productsSubject.getValue();
    const product = currentProducts.find(product => product.id === productId);
    if (product) {
      product.quantity = quantity;
      this.productsSubject.next([...currentProducts]);
    }
  }

  getTotalPrice(): number {
    const currentProducts = this.productsSubject.getValue();
    return currentProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
  }
}
