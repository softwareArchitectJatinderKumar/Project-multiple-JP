import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RouteParamService {

  constructor(private route: ActivatedRoute, private router: Router) {}

  /** 
   * Fetches and validates 'Id' and 'name' from the route parameters.
   * If invalid, it shows an error and redirects.
   * @param callback Function to execute with valid BookId and name
   */
  getValidatedRouteParams(callback: (BookId: string, name: string) => void): void {
    this.route.params.subscribe(params => {
      let BookId = params['Id'];
      let name = params['name'];

      // console.log(BookId + '****' + name);
      // alert(BookId + '****' + name);

      if (!BookId || !name || BookId === 'undefined' || name === 'undefined') {
        // alert(0);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigateByUrl('/');
          }
        });
      } else {
        callback(BookId, name);
      }
    });
  }
}
