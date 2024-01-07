import { useContext, useEffect, useState } from "react";
import { Place } from "../models/Place";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function BookingWidget({ place }: { place: Place }) {

    const[checkIn, setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [numberOfGuests,setNumberOfGuests] = useState('1');
    const [name,setName] = useState('');
    const [mobile,setMobile] = useState('');
    const [redirect,setRedirect] = useState('');
   const {user} =  useContext(UserContext);

   useEffect(()=>{
    if(user){
        setName(user.name);
    }
   },[user])

    let numberOfNights = 0;
    if(checkIn && checkOut){
        numberOfNights = differenceInCalendarDays(new Date(checkOut),new Date(checkIn));
    }

   async function bookThisPlace(){
        const response = await axios.post('/booking',{
        checkIn, 
        checkOut,
        numberOfGuests,
        name,
        mobile,
        place: place._id,
        price : numberOfNights * place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);

    }
        
    if(redirect){
        return <Navigate to={redirect}/>
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
                        <input type="number" value={numberOfGuests} onChange={ev=> setNumberOfGuests(ev.target.value)}></input>
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
            <button onClick={bookThisPlace} className="primary mt-4">
                Book this place 
                {numberOfNights > 0 && (
                    <span> ${numberOfNights * place.price}</span>
                )}
                </button>
        </div>

    );
}