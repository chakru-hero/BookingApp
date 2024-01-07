import { useState } from "react";
import { Place } from "../models/Place";

export default function  PlaceGallery({place}:{place : Place}){
    const EU = import.meta.env.VITE_REACT_APP_expressUrl;

    const [showAllPhotos, setShowAllPhotos] = useState(false);

    if (showAllPhotos) {
        return (
            <div className="absolute inset-0 bg-black text-white min-h-screen">
                <div className=" bg-black p-8 grid gap-4">
                    <div>
                        <h2 className="text-3xl mr-48">{place.title}</h2>
                        <button
                            onClick={() => setShowAllPhotos(false)}
                            className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow-black bg-white text-black"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                            Close
                        </button>
                    </div>
                    {place?.photos?.length > 0 &&
                        place.photos.map((photo: string) => (
                            <div>
                                <img src={`${EU}/uploads/places/` + photo} />
                            </div>
                        ))}
                </div>
            </div>
        );
    }
    return(
        <div className="relative">
                <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
                    <div>
                        {place.photos?.[0] && (
                            <div>
                                <img onClick={()=> setShowAllPhotos(true)}
                                    className="aspect-square cursor-pointer object-cover"
                                    src={
                                        `${EU}/uploads/places/` + place.photos[0]
                                    }
                                ></img>
                            </div>
                        )}
                    </div>
                    <div className="grid">
                        {place.photos?.[1] && (
                                <img onClick={()=> setShowAllPhotos(true)}
                                className="aspect-square cursor-pointer object-cover"
                                src={`${EU}/uploads/places/` + place.photos[1]}
                            ></img>
                        )}
                        <div className="overflow-hidden">
                            {place.photos?.[2] && (
                                <img onClick={()=> setShowAllPhotos(true)}
                                className="aspect-square cursor-pointer object-cover relative top-2"
                                    src={
                                        `${EU}/uploads/places/` + place.photos[2]
                                    }
                                ></img>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setShowAllPhotos(true)}
                    className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md shadow-gray-500 "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                        />
                    </svg>
                    Show more photos
                </button>
            </div>
    );
}