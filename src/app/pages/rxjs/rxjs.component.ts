import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {
  subcripcion: Subscription;

  constructor() {
    this.subcripcion = this.regresaObservable().subscribe(
      numero => console.log(numero),
      error => console.log('Error en observable', error),
      () => console.log('Completado!!!')
    );
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subcripcion.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let contador = 0;
      const intervalo = setInterval(() => {
        contador++;
        const salida = {
          valor: contador
        };
        observer.next(salida);
        // if (contador === 3) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }
      }, 1000);
    }).pipe(
      map(response => response.valor),
      filter(valor => valor % 2 === 1)
    );
  }
}
