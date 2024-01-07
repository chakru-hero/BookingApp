import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Booking } from "../models/Booking";
import axios from "axios";
import AddressLink from "../components/AddressLink";
import PlaceGallery from "../components/PlaceGallery";
import BookingDates from "../components/BookingDates";

export function BookingPage() {
    const { id } = useParams<{ id: string }>();
    const [booking, setBooking] = useState<Booking>();
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get('/bookings');
                const filteredBooking = response.data.find(({ _id }: { _id: string }) => _id === id);
                setBooking(filteredBooking);
            } catch (error) {
                console.error('Error fetching booking:', error);
            }
        };

        if (id) {
            fetchBooking();
        }
    }, [id]);

    if (!booking) {
        return null;
    }

    return (
        <div className="mb-8 mt-8">
            <h1 className="text-3xl"> {booking.place.title}</h1>
            <AddressLink place={booking.place} className="my-2 block mb-2" />
            <div className="bg-gray-200 p-8 my-6 mb-4 mt-4 rounded-2xl flex justify-between items-center">
                <div>
                    <h2 className="text-2xl mb-4">Your Booking information:</h2>
                    <BookingDates booking={booking} />
                </div>
                <div className="bg-primary p-8 text-white rounded-2xl">
                    <div>Total price</div>
                    <div className="text-3xl">${booking.price}</div>
                </div>
            </div>
            <PlaceGallery place={booking.place} />
        </div>
    );
}

