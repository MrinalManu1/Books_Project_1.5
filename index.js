import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
let favorites = []; // Global array to hold favorite books


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get("/book/:id", async (req, res) => {
    const bookId = req.params.id;
    const apiUrl = `https://openlibrary.org/works/${bookId}.json`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        res.render("result", { book: data });
    } catch (error) {
        console.error("Error fetching book details:", error);
        res.status(500).send("Something went wrong while fetching book details.");
    }
});


app.post("/add-to-favorites", (req, res) => {
    const book = JSON.parse(req.body.book);
    if (!favorites.find(fav => fav.key === book.key)) {
        favorites.push(book);
    }
    res.redirect("back");
});

app.post("/remove-from-favorites", (req, res) => {
    const bookKey = req.body.bookKey;
    favorites = favorites.filter(book => book.key !== bookKey);
    res.redirect("back");
});
app.post('/remove-favorite', (req, res) => {
    const bookKey = req.body.key;
    const index = favorites.findIndex(book => book.key === bookKey);

    if (index !== -1) {
        favorites.splice(index, 1);
    }

    res.redirect('/favorites');
});

app.get("/favorites", (req, res) => {
    res.render("favorites", { books: favorites });
});
app.get('/', async (req, res) => {
    const bookTitle = req.query.bookTitle;
    let bookData = [];

    if (bookTitle) {
        try {
            // Fetch books with relevance sorting
            const response = await axios.get(`https://openlibrary.org/search.json`, {
                params: {
                    q: bookTitle, // General search query
                    limit: 20 // Limit results
                }
            });

            // console.log("API Response:", response.data); // Debugging log

            // Filter results to include only books with at least one ISBN
             bookData = response.data.docs;
             topBook = bookData.find(book => book.isbn || book.cover_edition_key); // Get first book with a cover
            res.render("home", { books: topBook ? [topBook] : [] });
            


           
        } catch (error) {
            console.error('Error fetching book data:', error.message);
        }
    }

    // Render home.ejs with book data
    res.render('home', { books: bookData });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});


  