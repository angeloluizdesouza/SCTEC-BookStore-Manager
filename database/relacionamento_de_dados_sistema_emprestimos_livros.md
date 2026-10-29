# relacionamento de dados sistema empréstimos livros

**Created:** —  
**Exported:** 21/10/2026, 21:06:24

---

### You

Gere um diagrama de relacionamento de dados de um sistema de gerenciamento de empréstimos de livros, que deverá conter os seguintes banco de dados: Autores, Livros, Clientes e Empréstimos.

*21/10/2026, 20:50:14*

---

### Cloudairy AI

Cloudairy AI created an er diagram for a book loan management system.

## Data Relationships

This diagram shows database entities and their relationships in the book loan system.

- **Authors and Books** — Authors write multiple books, relationship one to many
- **Books and Loans** — Books are loaned out, connecting to loan records
- **Clients and Loans** — Clients borrow books, linked via loan records

```cloudairy
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

<follow-up>
Your Data Relationships is ready with 4 entities linked by key relations. Want to add more attributes or detail?

- **Create a flowchart** (create) — Show the loan process flow of books to clients
- **Create a class diagram** (create) — Represent entities with methods and properties
- **Add audit trail entity** (refine) — Track changes in loans and returns
- **Looks good, I'm done**
</follow-up>

*21/10/2026, 20:50:28*

---

