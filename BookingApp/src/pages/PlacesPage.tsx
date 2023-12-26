import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PerksComponent from "../components/PerksComponent";
import axios from "axios";

export default function PlacesPage() {
    const { action } = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState<string[]>([]);
    const [photoLink, setPhotoLink] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);

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

    async function addPhotoByLink(ev: React.FormEvent){
        ev.preventDefault();
        const {data:filename} = await axios.post('/uploadByLink' , {Link: photoLink});
        setAddedPhotos(prev => {
            return [...prev, filename];
        });
        setPhotoLink('');
    }
     
    function uploadPhoto(ev: React.FormEvent) {
        const files = (ev.target as HTMLInputElement).files;
      
        if (files) {
          const data = new FormData();
      
          for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
          }
      
          axios.post('/upload', data,{
            headers: {'Content-Type' : 'multipart/form-data'}
          })
            .then(response => {
              console.log(response);
              const {data:filenames} = response;
              setAddedPhotos(prev=>{
                return [...prev,...filenames];
              })
            })
            .catch(error => {
              console.error('Error uploading photo:', error);
            });
        }
      }

    return (
        <div>
            {action !== 'new' && (
                <div className="text-center">
                    <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add new place
                    </Link>
                </div>
            )}
            {action === 'new' && (
                <div>
                    <form>
                        {preInput('Title', 'Title for your place, make it something short and catchy.')}
                        <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="My Lovely Apartment"></input>
                        {preInput('Address','Full and complete that makes it easier to find!')}
                        <input type="text" value={address} onChange={ev =>setAddress(ev.target.value)} placeholder="e/1, example, example city"></input>
                        {preInput('Photos','The more,the better!')}
                        <div className="flex gap-2">
                            <input type="text" 
                            value={photoLink} 
                            onChange={ev=> setPhotoLink(ev.target.value)} 
                            placeholder={'Add using a Link ......jpg'}></input>
                            <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button>
                        </div>
                        <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {addedPhotos.length > 0 && addedPhotos.map(link=>
                                <div className="h-32 flex">
                                    <img className="rounded-2xl w-full object-cover" src={"http://localhost:4000/uploads/places/"+link}></img>
                                </div>
                            )}
                            <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border  bg-transparent rounded-2xl p-2 text-2xl text-grey-600">
                            <input type="file" multiple className="hidden" onChange={uploadPhoto}></input>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                </svg>
                                Upload
                            </label>
                        </div>
                        {preInput('Description','Short and catchy description of your place')}
                        <textarea value={description} onChange={ev=>setDescription(ev.target.value)} className="" />
                        {preInput('Perks','Select all the perks.')}
                        <div className="grid mt-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                            <PerksComponent selected={perks} onChange={setPerks}/>
                        </div>
                        {preInput('Extra info','House rules etc..')}
                        <textarea value={extraInfo} onChange={ev=> setExtraInfo(ev.target.value)} />
                        {preInput('Check in&out times, max guests','Add check in and check out times, remember to have some time windows for cleaning the rooms between guests.')}
                         <div className="grid gap-2 sm:grid-cols-3">
                            <div>
                                <h3 className="mt-2 -mb-2"
                                >Check-In time</h3>
                                <input type="text" value={checkIn} onChange={ev=> setCheckIn(ev.target.value)} placeholder="14:00"></input>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-2"
                                >Check-Out time</h3>
                                <input type="text" value={checkOut} onChange={ev=> setCheckOut(ev.target.value)} placeholder="11:00"></input>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-2"
                                >Max Guests</h3>

                                <input type="number" value={maxGuests} onChange={ev=> setMaxGuests(ev.target.valueAsNumber)}  ></input>
                            </div>
                        </div>
                        <button className="primary my-4">Save</button>
                    </form>
                </div>
            )}
        </div>
    )
}