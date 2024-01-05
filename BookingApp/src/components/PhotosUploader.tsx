import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface PhotosUploaderProps {
  addedPhotos: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
}

const PhotosUploader: React.FC<PhotosUploaderProps> = ({ addedPhotos, onChange }) => {
  const [photoLink, setPhotoLink] = useState<string>('');

  async function addPhotoByLink(ev: FormEvent) {
    ev.preventDefault();
    try {
      const { data: filename } = await axios.post('/uploadByLink', { Link: photoLink });
      onChange((prev) => [...prev, filename]);
      setPhotoLink('');
    } catch (error) {
      console.error('Error adding photo by link:', error);
    }
  }

  function uploadPhoto(ev: ChangeEvent<HTMLInputElement>) {
    const files = ev.target.files;

    if (files) {
      const data = new FormData();

      for (let i = 0; i < files.length; i++) {
        data.append('photos', files[i]);
      }

      axios.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => {
          console.log(response);
          const { data: filenames } = response;
          onChange((prev) => [...prev, ...filenames]);
        })
        .catch((error) => {
          console.error('Error uploading photo:', error);
        });
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <input
          type="text"
          value={photoLink}
          onChange={(ev) => setPhotoLink(ev.target.value)}
          placeholder={'Add using a Link ......jpg'}
        />
        <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">
          Add photo
        </button>
      </div>
      <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {addedPhotos.length > 0 &&
          addedPhotos.map((link, index) => (
            <div key={index} className="h-32 flex">
              <img className="rounded-2xl w-full object-cover" src={`http://localhost:4000/uploads/places/${link}`} alt={`Photo ${index + 1}`} />
            </div>
          ))}
        <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-grey-600">
          <input type="file" multiple className="hidden" onChange={uploadPhoto} />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          Upload
        </label>
      </div>
    </>
  );
};

export default PhotosUploader;