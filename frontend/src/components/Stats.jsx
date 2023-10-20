import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Stats({ socket }) {
    const [userCount, setUserCount] = useState({ count: 0 });
    const buttonText = window.location.href;

    useEffect(() => {
        socket.on('updateClients', (clientsInRoom) => {
            setUserCount(prevState => {
                return { ...prevState, count: clientsInRoom };
            });
        })
    }, [])

    const handleClick = () => {
        navigator.clipboard.writeText(buttonText)
        toast("Link Copied 😎 !");
    }

    return (<>
        <div className='my-2'>
            <h1 className='text-2xl text-[#ff3939]'>Total users connected: {userCount.count} </h1>
            <h1 className='text-xl text-[#ff3939]'>Share the link below to join more people!</h1>
            <button onClick={handleClick} className="text-blue-800">{buttonText}</button>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable
                theme="dark" />
        </div>
    </>

    )
}
