
import { Link } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import { Place } from "../models/Place";
import PlaceImg from "../components/PlaceImg";

export default function PlacesPage() {

    const [places, setPlaces] = useState<Place[]>([]);

    useEffect(() => {
        axios.get('/user-places').then(({ data }) => {
            setPlaces(data);
        });
    }, []);

    return (
        <div>
            <AccountNav />
            <div className="text-center">
                <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new place
                </Link>
            </div>
            <div className="mt-4">
                {places.length > 0 && places.map((place, index) => (

                    <Link to={'/account/places/'+place._id} key={index} 
                    className="mb-8 cursor-pointer flex gap-4 bg-gray-100 rounded-2xl overflow-hidden">
                        
                        <div className="flex w-32 h-full shrink-0">
                            <PlaceImg place={place} />
                        </div>
                        <div className="grow-0 shrink">
                            <h2 className="text-xl">{place.title}</h2>
                            <p className="text-sm mt-2">{place.description} </p>
                        </div>
                        </Link>
                ))}
            </div>

        </div>
    )
}