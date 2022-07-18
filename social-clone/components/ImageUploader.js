import { useState } from 'react';
import { auth, storage, STATE_CHANGED } from '../lib/firebase';
import Loader from './Loader';


export default function ImageUploader() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState(null);


    const uploadFile = async (e) => {
        const file = Array.from(e.target.files)[0];
        const extenstion = file.type.split('/')[1];

        const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extenstion}`);
        setUploading(true);

        const task = ref.put(file);

        task.on(STATE_CHANGED, (snapshot) => {
            const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            setProgress(pct);

            task
                .then((d) => ref.getDownloadURL())
                .then((url) => {
                    setDownloadURL(url);
                    setUploading(false);
                });
        });
    };


    return (
        <div>
            <Loader show={uploading} />
            {uploading && <h3>{progress}%</h3>}

            {!uploading && (
                <>
                    <label>
                        Upload Image
                        <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
                    </label>
                </>
            )}

            {downloadURL && <code>{`![alt](${downloadURL})`}</code>}
        </div>
    )
}