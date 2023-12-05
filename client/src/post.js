export default function Post(){
    return(
        <div className="post">
        <div className="image">
          <img src="https://miro.medium.com/v2/resize:fit:1100/format:webp/0*md7bwKfP2wAQkmgs.png"></img>
        </div>
        <div className="texts">
          <h2>Full Stack Projects</h2>
          <p className="info">
            <a className="author">Akshata Gawas</a>
            <time>2023-03-06 14:43</time>
          </p>
          <p className="summary">Full-stack development is extremely popular these days. Most of the developers want to be full-stack developers as they can create an end-to-end application independently and have more skills and even better skills, as compared to the other developers.</p>
        </div>
      </div>
    );
}