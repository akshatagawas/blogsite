import { useEffect, useState } from "react";
import Post from "../post";

export default function IndexPage(){
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:4000/post');
            const data = await response.json();
            setPosts(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);
    console.log(posts);
    return(
        <>
            {posts.length > 0 && posts.map(post => (
                <Post {...post}/>
            ))}
        </>
    );
}