
console.log("Hello from app.js");
setProperty("Send-Button","color","teal");
setProperty("userprompt1","backgroundColor","gray");
setProperty("output","color","purple");
onEvent("soundbutton","click",function(){
console.log("Torture Me");
playSound("mainsound.mp3", false);
});

onEvent("Send-Button","click",function(){
console.log("ButtonClicked");
 let input1= getValue("userprompt1");
 let input2=getValue("userprompt2");
if(input1 && input2===""){
setText("output","Error...Type Something");
setProperty("output","color","red");  
} else{
    setText("output","Deciding Your Faith");
    setProperty("output","color","gray");
    sendtomodel();
}
playSound("buttonsound.mp3", false);
});
// onEvent("userprompt1","input",function(){
// console.log("input");
// setText("output",input1);
// setText("output",input2);
// });
  function fetchmovie(){
  const requestOptions = {
  method: "GET",
  redirect: "follow"
};
fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_TOKEN}&with_genres=27&page=5`, requestOptions)
  .then((response) => response.json())
  .then(data => {
      const movies = data.results;
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      displayMovie(randomMovie);
    })
  .catch((error) => console.error(error));
  }
 function displayMovie(movie) {
  setText("Movie-Title", movie.title);
  setText("Overview", movie.overview);

  // Check if poster_path exists before trying to display it
  if (movie.poster_path) {
    setImageURL("Movie-Poster",`https://image.tmdb.org/t/p/w500${movie.poster_path}`);
  } else {
    // Optionally, set a placeholder image or hide the element
    setImageURL("Movie-Poster", "path/to/placeholder.jpg");
  }
  console.log(movie.poster_path);
}
fetchmovie();
function sendtomodel(){
    let input1= getValue("userprompt1");
 let input2=getValue("userprompt2");
    async function query(data) {
	const response = await fetch(
		"https://router.huggingface.co/v1/chat/completions",
		{
			headers: {
				Authorization: `Bearer ${HF_TOKEN}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}

query({ 
    messages: [
        {
            role: "user",
            content: `Who would win ${input1} or${input2}`,
        },
    ],
    model: "meta-llama/Llama-3.1-8B-Instruct:fireworks-ai",
}).then((response) => {
    console.log(JSON.stringify(response));
   let botReply=response.choices[0].message.content;
    setText("output",botReply);

})};