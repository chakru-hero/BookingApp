import { Place } from "../models/Place";

export default function PlaceImg({ place,index=0, className='' }: { place: Place, index?:number, className?:string }){
    const EU = import.meta.env.VITE_REACT_APP_expressUrl;
    if(!place.photos?.length){
        return null;
    }
    if(!className){
        className = 'object-cover';
    }

    return(
            <img className={className} src={`${EU}/uploads/places/`+place.photos[index]} alt = "" />
    );
}