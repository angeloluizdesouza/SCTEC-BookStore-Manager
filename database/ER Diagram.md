```
erDiagram
    AUTHORS ||--o{ BOOKS : writes
    BOOKS ||--o{ LOANS : contains
    CLIENTS ||--o{ LOANS : borrows

    AUTHORS {
        int authorId PK
        string name
        string nationality
        date birthDate
    }
    BOOKS {
        int bookId PK
        string title
        int authorId FK
        string genre
        int publicationYear
    }
    CLIENTS {
        int clientId PK
        string name
        string email
        string phone
        date birthDate
    }
    LOANS {
        int loanId PK
        int bookId FK
        int clientId FK
        date loanDate
        date returnDate
        boolean isReturned
    }
```