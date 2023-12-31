import axios from "axios";
import { useEffect, useState } from "react"
import { Place } from "../models/Place";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const EU = import.meta.env.VITE_REACT_APP_expressUrl;


  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    axios.get('/places')
      .then(response => {
        setPlaces(response.data);
      })
      .catch(error => {
        console.error('Error fetching places:', error);
      });
  }, []);

  return (
    <div className="mt-8 gap-x-6 gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.isArray(places) && places.length > 0 && places.map(place => (
        <Link to={'/place/' + place._id}>
          <div className="bg-gray-500 mb-2 rounded-2xl flex">
            {place.photos?.[0] && (
              <img className=" object-cover rounded-2xl aspect-square" src={`${EU}/uploads/places/`+place.photos?.[0]}/>
            )}
          </div>
          <h2 className="font-bold">{place.address}</h2>
          <h3 className="text-sm text-gray-500">{place.title}</h3>
          <div className="mt-1">
              <span className="font-bold">${place.price} per night</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
