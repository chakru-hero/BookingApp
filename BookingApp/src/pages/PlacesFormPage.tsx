import { useEffect, useState } from "react";
import PerksComponent from "../components/PerksComponent";
import PhotosUploader from "../components/PhotosUploader";
import axios from "axios";
import AccountNav from "../components/AccountNav";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFormPage(){
    const {id} = useParams();

    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState<string[]>([]);

    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState<string[]>([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [redirect,setRedirect] = useState(false);

    useEffect(()=>{

        if(!id){
            return;
        }
        axios.get('/places/' + id).then(
            response =>{
                const {data} = response;
            }
        );

    },[id]);


    async function addNewPlace(ev: React.FormEvent) {
        ev.preventDefault();
        await axios.post('/places', {
            title,
            address,
            addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests
        });
      setRedirect(true);
    }

    function inputHeader(text: String) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }
    function inputDescription(text: String) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }
    function preInput(header: String, description: String) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }

    if(redirect){
        return <Navigate to={'/account/places'}/>;
    }

    return (
        <div>
            <AccountNav/>
        <form onSubmit={addNewPlace}>
            {preInput('Title', 'Title for your place, make it something short and catchy.')}
            <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="My Lovely Apartment"></input>
            {preInput('Address', 'Full and complete that makes it easier to find!')}
            <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="e/1, example, example city"></input>
            {preInput('Photos', 'The more,the better!')}

            <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

            {preInput('Description', 'Short and catchy description of your place')}
            <textarea value={description} onChange={ev => setDescription(ev.target.value)} className="" />
            {preInput('Perks', 'Select all the perks.')}
            <div className="grid mt-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                <PerksComponent selected={perks} onChange={setPerks} />
            </div>
            {preInput('Extra info', 'House rules etc..')}
            <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
            {preInput('Check in&out times, max guests', 'Add check in and check out times, remember to have some time windows for cleaning the rooms between guests.')}
            <div className="grid gap-2 sm:grid-cols-3">
                <div>
                    <h3 className="mt-2 -mb-2"
                    >Check-In time</h3>
                    <input type="text" value={checkIn} onChange={ev => setCheckIn(ev.target.value)} placeholder="14:00"></input>
                </div>
                <div>
                    <h3 className="mt-2 -mb-2"
                    >Check-Out time</h3>
                    <input type="text" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} placeholder="11:00"></input>
                </div>
                <div>
                    <h3 className="mt-2 -mb-2"
                    >Max Guests</h3>

                    <input type="number" value={maxGuests} onChange={ev => setMaxGuests(ev.target.valueAsNumber)}  ></input>
                </div>
            </div>
            <button className="primary my-4">Save</button>
        </form>
    </div>
    );
}