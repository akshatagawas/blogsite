import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"
import { Navigate } from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost(){
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function createNewPost(e){
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files?.[0]);
        e.preventDefault();
        const response = await fetch('http://localhost:4000/post', {
            method: "POST",
            body: data,
            credentials: 'include',

        });
        console.log(response.ok, response.status)
        if (response.status === 200){
            setRedirect(true);
        }
        
    }

    
    if(redirect){
        return <Navigate to={'/'}></Navigate>
    }


    return(
        // <div>Create new post here</div>
        <form onSubmit={createNewPost}>
            <input 
                type="title" 
                placeholder={'Title'}
                value={title}
                onChange={e => setTitle(e.target.value)}
            ></input>
            <input 
                type="summary" 
                placeholder={'Summary'}
                value={summary}
                onChange={e => setSummary(e.target.value)}
            ></input>
            <input 
                type="file"
                // value={files}
                onChange={e => setFiles(e.target.files)}
            ></input>
            <Editor onChange={setContent} value={content}/>
            <button style={{marginTop:'5px'}}>Create Post</button>
        </form>
    );
}