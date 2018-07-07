import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterPurchase'
})
export class FilterPurchasePipe implements PipeTransform {

    transform(Purchase: any, searchTerm: any): any {
        // check if search term is undefined
        if (searchTerm === undefined || searchTerm === '') { return Purchase };
        // return updated supplies array
        return Purchase.filter(function(purchases){
            return purchases.UserfullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            purchases.Coupontitle.toString().toLowerCase().includes(searchTerm.toLowerCase())
        });
    }

}