import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css"
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";
// import { response } from "express";

export default function EditPost(){
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [cover, setCover] = useState('');
    const [redirect, setRedirect] = useState(false);
    // console.log(id)
    useEffect(() => {
        fetch('http://localhost:4000/post/'+id).then(response => {
            response.json().then(postInfo =>{
                setTitle(postInfo.title);
                setContent(postInfo.content);
                setSummary(postInfo.summary);
            
            })
        })
    },[]);

    async function updatePost(e){
        e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if(files?.[0]){
            data.set('file', files?.[0]);
        }
        
        const response = await fetch('http://localhost:4000/post', {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
        if (response.ok){
            setRedirect(true);
        }
        
    }

    if(redirect){
        return <Navigate to={'/post/'+id}></Navigate>
    }


    return(
        // <div>Create new post here</div>
        <form onSubmit={updatePost}>
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
            {/* <ReactQuill 
                value={content} 
                modules={modules} 
                formats={formats}
                onChange={newValue => setContent(newValue)}
            ></ReactQuill> */}
            <Editor onChange={setContent} value={content}/>
            <button style={{marginTop:'5px'}}>Update Post</button>
        </form>
    )
}