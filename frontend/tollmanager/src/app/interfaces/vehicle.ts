export interface Vehicle{
    id: string,
    photoURL?: string,
    car_det?:string,
    vin:string,
    email:string,
    somethingCustom?: string,
    isAnonymous?:boolean,
    timestamp: Date,
    cost:number,
}