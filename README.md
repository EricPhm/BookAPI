# REST Service

Write an Express.js server that manages the following entities through the following endpoints.

## Entities

### Author
An author has the following attributes:
- Full name
- Bio (a short description of their life)
- Birth date
- Primary genre

### Book
A book has the following attributes:
- Title
- Subtitle (optional)
- Original publication date
- Tags (think of this as a list/set of strings like "funny", "thrilling", "suspenseful", "page-turner", etc.)
- Primary author (identifies a specific author that already exists in the server's collection of authors)

### Book Edition
A book edition is a sub-entity of a book. It has the following attributes:
- Edition number
- Publication date

## Endpoints

### Author Endpoints
1. **Add an author**
2. **List all authors**
3. **Update a specific author's bio**

### Book Endpoints
4. **Add a book**
5. **List all books**
6. **List all books that match a given list of tags**
7. **List all books by a specific author**
8. **Get the details of a specific book**
9. **Update any of the attributes of a specific book**
10. **Remove a book (and by extension all its editions)**

### Book Edition Endpoints
11. **Add an edition of a specific book**
12. **List editions of a specific book**
13. **Remove an edition of a specific book**
