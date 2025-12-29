# Book Explorer

This is a small application designed for book discovery. Users can create accounts, search for books or authors, save favorites, build reading lists, and view detailed book descriptions.

A preconfigured user for exploring the app has the following credentials: `test@test.de` (PW: `1234`).

---

Authentication between the frontend (React with Tailwind CSS) and the backend (Spring Boot) is handled using JWTs. The application follows a stateless architecture, meaning Spring does not manage any sessions or store data in them. Every request to protected resources must include a JWT in the Authorization header to be authorized. The only exceptions are the login and registration endpoints, which do not require a JWT—but both will return one upon successful completion.

To begin, the user logs in with a username and password. If the credentials are valid, a JWT is issued and stored in localStorage for future use. This token is then automatically included in the Authorization header of all subsequent API requests to the backend.

<p align="center" style="margin-bottom: 0px;">
  <img src="media/home.png" alt="Login Page" width="700"/>
</p>
<p align="center" style="margin-top: 0px;">
  <img src="media/login.png" alt="Login Page" width="350" style="margin-right: 0px;"/>
  <img src="media/reading_lists.png" alt="Reading Lists Page" width="350"/>
</p>

## To Improve

This app serves as a functional prototype and is not production-ready. Key improvements required regarding style, security, and architecture are outlined below:
- Replace Context+Provider with atoms (Jotai/Recoil/...) for frequently changing state to enable fine-grained re-renders and avoid unnecessary component updates
- Wrap Open Library and backend API calls in custom hooks, keeping UI components purely presentational
- Adopt `react-query` for API calls
- The current JWT authentication stores tokens in localStorage (XSS vulnerable, prototyping only). A better solution would be to rely on cookies (http only)

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at  `http://localhost:3000`.


## Backend

Before proceeding, make sure to start the database as described in the instructions below.

```bash
cd backend
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`.

### Database

The following command will start an empty database. The schema will be automatically created when the application starts.

```bash
docker run --name bookdb -e POSTGRES_DB=bookdb -e POSTGRES_USER=bookuser -e POSTGRES_PASSWORD=bookpw -p 5432:5432 -d postgres:17
```

Note: The schema will be dropped and re-created each time the application starts (see `backend\src\main\resources\application.yaml`).

To inspect the database content run:

```bash
docker exec -it bookdb psql -U bookuser -d bookdb
```


