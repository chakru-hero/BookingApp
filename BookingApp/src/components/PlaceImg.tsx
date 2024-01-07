import { Place } from "../models/Place";

export default function PlaceImg({ place,index=0, className='' }: { place: Place, index?:number, className?:string }){

    if(!place.photos?.length){
        return null;
    }
    if(!className){
        className = 'object-cover';
    }

    return(
            <img className={className} src={'http://localhost:4000/uploads/places/'+place.photos[index]} alt = "" />
    );
}