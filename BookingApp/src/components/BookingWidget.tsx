import { Place } from "../models/Place";

export default function BookingWidget({ place }: { place: Place }) {
    return (

        <div className="p-4 rounded-2xl bg-white shadow">
            <div className="text-2xl text-center">
                Price : ${place.price} / per night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className=" py-3 px-4">
                        <label>Check in:</label>
                        <input type="date"></input>
                    </div>
                    <div className=" py-3 px-4 border-l">
                        <label>Check out:</label>
                        <input type="date"></input>
                    </div>
                </div>
                <div>
                    <div className=" py-3 px-4 border-l">
                        <label>Number of guests:</label>
                        <input type="number" value={1}></input>
                    </div>
                </div>
            </div>
            <button className="primary mt-4">Book this place </button>
        </div>

    );
}