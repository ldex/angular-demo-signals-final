import { Component, inject, output, input, computed, effect } from '@angular/core';

import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-product-form',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent {
  private fb = inject(FormBuilder);

  product = input<Product | null>()
  readonly isSubmitting = input(false);

  readonly save = output<Partial<Product>>();
  readonly cancel = output<void>();

  productForm: FormGroup;
  isEditing = computed(() => !!this.product());

  constructor() {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });

    effect(() => {
      const product = this.product();
      if (product) {
        this.productForm.patchValue({
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image
        });
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.save.emit(this.productForm.value);
    }
  }

  onCancel(): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.cancel.emit();
  }
}