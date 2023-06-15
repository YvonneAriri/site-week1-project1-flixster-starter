https://api.themoviedb.org/3/search/movie?api_key=https://api.themoviedb.org/3/search/movie?api_key=1659706dfae4865fb5606d1db53414cd&q="hello"
gifsDiv.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent form submission (optional)

    // http://api.giphy.com/v1/channels/search?api_key=9yiUnV6M2o6MsLcoAxcaDWglijaCuBG7&q="hello"

    try {
        const apiKey = "1659706dfae4865fb5606d1db53414cd";
        const searchTerm = searchInput.value;
        const url = `https://api.themoviedb.org/search/movie?api_key=${apiKey}&q=${encodeURIComponent(searchTerm)}`;
    
        const response = await fetch(url);
        const data = await response.json();
        const images = data.data;

        images.forEach(gif => {
            const img = document.createElement("img");
            img.src = gif.images.original.url;
            gifsDiv.appendChild(img); // Step 3: Add the image url to the gifsDiv
        });

        console.log(data.data[0]);
        console.log(data.data[0].images.original.url);
        // Process the data returned from the API
        // console.log(data);
    } catch (error) {
        // Handle any errors that occur during the fetch request
        console.log(error);
    }

    // Perform your desired action here
    
});

