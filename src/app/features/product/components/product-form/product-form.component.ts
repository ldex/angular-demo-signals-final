import { Component, output, input, computed, effect, signal } from '@angular/core';
import { Product } from '../../../../models/product.model';
import {
  form,
  required,
  minLength,
  pattern,
  min,
  max,
  schema,
  submit,
  FormField,
  FormRoot,
  FormOptions,
} from '@angular/forms/signals';

@Component({
  selector: 'app-product-form',
  imports: [FormField, FormRoot],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent {

  product = input.required<Product | null>()
  readonly isSubmitting = input(false);

  readonly save = output<Partial<Product>>();
  readonly cancel = output<void>();

  isEditing = computed(() => !!this.product());

  // This is an alternative to using an effect to set the form data when the product input changes.
  // It uses a linked signal to derive the form data directly from the product input, providing a default value when no product is provided.
  //
  // protected readonly productData = linkedSignal({
  //   source: this.product,
  //   computation: () => {
  //       if (this.product()) {
  //         return this.product()
  //       } else {
  //         return {
  //           id: 0,
  //           title: '',
  //           description: '',
  //           price: 0,
  //           category: '',
  //           image: '',
  //           rating: { rate: 0, count: 0}
  //         }
  //       }
  //   }
  // });

  protected readonly productData = signal<Product>({
    id: 0,
    title: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    rating: { rate: 0, count: 0}
  });

  protected readonly productSchema = schema<Product>((path) => {
    required(path.title, { message: 'Title is required.'});
    minLength(path.title, 3, { message: 'Title must be at least 3 characters long.'});

    required(path.price, { message: 'Price is required.'});
    min(path.price, 0, { message: 'Price cannot be negative.'});
    max(path.price, 100000, { message: 'Price cannot exceed 100 000.'});

    required(path.description, { message: 'Description is required.'});
    minLength(path.description, 5, { message: 'Description must be at least 5 characters long.'});

    required(path.category, { message: 'Category is required.'});
    required(path.image, { message: 'Image is required.'});

    pattern(
      path.image,
      new RegExp(
        '^(https?://[a-zA-Z0-9-.]+.[a-zA-Z]{2,5}(?:/S*)?(?:[-A-Za-z0-9+&@#/%?=~_|!:,.;])+.)(\\?(?:&?[^=&]*=[^=&]*)*)?$'
      ),
      {
        message: 'Invalid image url.',
      }
    );
  });

  protected readonly formOptions: FormOptions<Product> = {
    submission: {
      action: async (form) => {
        const newProduct = form().value();
        console.log('Product to save:', newProduct);
        await this.save.emit(newProduct);
      },
      onInvalid: (form) => {
        console.log('Form is invalid:', form().errors());
      },
      ignoreValidators: 'pending' // Optional: ignore pending async validators during submission
    }
  };

  protected readonly productForm = form(this.productData, this.productSchema, this.formOptions);
  protected readonly disableSubmit = computed(() =>  this.productForm().invalid() || this.productForm().submitting())

  constructor() {
    effect(() => {
      const product = this.product();
      if (product) {
        this.productData.set(product)
      }
    });
  }

  onCancel(): void {
    this.cancel.emit(undefined);
  }
}