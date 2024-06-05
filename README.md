    REST Service
Write an Express.js server that manages the following entities through the following endpoints.


    Author
An author has the following attributes:
    Full name
    Bio (a short description of their life)
    Birth date
    Primary genre
    
    Book
A book has the following attributes:
    Title
    Subtitle (optional)
    Original publication date
    Tags (think of this as a list/set of strings like "funny", "thrilling", "suspenseful", "page-turner", etc.)
    Primary author (identifies a specific author that already exists in the server's collection of authors)

    Book Edition
A book edition is a sub-entity of a book. It has the following attributes:
    Edition number
    Publication date


endpoints - Write endpoints for the following actions a client can request from the server.
Add an author
List all authors
Update a specific author's bio
Add a book
List all books
List all books that match a given list of tags
List all books by a specific author
Get the details of a specific book
Update any of the attributes of a specific book
Remove a book (and by extension all its editions)
Add an edition of a specific book
List editions of a specific book
Remove an edition of a specific book
