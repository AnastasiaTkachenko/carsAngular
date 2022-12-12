import {
  Component,
  ComponentFactoryResolver,
  HostListener,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { subscribeOn } from 'rxjs';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  priceForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    car: ['', Validators.required],
  });

  /*   make the cars dynamic  */
 /*  carsData = [
    {
      image: '1.png',
      name: 'Lamborghini Huracan Spyder',
      gear: 'полный',
      engine: 5.2,
      places: 2,
    },
    {
      image: '2.png',
      name: 'Chevrolet Corvette',
      gear: 'полный',
      engine: 6.2,
      places: 2,
    },
    {
      image: '3.png',
      name: 'Ferrari California',
      gear: 'полный',
      engine: 3.9,
      places: 4,
    },
    {
      image: '4.png',
      name: 'Lamborghini Urus',
      gear: 'полный',
      engine: 4,
      places: 5,
    },
    {
      image: '5.png',
      name: 'Audi R8',
      gear: 'полный',
      engine: 5.2,
      places: 2,
    },
    {
      image: '6.png',
      name: 'Chevrolet Camaro',
      gear: 'полный',
      engine: 2.0,
      places: 4,
    },
  ]; */

  carsData:any;

  constructor(private fb: FormBuilder, private appService: AppService) {}

/* to receive the data about cars */
  ngOnInit() {
   /*  this.appService.getData().subscribe(carsData=> this.carsData = carsData); */
   this.appService.getData(this.category).subscribe(carsData => this.carsData = carsData);
  }

  goScroll(target: HTMLElement, car?: any) {
    target.scrollIntoView({ behavior: 'smooth' });
    if (car) {
      this.priceForm.patchValue({ car: car.name });
    }
  }

  category: string = 'sport';
toggleCategory(category: string) {
  this.category = category;
  this.ngOnInit();
}
  /* parallax  */
  trans: any;
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.trans = {
      transform:
        'translate3d(' +
        (e.clientX * 0.3) / 8 +
        'px,' +
        (e.clientY * 0.3) / 8 +
        'px,0px)',
    };
  }

  bgPos: any;
  @HostListener('document:scroll', ['$event'])
  onScroll() {
    this.bgPos = { backgroundPositionX: '0' + 0.3 * window.scrollY + 'px' };
  }

  onSubmit() {
    if (this.priceForm.valid) {
      this.appService
        .sendQuery(this.priceForm.value)
      /*   .subscribe((result) => console.log(result)); */
      alert('Спасибо за заявку мы,свяжемся с Вами в ближайшее время');
      /*       this.priceForm.reset();  */ // delete everything fron the form after its submitted
    }
    this.appService.sendQuery(this.priceForm.value).subscribe({
      next: (response: any) => {
        alert(response.message);
        this.priceForm.reset();
      },
      error: (response) => {
        alert(response.console.message);
      },
    });
  }
}
