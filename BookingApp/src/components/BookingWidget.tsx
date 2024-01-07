import { useState } from "react";
import { Place } from "../models/Place";
import { differenceInCalendarDays } from "date-fns";

export default function BookingWidget({ place }: { place: Place }) {

    const[checkIn, setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [numberOfGuests,setNumberOfGuests] = useState(1);
    const [name,setName] = useState('');
    const [mobile,setMobile] = useState('');
    let numberOfNights = 0;
    if(checkIn && checkOut){
        numberOfNights = differenceInCalendarDays(new Date(checkOut),new Date(checkIn));
    }
        

    return (

        <div className="p-4 rounded-2xl bg-white shadow">
            <div className="text-2xl text-center">
                Price : ${place.price} / per night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className=" py-3 px-4">
                        <label>Check in:</label>
                        <input type="date" value={checkIn} onChange={ev=> setCheckIn(ev.target.value)}></input>
                    </div>
                    <div className=" py-3 px-4 border-l">
                        <label>Check out:</label>
                        <input type="date" value={checkOut} onChange={ev=> setCheckOut(ev.target.value)}></input>
                    </div>
                </div>
                <div>
                    <div className=" py-3 px-4 border-l">
                        <label>Number of guests:</label>
                        <input type="number" value={numberOfGuests} onChange={ev=> setNumberOfGuests(ev.target.valueAsNumber)}></input>
                    </div>
                </div>
                {numberOfNights >0 &&  (
                      <div className=" py-3 px-4 border-l">
                      <label>Your full name:</label>
                      <input type="text" value={name} onChange={ev=> setName(ev.target.value)}></input>
                      <label>Phone number:</label>
                      <input type="tel" value={mobile} onChange={ev=> setMobile(ev.target.value)}></input>
                 
                  </div>
                )}
            </div>
            <button className="primary mt-4">
                Book this place 
                {numberOfNights > 0 && (
                    <span> ${numberOfNights * place.price}</span>
                )}
                </button>
        </div>

    );
}